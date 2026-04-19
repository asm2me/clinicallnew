'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

const PATIENTS_PATH = '/dashboard/patients';

const patientInputSchema = z.object({
  name: z.string().trim().min(1, 'Patient name is required.').max(120),
  mrn: z.string().trim().min(1, 'MRN is required.').max(100),
  clinicId: z.string().trim().min(1, 'Clinic is required.'),
  status: z.string().trim().min(1, 'Status is required.').max(60),
  email: z.string().trim().email('Please enter a valid email address.').max(191).optional().or(z.literal('')),
  phone: z.string().trim().max(50).optional().or(z.literal('')),
  team: z.string().trim().max(100).optional().or(z.literal('')),
  notes: z.string().trim().max(5000).optional().or(z.literal('')),
  gender: z.string().trim().max(50).optional().or(z.literal('')),
  emergencyContact: z.string().trim().max(120).optional().or(z.literal('')),
  emergencyPhone: z.string().trim().max(50).optional().or(z.literal('')),
  lastVisit: z.string().trim().optional().or(z.literal('')),
});

const updatePatientSchema = patientInputSchema.extend({
  id: z.string().trim().min(1, 'Patient id is required.'),
});

const deletePatientSchema = z.object({
  id: z.string().trim().min(1, 'Patient id is required.'),
});

type Actor = {
  id: string;
  role: string;
  tenantId: string | null;
  clinicId: string | null;
};

function redirectWith(kind: 'message' | 'error', value: string): never {
  redirect(`${PATIENTS_PATH}?${kind}=${encodeURIComponent(value)}`);
}

function normalizeOptionalString(value?: string) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeOptionalDate(value?: string) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Please provide a valid last-visit date.');
  }

  return date;
}

async function getActor() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const actor = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      role: true,
      tenantId: true,
      clinicId: true,
    },
  });

  if (!actor) {
    redirect('/login');
  }

  return actor as Actor;
}

function ensureMutationRole(actor: Actor) {
  if (actor.role === 'PATIENT') {
    redirectWith('error', 'You are not allowed to manage patients.');
  }

  if (actor.role === 'TENANT_ADMIN' && !actor.tenantId) {
    redirectWith('error', 'Your account is not linked to a tenant.');
  }

  if ((actor.role === 'DOCTOR' || actor.role === 'STAFF') && !actor.clinicId) {
    redirectWith('error', 'Your account is not linked to a clinic.');
  }

  return actor;
}

async function getScopedClinic(actor: Actor, clinicId: string) {
  if (actor.role === 'DOCTOR' || actor.role === 'STAFF') {
    if (!actor.clinicId || actor.clinicId !== clinicId) {
      redirectWith('error', 'You can only manage patients in your own clinic.');
    }
  }

  const clinic = await db.clinic.findFirst({
    where: {
      id: clinicId,
      ...(actor.role === 'TENANT_ADMIN' ? { tenantId: actor.tenantId ?? '__no_access__' } : {}),
      ...(actor.role === 'DOCTOR' || actor.role === 'STAFF'
        ? {
            id: actor.clinicId ?? '__no_access__',
          }
        : {}),
    },
    select: {
      id: true,
      tenantId: true,
      name: true,
    },
  });

  if (!clinic) {
    redirectWith('error', 'The selected clinic is outside your allowed scope.');
  }

  return clinic;
}

async function getScopedPatient(actor: Actor, id: string) {
  const patient = await db.patient.findFirst({
    where: {
      id,
      ...(actor.role === 'TENANT_ADMIN' ? { tenantId: actor.tenantId ?? '__no_access__' } : {}),
      ...(actor.role === 'DOCTOR' || actor.role === 'STAFF'
        ? {
            clinicId: actor.clinicId ?? '__no_access__',
          }
        : {}),
      ...(actor.role === 'PATIENT' ? { id: '__forbidden__' } : {}),
    },
    select: {
      id: true,
      clinicId: true,
      tenantId: true,
      name: true,
    },
  });

  if (!patient) {
    redirectWith('error', 'Patient not found or outside your allowed scope.');
  }

  return patient;
}

function isRedirectError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    typeof (error as { digest?: unknown }).digest === 'string' &&
    (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
  );
}

function handleKnownError(error: unknown): never {
  if (isRedirectError(error)) {
    throw error;
  }

  if (error instanceof Error && error.message === 'Please provide a valid last-visit date.') {
    redirectWith('error', error.message);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      redirectWith('error', 'A patient with that MRN or email already exists.');
    }

    if (error.code === 'P2003') {
      redirectWith('error', 'This patient cannot be deleted because related records still exist.');
    }
  }

  redirectWith('error', 'Unable to save the patient right now.');
}

