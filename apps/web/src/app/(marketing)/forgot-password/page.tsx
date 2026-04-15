import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Request a password reset link for your Clinicall account.'
};

export default function ForgotPasswordPage() {
  return (
    <div className="py-16 sm:py-20">
      <section className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Forgot Password</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Reset your password</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Enter your email and we'll send you a secure reset link.
            </p>
          </div>

          <form className="space-y-5" aria-label="Password reset form">
            <div>
              <label htmlFor="reset-email" className="mb-2 block text-sm font-medium text-foreground">
                Email address
              </label>
              <input
                id="reset-email"
                name="email"
                type="email"
                autoComplete="email"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="you@company.com"
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Send Reset Link
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Remembered your password?{' '}
            <Link href="/login" className="font-semibold text-primary hover:opacity-80">
              Back to login
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}