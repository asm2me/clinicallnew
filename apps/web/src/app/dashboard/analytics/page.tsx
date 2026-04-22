import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { DashboardShell } from '@/components/dashboard/shell';
import { getAnalyticsData } from '@/lib/queries/analytics';
import { canAccessDashboardSection } from '@/lib/permissions';
import { authOptions, type AppRole } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'Analytics dashboard view.'
};

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const role = session.user.role as AppRole;

  if (!canAccessDashboardSection(role, 'analytics')) {
    redirect('/dashboard?error=You%20do%20not%20have%20permission%20to%20view%20analytics.');
  }

  const data = await getAnalyticsData(session.user.id);

  return (
    <DashboardShell
      title="Analytics"
      description="Operational trends, performance metrics, and conversion health."
      role={role}
    >

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
            {data.trends.map((item, index) => (
              <div key={item.label} className="flex items-start gap-4 rounded-xl border border-border bg-background p-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                  <p className="mt-1 text-base font-semibold text-foreground">{item.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
