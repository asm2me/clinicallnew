import { db } from '@/lib/db';

export async function getAppointmentsData(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId }, include: { clinic: true, tenant: true } });
  if (!user) throw new Error('User not found');

  let where: any = {};
  if (user.role !== 'SUPER_ADMIN' && user.role !== 'TENANT_ADMIN') {
    where = user.clinicId ? { clinicId: user.clinicId } : {};
  } else if (user.role === 'TENANT_ADMIN' && user.tenantId) {
    where = { clinic: { tenantId: user.tenantId } };
  }

  const [total, confirmed, pending, cancelled] = await Promise.all([
    db.appointment.count({ where }),
    db.appointment.count({ where: { ...where, status: 'CONFIRMED' } }),
    db.appointment.count({ where: { ...where, status: 'PENDING' } }),
    db.appointment.count({ where: { ...where, status: 'CANCELLED' } })
  ]);

  const appointments = await db.appointment.findMany({
    where,
    include: { patient: true, clinic: true, doctor: true },
    orderBy: { time: 'desc' },
    take: 10
  });

  return {
    summary: [
      { label: 'Total Appointments', value: total.toString(), note: 'All time' },
      { label: 'Confirmed', value: confirmed.toString(), note: 'Ready to proceed' },
      { label: 'Pending', value: pending.toString(), note: 'Awaiting confirmation' },
      { label: 'Cancelled', value: cancelled.toString(), note: 'Rescheduled or withdrawn' }
    ],
    appointments: appointments.map(a => ({
      time: a.time.toLocaleString(),
      patient: a.patient.name,
      clinic: a.clinic.name,
      doctor: a.doctor.name,
      status: a.status
    }))
  };
}
