import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { DashboardShell } from '@/components/dashboard/shell';
import { statusBadge } from '@/lib/status-badge';
import { getClinicsData } from '@/lib/queries/clinics';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Clinics',
  description: 'Clinic and tenant management dashboard view.'
};

export default async function ClinicsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const data = await getClinicsData(session.user.id);

  return (
    <DashboardShell
      title="Clinics"
      description="Oversee branches, locations, and operational readiness across the tenant."
      role={session.user.role as string}
    >

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
          <h2 className="text-xl font-semibold text-foreground">Clinic locations</h2>
          <p className="mt-1 text-sm text-muted-foreground">Branches and operating statuses for the selected role.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-left text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Clinic</th>
                <th className="px-6 py-4 font-semibold">City</th>
                <th className="px-6 py-4 font-semibold">Manager</th>
                <th className="px-6 py-4 font-semibold">Rooms</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {data.clinics.map((item) => (
                <tr key={item.name} className="transition-colors hover:bg-muted/40">
                  <td className="px-6 py-4 font-medium text-foreground">{item.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.city}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.manager}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.rooms}</td>
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