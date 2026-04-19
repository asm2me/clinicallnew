'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

const CLINICS_PATH = '/dashboard/clinics';

const clinicStatusValues = ['OPERATIONAL', 'LAUNCHING', 'UNDER_REVIEW', 'INACTIVE'] as const;

const baseClinicSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120, 'Name is too long'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(120, 'Slug is too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must use lowercase letters, numbers, and hyphens only'),
  city: z.string().trim().min(1, 'City is required').max(120, 'City is too long'),
  manager: z.string().trim().min(1, 'Manager is required').max(120, 'Manager is too long'),
  rooms: z.coerce.number().int().min(0, 'Rooms must be 0 or more'),
  status: z.enum(clinicStatusValues),
  phone: z.string().trim().max(50, 'Phone is too long').optional(),
  email: z.union([z.literal(''), z.string().trim().email('Invalid email address').max(255)]).optional(),
  addressLine1: z.string().trim().max(255, 'Address line 1 is too long').optional(),
  addressLine2: z.string().trim().max(255, 'Address line 2 is too long').optional(),
  timezone: z.string().trim().max(100, 'Timezone is too long').optional(),
  tenantId: z.string().trim().optional(),
  isBookingEnabled: z.boolean().optional()
});

const createClinicSchema = baseClinicSchema;
const updateClinicSchema = baseClinicSchema.extend({
  id: z.string().trim().min(1, 'Clinic id is required')
});

const deleteClinicSchema = z.object({
  id: z.string().trim().min(1, 'Clinic id is required')
});

function normalizeOptionalString(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeBoolean(value: FormDataEntryValue | null) {
  return value === 'true' || value === 'on' || value === '1';
}

function buildUrl(type: 'message' | 'error', text: string) {
  return `${CLINICS_PATH}?${type}=${encodeURIComponent(text)}`;
}

function redirectError(message: string): never {
  redirect(buildUrl('error', message));
}

function redirectSuccess(message: string): never {
  redirect(buildUrl('message', message));
}

async function getAuthorizedSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.user.role) {
    redirect('/login');
  }

  if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'TENANT_ADMIN') {
    redirectError('You are not allowed to manage clinics.');
  }

  if (session.user.role === 'TENANT_ADMIN' && !session.user.tenantId) {
    redirectError('Your account is missing a tenant assignment.');
  }

  return session;
}

async function resolveTenantIdForWrite(role: string, postedTenantId: string | undefined, sessionTenantId: string | null | undefined) {
  if (role === 'SUPER_ADMIN') {
    if (!postedTenantId) {
      redirectError('Tenant is required.');
    }

    const tenant = await db.tenant.findUnique({
      where: { id: postedTenantId },
      select: { id: true }
    });

    if (!tenant) {
      redirectError('Selected tenant was not found.');
    }

    return tenant.id;
  }

  const tenantId = sessionTenantId ?? undefined;

  if (!tenantId) {
    redirectError('Your account is missing a tenant assignment.');
  }

  return tenantId;
}

function parseClinicInput(formData: FormData) {
  return {
    name: formData.get('name'),
    slug: formData.get('slug'),
    city: formData.get('city'),
    manager: formData.get('manager'),
    rooms: formData.get('rooms'),
    status: formData.get('status'),
    phone: normalizeOptionalString(formData.get('phone')),
    email: normalizeOptionalString(formData.get('email')) ?? '',
    addressLine1: normalizeOptionalString(formData.get('addressLine1')),
    addressLine2: normalizeOptionalString(formData.get('addressLine2')),
    timezone: normalizeOptionalString(formData.get('timezone')),
    tenantId: normalizeOptionalString(formData.get('tenantId')),
    isBookingEnabled: normalizeBoolean(formData.get('isBookingEnabled'))
  };
}

