import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { DashboardShell } from '@/components/dashboard/shell';
import { statusBadge } from '@/lib/status-badge';
import { getPatientsData } from '@/lib/queries/patients';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Patients',
  description: 'Patient management dashboard view.'
};

export default async function PatientsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const data = await getPatientsData(session.user.id);

  return (
    <DashboardShell
      title="Patients"
      description="Review patient records, engagement, and care coordination."
      role={session.user.role as string}
    >

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
                <tr key={item.name} className="transition-colors hover:bg-muted/40">
                  <td className="px-6 py-4 font-medium text-foreground">{item.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.mrn}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.lastVisit}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.team}</td>
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