export async function createPatientAction(formData: FormData): Promise<void> {
  const actor = ensureMutationRole(await getActor());

  const parsed = patientInputSchema.safeParse({
    name: formData.get('name'),
    mrn: formData.get('mrn'),
    clinicId: formData.get('clinicId'),
    status: formData.get('status'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    team: formData.get('team'),
    notes: formData.get('notes'),
    gender: formData.get('gender'),
    emergencyContact: formData.get('emergencyContact'),
    emergencyPhone: formData.get('emergencyPhone'),
    lastVisit: formData.get('lastVisit'),
  });

  if (!parsed.success) {
    redirectWith('error', parsed.error.issues[0]?.message ?? 'Please check the patient details and try again.');
  }

  try {
    const clinic = await getScopedClinic(actor, parsed.data.clinicId);

    await db.patient.create({
      data: {
        tenantId: clinic.tenantId,
        clinicId: clinic.id,
        name: parsed.data.name,
        mrn: parsed.data.mrn,
        status: parsed.data.status as never,
        email: normalizeOptionalString(parsed.data.email) ?? undefined,
        phone: normalizeOptionalString(parsed.data.phone) ?? undefined,
        team: normalizeOptionalString(parsed.data.team) ?? undefined,
        notes: normalizeOptionalString(parsed.data.notes) ?? undefined,
        gender: normalizeOptionalString(parsed.data.gender) as never,
        emergencyContact: normalizeOptionalString(parsed.data.emergencyContact) ?? undefined,
        emergencyPhone: normalizeOptionalString(parsed.data.emergencyPhone) ?? undefined,
        lastVisit: normalizeOptionalDate(parsed.data.lastVisit) ?? undefined,
      },
    });

    revalidatePath(PATIENTS_PATH);
    redirectWith('message', 'Patient created successfully.');
  } catch (error) {
    handleKnownError(error);
  }
}

export async function updatePatientAction(formData: FormData): Promise<void> {
  const actor = ensureMutationRole(await getActor());

  const parsed = updatePatientSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    mrn: formData.get('mrn'),
    clinicId: formData.get('clinicId'),
    status: formData.get('status'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    team: formData.get('team'),
    notes: formData.get('notes'),
    gender: formData.get('gender'),
    emergencyContact: formData.get('emergencyContact'),
    emergencyPhone: formData.get('emergencyPhone'),
    lastVisit: formData.get('lastVisit'),
  });

  if (!parsed.success) {
    redirectWith('error', parsed.error.issues[0]?.message ?? 'Please check the patient details and try again.');
  }

  try {
    await getScopedPatient(actor, parsed.data.id);
    const clinic = await getScopedClinic(actor, parsed.data.clinicId);

    await db.patient.update({
      where: { id: parsed.data.id },
      data: {
        tenantId: clinic.tenantId,
        clinicId: clinic.id,
        name: parsed.data.name,
        mrn: parsed.data.mrn,
        status: parsed.data.status as never,
        email: normalizeOptionalString(parsed.data.email),
        phone: normalizeOptionalString(parsed.data.phone),
        team: normalizeOptionalString(parsed.data.team),
        notes: normalizeOptionalString(parsed.data.notes),
        gender: normalizeOptionalString(parsed.data.gender) as never,
        emergencyContact: normalizeOptionalString(parsed.data.emergencyContact),
        emergencyPhone: normalizeOptionalString(parsed.data.emergencyPhone),
        lastVisit: normalizeOptionalDate(parsed.data.lastVisit),
      },
    });

    revalidatePath(PATIENTS_PATH);
    redirectWith('message', 'Patient updated successfully.');
  } catch (error) {
    handleKnownError(error);
  }
}

export async function deletePatientAction(formData: FormData): Promise<void> {
  const actor = ensureMutationRole(await getActor());

  const parsed = deletePatientSchema.safeParse({
    id: formData.get('id'),
  });

  if (!parsed.success) {
    redirectWith('error', parsed.error.issues[0]?.message ?? 'Invalid patient request.');
  }

  try {
    await getScopedPatient(actor, parsed.data.id);

    await db.patient.delete({
      where: { id: parsed.data.id },
    });

    revalidatePath(PATIENTS_PATH);
    redirectWith('message', 'Patient deleted successfully.');
  } catch (error) {
    handleKnownError(error);
  }
}