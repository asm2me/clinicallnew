import type { Metadata } from 'next';
import {
  CTASection,
  FeatureGrid,
  HeroSection,
  HowItWorks,
  PricingSection,
  TestimonialsSection,
  TrustBand
} from '@/components/marketing';

export const metadata: Metadata = {
  title: 'Clinicall | Premium clinic marketing and scheduling',
  description:
    'Convert more visitors into appointments with a premium clinic SaaS platform for booking, patient management, analytics, and multi-clinic operations.'
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBand />
      <FeatureGrid />
      <HowItWorks />
      <section className="bg-slate-50 py-20 dark:bg-slate-900/40 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Product preview</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                A polished dashboard built to make operations feel effortless.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-mutedForeground">
                Use one premium interface to review clinic performance, manage upcoming visits, and keep your team aligned
                across every location.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-white p-4 shadow-sm dark:bg-slate-950">
              <div className="rounded-2xl border border-border bg-slate-50 p-6 dark:bg-slate-900">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ['Appointments today', '128'],
                    ['Conversion rate', '34%'],
                    ['Active clinics', '12'],
                    ['No-shows prevented', '19']
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-950">
                      <p className="text-sm text-mutedForeground">{label}</p>
                      <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
    </>
  );
}