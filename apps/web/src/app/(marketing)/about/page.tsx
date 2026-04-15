import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn how Clinicall helps modern clinics launch a premium, conversion-focused SaaS experience.'
};

const milestones = [
  {
    title: 'Built for clinic operations',
    description: 'A focused product story that connects patient acquisition, scheduling, and admin workflows.'
  },
  {
    title: 'Designed to convert',
    description: 'Premium SaaS messaging, clear calls to action, and friction-light onboarding paths.'
  },
  {
    title: 'Ready for scale',
    description: 'A structure that supports multi-clinic growth, subscription billing, and dashboard entry points.'
  }
];

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-20">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">About</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              A premium SaaS presence for clinics that want to grow with confidence.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Clinicall is structured to showcase a modern clinic software platform with a polished public website,
              clear route architecture, and direct entry points for customers and teams.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Start Free Trial
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                Book Demo
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <div className="space-y-6">
              {milestones.map((item) => (
                <article key={item.title} className="rounded-2xl bg-muted/60 p-5">
                  <h2 className="text-lg font-semibold text-foreground">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}