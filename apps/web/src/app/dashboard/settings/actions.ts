'use server';

import { hash } from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';

const SETTINGS_PATH = '/dashboard/settings';
const ADMIN_ROLES = ['SUPER_ADMIN', 'TENANT_ADMIN'] as const;
const USER_ROLES = ['SUPER_ADMIN', 'TENANT_ADMIN', 'DOCTOR', 'STAFF', 'PATIENT'] as const;
const TENANT_STATUSES = ['ACTIVE', 'TRIALING', 'SUSPENDED', 'ARCHIVED'] as const;

const profileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120, 'Name is too long'),
  phone: z.string().trim().max(50, 'Phone is too long').optional(),
  title: z.string().trim().max(120, 'Title is too long').optional(),
});

const createUserSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120, 'Name is too long'),
  email: z.string().trim().email('A valid email address is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(USER_ROLES),
  phone: z.string().trim().max(50, 'Phone is too long').optional(),
  title: z.string().trim().max(120, 'Title is too long').optional(),
  tenantId: z.string().trim().optional(),
  clinicId: z.string().trim().optional(),
});

const updateUserSchema = z.object({
  userId: z.string().trim().min(1, 'User id is required'),
  name: z.string().trim().min(1, 'Name is required').max(120, 'Name is too long'),
  email: z.string().trim().email('A valid email address is required'),
  password: z.string().optional(),
  role: z.enum(USER_ROLES),
  phone: z.string().trim().max(50, 'Phone is too long').optional(),
  title: z.string().trim().max(120, 'Title is too long').optional(),
  tenantId: z.string().trim().optional(),
  clinicId: z.string().trim().optional(),
});

const deleteUserSchema = z.object({
  userId: z.string().trim().min(1, 'User id is required'),
  confirmationText: z.string().trim().min(1, 'Type the user email to confirm deletion.'),
});

const createTenantSchema = z
  .object({
    name: z.string().trim().min(1, 'Tenant name is required').max(120, 'Tenant name is too long'),
    slug: z.string().trim().min(1, 'Tenant slug is required').max(120, 'Tenant slug is too long'),
    status: z.enum(TENANT_STATUSES),
    websiteName: z.string().trim().max(120, 'Website name is too long').optional(),
    supportEmail: z
      .string()
      .trim()
      .email('A valid support email address is required')
      .optional()
      .or(z.literal('')),
    supportPhone: z.string().trim().max(50, 'Support phone is too long').optional(),
    timezone: z.string().trim().min(1, 'Timezone is required').max(100, 'Timezone is too long'),
    locale: z.string().trim().min(1, 'Locale is required').max(20, 'Locale is too long'),
    subscriptionPlan: z.string().trim().max(50, 'Subscription plan is too long').optional(),
    subscriptionStatus: z.string().trim().max(50, 'Subscription status is too long').optional(),
    tenantAdminName: z.string().trim().max(120, 'Tenant admin name is too long').optional(),
    tenantAdminEmail: z
      .string()
      .trim()
      .email('A valid tenant admin email address is required')
      .optional(),
    tenantAdminPassword: z.string().max(200, 'Tenant admin password is too long').optional(),
  })
  .superRefine((value, ctx) => {
    const hasAdminName = Boolean(value.tenantAdminName);
    const hasAdminEmail = Boolean(value.tenantAdminEmail);
    const hasAdminPassword = Boolean(value.tenantAdminPassword);

    if (hasAdminName || hasAdminEmail || hasAdminPassword) {
      if (!hasAdminName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tenant admin name is required when creating an initial tenant admin.',
          path: ['tenantAdminName'],
        });
      }

      if (!hasAdminEmail) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tenant admin email is required when creating an initial tenant admin.',
          path: ['tenantAdminEmail'],
        });
      }

      if (!hasAdminPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tenant admin password is required when creating an initial tenant admin.',
          path: ['tenantAdminPassword'],
        });
      }

      if (value.tenantAdminPassword && value.tenantAdminPassword.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tenant admin password must be at least 6 characters.',
          path: ['tenantAdminPassword'],
        });
      }
    }
  });

