import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { DashboardShell } from '@/components/dashboard/shell';
import { authOptions, type AppRole } from '@/lib/auth';
import { getDashboardData } from '@/lib/queries/dashboard';
import { statusBadge } from '@/lib/status-badge';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard overview for clinic operations.',
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

  const role = session.user.role as AppRole;
  const data = await getDashboardData({
    userId: session.user.id,
    role,
    tenantId: session.user.tenantId ?? null,
  });

  return (
    <DashboardShell
      title="Overview"
      description="A refined workspace for today’s schedule, active follow-up, and the signals that matter most."
      role={role}
    >
      <div className="space-y-6">
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
          <div className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Daily brief
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                  Start with a calm read of the day before stepping into action.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                  This overview brings today’s schedule, notable exceptions, and active work into
                  a quieter single canvas so priorities feel immediate without feeling crowded.
                </p>
              </div>

              <div className="flex min-w-full flex-col gap-3 lg:min-w-[20rem] lg:max-w-sm">
                <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-primary/80">
                    Activity summary
                  </p>
                  <p className="mt-2 text-lg font-semibold text-foreground">{data.activitySummary}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Active role
                    </p>
                    <p className="mt-2 text-xl font-semibold text-foreground">{role}</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Decision mode
                    </p>
                    <p className="mt-2 text-xl font-semibold text-foreground">Elegant workspace</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border/70 bg-background/80 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Priority highlights
                </p>
                <h2 className="mt-2 text-lg font-semibold text-foreground">
                  Where attention belongs now
                </h2>
              </div>
              <span className="rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {data.highlights.length} items
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {data.highlights.map((highlight) => (
                <article
                  key={highlight.label}
                  className="rounded-2xl border border-border/70 bg-card/80 p-4"
                >
                  <p className="text-sm font-medium text-foreground">{highlight.label}</p>
                  <p className="mt-2 text-lg font-semibold text-foreground">{highlight.value}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{highlight.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-border/70 bg-background/80 p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Metrics board
              </p>
              <h2 className="mt-2 text-lg font-semibold text-foreground">Core clinic metrics</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Read the primary indicators first, then move into the workflow that needs care.
            </p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {data.kpis.map((kpi, index) => (
              <article
                key={kpi.label}
                className="rounded-[1.75rem] border border-border/70 bg-card/90 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {kpi.label}
                  </p>
                  <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                  {kpi.value}
                </p>
                <p className={`mt-3 text-sm leading-6 ${trendClass(kpi.change)}`}>{kpi.change}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Activity timeline
                </p>
                <h2 className="mt-2 text-lg font-semibold text-foreground">
                  Recent movement across the clinic
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                A quieter chronological read of updates, tasks, and operational changes.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {data.activities.map((activity, index) => (
                <article
                  key={activity.title}
                  className="rounded-2xl border border-border/70 bg-background/80 p-4"
                >
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-xs font-semibold text-muted-foreground">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {index < data.activities.length - 1 ? (
                        <span className="mt-2 h-full w-px bg-border" />
                      ) : null}
                    </div>

                    <div className="min-w-0 flex-1 pb-2">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{activity.title}</p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {activity.description}
                          </p>
                        </div>

                        <span
                          className={[
                            statusBadge(activity.status),
                            'rounded-full px-2.5 py-1 text-xs font-medium capitalize',
                          ].join(' ')}
                        >
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <section className="rounded-[2rem] border border-border/70 bg-background/80 p-6 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Summary ledger
              </p>
              <div className="mt-4 space-y-3">
                {data.highlights.map((highlight) => (
                  <div
                    key={highlight.label}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/80 px-4 py-3"
                  >
                    <span className="text-sm text-muted-foreground">{highlight.label}</span>
                    <span className="text-sm font-semibold text-foreground">{highlight.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Workspace cue
              </p>
              <h2 className="mt-2 text-lg font-semibold text-foreground">
                Let the overview guide focus, then move forward with intention.
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Review the brief, notice the queue that needs attention, and enter the right
                workflow from the sidebar without breaking concentration.
              </p>
            </section>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
