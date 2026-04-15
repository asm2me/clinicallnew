import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { DashboardShell } from '@/components/dashboard/shell';
import { DemoBanner } from '@/components/dashboard/demo-banner';
import { statusBadge } from '@/lib/status-badge';
import { getAppointmentsDemoData } from '@/lib/demo-data';
import { getDemoSession, type DemoRole } from '@/lib/demo-auth';

export const metadata: Metadata = {
  title: 'Appointments',
  description: 'Demo appointments dashboard view for clinic operations.'
};

export default function AppointmentsPage({
  searchParams
}: {
  searchParams?: {
    role?: string;
  };
}) {
  const session = getDemoSession(searchParams?.role);
  if (!session) {
    redirect('/login');
  }

  const role = session.role as DemoRole;
  const data = getAppointmentsDemoData(role);

  return (
    <DashboardShell
      title="Appointments"
      description="Track schedules, appointment status, and daily flow from a clean operations view."
      role={role}
    >
      <DemoBanner message="Demo auth enabled. Appointment data shown here is deterministic sample content." />

      <div className="grid gap-6 lg:grid-cols-3">
        {data.summary.map((item) => (
          <article key={item.label} className="odoo-panel p-5">
            <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
            <p className="mt-3 text-3xl font-bold text-foreground">{item.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{item.note}</p>
          </article>
        ))}
      </div>

      <section className="odoo-panel mt-6 overflow-hidden">
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-semibold text-foreground">Schedule</h2>
          <p className="mt-1 text-sm text-muted-foreground">Upcoming and recent appointments for the selected demo role.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-left text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Time</th>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Clinic</th>
                <th className="px-6 py-4 font-semibold">Doctor</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {data.appointments.map((item) => (
                <tr key={`${item.time}-${item.patient}`} className="transition-colors hover:bg-muted/40">
                  <td className="px-6 py-4 font-medium text-foreground">{item.time}</td>
                  <td className="px-6 py-4 text-foreground">{item.patient}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.clinic}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.doctor}</td>
                  <td className="px-6 py-4">
                    <span className={statusBadge(item.status)}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardShell>
  );
}