const updateTenantSchema = z.object({
  tenantId: z.string().trim().min(1, 'Tenant id is required'),
  name: z.string().trim().min(1, 'Tenant name is required').max(120, 'Tenant name is too long'),
  slug: z.string().trim().min(1, 'Tenant slug is required').max(120, 'Tenant slug is too long'),
  status: z.enum(TENANT_STATUSES),
  websiteName: z.string().trim().max(120, 'Website name is too long').optional(),
  supportEmail: z
    .string()
    .trim()
    .email('A valid support email address is required')
    .optional()
    .or(z.literal('')),
  supportPhone: z.string().trim().max(50, 'Support phone is too long').optional(),
  timezone: z.string().trim().min(1, 'Timezone is required').max(100, 'Timezone is too long'),
  locale: z.string().trim().min(1, 'Locale is required').max(20, 'Locale is too long'),
  subscriptionPlan: z.string().trim().max(50, 'Subscription plan is too long').optional(),
  subscriptionStatus: z.string().trim().max(50, 'Subscription status is too long').optional(),
});

type Actor = {
  id: string;
  role: (typeof USER_ROLES)[number];
  tenantId: string | null;
  clinicId: string | null;
};

type TargetAssignment = {
  tenantId: string | null;
  clinicId: string | null;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== 'string') {
    return '';
  }

  return value;
}

function toOptional(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}

function toNullable(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function redirectWithError(message: string): never {
  redirect(`${SETTINGS_PATH}?error=${encodeURIComponent(message)}`);
}

function redirectWithMessage(message: string): never {
  redirect(`${SETTINGS_PATH}?message=${encodeURIComponent(message)}`);
}

async function getActor(): Promise<Actor> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirectWithError('You must be signed in to manage settings.');
  }

  const actor = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!actor) {
    redirectWithError('Your account could not be found.');
  }

  return {
    id: actor.id,
    role: actor.role as Actor['role'],
    tenantId: (actor as { tenantId?: string | null }).tenantId ?? null,
    clinicId: (actor as { clinicId?: string | null }).clinicId ?? null,
  };
}

function ensureAdmin(actor: Actor) {
  if (!ADMIN_ROLES.includes(actor.role as (typeof ADMIN_ROLES)[number])) {
    redirectWithError('You are not allowed to manage users.');
  }
}

function ensureSuperAdmin(actor: Actor) {
  if (actor.role !== 'SUPER_ADMIN') {
    redirectWithError('Only super admins can manage tenants.');
  }
}

function ensureTenantManager(actor: Actor) {
  if (actor.role !== 'SUPER_ADMIN' && actor.role !== 'TENANT_ADMIN') {
    redirectWithError('You are not allowed to manage tenant settings.');
  }
}

async function resolveAssignment(
  actor: Actor,
  role: (typeof USER_ROLES)[number],
  tenantIdInput: string | undefined,
  clinicIdInput: string | undefined,
): Promise<TargetAssignment> {
  if (role === 'SUPER_ADMIN') {
    if (actor.role !== 'SUPER_ADMIN') {
      redirectWithError('Only super admins can create or update super admin users.');
    }

    return { tenantId: null, clinicId: null };
  }

  let tenantId: string | null = null;

  if (actor.role === 'SUPER_ADMIN') {
    tenantId = toNullable(tenantIdInput ?? '');

    if (!tenantId) {
      redirectWithError('A tenant is required for this user.');
    }

    const tenant = await db.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      redirectWithError('The selected tenant was not found.');
    }
  } else {
    if (!actor.tenantId) {
      redirectWithError('Your account is missing a tenant assignment.');
    }

    tenantId = actor.tenantId;
  }

  const clinicId = toNullable(clinicIdInput ?? '');

  if (!clinicId) {
    return { tenantId, clinicId: null };
  }

  const clinic = await db.clinic.findUnique({
    where: { id: clinicId },
  });

  if (!clinic) {
    redirectWithError('The selected clinic was not found.');
  }

  const clinicTenantId = (clinic as { tenantId?: string | null }).tenantId ?? null;

  if (!clinicTenantId) {
    redirectWithError('The selected clinic is missing a tenant assignment.');
  }

  if (actor.role === 'TENANT_ADMIN' && clinicTenantId !== actor.tenantId) {
    redirectWithError('You can only assign users to clinics in your tenant.');
  }

  if (tenantId && clinicTenantId !== tenantId) {
    redirectWithError('The selected clinic does not belong to the selected tenant.');
  }

  return {
    tenantId: clinicTenantId,
    clinicId: clinic.id,
  };
}

