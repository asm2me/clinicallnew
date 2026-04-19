import Link from 'next/link';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { DashboardNav } from '@/components/dashboard/nav';

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

export function DashboardShell({ title, description, role, children }: DashboardShellProps) {
  return (
    <div className="odoo-shell min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
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
              <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${roleTone[role].bg} ${roleTone[role].text}`}>
                <span className={`h-2 w-2 rounded-full ${roleTone[role].dot}`} aria-hidden="true" />
                {role}
              </div>
            </div>

            <div className="mt-6">
              <DashboardNav role={role} />
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <SignOutButton />
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

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="odoo-panel min-w-[180px] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Environment</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">Demo workspace</p>
                  <p className="mt-1 text-xs text-muted-foreground">No backend persistence</p>
                </div>
                <div className="odoo-panel min-w-[180px] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Access</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">{role}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Role-aware sample data</p>
                </div>
              </div>
            </div>
          </header>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
