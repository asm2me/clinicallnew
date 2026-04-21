import Link from 'next/link';

import { SignOutButton } from '@/components/auth/sign-out-button';
import { stopUserImpersonationAction } from '@/app/dashboard/users/impersonation-actions';
import { DashboardNav } from '@/components/dashboard/nav';
import { getEffectiveDashboardUser } from '@/lib/impersonation';

type DashboardShellProps = {
  title?: string;
  description?: string;
  role: string;
  children: React.ReactNode;
};

type RoleToneConfig = {
  bg: string;
  text: string;
  dot: string;
};

const roleTone: Record<string, RoleToneConfig> = {
  'SUPER_ADMIN': { bg: 'bg-primary/10', text: 'text-primary', dot: 'bg-primary' },
  'Super Admin': { bg: 'bg-primary/10', text: 'text-primary', dot: 'bg-primary' },
  'TENANT_ADMIN': { bg: 'bg-secondary/10', text: 'text-secondary', dot: 'bg-secondary' },
  'Tenant Admin': { bg: 'bg-secondary/10', text: 'text-secondary', dot: 'bg-secondary' },
  'DOCTOR': { bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
  'Doctor': { bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
  'STAFF': { bg: 'bg-amber-500/10', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
  'Staff': { bg: 'bg-amber-500/10', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
  'PATIENT': { bg: 'bg-sky-500/10', text: 'text-sky-700 dark:text-sky-300', dot: 'bg-sky-500' },
  'Patient': { bg: 'bg-sky-500/10', text: 'text-sky-700 dark:text-sky-300', dot: 'bg-sky-500' }
};

export async function DashboardShell({ title, description, role, children }: DashboardShellProps) {
  const effectiveUser = await getEffectiveDashboardUser();
  const effectiveRole = effectiveUser?.role || role;
  const impersonationName = effectiveUser?.name || effectiveUser?.email || 'selected user';
  const tone = roleTone[effectiveRole] ?? roleTone.STAFF;

  return (
    <div className="odoo-shell min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
        {effectiveUser?.isImpersonating ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold">Impersonation mode active</div>
                <div className="mt-1 text-amber-800">
                  You are viewing the dashboard as {impersonationName}. Stop impersonation to return to your
                  super admin account.
                </div>
              </div>

              <form action={stopUserImpersonationAction}>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md border border-amber-300 bg-white px-3 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-100"
                >
                  Return to super admin
                </button>
              </form>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-72">
          <div className="odoo-card sticky top-6 p-5">
            <div className="border-b border-border pb-5">
              <Link href="/" className="text-lg font-bold tracking-tight text-foreground">
                Clinicall
              </Link>
              <p className="mt-2 text-sm text-muted-foreground">
                Multi-tenant clinic operations demo with role-based workspace views.
              </p>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Workspace role</p>
              <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${tone.bg} ${tone.text}`}>
                <span className={`h-2 w-2 rounded-full ${tone.dot}`} aria-hidden="true" />
                {effectiveRole}
              </div>
            </div>

            <div className="mt-6">
              <DashboardNav role={effectiveRole} />
            </div>

          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="odoo-card mb-6 p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Clinic SaaS dashboard</p>
                {title ? <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">{title}</h1> : null}
                {description ? <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p> : null}
              </div>

              <div className="flex flex-col items-stretch gap-3 sm:items-end">
                <details className="relative">
                  <summary className="flex cursor-pointer list-none items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-left shadow-sm transition hover:bg-muted">
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {effectiveUser?.name || effectiveUser?.email || 'My account'}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">{effectiveUser?.email || effectiveRole}</span>
                    </div>
                    <span className="text-xs text-muted-foreground" aria-hidden="true">
                      ▾
                    </span>
                  </summary>

                  <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-border bg-background p-2 shadow-lg">
                    <Link
                      href="/dashboard/my-profile"
                      className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                    >
                      My profile
                    </Link>
                    <div className="mt-1 border-t border-border pt-2">
                      <SignOutButton
                        className="w-full justify-start rounded-md px-3 py-2 text-sm font-medium"
                        label="Logout"
                        loadingLabel="Logging out…"
                      />
                    </div>
                  </div>
                </details>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="odoo-panel min-w-[180px] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Environment</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">Demo workspace</p>
                    <p className="mt-1 text-xs text-muted-foreground">No backend persistence</p>
                  </div>
                  <div className="odoo-panel min-w-[180px] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Access</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{effectiveRole}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Role-aware sample data</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div>{children}</div>
        </div>
        </div>
      </div>
    </div>
  );
}
