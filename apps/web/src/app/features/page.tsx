import type { Metadata } from 'next';
import { CTASection, FeatureGrid, HowItWorks, TrustBand } from '@/components/marketing';

export const metadata: Metadata = {
  title: 'Features | Clinicall',
  description:
    'Explore multi-clinic management, doctor scheduling, online booking, patient management, and analytics for modern clinic growth.'
};

export default function FeaturesPage() {
  return (
    <>
      <section className="border-b border-border bg-slate-950 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Features</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Built for multi-clinic operations, patient growth, and modern scheduling.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Everything your team needs to manage locations, streamline care delivery, and convert more visitors into
            scheduled appointments.
          </p>
        </div>
      </section>
      <TrustBand />
      <FeatureGrid />
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-5">
            {[
              {
                title: 'Multi-clinic management',
                description:
                  'Oversee every branch from a single dashboard with centralized visibility, permissions, and reporting.'
              },
              {
                title: 'Doctor scheduling',
                description:
                  'Coordinate provider calendars, specialties, room availability, and coverage without manual conflict resolution.'
              },
              {
                title: 'Online booking',
                description:
                  'Capture bookings 24/7 with live availability, mobile-friendly flows, and clear conversion-focused CTAs.'
              },
              {
                title: 'Patient management',
                description:
                  'Keep profiles, appointment history, and follow-ups organized so your staff can deliver consistent service.'
              },
              {
                title: 'Analytics',
                description:
                  'Measure bookings, no-shows, utilization, and campaign performance to guide better decisions.'
              }
            ].map((item) => (
              <article key={item.title} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-cardForeground">{item.title}</h2>
                <p className="mt-3 leading-7 text-mutedForeground">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <HowItWorks />
      <CTASection />
    </>
  );
}