async function getManagedUser(actor: Actor, userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    redirectWithError('The selected user was not found.');
  }

  const userRole = user.role as Actor['role'];
  const userTenantId = (user as { tenantId?: string | null }).tenantId ?? null;

  if (actor.role === 'TENANT_ADMIN') {
    if (!actor.tenantId || userTenantId !== actor.tenantId) {
      redirectWithError('You can only manage users in your tenant.');
    }

    if (userRole === 'SUPER_ADMIN') {
      redirectWithError('Tenant admins cannot manage super admin users.');
    }
  }

  return user;
}

export async function createTenantAction(formData: FormData): Promise<void> {
  const actor = await getActor();
  ensureSuperAdmin(actor);

  const parsed = createTenantSchema.safeParse({
    name: getString(formData, 'name'),
    slug: getString(formData, 'slug').toLowerCase(),
    status: getString(formData, 'status'),
    websiteName: toOptional(getString(formData, 'websiteName')),
    supportEmail: toOptional(getString(formData, 'supportEmail')),
    supportPhone: toOptional(getString(formData, 'supportPhone')),
    timezone: getString(formData, 'timezone') || 'UTC',
    locale: getString(formData, 'locale') || 'en',
    subscriptionPlan: toOptional(getString(formData, 'subscriptionPlan')),
    subscriptionStatus: toOptional(getString(formData, 'subscriptionStatus')),
    tenantAdminName: toOptional(getString(formData, 'tenantAdminName')),
    tenantAdminEmail: toOptional(getString(formData, 'tenantAdminEmail').toLowerCase()),
    tenantAdminPassword: toOptional(getString(formData, 'tenantAdminPassword')),
  });

  if (!parsed.success) {
    redirectWithError(parsed.error.issues[0]?.message ?? 'Tenant details are invalid.');
  }

  try {
    await db.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: parsed.data.name,
          slug: parsed.data.slug,
          status: parsed.data.status,
          websiteName: parsed.data.websiteName ?? null,
          supportEmail: parsed.data.supportEmail ?? null,
          supportPhone: parsed.data.supportPhone ?? null,
          timezone: parsed.data.timezone,
          locale: parsed.data.locale,
          subscriptionPlan: parsed.data.subscriptionPlan ?? null,
          subscriptionStatus: parsed.data.subscriptionStatus ?? null,
          isActive: parsed.data.status !== 'ARCHIVED',
        } as never,
      });

      if (
        parsed.data.tenantAdminName &&
        parsed.data.tenantAdminEmail &&
        parsed.data.tenantAdminPassword
      ) {
        await tx.user.create({
          data: {
            name: parsed.data.tenantAdminName,
            email: parsed.data.tenantAdminEmail,
            hashedPassword: await hash(parsed.data.tenantAdminPassword, 10),
            role: 'TENANT_ADMIN',
            tenantId: tenant.id,
            clinicId: null,
            title: 'Tenant Administrator',
            isActive: true,
            emailVerifiedAt: new Date(),
          } as never,
        });
      }
    });
  } catch (error) {
    console.error('createTenantAction failed', error);
    redirectWithError(
      'The tenant could not be created. Check for duplicate tenant names, slugs, or tenant admin email addresses.',
    );
  }

  revalidatePath(SETTINGS_PATH);
  redirectWithMessage(
    parsed.data.tenantAdminEmail
      ? 'Tenant and initial tenant admin created successfully.'
      : 'Tenant created successfully.',
  );
}

