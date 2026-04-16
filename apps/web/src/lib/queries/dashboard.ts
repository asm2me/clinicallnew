import { db } from '@/lib/db';

export async function getDashboardData(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId }, include: { clinic: true, tenant: true } });
  if (!user) throw new Error('User not found');

  const kpis = [];
  const activities = [];
  const highlights = [];

  if (user.role === 'SUPER_ADMIN') {
    const [totalUsers, totalClinics, totalAppointments, totalPatients] = await Promise.all([
      db.user.count(),
      db.clinic.count(),
      db.appointment.count(),
      db.patient.count()
    ]);

    kpis.push(
      { label: 'Total Users', value: totalUsers.toString(), change: '+12.6% vs last month' },
      { label: 'Active Clinics', value: totalClinics.toString(), change: '+2 new clinics' },
      { label: 'Scheduled Appointments', value: totalAppointments.toString(), change: '+24.3% vs last month' },
      { label: 'Total Patients', value: totalPatients.toString(), change: '+8.2% vs last month' }
    );

    activities.push(
      { title: 'System Alert', description: 'Database backup completed successfully', status: 'Completed' },
      { title: 'New Clinic Onboarded', description: 'Uptown Clinic activated and ready for scheduling', status: 'Confirmed' },
      { title: 'User Limit Reached', description: '95% of licenses in use — consider upgrading', status: 'Pending' }
    );

    highlights.push(
      { label: 'Monthly Revenue', value: '$48,500', note: 'Platform subscriptions & usage fees' },
      { label: 'API Health', value: '99.9%', note: 'Uptime over 30 days' },
      { label: 'Support Tickets', value: '12', note: 'Resolved this week' }
    );
  } else if (user.role === 'TENANT_ADMIN' && user.tenantId) {
    const [appointmentCount, patientCount, userCount, clinicCount] = await Promise.all([
      db.appointment.count({ where: { clinic: { tenantId: user.tenantId } } }),
      db.patient.count({ where: { clinic: { tenantId: user.tenantId } } }),
      db.user.count({ where: { tenantId: user.tenantId } }),
      db.clinic.count({ where: { tenantId: user.tenantId } })
    ]);

    kpis.push(
      { label: 'This Month Appointments', value: appointmentCount.toString(), change: '+18.5% vs last month' },
      { label: 'Patient Base', value: patientCount.toString(), change: '+5 new patients' },
      { label: 'Team Members', value: userCount.toString(), change: 'All roles active' },
      { label: 'Branch Locations', value: clinicCount.toString(), change: '1 location launching' }
    );

    activities.push(
      { title: 'Team Meeting Scheduled', description: 'Quarterly ops review — Thursday 2pm', status: 'Confirmed' },
      { title: 'New Doctor Onboarded', description: 'Dr. Sarah Chen approved and ready', status: 'Confirmed' },
      { title: 'Billing Alert', description: 'Subscription renewal in 7 days', status: 'Pending' }
    );

    highlights.push(
      { label: 'Patient Satisfaction', value: '4.8/5', note: 'Based on 120 reviews' },
      { label: 'Staff Utilization', value: '87%', note: 'Average hours per week' },
      { label: 'Avg Wait Time', value: '12 mins', note: 'Below target of 15 mins' }
    );
  } else {
    kpis.push(
      { label: 'Your Appointments', value: '8', change: '2 today' },
      { label: 'Patients Served', value: '243', change: '+32 this month' },
      { label: 'Clinic Rooms', value: '6', change: 'All operational' },
      { label: 'Team Members', value: '12', change: 'All active' }
    );

    activities.push(
      { title: 'Next Appointment', description: 'Patient check-in in 1 hour', status: 'Pending' },
      { title: 'Lab Results', description: '3 patient results ready for review', status: 'Urgent' },
      { title: 'Schedule Update', description: 'Evening clinic hours adjusted', status: 'Completed' }
    );

    highlights.push(
      { label: 'Today\'s Schedule', value: '8 appointments', note: '6 confirmed, 2 pending' },
      { label: 'Notes to Complete', value: '4', note: 'Follow-up documentation' },
      { label: 'Messages', value: '3 unread', note: 'From clinic staff' }
    );
  }

  return { kpis, activitySummary: `${activities.length} items`, activities, highlights };
}
