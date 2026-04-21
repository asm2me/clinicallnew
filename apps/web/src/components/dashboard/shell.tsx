import type { ReactNode } from "react";
import Link from "next/link";

import { SignOutButton } from '@/components/auth/sign-out-button';
import { stopUserImpersonationAction } from '@/app/dashboard/users/impersonation-actions';
import { DashboardNav } from '@/components/dashboard/nav';
import type { AppRole } from '@/lib/auth';
import { getEffectiveDashboardUser } from '@/lib/impersonation';

export interface DashboardShellProps {
  title?: string;
  description?: string;
  role: AppRole;
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

function ShellBadge({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/75 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

export async function DashboardShell({
  title,
  description,
  role,
  children,
}: DashboardShellProps) {
  const user = await getEffectiveDashboardUser();
  const sessionType = user?.isImpersonating ? "Delegated access" : "Direct access";

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_24%),radial-gradient(circle_at_85%_12%,rgba(212,175,55,0.12),transparent_22%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_30%,rgba(255,255,255,0.02))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:gap-8">
          <aside className="space-y-5 lg:sticky lg:top-5 lg:self-start">
            <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/90 shadow-sm">
              <div className="border-b border-border/60 px-5 py-5">
                <div className="flex items-start gap-4">
                  <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-background text-primary shadow-sm">
                    <ToneMark className="absolute inset-0 h-full w-full" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      Clinicall
                    </p>
                    <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                      Atelier Workspace
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      A calmer operating layout built for elegant daily flow.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-4">
                <DashboardNav role={role} />
              </div>
            </section>

            <section className="rounded-[2rem] border border-border/70 bg-card/80 p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Operator profile
              </p>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-border/70 bg-background/75 px-4 py-4">
                  <p className="text-sm font-medium text-foreground">
                    {user?.name ?? "Clinic user"}
                  </p>
                  {user?.email ? (
                    <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                  ) : null}
                </div>

                <div className="grid gap-3">
                  <ShellBadge label="Role" value={role} />
                  <ShellBadge label="Access" value={sessionType} />
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-border/70 bg-background/70 p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Quick actions
              </p>
              <div className="mt-4 space-y-3">
                <Link
                  href="/"
                  className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-border bg-card px-4 text-sm font-medium text-foreground transition hover:border-foreground/20 hover:bg-accent"
                >
                  Public site
                </Link>
                <Link
                  href="/dashboard/my-profile"
                  className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-border bg-card px-4 text-sm font-medium text-foreground transition hover:border-foreground/20 hover:bg-accent"
                >
                  My profile
                </Link>
                <SignOutButton className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-border bg-card px-4 text-sm font-medium text-foreground transition hover:border-foreground/20 hover:bg-accent" />
              </div>
            </section>
          </aside>

          <div className="min-w-0 space-y-6">
            <header className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/90 shadow-sm">
              <div className="border-b border-border/60 px-6 py-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    <span>Elegant operations canvas</span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span>Focused daily flow</span>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {role}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 px-6 py-6 xl:grid-cols-[minmax(0,1.4fr)_320px]">
                <div className="min-w-0">
                  {title ? (
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                      {title}
                    </h1>
                  ) : null}

                  {description ? (
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                      {description}
                    </p>
                  ) : null}

                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm text-foreground">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      Refined workspace
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm text-foreground">
                      <span className="h-2 w-2 rounded-full bg-secondary" />
                      Low-noise navigation
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm text-foreground">
                      <span className="h-2 w-2 rounded-full bg-accent" />
                      High-clarity surfaces
                    </span>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-[1.75rem] border border-primary/20 bg-primary/10 px-5 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/80">
                      Workspace mode
                    </p>
                    <p className="mt-2 text-lg font-semibold text-foreground">
                      Elegant operations
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Designed to reduce visual noise and keep each next action clear.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <ShellBadge
                      label="Operator"
                      value={user?.name ?? "Clinic user"}
                    />
                    <ShellBadge label="Session" value={sessionType} />
                  </div>
                </div>
              </div>
            </header>

            {user?.isImpersonating ? (
              <section className="rounded-[2rem] border border-primary/30 bg-primary/10 p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Impersonation mode is active
                    </p>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                      You are reviewing the workspace through an alternate account context.
                      Exit impersonation to return to your own operator session.
                    </p>
                  </div>

                  <form action={stopUserImpersonationAction}>
                    <button
                      type="submit"
                      className="inline-flex h-11 items-center justify-center rounded-2xl border border-primary/35 bg-background px-4 text-sm font-medium text-foreground transition hover:bg-card"
                    >
                      Stop impersonating
                    </button>
                  </form>
                </div>
              </section>
            ) : null}

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
              <div className="rounded-[2rem] border border-border/70 bg-background/75 px-5 py-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  UX direction
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  This layout moves away from a dense command-center dock and into a quieter
                  studio-style workspace with a persistent sidebar, a clear hero header, and
                  one primary reading lane for content.
                </p>
              </div>

              <div className="rounded-[2rem] border border-border/70 bg-card/80 px-5 py-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Best use
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Start with the title block, scan your active role and session, then move down
                  the page without interruption.
                </p>
              </div>
            </section>

            <main className="min-w-0">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
