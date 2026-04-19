"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const APPOINTMENTS_PATH = "/dashboard/appointments";

type ScopedUser = {
  id: string;
  role: string;
  tenantId: string | null;
  clinicId: string | null;
};

const optionalText = z
  .string()
  .optional()
  .transform((value) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
  });

const appointmentSchema = z.object({
  clinicId: z.string().trim().min(1, "Clinic is required."),
  patientId: z.string().trim().min(1, "Patient is required."),
  doctorId: z.string().trim().min(1, "Doctor is required."),
  startsAt: z.string().trim().min(1, "Start time is required."),
  endsAt: optionalText,
  status: z.string().trim().min(1, "Status is required."),
  source: optionalText,
  reason: optionalText,
  notes: optionalText,
});

const appointmentUpdateSchema = appointmentSchema.extend({
  id: z.string().trim().min(1, "Appointment id is required."),
});

const appointmentDeleteSchema = z.object({
  id: z.string().trim().min(1, "Appointment id is required."),
});

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function redirectWithMessage(type: "message" | "error", message: string): never {
  redirect(`${APPOINTMENTS_PATH}?${type}=${encodeURIComponent(message)}`);
}

function isRedirectError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

function parseDateInput(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

async function getScopedUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirectWithMessage("error", "You must be signed in to manage appointments.");
  }

  const user = (await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      role: true,
      tenantId: true,
      clinicId: true,
    },
  })) as ScopedUser | null;

  if (!user) {
    redirectWithMessage("error", "Unable to load your account scope.");
  }

  if (
    user.role !== "SUPER_ADMIN" &&
    user.role !== "TENANT_ADMIN" &&
    user.role !== "DOCTOR" &&
    user.role !== "STAFF"
  ) {
    redirectWithMessage("error", "You are not allowed to manage appointments.");
  }

  return user;
}

function clinicScopeWhere(user: ScopedUser, clinicId?: string) {
  if (user.role === "SUPER_ADMIN") {
    return clinicId ? { id: clinicId } : {};
  }

  if (user.role === "TENANT_ADMIN") {
    return {
      ...(clinicId ? { id: clinicId } : {}),
      tenantId: user.tenantId ?? "__forbidden__",
    };
  }

  if (!user.clinicId || (clinicId && clinicId !== user.clinicId)) {
    return {
      id: "__forbidden__",
    };
  }

  return {
    id: user.clinicId,
  };
}

function patientScopeWhere(user: ScopedUser, patientId: string, clinicId: string) {
  if (user.role === "SUPER_ADMIN") {
    return {
      id: patientId,
      clinicId,
    };
  }

  if (user.role === "TENANT_ADMIN") {
    return {
      id: patientId,
      clinicId,
      tenantId: user.tenantId ?? "__forbidden__",
    };
  }

  return {
    id: patientId,
    clinicId: user.clinicId ?? "__forbidden__",
  };
}

function doctorScopeWhere(user: ScopedUser, doctorId: string, clinicId: string) {
  if (user.role === "SUPER_ADMIN") {
    return {
      id: doctorId,
      clinicId,
      role: "DOCTOR" as never,
    };
  }

  if (user.role === "TENANT_ADMIN") {
    return {
      id: doctorId,
      clinicId,
      tenantId: user.tenantId ?? "__forbidden__",
      role: "DOCTOR" as never,
    };
  }

  return {
    id: doctorId,
    clinicId: user.clinicId ?? "__forbidden__",
    role: "DOCTOR" as never,
  };
}

function appointmentScopeWhere(user: ScopedUser, appointmentId: string) {
  if (user.role === "SUPER_ADMIN") {
    return { id: appointmentId };
  }

  if (user.role === "TENANT_ADMIN") {
    return {
      id: appointmentId,
      tenantId: user.tenantId ?? "__forbidden__",
    };
  }

  return {
    id: appointmentId,
    clinicId: user.clinicId ?? "__forbidden__",
  };
}

async function resolveAppointmentWriteContext(
  user: ScopedUser,
  clinicId: string,
  patientId: string,
  doctorId: string,
) {
  const clinic = await db.clinic.findFirst({
    where: clinicScopeWhere(user, clinicId),
    select: {
      id: true,
      tenantId: true,
    },
  });

  if (!clinic) {
    redirectWithMessage("error", "The selected clinic is outside your allowed scope.");
  }

  const [patient, doctor] = await Promise.all([
    db.patient.findFirst({
      where: patientScopeWhere(user, patientId, clinic.id),
      select: {
        id: true,
      },
    }),
    db.user.findFirst({
      where: doctorScopeWhere(user, doctorId, clinic.id),
      select: {
        id: true,
      },
    }),
  ]);

  if (!patient) {
    redirectWithMessage("error", "The selected patient is outside your allowed scope.");
  }

  if (!doctor) {
    redirectWithMessage("error", "The selected doctor is outside your allowed scope.");
  }

  return clinic;
}