export async function updateTenantAction(formData: FormData): Promise<void> {
  const actor = await getActor();
  ensureTenantManager(actor);

  const parsed = updateTenantSchema.safeParse({
    tenantId: getString(formData, 'tenantId'),
    name: getString(formData, 'name'),
    slug: getString(formData, 'slug').toLowerCase(),
    status: getString(formData, 'status'),
    websiteName: toOptional(getString(formData, 'websiteName')),
    supportEmail: toOptional(getString(formData, 'supportEmail')),
    supportPhone: toOptional(getString(formData, 'supportPhone')),
    timezone: getString(formData, 'timezone') || 'UTC',
    locale: getString(formData, 'locale') || 'en',
    subscriptionPlan: toOptional(getString(formData, 'subscriptionPlan')),
    subscriptionStatus: toOptional(getString(formData, 'subscriptionStatus')),
  });

  if (!parsed.success) {
    redirectWithError(parsed.error.issues[0]?.message ?? 'Tenant details are invalid.');
  }

  const existingTenant = await db.tenant.findUnique({
    where: { id: parsed.data.tenantId },
    select: { id: true },
  });

  if (!existingTenant) {
    redirectWithError('The selected tenant was not found.');
  }

  if (actor.role === 'TENANT_ADMIN') {
    if (!actor.tenantId) {
      redirectWithError('Your account is missing a tenant assignment.');
    }

    if (parsed.data.tenantId !== actor.tenantId) {
      redirectWithError('Tenant admins can only update their own tenant.');
    }
  }

  try {
    await db.tenant.update({
      where: { id: parsed.data.tenantId },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        status: parsed.data.status,
        websiteName: parsed.data.websiteName ?? null,
        supportEmail: parsed.data.supportEmail ?? null,
        supportPhone: parsed.data.supportPhone ?? null,
        timezone: parsed.data.timezone,
        locale: parsed.data.locale,
        subscriptionPlan: parsed.data.subscriptionPlan ?? null,
        subscriptionStatus: parsed.data.subscriptionStatus ?? null,
        isActive: parsed.data.status !== 'ARCHIVED',
      } as never,
    });
  } catch (error) {
    console.error('updateTenantAction failed', error);
    redirectWithError('The tenant could not be updated. Check for duplicate tenant names or slugs.');
  }

  revalidatePath(SETTINGS_PATH);
  redirectWithMessage('Tenant updated successfully.');
}

export async function updateProfileAction(formData: FormData): Promise<void> {
  const actor = await getActor();

  const parsed = profileSchema.safeParse({
    name: getString(formData, 'name'),
    phone: toOptional(getString(formData, 'phone')),
    title: toOptional(getString(formData, 'title')),
  });

  if (!parsed.success) {
    redirectWithError(parsed.error.issues[0]?.message ?? 'Profile details are invalid.');
  }

  await db.user.update({
    where: { id: actor.id },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone ?? null,
      title: parsed.data.title ?? null,
    } as never,
  });

  revalidatePath(SETTINGS_PATH);
  redirectWithMessage('Your profile was updated successfully.');
}

export async function createUserAction(formData: FormData): Promise<void> {
  const actor = await getActor();
  ensureAdmin(actor);

  const parsed = createUserSchema.safeParse({
    name: getString(formData, 'name'),
    email: getString(formData, 'email').toLowerCase(),
    password: getString(formData, 'password'),
    role: getString(formData, 'role'),
    phone: toOptional(getString(formData, 'phone')),
    title: toOptional(getString(formData, 'title')),
    tenantId: toOptional(getString(formData, 'tenantId')),
    clinicId: toOptional(getString(formData, 'clinicId')),
  });

  if (!parsed.success) {
    redirectWithError(parsed.error.issues[0]?.message ?? 'User details are invalid.');
  }

  const assignment = await resolveAssignment(
    actor,
    parsed.data.role,
    parsed.data.tenantId,
    parsed.data.clinicId,
  );

  try {
    await db.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        hashedPassword: await hash(parsed.data.password, 10),
        role: parsed.data.role,
        phone: parsed.data.phone ?? null,
        title: parsed.data.title ?? null,
        tenantId: assignment.tenantId,
        clinicId: assignment.clinicId,
      } as never,
    });
  } catch (error) {
    console.error('createUserAction failed', error);
    redirectWithError('The user could not be created. Check for duplicate email addresses or invalid assignments.');
  }

  revalidatePath(SETTINGS_PATH);
  redirectWithMessage('User created successfully.');
}

