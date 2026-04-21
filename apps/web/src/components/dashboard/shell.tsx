import type { ReactNode } from "react";
import Link from "next/link";

import { SignOutButton } from '@/components/auth/sign-out-button';
import { stopUserImpersonationAction } from '@/app/dashboard/users/impersonation-actions';
import { DashboardNav } from '@/components/dashboard/nav';
import { getEffectiveDashboardUser } from '@/lib/impersonation';

export interface DashboardShellProps {
  title?: string;
  description?: string;
  role: string;
  children: ReactNode;
}

function ToneMark({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      className={className}
      fill="none"
    >
      <circle cx="60" cy="60" r="59.5" stroke="currentColor" opacity="0.16" />
      <circle cx="60" cy="60" r="38" stroke="currentColor" opacity="0.24" />
      <path
        d="M17 77c14-6 26-10 43-10 16 0 28 4 43 10"
        stroke="currentColor"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M26 45c11-12 20-18 34-18s23 6 34 18"
        stroke="currentColor"
        strokeLinecap="round"
        opacity="0.32"
      />
    </svg>
  );
}

export async function DashboardShell({
  title,
  description,
  role,
  children,
}: DashboardShellProps) {
  const user = await getEffectiveDashboardUser();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_24%),linear-gradient(to_bottom,transparent,rgba(255,255,255,0.02),transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.04),transparent)]" />
      <div className="relative">
        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/88 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="relative hidden h-14 w-14 overflow-hidden rounded-2xl border border-border/70 bg-card text-primary shadow-sm sm:block">
                  <ToneMark className="absolute inset-0 h-full w-full" />
                </div>
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    <span>Clinical command center</span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span>Live operations view</span>
                  </div>
                  <div className="space-y-1">
                    {title ? (
                      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        {title}
                      </h1>
                    ) : null}
                    {description ? (
                      <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                        {description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] lg:min-w-[28rem]">
                <div className="rounded-3xl border border-border/70 bg-card/80 p-3 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Active operator
                      </p>
                      <p className="truncate text-sm font-medium text-foreground">
                        {user?.name ?? "Clinic user"}
                      </p>
                      {user?.email ? (
                        <p className="truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      ) : null}
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      {role}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Link
                    href="/"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition hover:border-foreground/20 hover:bg-accent"
                  >
                    Public site
                  </Link>
                  <SignOutButton />
                </div>
              </div>
            </div>

            {user?.isImpersonating ? (
              <div className="rounded-3xl border border-primary/30 bg-primary/10 p-4 text-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      Impersonation mode is active
                    </p>
                    <p className="text-muted-foreground">
                      You are viewing the dashboard through an alternate account
                      context. Exit impersonation to return to your own operator
                      session.
                    </p>
                  </div>
                  <form action={stopUserImpersonationAction}>
                    <button
                      type="submit"
                      className="inline-flex h-11 items-center justify-center rounded-full border border-primary/40 bg-background px-4 text-sm font-medium text-foreground transition hover:bg-card"
                    >
                      Stop impersonating
                    </button>
                  </form>
                </div>
              </div>
            ) : null}
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)_320px] lg:px-8">
          <aside className="space-y-4">
            <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/85 shadow-sm">
              <div className="border-b border-border/70 px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Navigation dock
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Jump between operating surfaces and administrative queues.
                </p>
              </div>
              <div className="p-3">
                <DashboardNav role={role} />
              </div>
            </section>

            <section className="rounded-[2rem] border border-border/70 bg-background/80 p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Mission posture
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Designed for rapid handoff
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Use the dock for direct navigation, then focus the center
                    stage on today's appointments, patient flow, and
                    operational follow-through.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl border border-border/70 bg-card px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Role context
                    </p>
                    <p className="mt-2 text-sm font-medium text-foreground">
                      {role}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-card px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Session type
                    </p>
                    <p className="mt-2 text-sm font-medium text-foreground">
                      {user?.isImpersonating ? "Delegated access" : "Direct access"}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </aside>

          <main className="min-w-0">{children}</main>

          <aside className="space-y-4">
            <section className="rounded-[2rem] border border-border/70 bg-card/85 p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Command notes
              </p>
              <div className="mt-4 space-y-4 text-sm text-muted-foreground">
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <p className="font-medium text-foreground">Quick read</p>
                  <p className="mt-2 leading-6">
                    The dashboard is organized for glanceability first: signals
                    on top, queues in the center, and account context on the
                    rail so daily work stays uninterrupted.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <p className="font-medium text-foreground">Best next step</p>
                  <p className="mt-2 leading-6">
                    Review the live activity lane, then use the dock to enter
                    the workflow that needs attention first.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-border/70 bg-background/80 p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Account controls
              </p>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-border/70 bg-card px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Operator
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {user?.name ?? "Clinic user"}
                  </p>
                  {user?.email ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  ) : null}
                </div>
                <SignOutButton />
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
