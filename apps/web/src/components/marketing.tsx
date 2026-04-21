import Link from 'next/link';
import type { ReactNode } from 'react';

type NarrativeItem = {
  title: string;
  body: string;
  meta: string;
};

type PricingPlan = {
  name: string;
  price: string;
  cadence: string;
  summary: string;
  audience: string;
  cta: string;
  href: string;
  featured?: boolean;
  notes: string[];
};

const proofPoints = [
  'Faster intake and follow-up coordination',
  'Shared visibility across front desk and care teams',
  'Cleaner handoff between scheduling, notes, and billing prep',
  'A calmer patient experience from first contact to revisit',
];

const modules: Array<{ label: string; title: string; body: string; icon: ReactNode }> = [
  {
    label: 'Flow control',
    title: 'See the clinic day as it unfolds, not after it slips.',
    body: 'Live schedules, patient movement, and team actions stay visible in one operational picture so managers can respond before bottlenecks compound.',
    icon: <PulseIcon />,
  },
  {
    label: 'Patient communication',
    title: 'Give every patient a more coherent journey.',
    body: 'Centralized outreach keeps confirmations, reminders, and care updates aligned with the actual state of the visit.',
    icon: <ChatIcon />,
  },
  {
    label: 'Documentation',
    title: 'Replace scattered admin with a structured clinical record.',
    body: 'Capture notes, context, and follow-up actions in the same workspace your team already uses to coordinate care.',
    icon: <DocumentIcon />,
  },
  {
    label: 'Leadership insight',
    title: 'Turn daily operations into something measurable.',
    body: 'Track throughput, missed steps, and operational friction without forcing your team into yet another disconnected reporting tool.',
    icon: <CompassIcon />,
  },
];

const operatingSystemStories: NarrativeItem[] = [
  {
    meta: '01 / Before clinic opens',
    title: 'Prepare the day with one shared briefing surface.',
    body: 'Teams can review appointments, special handling needs, staffing notes, and at-risk visits before the first patient arrives.',
  },
  {
    meta: '02 / During live operations',
    title: 'Coordinate movement, exceptions, and communication in real time.',
    body: 'When visits run long or the schedule shifts, staff can respond from the same source of truth instead of chasing updates across tools.',
  },
  {
    meta: '03 / After patient care',
    title: 'Close loops while the context is still fresh.',
    body: 'Documentation, follow-up tasks, and next-step communication stay connected to the visit, reducing operational drift at the end of the day.',
  },
];

const testimonials = [
  {
    quote:
      'We stopped operating like three different teams sharing a building. Front desk, clinicians, and leadership finally see the same day.',
    name: 'Dr. Maya Chen',
    role: 'Medical Director, Harbor Family Clinic',
  },
  {
    quote:
      'The product feels less like software and more like an operations room. We can spot issues earlier and move patients through the system with less friction.',
    name: 'Elena Brooks',
    role: 'Practice Manager, Northline Women’s Health',
  },
];

