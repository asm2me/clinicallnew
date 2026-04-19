import { db } from "@/lib/db";

type ScopedUser = {
  id: string;
  role: string;
  tenantId: string | null;
  clinicId: string | null;
};

type AppointmentWhere = {
  tenantId?: string;
  clinicId?: string;
  id?: string;
};

const EMPTY_APPOINTMENTS_DATA = {
  summary: {
    total: 0,
    today: 0,
    upcoming: 0,
    completed: 0,
  },
  appointments: [] as Array<{
    id: string;
    clinicId: string;
    clinicName: string;
    patientId: string;
    patientName: string;
    patientMrn: string | null;
    doctorId: string;
    doctorName: string;
    startsAt: Date;
    endsAt: Date | null;
    startsAtInput: string;
    endsAtInput: string;
    status: string;
    source: string;
    reason: string;
    notes: string;
  }>,
  clinicOptions: [] as Array<{ id: string; name: string }>,
  patientOptions: [] as Array<{
    id: string;
    name: string;
    mrn: string | null;
    clinicId: string;
  }>,
  doctorOptions: [] as Array<{
    id: string;
    name: string;
    email: string | null;
    clinicId: string | null;
  }>,
  canManage: false,
  role: "PATIENT",
};

function toDateTimeLocalValue(date: Date | null) {
  if (!date) {
    return "";
  }

  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function sameLocalDate(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function applyScope(user: ScopedUser, where: AppointmentWhere = {}): AppointmentWhere {
  if (user.role === "SUPER_ADMIN") {
    return where;
  }

  if (user.role === "TENANT_ADMIN") {
    return {
      ...where,
      tenantId: user.tenantId ?? "__forbidden__",
    };
  }

  if (user.role === "DOCTOR" || user.role === "STAFF") {
    return {
      ...where,
      clinicId: user.clinicId ?? "__forbidden__",
    };
  }

  return {
    ...where,
    id: "__forbidden__",
  };
}

export async function getAppointmentsData(userId: string) {
  const user = (await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      tenantId: true,
      clinicId: true,
    },
  })) as ScopedUser | null;

  if (!user) {
    return EMPTY_APPOINTMENTS_DATA;
  }

  const canManage =
    user.role === "SUPER_ADMIN" ||
    user.role === "TENANT_ADMIN" ||
    user.role === "DOCTOR" ||
    user.role === "STAFF";

  if (!canManage) {
    return {
      ...EMPTY_APPOINTMENTS_DATA,
      role: user.role,
    };
  }

  const appointmentWhere = applyScope(user);

  const [appointments, clinics, patients, doctors] = await Promise.all([
    db.appointment.findMany({
      where: appointmentWhere,
      orderBy: {
        startsAt: "asc",
      },
      select: {
        id: true,
        clinicId: true,
        patientId: true,
        doctorId: true,
        startsAt: true,
        endsAt: true,
        status: true,
        source: true,
        reason: true,
        notes: true,
        clinic: {
          select: {
            id: true,
            name: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
            mrn: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    db.clinic.findMany({
      where:
        user.role === "SUPER_ADMIN"
          ? {}
          : user.role === "TENANT_ADMIN"
            ? { tenantId: user.tenantId ?? "__forbidden__" }
            : { id: user.clinicId ?? "__forbidden__" },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),
    db.patient.findMany({
      where:
        user.role === "SUPER_ADMIN"
          ? {}
          : user.role === "TENANT_ADMIN"
            ? { tenantId: user.tenantId ?? "__forbidden__" }
            : { clinicId: user.clinicId ?? "__forbidden__" },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        mrn: true,
        clinicId: true,
      },
    }),
    db.user.findMany({
      where:
        user.role === "SUPER_ADMIN"
          ? { role: "DOCTOR" as never }
          : user.role === "TENANT_ADMIN"
            ? { role: "DOCTOR" as never, tenantId: user.tenantId ?? "__forbidden__" }
            : { role: "DOCTOR" as never, clinicId: user.clinicId ?? "__forbidden__" },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        clinicId: true,
      },
    }),
  ]);

  const now = new Date();
  const mappedAppointments = appointments.map((appointment) => ({
    id: appointment.id,
    clinicId: appointment.clinicId,
    clinicName: appointment.clinic.name,
    patientId: appointment.patientId,
    patientName: appointment.patient.name,
    patientMrn: appointment.patient.mrn,
    doctorId: appointment.doctorId,
    doctorName: appointment.doctor.name ?? "Unassigned doctor",
    startsAt: appointment.startsAt,
    endsAt: appointment.endsAt,
    startsAtInput: toDateTimeLocalValue(appointment.startsAt),
    endsAtInput: toDateTimeLocalValue(appointment.endsAt),
    status: String(appointment.status),
    source: appointment.source ?? "",
    reason: appointment.reason ?? "",
    notes: appointment.notes ?? "",
  }));

  return {
    summary: {
      total: mappedAppointments.length,
      today: mappedAppointments.filter((appointment) => sameLocalDate(appointment.startsAt, now)).length,
      upcoming: mappedAppointments.filter((appointment) => appointment.startsAt > now).length,
      completed: mappedAppointments.filter(
        (appointment) => appointment.status.toUpperCase() === "COMPLETED",
      ).length,
    },
    appointments: mappedAppointments,
    clinicOptions: clinics,
    patientOptions: patients,
    doctorOptions: doctors.map((doctor) => ({
      id: doctor.id,
      name: doctor.name ?? doctor.email ?? "Doctor",
      email: doctor.email,
      clinicId: doctor.clinicId,
    })),
    canManage,
    role: user.role,
  };
}