import { db } from '../db';

const ADMIN_ROLES = ['SUPER_ADMIN', 'TENANT_ADMIN'] as const;

export async function getSettingsData(userId: string) {
  const currentUser = await db.user.findUnique({
    where: { id: userId },
    include: {
      tenant: true,
      clinic: {
        include: {
          tenant: true,
        },
      },
    } as never,
  });

  if (!currentUser) {
    throw new Error('Current user not found.');
  }

  const role = String(currentUser.role) as
    | 'SUPER_ADMIN'
    | 'TENANT_ADMIN'
    | 'DOCTOR'
    | 'STAFF'
    | 'PATIENT';

  const canManageUsers = ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number]);

  const scopedTenantId = (currentUser as { tenantId?: string | null }).tenantId ?? null;

  const userWhere =
    role === 'SUPER_ADMIN'
      ? {}
      : role === 'TENANT_ADMIN'
        ? scopedTenantId
          ? { tenantId: scopedTenantId }
          : { id: '__forbidden__' }
        : undefined;

  const clinicWhere =
    role === 'SUPER_ADMIN'
      ? {}
      : role === 'TENANT_ADMIN'
        ? scopedTenantId
          ? { tenantId: scopedTenantId }
          : { id: '__forbidden__' }
        : undefined;

  const [users, clinics, tenants] = await Promise.all([
    canManageUsers
      ? db.user.findMany({
          where: userWhere,
          include: {
            tenant: true,
            clinic: {
              include: {
                tenant: true,
              },
            },
          } as never,
          orderBy: [{ name: 'asc' }, { email: 'asc' }],
        })
      : Promise.resolve([]),
    canManageUsers
      ? db.clinic.findMany({
          where: clinicWhere,
          include: {
            tenant: true,
          } as never,
          orderBy: [{ name: 'asc' }],
        })
      : Promise.resolve([]),
    role === 'SUPER_ADMIN'
      ? db.tenant.findMany({
          include: {
            _count: {
              select: {
                clinics: true,
                users: true,
                patients: true,
                appointments: true,
              },
            },
          },
          orderBy: [{ name: 'asc' }],
        })
      : role === 'TENANT_ADMIN' && scopedTenantId
        ? db.tenant.findMany({
            where: { id: scopedTenantId },
            include: {
              _count: {
                select: {
                  clinics: true,
                  users: true,
                  patients: true,
                  appointments: true,
                },
              },
            },
            orderBy: [{ name: 'asc' }],
          })
        : Promise.resolve([]),
  ]);

  return {
    profile: {
      id: currentUser.id,
      name: currentUser.name ?? '',
      email: currentUser.email ?? '',
      phone: (currentUser as { phone?: string | null }).phone ?? '',
      title: (currentUser as { title?: string | null }).title ?? '',
      role,
      tenantId: scopedTenantId,
      tenantName:
        (currentUser as { tenant?: { name?: string | null } | null }).tenant?.name ??
        (currentUser as {
          clinic?: { tenant?: { name?: string | null } | null } | null;
        }).clinic?.tenant?.name ??
        null,
      clinicId: (currentUser as { clinicId?: string | null }).clinicId ?? null,
      clinicName:
        (currentUser as { clinic?: { name?: string | null } | null }).clinic?.name ?? null,
    },
    preferences: {
      notifications: 'Managed through your assigned role and clinic workflows.',
      timezone:
        (currentUser as { clinic?: { timezone?: string | null } | null }).clinic?.timezone ??
        'Default clinic timezone',
      booking:
        (currentUser as {
          clinic?: { isBookingEnabled?: boolean | null } | null;
        }).clinic?.isBookingEnabled === false
          ? 'Clinic booking is disabled'
          : 'Clinic booking is enabled',
    },
    canManageUsers,
    users: canManageUsers
      ? users.map((user) => ({
          id: user.id,
          name: user.name ?? '',
          email: user.email ?? '',
          phone: (user as { phone?: string | null }).phone ?? '',
          title: (user as { title?: string | null }).title ?? '',
          role: String(user.role),
          tenantId: (user as { tenantId?: string | null }).tenantId ?? '',
          tenantName:
            (user as { tenant?: { name?: string | null } | null }).tenant?.name ??
            (user as { clinic?: { tenant?: { name?: string | null } | null } | null }).clinic
              ?.tenant?.name ??
            '—',
          clinicId: (user as { clinicId?: string | null }).clinicId ?? '',
          clinicName:
            (user as { clinic?: { name?: string | null } | null }).clinic?.name ?? '—',
        }))
      : [],
    clinics: canManageUsers
      ? clinics.map((clinic) => ({
          id: clinic.id,
          name: clinic.name,
          city: (clinic as { city?: string | null }).city ?? '',
          tenantId: (clinic as { tenantId?: string | null }).tenantId ?? '',
          tenantName:
            (clinic as { tenant?: { name?: string | null } | null }).tenant?.name ?? '—',
        }))
      : [],
    tenants:
      role === 'SUPER_ADMIN' || role === 'TENANT_ADMIN'
        ? tenants.map((tenant) => ({
            id: tenant.id,
            name: tenant.name,
            slug: (tenant as { slug?: string | null }).slug ?? '',
            status: (tenant as { status?: string | null }).status ?? 'TRIALING',
            websiteName: (tenant as { websiteName?: string | null }).websiteName ?? '',
            supportEmail: (tenant as { supportEmail?: string | null }).supportEmail ?? '',
            supportPhone: (tenant as { supportPhone?: string | null }).supportPhone ?? '',
            timezone: (tenant as { timezone?: string | null }).timezone ?? 'UTC',
            locale: (tenant as { locale?: string | null }).locale ?? 'en',
            subscriptionPlan: (tenant as { subscriptionPlan?: string | null }).subscriptionPlan ?? '',
            subscriptionStatus:
              (tenant as { subscriptionStatus?: string | null }).subscriptionStatus ?? '',
            isActive: (tenant as { isActive?: boolean | null }).isActive ?? true,
            clinicCount: tenant._count.clinics,
            userCount: tenant._count.users,
            patientCount: tenant._count.patients,
            appointmentCount: tenant._count.appointments,
          }))
        : [],
  };
}
