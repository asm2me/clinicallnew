import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <section className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
              Secure clinic operations platform
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Sign in to Clinicall
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                Access your tenant workspace, manage patients and appointments, and continue where your team left off.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">Development access</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                For local development, use any seeded account with the password <span className="font-semibold text-foreground">demo1234</span>.
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <li>superadmin@clinicall.demo</li>
                <li>tenantadmin@clinicall.demo</li>
                <li>doctor@clinicall.demo</li>
                <li>staff@clinicall.demo</li>
                <li>patient@clinicall.demo</li>
              </ul>
            </div>
          </section>

          <section aria-label="Sign in form">
            <Suspense
              fallback={
                <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                  <div className="h-6 w-40 animate-pulse rounded bg-muted" />
                  <div className="mt-4 h-10 w-full animate-pulse rounded bg-muted" />
                  <div className="mt-3 h-10 w-full animate-pulse rounded bg-muted" />
                  <div className="mt-5 h-11 w-full animate-pulse rounded bg-muted" />
                </div>
              }
            >
              <LoginForm />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  );
}
