import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { DashboardShell } from '@/components/dashboard/shell';
import { statusBadge } from '@/lib/status-badge';
import { getDashboardData } from '@/lib/queries/dashboard';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard overview for clinic operations.'
};

function trendClass(change: string) {
  if (change.startsWith('+')) return 'text-emerald-600 dark:text-emerald-400';
  if (change.startsWith('-')) return 'text-red-500 dark:text-red-400';
  return 'text-muted-foreground';
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const data = await getDashboardData({
    userId: session.user.id,
    role: session.user.role as string,
    tenantId: session.user.tenantId ?? null
  });

  return (
    <DashboardShell
      title="Overview"
      description="A production-style workspace with role-aware insights, notifications, and quick actions."
      role={session.user.role as string}
    >

      <div className="grid gap-6 lg:grid-cols-4">
        {data.kpis.map((item) => (
          <article key={item.label} className="odoo-kpi p-5">
            <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
            <p className="mt-3 text-3xl font-bold text-foreground">{item.value}</p>
            <p className={`mt-2 text-xs font-medium ${trendClass(item.change)}`}>{item.change}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <section className="odoo-panel p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Today’s activity</h2>
              <p className="mt-1 text-sm text-muted-foreground">Appointments, tasks, and operational alerts for this role.</p>
            </div>
            <span className="odoo-badge">{data.activitySummary}</span>
          </div>

          <div className="mt-6 space-y-4">
            {data.activities.map((item) => (
              <div key={item.title} className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-background px-4 py-3 transition-colors hover:bg-muted/40">
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
                <span className={statusBadge(item.status)}>{item.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="odoo-panel p-6">
          <h2 className="text-xl font-semibold text-foreground">Role highlights</h2>
          <div className="mt-6 space-y-4">
            {data.highlights.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-background p-4">
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
