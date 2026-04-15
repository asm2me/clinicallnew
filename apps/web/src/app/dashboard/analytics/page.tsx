import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { DashboardShell } from '@/components/dashboard/shell';
import { getAnalyticsDemoData } from '@/lib/demo-data';
import { getDemoSession, type DemoRole } from '@/lib/demo-auth';

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'Demo analytics dashboard view.'
};

export default function AnalyticsPage({
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
  const data = getAnalyticsDemoData(role);

  return (
    <DashboardShell
      title="Analytics"
      description="A role-aware demo of operational trends, performance metrics, and conversion health."
      role={role}
    >
      <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
        Demo auth enabled. Analytics values are illustrative and deterministic.
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {data.kpis.map((item) => (
          <article key={item.label} className="odoo-kpi p-5">
            <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
            <p className="mt-3 text-3xl font-bold text-foreground">{item.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{item.note}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="odoo-panel p-6">
          <h2 className="text-xl font-semibold text-foreground">Performance snapshot</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {data.metrics.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-background p-4">
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{item.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="odoo-panel p-6">
          <h2 className="text-xl font-semibold text-foreground">Trends</h2>
          <div className="mt-6 space-y-4">
            {data.trends.map((item) => (
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