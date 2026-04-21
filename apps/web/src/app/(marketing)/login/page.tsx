import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';

function ToneMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      className="h-16 w-16 text-primary/70"
      fill="none"
    >
      <circle cx="60" cy="60" r="59.5" stroke="currentColor" opacity="0.18" />
      <circle cx="60" cy="60" r="38" stroke="currentColor" opacity="0.28" />
      <path
        d="M17 77c14-6 26-10 43-10 16 0 28 4 43 10"
        stroke="currentColor"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M26 45c11-12 20-18 34-18s23 6 34 18"
        stroke="currentColor"
        strokeLinecap="round"
        opacity="0.36"
      />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 pb-12 pt-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_24%),radial-gradient(circle_at_82%_14%,rgba(212,175,55,0.14),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_32%,rgba(255,255,255,0.02))]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center xl:gap-12">
          <section className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Secure clinic operations platform
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-border/70 bg-card/90 shadow-sm">
                  <ToneMark />
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                    Clinicall access
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Premium operations workspace for modern clinics
                  </p>
                </div>
              </div>

              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Sign in to your clinic workspace with clarity and confidence.
              </h1>

              <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                Continue with appointments, patient operations, and team workflows inside the
                same dark premium environment as the main Clinicall experience.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-[1.75rem] border border-border/70 bg-card/90 p-5 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Theme alignment
                </p>
                <p className="mt-3 text-lg font-semibold text-foreground">
                  Same visual language
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Dark background, warm gold accents, quiet surfaces, and stronger readability.
                </p>
              </article>

              <article className="rounded-[1.75rem] border border-primary/20 bg-primary/10 p-5 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/80">
                  Access mode
                </p>
                <p className="mt-3 text-lg font-semibold text-foreground">
                  Secure sign-in
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Designed to feel consistent with the home page while keeping the form easy to
                  scan and complete.
                </p>
              </article>
            </div>

            <div className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-sm">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Development access
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                For local development, use any seeded account with the password{' '}
                <span className="font-semibold text-foreground">demo1234</span>.
              </p>
              <ul className="mt-5 grid gap-3 text-sm text-foreground/90 sm:grid-cols-2">
                <li className="rounded-xl border border-border/70 bg-background/70 px-4 py-3">
                  superadmin@clinicall.demo
                </li>
                <li className="rounded-xl border border-border/70 bg-background/70 px-4 py-3">
                  tenantadmin@clinicall.demo
                </li>
                <li className="rounded-xl border border-border/70 bg-background/70 px-4 py-3">
                  doctor@clinicall.demo
                </li>
                <li className="rounded-xl border border-border/70 bg-background/70 px-4 py-3">
                  staff@clinicall.demo
                </li>
                <li className="rounded-xl border border-border/70 bg-background/70 px-4 py-3 sm:col-span-2">
                  patient@clinicall.demo
                </li>
              </ul>
            </div>
          </section>

          <section aria-label="Sign in form" className="lg:pl-4">
            <Suspense
              fallback={
                <div className="w-full rounded-[2rem] border border-border/70 bg-card/95 p-6 shadow-sm sm:p-8">
                  <div className="h-6 w-40 animate-pulse rounded bg-muted" />
                  <div className="mt-4 h-12 w-full animate-pulse rounded-xl bg-muted" />
                  <div className="mt-3 h-12 w-full animate-pulse rounded-xl bg-muted" />
                  <div className="mt-5 h-12 w-full animate-pulse rounded-xl bg-muted" />
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
