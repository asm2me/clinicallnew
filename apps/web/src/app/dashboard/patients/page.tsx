import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { DashboardShell } from '@/components/dashboard/shell';
import { getDemoSession, type DemoRole } from '@/lib/demo-auth';
import { getPatientsDemoData } from '@/lib/demo-data';

export const metadata: Metadata = {
  title: 'Patients',
  description: 'Demo patient management dashboard view.'
};

export default function PatientsPage({
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
  const data = getPatientsDemoData(role);

  return (
    <DashboardShell
      title="Patients"
      description="Review patient records, engagement, and care coordination in a polished demo UI."
      role={role}
    >
      <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
        Demo auth enabled. Patient directory and status data are sample-only.
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {data.metrics.map((item) => (
          <article key={item.label} className="odoo-kpi p-5">
            <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
            <p className="mt-3 text-3xl font-bold text-foreground">{item.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{item.note}</p>
          </article>
        ))}
      </div>

      <section className="odoo-panel mt-6 overflow-hidden">
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-semibold text-foreground">Patient roster</h2>
          <p className="mt-1 text-sm text-muted-foreground">Most recent and priority patients visible to the selected role.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-left text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">MRN</th>
                <th className="px-6 py-4 font-semibold">Last visit</th>
                <th className="px-6 py-4 font-semibold">Care team</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {data.patients.map((item) => (
                <tr key={item.name}>
                  <td className="px-6 py-4 font-medium text-foreground">{item.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.mrn}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.lastVisit}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.team}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                      {item.status}
                    </span>
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