export async function updateUserAction(formData: FormData): Promise<void> {
  const actor = await getActor();
  ensureAdmin(actor);

  const parsed = updateUserSchema.safeParse({
    userId: getString(formData, 'userId'),
    name: getString(formData, 'name'),
    email: getString(formData, 'email').toLowerCase(),
    password: getString(formData, 'password'),
    role: getString(formData, 'role'),
    phone: toOptional(getString(formData, 'phone')),
    title: toOptional(getString(formData, 'title')),
    tenantId: toOptional(getString(formData, 'tenantId')),
    clinicId: toOptional(getString(formData, 'clinicId')),
  });

  if (!parsed.success) {
    redirectWithError(parsed.error.issues[0]?.message ?? 'User details are invalid.');
  }

  const existingUser = await getManagedUser(actor, parsed.data.userId);
  const assignment = await resolveAssignment(
    actor,
    parsed.data.role,
    parsed.data.tenantId,
    parsed.data.clinicId,
  );

  if (actor.role === 'TENANT_ADMIN' && existingUser.id === actor.id && parsed.data.role !== 'TENANT_ADMIN') {
    redirectWithError('Tenant admins cannot change their own role from this screen.');
  }

  const password = parsed.data.password?.trim();
  const data: Record<string, unknown> = {
    name: parsed.data.name,
    email: parsed.data.email,
    role: parsed.data.role,
    phone: parsed.data.phone ?? null,
    title: parsed.data.title ?? null,
    tenantId: assignment.tenantId,
    clinicId: assignment.clinicId,
  };

  if (password) {
    if (password.length < 6) {
      redirectWithError('Password must be at least 6 characters.');
    }

    data.hashedPassword = await hash(password, 10);
  }

  try {
    await db.user.update({
      where: { id: existingUser.id },
      data: data as never,
    });
  } catch (error) {
    console.error('updateUserAction failed', error);
    redirectWithError('The user could not be updated. Check for duplicate email addresses or invalid assignments.');
  }

  revalidatePath(SETTINGS_PATH);
  redirectWithMessage('User updated successfully.');
}

export async function deleteUserAction(formData: FormData): Promise<void> {
  const actor = await getActor();
  ensureAdmin(actor);

  const parsed = deleteUserSchema.safeParse({
    userId: getString(formData, 'userId'),
    confirmationText: getString(formData, 'confirmationText'),
  });

  if (!parsed.success) {
    redirectWithError(parsed.error.issues[0]?.message ?? 'Delete confirmation is invalid.');
  }

  if (parsed.data.userId === actor.id) {
    redirectWithError('You cannot delete your own account.');
  }

  const existingUser = await getManagedUser(actor, parsed.data.userId);
  const expectedConfirmation = existingUser.email.toLowerCase();

  if (parsed.data.confirmationText.trim().toLowerCase() !== expectedConfirmation) {
    redirectWithError(`Type ${existingUser.email} exactly to confirm deletion.`);
  }

  try {
    await db.$transaction(async (tx) => {
      await tx.passwordResetToken.deleteMany({
        where: { userId: existingUser.id },
      });

      await tx.auditLog.deleteMany({
        where: { actorId: existingUser.id },
      });

      await tx.appointment.deleteMany({
        where: { doctorId: existingUser.id },
      });

      const linkedPatientId = (existingUser as { patientId?: string | null }).patientId ?? null;

      if (linkedPatientId) {
        await tx.appointment.deleteMany({
          where: { patientId: linkedPatientId },
        });

        await tx.patient.delete({
          where: { id: linkedPatientId },
        });
      }

      await tx.user.delete({
        where: { id: existingUser.id },
      });
    });
  } catch (error) {
    console.error('deleteUserAction failed', error);
    redirectWithError('The user and related records could not be deleted.');
  }

  revalidatePath(SETTINGS_PATH);
  redirectWithMessage('User and related records deleted successfully.');
}
