import type { Prisma } from '@prisma/client';

import { db } from '@/lib/db';

export async function getAnalyticsData(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error('User not found');
  }

  const appointmentWhere: Prisma.AppointmentWhereInput =
    user.role === 'SUPER_ADMIN'
      ? {}
      : user.role === 'TENANT_ADMIN'
        ? user.tenantId
          ? { tenantId: user.tenantId }
          : { id: '__forbidden__' }
        : user.clinicId
          ? { clinicId: user.clinicId }
          : { id: '__forbidden__' };

  const patientWhere: Prisma.PatientWhereInput =
    user.role === 'SUPER_ADMIN'
      ? {}
      : user.role === 'TENANT_ADMIN'
        ? user.tenantId
          ? { tenantId: user.tenantId }
          : { id: '__forbidden__' }
        : user.clinicId
          ? { clinicId: user.clinicId }
          : { id: '__forbidden__' };

  const [appointmentCount, patientCount, confirmedAppointments] = await Promise.all([
    db.appointment.count({ where: appointmentWhere }),
    db.patient.count({ where: patientWhere }),
    db.appointment.count({
      where: {
        ...appointmentWhere,
        status: 'CONFIRMED',
      },
    }),
  ]);

  const confirmedRate = appointmentCount > 0 ? ((confirmedAppointments / appointmentCount) * 100).toFixed(1) : '0.0';

  return {
    kpis: [
      { label: 'Total Appointments', value: appointmentCount.toString(), note: 'This period' },
      { label: 'Patient Registrations', value: patientCount.toString(), note: 'Active patients' },
      { label: 'Confirmation Rate', value: `${confirmedRate}%`, note: 'Scheduled appointments' },
      { label: 'System Uptime', value: '99.9%', note: 'This month' },
    ],
    metrics: [
      { label: 'Avg Appointment Duration', value: '45 mins', note: 'Across all roles' },
      { label: 'Patient Retention', value: '94%', note: '12-month retention' },
      { label: 'Staff Utilization', value: '87%', note: 'Average hours per week' },
      { label: 'Revenue Per Patient', value: '$285', note: 'Avg lifetime value' },
    ],
    trends: [
      { label: 'Appointment Bookings', value: '+23.5%', note: 'vs last month' },
      { label: 'Patient Satisfaction', value: '4.8/5', note: 'Based on feedback' },
      { label: 'No-Show Rate', value: '-4.2%', note: 'Improvement trend' },
      { label: 'Clinic Efficiency', value: '+12%', note: 'Schedule optimization' },
    ],
  };
}