const plans: PricingPlan[] = [
  {
    name: 'Starter',
    price: '$79',
    cadence: '/clinic month',
    summary: 'For smaller practices replacing spreadsheets, shared inboxes, and basic scheduling tools.',
    audience: 'Best for single-location teams establishing a cleaner daily operating rhythm.',
    cta: 'Start with Starter',
    href: '/register',
    notes: ['Scheduling and calendar coordination', 'Patient messaging hub', 'Shared activity tracking'],
  },
  {
    name: 'Growth',
    price: '$179',
    cadence: '/clinic month',
    summary: 'For active clinics ready to manage intake, care coordination, and team visibility in one place.',
    audience: 'Best for multi-role teams that need tighter operational control and clearer accountability.',
    cta: 'Choose Growth',
    href: '/register',
    featured: true,
    notes: ['Everything in Starter', 'Workflow automation and team views', 'Advanced reporting and clinic oversight'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    cadence: '',
    summary: 'For larger groups that need tailored rollout support, oversight, and implementation planning.',
    audience: 'Best for regional operators and complex organizations with multiple clinics or service lines.',
    cta: 'Talk to sales',
    href: '/contact',
    notes: ['Implementation guidance', 'Custom configuration support', 'Priority partnership and rollout planning'],
  },
];

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
      {children}
    </p>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

function PulseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12h4l2.5-5 4 10 2.5-5H21" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10h10" />
      <path d="M7 14h6" />
      <path d="M5 19V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3Z" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 7h8" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
      <path d="M7 3h8l4 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M15 3v4h4" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="m15.5 8.5-2.6 5.1-5.1 2.6 2.6-5.1 5.1-2.6Z" />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className="px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-14 lg:pt-10">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-end">
        <div className="space-y-8 rounded-[2rem] border border-border bg-card/60 p-6 shadow-[0_24px_80px_-56px_rgba(0,0,0,0.7)] sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-border bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Editorial clinic operations
            </span>
            <span className="rounded-full bg-primary/10 px-4 py-2 text-xs font-medium text-primary">
              Built for practices that value precision and calm
            </span>
          </div>

          <div className="max-w-3xl space-y-5">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              A better clinic day starts with a better operating system.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Clinicall replaces fragmented admin with a clearer way to run care. Scheduling,
              patient communication, documentation, and team visibility all live in one editorial,
              day-shaping workspace.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
            >
              Start free
              <ArrowUpRightIcon />
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3.5 text-sm font-medium text-foreground transition hover:bg-accent"
            >
              Explore the system
            </Link>
          </div>

          <div className="grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
            <div>
              <p className="text-3xl font-semibold text-foreground">1 source</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                of truth for front desk, clinicians, and operators.
              </p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-foreground">Live-day</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                awareness for visits, delays, exceptions, and follow-up needs.
              </p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-foreground">Care-first</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                workflows that reduce noise without flattening clinical nuance.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-border bg-background shadow-[0_32px_100px_-60px_rgba(0,0,0,0.75)]">
          <div className="border-b border-border px-6 py-5">
            <SectionLabel>Clinic daybook</SectionLabel>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Today’s command view</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  A narrative picture of capacity, patient flow, and the work still open.
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Live operations
              </span>
            </div>
          </div>

          <div className="grid gap-6 p-6">
            <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[1.5rem] border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">Schedule integrity</p>
                  <span className="text-xs text-muted-foreground">08:00 — 17:30</span>
                </div>
                <div className="mt-5 space-y-4">
                  {[
                    ['On-time visits', '84%'],
                    ['Pending confirmations', '12'],
                    ['Follow-up tasks', '07'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between border-b border-border/70 pb-3 last:border-b-0 last:pb-0">
                      <span className="text-sm text-muted-foreground">{label}</span>
                      <span className="text-lg font-semibold text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-border bg-primary p-5 text-primary-foreground">
                <p className="text-sm font-medium text-primary-foreground/80">Operational note</p>
                <p className="mt-3 text-lg font-semibold leading-7">
                  Two providers are running ahead. Front desk can pull forward three waiting patients
                  and reduce late-afternoon congestion.
                </p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">What teams keep in view</p>
                <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Coordinated workflows
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {proofPoints.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-border/80 bg-background/80 px-4 py-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustBand() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-border bg-background/70 px-6 py-8 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-3">
            <SectionLabel>Why clinics switch</SectionLabel>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              High-trust operations need more than a collection of disconnected tools.
            </h2>
            <p className="text-sm leading-6 text-muted-foreground sm:text-base">
              Clinicall is designed for care environments where handoffs matter, timing matters, and
              every operational detail shapes the patient experience.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['Scheduling', 'Bring booking, rescheduling, and daily flow into one coordinated layer.'],
              ['Patient experience', 'Keep reminders, arrivals, and follow-up communication connected to the real visit.'],
              ['Leadership visibility', 'Understand pressure points across teams without losing clinical context.'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-[1.5rem] border border-border bg-card px-5 py-5">
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeatureGrid() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div className="space-y-4 lg:sticky lg:top-28">
            <SectionLabel>The system</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Four connected layers for the modern clinic.
            </h2>
            <p className="text-sm leading-6 text-muted-foreground sm:text-base">
              Instead of forcing teams to jump between isolated apps, Clinicall is designed as one
              continuous operating environment.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {modules.map((module, index) => (
              <article
                key={module.title}
                className={index === 1 ? 'sm:translate-y-10' : index === 2 ? 'sm:-translate-y-4' : ''}
              >
                <div className="h-full rounded-[1.75rem] border border-border bg-card p-6 shadow-[0_24px_80px_-60px_rgba(0,0,0,0.65)]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      {module.icon}
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        {module.label}
                      </p>
                    </div>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
                    {module.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{module.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-border bg-card/60 p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Built around the actual rhythm of a care day.
            </h2>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              Clinicall follows the clinic journey from preparation to live operations to follow-up,
              so information stays coherent as patients and teams move.
            </p>
          </div>

          <div className="space-y-4">
            {operatingSystemStories.map((story) => (
              <article
                key={story.meta}
                className="rounded-[1.5rem] border border-border bg-background/80 p-5 sm:p-6"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  {story.meta}
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
                  {story.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{story.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <SectionLabel>Field notes</SectionLabel>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            What practice leaders notice first.
          </h2>
          <p className="text-sm leading-7 text-muted-foreground sm:text-base">
            Less rework, clearer handoffs, and a calmer front-of-house experience are often the first
            changes teams describe after adopting Clinicall.
          </p>
        </div>

        <div className="grid gap-4">
          {testimonials.map((item, index) => (
            <blockquote
              key={item.name}
              className={index === 0 ? 'rounded-[1.75rem] border border-border bg-primary p-6 text-primary-foreground sm:p-8' : 'rounded-[1.75rem] border border-border bg-card p-6 sm:p-8'}
            >
              <p className={index === 0 ? 'text-xl font-medium leading-8 text-primary-foreground' : 'text-xl font-medium leading-8 text-foreground'}>
                “{item.quote}”
              </p>
              <footer className="mt-6">
                <p className={index === 0 ? 'text-sm font-semibold text-primary-foreground' : 'text-sm font-semibold text-foreground'}>
                  {item.name}
                </p>
                <p className={index === 0 ? 'text-sm text-primary-foreground/80' : 'text-sm text-muted-foreground'}>
                  {item.role}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="space-y-4">
            <SectionLabel>Pricing</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Choose the operating model that fits your clinic stage.
            </h2>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              Start with the essentials or roll out a more advanced command layer for larger teams.
              Every plan is designed to reduce operational fragmentation and support better care flow.
            </p>
            <div className="rounded-[1.5rem] border border-border bg-card p-5">
              <p className="text-sm font-semibold text-foreground">Included with every plan</p>
              <ul className="mt-4 space-y-3">
                {[
                  'Modern scheduling and day planning',
                  'Shared patient communication history',
                  'A clinic-wide view of tasks and follow-up',
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <PricingTable />
        </div>
      </div>
    </section>
  );
}

export function PricingTable() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {plans.map((plan) => (
        <article
          key={plan.name}
          className={
            plan.featured
              ? 'rounded-[1.75rem] border border-primary/30 bg-primary p-6 text-primary-foreground shadow-[0_36px_100px_-70px_rgba(0,0,0,0.8)]'
              : 'rounded-[1.75rem] border border-border bg-card p-6'
          }
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className={
                  plan.featured
                    ? 'text-[11px] font-semibold uppercase tracking-[0.24em] text-primary-foreground/80'
                    : 'text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground'
                }
              >
                {plan.name}
              </p>
              <p className={plan.featured ? 'mt-4 text-4xl font-semibold text-primary-foreground' : 'mt-4 text-4xl font-semibold text-foreground'}>
                {plan.price}
                <span className={plan.featured ? 'ml-1 text-base font-normal text-primary-foreground/80' : 'ml-1 text-base font-normal text-muted-foreground'}>
                  {plan.cadence}
                </span>
              </p>
            </div>
            {plan.featured ? (
              <span className="rounded-full bg-background/15 px-3 py-1 text-xs font-medium text-primary-foreground">
                Most chosen
              </span>
            ) : null}
          </div>

          <p className={plan.featured ? 'mt-5 text-sm leading-7 text-primary-foreground/85' : 'mt-5 text-sm leading-7 text-muted-foreground'}>
            {plan.summary}
          </p>
          <p className={plan.featured ? 'mt-3 text-sm leading-7 text-primary-foreground/75' : 'mt-3 text-sm leading-7 text-muted-foreground'}>
            {plan.audience}
          </p>

          <ul className="mt-6 space-y-3">
            {plan.notes.map((item) => (
              <li
                key={item}
                className={
                  plan.featured
                    ? 'flex gap-3 text-sm leading-6 text-primary-foreground/90'
                    : 'flex gap-3 text-sm leading-6 text-muted-foreground'
                }
              >
                <span className={plan.featured ? 'mt-2 h-1.5 w-1.5 rounded-full bg-primary-foreground' : 'mt-2 h-1.5 w-1.5 rounded-full bg-primary'} />
                {item}
              </li>
            ))}
          </ul>

          <Link
            href={plan.href}
            className={
              plan.featured
                ? 'mt-8 inline-flex items-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:opacity-95'
                : 'mt-8 inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-accent'
            }
          >
            {plan.cta}
            <ArrowUpRightIcon />
          </Link>
        </article>
      ))}
    </div>
  );
}

export function CTASection() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-border bg-background shadow-[0_28px_100px_-68px_rgba(0,0,0,0.8)]">
        <div className="grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-12">
          <div className="space-y-4">
            <SectionLabel>Next step</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Design a steadier clinic experience from the inside out.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Whether you are modernizing one location or coordinating a broader care network,
              Clinicall helps teams work from a clearer operational narrative every day.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-3 rounded-[1.5rem] border border-border bg-card p-5 sm:p-6">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
            >
              Start free
              <ArrowUpRightIcon />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition hover:bg-accent"
            >
              Speak with sales
            </Link>
            <p className="text-center text-xs uppercase tracking-[0.22em] text-muted-foreground">
              No extra tools. No scattered workflows. Just one clinical operating system.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}