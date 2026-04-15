import { db } from '@/lib/db';

export async function getClinicsData(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const where = user.role === 'SUPER_ADMIN' ? {} : { tenantId: user.tenantId };

  const clinics = await db.clinic.findMany({
    where,
    include: { _count: { select: { patients: true, appointments: true, users: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return {
    summary: [
      { label: 'Total Clinics', value: clinics.length.toString(), note: 'All locations' },
      { label: 'Operational', value: clinics.filter(c => c.status === 'OPERATIONAL').length.toString(), note: 'Running smoothly' },
      { label: 'Launching', value: clinics.filter(c => c.status === 'LAUNCHING').length.toString(), note: 'Opening soon' }
    ],
    clinics: clinics.map(c => ({
      name: c.name,
      city: c.city,
      manager: c.manager,
      rooms: `${c.rooms} rooms`,
      status: c.status
    }))
  };
}
