import type { Prisma } from '@prisma/client';

import { db } from '@/lib/db';

export async function getClinicsData(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      clinic: {
        select: {
          tenantId: true
        }
      }
    }
  });

  if (!user) throw new Error('User not found');

  const scopedTenantId =
    user.role === 'SUPER_ADMIN' ? undefined : user.tenantId ?? user.clinic?.tenantId ?? undefined;

  const where: Prisma.ClinicWhereInput = scopedTenantId ? { tenantId: scopedTenantId } : {};

  const [clinics, tenantOptions] = await Promise.all([
    db.clinic.findMany({
      where,
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
            status: true
          }
        },
        _count: {
          select: {
            patients: true,
            appointments: true,
            users: true
          }
        }
      },
      orderBy: [{ createdAt: 'desc' }, { name: 'asc' }]
    }),
    user.role === 'SUPER_ADMIN'
      ? db.tenant.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            status: true
          },
          orderBy: [{ name: 'asc' }]
        })
      : Promise.resolve([])
  ]);

  return {
    summary: [
      { label: 'Total Clinics', value: clinics.length.toString(), note: 'All locations' },
      {
        label: 'Operational',
        value: clinics.filter((clinic) => clinic.status === 'OPERATIONAL').length.toString(),
        note: 'Running smoothly'
      },
      {
        label: 'Launching',
        value: clinics.filter((clinic) => clinic.status === 'LAUNCHING').length.toString(),
        note: 'Opening soon'
      }
    ],
    clinics: clinics.map((clinic) => ({
      id: clinic.id,
      name: clinic.name,
      slug: clinic.slug,
      city: clinic.city,
      manager: clinic.manager,
      rooms: `${clinic.rooms} rooms`,
      roomsValue: clinic.rooms,
      status: clinic.status,
      phone: clinic.phone ?? '',
      email: clinic.email ?? '',
      addressLine1: clinic.addressLine1 ?? '',
      addressLine2: clinic.addressLine2 ?? '',
      timezone: clinic.timezone ?? 'UTC',
      tenantId: clinic.tenantId,
      tenantName: clinic.tenant.name,
      tenantSlug: clinic.tenant.slug,
      isBookingEnabled: clinic.isBookingEnabled,
      patientCount: clinic._count.patients,
      appointmentCount: clinic._count.appointments,
      userCount: clinic._count.users
    })),
    tenantOptions: tenantOptions.map((tenant) => ({
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      status: tenant.status
    })),
    canManageClinics: user.role === 'SUPER_ADMIN' || user.role === 'TENANT_ADMIN',
    role: user.role,
    scopedTenantId: scopedTenantId ?? null
  };
}
