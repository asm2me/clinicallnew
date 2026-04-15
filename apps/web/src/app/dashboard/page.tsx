import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { DashboardShell } from '@/components/dashboard/shell';
import { DemoBanner } from '@/components/dashboard/demo-banner';
import { statusBadge } from '@/lib/status-badge';
import { getDashboardDemoData } from '@/lib/demo-data';
import { getDemoSession, type DemoRole } from '@/lib/demo-auth';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Demo SaaS dashboard overview for clinic operations.'
};

function getRoleLabel(role: DemoRole) {
  return role;
}

function trendClass(change: string) {
  if (change.startsWith('+')) return 'text-emerald-600 dark:text-emerald-400';
  if (change.startsWith('-')) return 'text-red-500 dark:text-red-400';
  return 'text-muted-foreground';
}

export default function DashboardPage({
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
  const data = getDashboardDemoData(role);

  return (
    <DashboardShell
      title="Overview"
      description="A production-style demo workspace with role-aware insights, notifications, and quick actions."
      role={role}
    >
      <DemoBanner message={`Demo auth enabled. This dashboard uses deterministic sample data for the ${getRoleLabel(role)} experience.`} />

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