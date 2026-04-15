import { db } from '@/lib/db';

export async function getPatientsData(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId }, include: { clinic: true } });
  if (!user) throw new Error('User not found');

  const where = user.role === 'SUPER_ADMIN' ? {} : { clinicId: user.clinicId };

  const patients = await db.patient.findMany({
    where,
    include: { clinic: true },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return {
    metrics: [
      { label: 'Total Patients', value: await db.patient.count({ where }), note: 'Active in system' },
      { label: 'Stable', value: await db.patient.count({ where: { ...where, status: 'STABLE' } }), note: 'No concerns' },
      { label: 'Pending', value: await db.patient.count({ where: { ...where, status: 'PENDING' } }), note: 'Awaiting action' },
      { label: 'Urgent', value: await db.patient.count({ where: { ...where, status: 'URGENT' } }), note: 'Immediate attention' }
    ].map(m => ({ label: m.label, value: m.value.toString(), note: m.note })),
    patients: patients.map(p => ({
      name: p.name,
      mrn: p.mrn,
      lastVisit: p.lastVisit?.toLocaleDateString() || 'Never',
      team: p.team || 'Unassigned',
      status: p.status
    }))
  };
}