function buildInput(formData: FormData) {
  return {
    clinicId: getString(formData, "clinicId"),
    patientId: getString(formData, "patientId"),
    doctorId: getString(formData, "doctorId"),
    startsAt: getString(formData, "startsAt"),
    endsAt: getString(formData, "endsAt") || undefined,
    status: getString(formData, "status"),
    source: getString(formData, "source") || undefined,
    reason: getString(formData, "reason") || undefined,
    notes: getString(formData, "notes") || undefined,
  };
}

function validateDateRange(startsAt: Date, endsAt?: Date | null) {
  if (endsAt && endsAt < startsAt) {
    redirectWithMessage("error", "End time must be after the start time.");
  }
}

export async function createAppointmentAction(formData: FormData): Promise<void> {
  try {
    const user = await getScopedUser();
    const parsed = appointmentSchema.safeParse(buildInput(formData));

    if (!parsed.success) {
      redirectWithMessage("error", parsed.error.issues[0]?.message ?? "Invalid appointment details.");
    }

    const startsAt = parseDateInput(parsed.data.startsAt);
    const endsAt = parsed.data.endsAt ? parseDateInput(parsed.data.endsAt) : null;

    if (!startsAt) {
      redirectWithMessage("error", "Start time is invalid.");
    }

    if (parsed.data.endsAt && !endsAt) {
      redirectWithMessage("error", "End time is invalid.");
    }

    validateDateRange(startsAt, endsAt);

    const clinic = await resolveAppointmentWriteContext(
      user,
      parsed.data.clinicId,
      parsed.data.patientId,
      parsed.data.doctorId,
    );

    await db.appointment.create({
      data: {
        tenantId: clinic.tenantId,
        clinicId: clinic.id,
        patientId: parsed.data.patientId,
        doctorId: parsed.data.doctorId,
        startsAt,
        endsAt,
        status: parsed.data.status as never,
        source: parsed.data.source,
        reason: parsed.data.reason,
        notes: parsed.data.notes,
      },
    });

    revalidatePath(APPOINTMENTS_PATH);
    redirectWithMessage("message", "Appointment created successfully.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    redirectWithMessage("error", "Unable to create appointment.");
  }
}

export async function updateAppointmentAction(formData: FormData): Promise<void> {
  try {
    const user = await getScopedUser();
    const parsed = appointmentUpdateSchema.safeParse({
      id: getString(formData, "id"),
      ...buildInput(formData),
    });

    if (!parsed.success) {
      redirectWithMessage("error", parsed.error.issues[0]?.message ?? "Invalid appointment details.");
    }

    const existingAppointment = await db.appointment.findFirst({
      where: appointmentScopeWhere(user, parsed.data.id),
      select: {
        id: true,
      },
    });

    if (!existingAppointment) {
      redirectWithMessage("error", "Appointment not found or outside your allowed scope.");
    }

    const startsAt = parseDateInput(parsed.data.startsAt);
    const endsAt = parsed.data.endsAt ? parseDateInput(parsed.data.endsAt) : null;

    if (!startsAt) {
      redirectWithMessage("error", "Start time is invalid.");
    }

    if (parsed.data.endsAt && !endsAt) {
      redirectWithMessage("error", "End time is invalid.");
    }

    validateDateRange(startsAt, endsAt);

    const clinic = await resolveAppointmentWriteContext(
      user,
      parsed.data.clinicId,
      parsed.data.patientId,
      parsed.data.doctorId,
    );

    await db.appointment.update({
      where: {
        id: existingAppointment.id,
      },
      data: {
        tenantId: clinic.tenantId,
        clinicId: clinic.id,
        patientId: parsed.data.patientId,
        doctorId: parsed.data.doctorId,
        startsAt,
        endsAt,
        status: parsed.data.status as never,
        source: parsed.data.source,
        reason: parsed.data.reason,
        notes: parsed.data.notes,
      },
    });

    revalidatePath(APPOINTMENTS_PATH);
    redirectWithMessage("message", "Appointment updated successfully.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    redirectWithMessage("error", "Unable to update appointment.");
  }
}

export async function deleteAppointmentAction(formData: FormData): Promise<void> {
  try {
    const user = await getScopedUser();
    const parsed = appointmentDeleteSchema.safeParse({
      id: getString(formData, "id"),
    });

    if (!parsed.success) {
      redirectWithMessage("error", parsed.error.issues[0]?.message ?? "Invalid appointment id.");
    }

    const existingAppointment = await db.appointment.findFirst({
      where: appointmentScopeWhere(user, parsed.data.id),
      select: {
        id: true,
      },
    });

    if (!existingAppointment) {
      redirectWithMessage("error", "Appointment not found or outside your allowed scope.");
    }

    await db.appointment.delete({
      where: {
        id: existingAppointment.id,
      },
    });

    revalidatePath(APPOINTMENTS_PATH);
    redirectWithMessage("message", "Appointment deleted successfully.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    redirectWithMessage("error", "Unable to delete appointment.");
  }
}