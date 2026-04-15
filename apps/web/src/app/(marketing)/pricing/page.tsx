import type { Metadata } from 'next';
import { CTASection, PricingSection, PricingTable, TrustBand } from '@/components/marketing';

export const metadata: Metadata = {
  title: 'Pricing | Clinicall',
  description:
    'Choose a clinic SaaS pricing plan with Free, Basic, and Pro tiers, including monthly and yearly billing options.'
};

export default function PricingPage() {
  return (
    <>
      <section className="border-b border-border bg-slate-950 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Pricing</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Simple pricing for clinics that want to grow without complexity.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Start with Free, upgrade to Basic for everyday operations, or choose Pro for advanced multi-clinic growth.
            Switch between monthly and yearly billing to find the right fit for your team.
          </p>
        </div>
      </section>
      <TrustBand />
      <PricingSection />
      <PricingTable />
      <section className="bg-slate-50 py-20 dark:bg-slate-900/40 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-white p-8 shadow-sm dark:bg-slate-950">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Monthly or yearly billing</h2>
                <p className="mt-2 text-mutedForeground">
                  Yearly billing gives you the best value for scaling clinics, while monthly billing keeps things flexible.
                </p>
              </div>
              <div className="rounded-full border border-border bg-slate-50 p-1 dark:bg-slate-900">
                <div className="flex rounded-full bg-white shadow-sm dark:bg-slate-950">
                  <span className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white">Monthly</span>
                  <span className="px-4 py-2 text-sm font-medium text-mutedForeground">Yearly</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}