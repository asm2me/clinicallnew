import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact the Clinicall team to request a demo, ask questions, or discuss your clinic rollout.'
};

export default function ContactPage() {
  return (
    <div className="py-16 sm:py-20">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Contact</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Talk to the team behind Clinicall.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Whether you're evaluating subscription plans, booking a demo, or preparing a tenant launch, we're
              here to help.
            </p>
            <div className="mt-8 space-y-4 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">Sales:</span> hello@clinicall.example
              </p>
              <p>
                <span className="font-semibold text-foreground">Support:</span> support@clinicall.example
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Start Free Trial
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                View Pricing
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <form className="space-y-5" aria-label="Contact form">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                  Work email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
                  How can we help?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Tell us about your clinic, rollout timeline, or demo request."
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}