export async function createClinicAction(formData: FormData): Promise<void> {
  const session = await getAuthorizedSession();

  const parsed = createClinicSchema.safeParse(parseClinicInput(formData));

  if (!parsed.success) {
    redirectError(parsed.error.issues[0]?.message ?? 'Invalid clinic data.');
  }

  const tenantId = await resolveTenantIdForWrite(session.user.role, parsed.data.tenantId, session.user.tenantId);

  try {
    await db.clinic.create({
      data: {
        tenantId,
        name: parsed.data.name,
        slug: parsed.data.slug,
        city: parsed.data.city,
        manager: parsed.data.manager,
        rooms: parsed.data.rooms,
        status: parsed.data.status,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        addressLine1: parsed.data.addressLine1,
        addressLine2: parsed.data.addressLine2,
        timezone: parsed.data.timezone || 'UTC',
        isBookingEnabled: parsed.data.isBookingEnabled ?? false
      }
    });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      redirectError('Clinic slug already exists for that tenant.');
    }

    redirectError('Unable to create clinic.');
  }

  revalidatePath(CLINICS_PATH);
  redirectSuccess('Clinic created successfully.');
}

export async function updateClinicAction(formData: FormData): Promise<void> {
  const session = await getAuthorizedSession();

  const parsed = updateClinicSchema.safeParse({
    id: formData.get('id'),
    ...parseClinicInput(formData)
  });

  if (!parsed.success) {
    redirectError(parsed.error.issues[0]?.message ?? 'Invalid clinic data.');
  }

  const existingClinic = await db.clinic.findUnique({
    where: { id: parsed.data.id },
    select: {
      id: true,
      tenantId: true
    }
  });

  if (!existingClinic) {
    redirectError('Clinic not found.');
  }

  if (session.user.role === 'TENANT_ADMIN' && existingClinic.tenantId !== session.user.tenantId) {
    redirectError('You can only update clinics in your tenant.');
  }

  const tenantId = await resolveTenantIdForWrite(session.user.role, parsed.data.tenantId, session.user.tenantId);

  if (session.user.role === 'TENANT_ADMIN' && tenantId !== existingClinic.tenantId) {
    redirectError('You cannot move clinics to another tenant.');
  }

  try {
    await db.clinic.update({
      where: { id: existingClinic.id },
      data: {
        tenantId,
        name: parsed.data.name,
        slug: parsed.data.slug,
        city: parsed.data.city,
        manager: parsed.data.manager,
        rooms: parsed.data.rooms,
        status: parsed.data.status,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        addressLine1: parsed.data.addressLine1,
        addressLine2: parsed.data.addressLine2,
        timezone: parsed.data.timezone || 'UTC',
        isBookingEnabled: parsed.data.isBookingEnabled ?? false
      }
    });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      redirectError('Clinic slug already exists for that tenant.');
    }

    redirectError('Unable to update clinic.');
  }

  revalidatePath(CLINICS_PATH);
  redirectSuccess('Clinic updated successfully.');
}

export async function deleteClinicAction(formData: FormData): Promise<void> {
  const session = await getAuthorizedSession();

  const parsed = deleteClinicSchema.safeParse({
    id: formData.get('id')
  });

  if (!parsed.success) {
    redirectError(parsed.error.issues[0]?.message ?? 'Invalid clinic selection.');
  }

  const existingClinic = await db.clinic.findUnique({
    where: { id: parsed.data.id },
    select: {
      id: true,
      tenantId: true
    }
  });

  if (!existingClinic) {
    redirectError('Clinic not found.');
  }

  if (session.user.role === 'TENANT_ADMIN' && existingClinic.tenantId !== session.user.tenantId) {
    redirectError('You can only delete clinics in your tenant.');
  }

  try {
    await db.clinic.delete({
      where: { id: existingClinic.id }
    });
  } catch (error: any) {
    if (error?.code === 'P2003') {
      redirectError('Clinic cannot be deleted while related records still exist.');
    }

    redirectError('Unable to delete clinic.');
  }

  revalidatePath(CLINICS_PATH);
  redirectSuccess('Clinic deleted successfully.');
}