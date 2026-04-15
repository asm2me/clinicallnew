import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create a Clinicall account and start your clinic software trial in minutes.'
};

export default function RegisterPage() {
  return (
    <div className="py-16 sm:py-20">
      <section className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Register</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Create your account</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Set up your clinic profile, choose a plan, and get ready to launch.
            </p>
          </div>

          <form className="space-y-5" aria-label="Registration form">
            <div>
              <label htmlFor="register-name" className="mb-2 block text-sm font-medium text-foreground">
                Full name
              </label>
              <input
                id="register-name"
                name="name"
                type="text"
                autoComplete="name"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="register-email" className="mb-2 block text-sm font-medium text-foreground">
                Work email
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label htmlFor="register-password" className="mb-2 block text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Create a password"
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Start Free Trial
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:opacity-80">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}