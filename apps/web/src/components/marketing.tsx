import Link from 'next/link';

type IconProps = {
  className?: string;
};

type Feature = {
  title: string;
  description: string;
  icon: (props: IconProps) => JSX.Element;
};

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  clinic: string;
};

type PricingPlan = {
  name: string;
  description: string;
  monthly: string;
  yearly: string;
  cta: string;
  highlight?: boolean;
  features: string[];
};

function SparkIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2Z" />
      <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" />
      <path d="M5 14l1.1 2.9L9 18l-2.9 1.1L5 22l-1.1-2.9L1 18l2.9-1.1L5 14Z" />
    </svg>
  );
}

function ClinicIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M4 21V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14" />
      <path d="M9 21v-4h6v4" />
      <path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
      <path d="M12 2v4M10 4h4" />
    </svg>
  );
}

function CalendarIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M7 2v4M17 2v4M3 9h18" />
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  );
}

function BookingIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M4 6h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" />
      <path d="M8 4v4M16 4v4M8 12h8M8 16h5" />
    </svg>
  );
}

function PatientIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
      <path d="M4 20a8 8 0 0 1 16 0" />
      <path d="M19 8h4M21 6v4" />
    </svg>
  );
}

function AnalyticsIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20v-11" />
      <path d="M2 20h20" />
    </svg>
  );
}

function ShieldIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M12 3 5 6v6c0 5 3.4 7.7 7 9 3.6-1.3 7-4 7-9V6l-7-3Z" />
      <path d="m9.5 12 1.7 1.7 3.3-3.7" />
    </svg>
  );
}

const features: Feature[] = [
  {
    title: 'Multi-clinic operations',
    description:
      'Coordinate several locations from one console with unified branding, tenant-level controls, and centralized reporting.',
    icon: ClinicIcon
  },
  {
    title: 'Doctor scheduling',
    description:
      'Build conflict-free calendars for doctors, specialists, and rooms with smart availability rules and real-time status.',
    icon: CalendarIcon
  },
  {
    title: 'Online booking',
    description:
      'Let patients reserve visits in seconds from your website, campaign pages, or shared links with live availability.',
    icon: BookingIcon
  },
  {
    title: 'Patient management',
    description:
      'Keep every patient profile, visit history, and follow-up task organized so your team can deliver faster care.',
    icon: PatientIcon
  },
  {
    title: 'Analytics that drive growth',
    description:
      'Track bookings, utilization, cancellations, and conversion performance so you know exactly what to improve.',
    icon: AnalyticsIcon
  },
  {
    title: 'Secure tenant-ready platform',
    description:
      'Deliver a premium SaaS experience with role-based access, tenant isolation, and launch-ready operational workflows.',
    icon: ShieldIcon
  }
];

const testimonials: Testimonial[] = [
  {
    quote:
      'Clinicall gave us a premium booking experience that immediately made our brand look more credible and modern.',
    name: 'Dr. Nadia Karim',
    role: 'Founder & Medical Director',
    clinic: 'Northstar Clinics'
  },
  {
    quote:
      'Managing branches, doctors, and appointments is finally simple. We spend less time coordinating and more time serving patients.',
    name: 'Omar Hassan',
    role: 'Operations Manager',
    clinic: 'Verve Health Group'
  },
  {
    quote:
      'The patient journey feels polished from the first click to the final confirmation. Our no-shows dropped noticeably.',
    name: 'Sara Ahmed',
    role: 'Practice Administrator',
    clinic: 'Apex Family Care'
  }
];

const plans: PricingPlan[] = [
  {
    name: 'Free',
    description: 'A polished starting point for solo clinics testing online booking and digital intake.',
    monthly: '$0',
    yearly: '$0',
    cta: 'Start Free Trial',
    features: ['1 clinic', 'Basic booking', 'Patient profiles', 'Email support']
  },
  {
    name: 'Basic',
    description: 'Built for growing clinics that need scheduling automation, analytics, and a stronger patient journey.',
    monthly: '$49',
    yearly: '$39',
    cta: 'Book Demo',
    features: ['Up to 3 clinics', 'Doctor scheduling', 'Online booking', 'Core analytics']
  },
  {
    name: 'Pro',
    description: 'Advanced operations for multi-location healthcare businesses focused on growth and premium service.',
    monthly: '$99',
    yearly: '$79',
    cta: 'Start Free Trial',
    highlight: true,
    features: ['Unlimited clinics', 'Advanced permissions', 'Automation workflows', 'Priority support']
  }
];

const comparisons = [
  { feature: 'Multi-clinic management', free: '—', basic: '✓', pro: '✓' },
  { feature: 'Doctor scheduling', free: '—', basic: '✓', pro: '✓' },
  { feature: 'Online booking', free: '✓', basic: '✓', pro: '✓' },
  { feature: 'Patient management', free: '✓', basic: '✓', pro: '✓' },
  { feature: 'Analytics dashboard', free: 'Basic', basic: 'Advanced', pro: 'Advanced+' },
  { feature: 'Priority support', free: '—', basic: '—', pro: '✓' }
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(52,211,153,0.15),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.12),_transparent_40%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-400/20 bg-primary-400/10 px-4 py-2 text-sm text-primary-100 backdrop-blur">
            <SparkIcon className="h-4 w-4" />
            Premium clinic management platform
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Transform Your Clinic Operations With Intelligent Booking
          </h1>
          <p className="mt-6 text-lg leading-8 text-primary-100/90">
            Streamline appointments, reduce no-shows, and deliver exceptional patient experiences with our modern, intuitive platform designed for healthcare excellence.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-400 to-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:from-primary-300 hover:to-primary-400"
            >
              <SparkIcon className="h-4 w-4" />
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 backdrop-blur-sm"
            >
              <CalendarIcon className="h-4 w-4" />
              Book Demo
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { value: '99.9%', label: 'Platform uptime', icon: ShieldIcon },
              { value: '3x', label: 'Faster bookings', icon: BookingIcon },
              { value: '24/7', label: 'Patient access', icon: SparkIcon }
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-primary-400/10 bg-primary-400/5 p-5 backdrop-blur-sm">
                <item.icon className="h-5 w-5 text-primary-300" />
                <p className="mt-4 text-2xl font-semibold text-white">{item.value}</p>
                <p className="mt-1 text-sm text-primary-100/70">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-primary-400/10 blur-3xl" />
          <div className="relative rounded-[2rem] border border-primary-400/20 bg-primary-900/30 p-4 shadow-2xl shadow-primary-950/40 backdrop-blur-xl">
            <div className="rounded-[1.5rem] border border-primary-400/20 bg-primary-950/60 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary-200">Live clinic command center</p>
                  <p className="text-xl font-semibold text-white">Operations dashboard</p>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Live
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-2xl border border-primary-400/10 bg-primary-900/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-primary-200">Appointments today</p>
                      <p className="mt-1 text-3xl font-bold text-white">128</p>
                    </div>
                    <AnalyticsIcon className="h-8 w-8 text-primary-400" />
                  </div>
                  <div className="mt-4 h-28 rounded-xl bg-gradient-to-b from-primary-500/20 to-primary-900/20 p-4">
                    <div className="flex h-full items-end gap-2">
                      {[35, 60, 44, 72, 58, 84, 66].map((height, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t-lg bg-gradient-to-t from-primary-600 to-primary-400"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    ['Confirmed bookings', '91', 'text-emerald-400'],
                    ['Pending approvals', '14', 'text-amber-400'],
                    ['No-show alerts', '07', 'text-rose-400']
                  ].map(([label, value, color]) => (
                    <div key={label} className="rounded-2xl border border-primary-400/10 bg-primary-900/30 p-4">
                      <p className="text-sm text-primary-200">{label}</p>
                      <p className={`mt-2 text-2xl font-semibold ${color}`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  ['09:00', 'New patient consultation', 'Dr. Lina Hassan', 'Confirmed'],
                  ['10:30', 'Dermatology follow-up', 'Dr. Omar Nabil', 'Booked'],
                  ['13:00', 'Telehealth review', 'Dr. Sara Adel', 'Pending']
                ].map(([time, title, doctor, status]) => (
                  <div key={time} className="flex items-center justify-between rounded-xl border border-primary-400/10 bg-primary-900/30 px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 rounded-lg bg-primary-500/20 p-2 text-primary-300">
                        <CalendarIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{title}</p>
                        <p className="text-sm text-primary-200">
                          {time} · {doctor}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full border border-primary-400/20 px-3 py-1 text-xs text-primary-100">{status}</span>
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
    <section className="border-b border-border bg-gradient-to-r from-primary-50 to-secondary-50 py-8 dark:from-primary-950/30 dark:to-secondary-950/30">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 sm:px-6 lg:px-8">
        {[
          { label: 'Trusted by modern clinics', icon: ShieldIcon },
          { label: 'Multi-location ready', icon: ClinicIcon },
          { label: 'Accessible patient journeys', icon: PatientIcon },
          { label: 'Built for conversion', icon: SparkIcon }
        ].map((item) => (
          <div key={item.label} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
            <item.icon className="h-4 w-4 text-primary-600" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FeatureGrid() {
  return (
    <section id="features" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Platform features</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            A Modern Clinic Platform Built for Healthcare Excellence
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Everything from appointment intake to analytics is designed to feel premium, move fast, and support healthcare teams at scale.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group card-base card-hover p-6"
            >
              <div className="inline-flex rounded-2xl bg-primary-500/10 p-3 text-primary-600 transition group-hover:bg-primary-500 group-hover:text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-950 dark:text-white">{feature.title}</h3>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{feature.description}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-600">
                Learn more
                <span aria-hidden="true">→</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="bg-gradient-to-b from-primary-50 to-white dark:from-primary-950/20 dark:to-slate-950 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">How it works</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Go from First Visitor to Confirmed Patient in Four Simple Steps
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {[
            {
              step: '01',
              title: 'Create your tenant workspace',
              description: 'Launch a branded clinic environment with plans, permissions, and a conversion-ready digital presence.',
              icon: ClinicIcon
            },
            {
              step: '02',
              title: 'Configure doctors and schedules',
              description: 'Assign providers, specialties, rooms, and availability rules across branches without manual chaos.',
              icon: CalendarIcon
            },
            {
              step: '03',
              title: 'Accept bookings online',
              description: 'Let patients book on any device with clean flows, instant confirmations, and reduced friction.',
              icon: BookingIcon
            },
            {
              step: '04',
              title: 'Measure and optimize growth',
              description: 'Use analytics, alerts, and patient behavior insights to improve conversion and operational efficiency.',
              icon: AnalyticsIcon
            }
          ].map((item) => (
            <article key={item.step} className="rounded-2xl border border-border bg-white p-6 shadow-sm dark:bg-slate-950">
              <div className="flex items-center justify-between">
                <div className="inline-flex rounded-2xl bg-primary-500/10 p-3 text-primary-600">
                  <item.icon className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-primary-600">{item.step}</p>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-950 dark:text-white">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Customer stories</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Trusted by Healthcare Teams Delivering Exceptional Care
          </h2>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.24)] dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="inline-flex rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary-600">
                Verified customer
              </div>
              <blockquote className="mt-5 text-lg leading-8 text-slate-800 dark:text-slate-100">"{testimonial.quote}"</blockquote>
              <figcaption className="mt-6 border-t border-border pt-5">
                <div className="font-semibold text-slate-950 dark:text-white">{testimonial.name}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</div>
                <div className="mt-1 inline-flex items-center gap-2 text-sm text-primary-600">
                  <ClinicIcon className="h-4 w-4" />
                  {testimonial.clinic}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  return (
    <section className="bg-gradient-to-b from-primary-50 to-white dark:from-primary-950/20 dark:to-slate-950 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Pricing</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Flexible Plans Designed for Growth at Every Stage
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Start free, scale with confidence, and unlock advanced automation, analytics, and tenant-level controls as you grow.
          </p>
        </div>

        <div className="mt-10 inline-flex rounded-full border border-border bg-white p-1 shadow-sm dark:bg-slate-950">
          <span className="rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white">Monthly billing</span>
          <span className="px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400">Yearly billing</span>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-2xl border p-7 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.24)] ${
                plan.highlight
                  ? 'border-primary-500 bg-primary-950 text-white'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${plan.highlight ? 'text-primary-300' : 'text-primary-600'}`}>
                    {plan.name}
                  </p>
                  <p className={`mt-4 text-5xl font-bold ${plan.highlight ? 'text-white' : 'text-slate-950 dark:text-white'}`}>
                    {plan.monthly}
                  </p>
                  <p className={`mt-1 text-sm ${plan.highlight ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                    or {plan.yearly}/mo yearly
                  </p>
                </div>
                <div
                  className={`inline-flex rounded-2xl p-3 ${
                    plan.highlight ? 'bg-white/10 text-primary-300' : 'bg-primary-500/10 text-primary-600'
                  }`}
                >
                  <SparkIcon className="h-6 w-6" />
                </div>
              </div>

              <p className={`mt-5 leading-7 ${plan.highlight ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>
                {plan.description}
              </p>

              <ul className="mt-6 space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className={`flex items-center gap-3 ${plan.highlight ? 'text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}>
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-500/15 text-primary-500">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.name === 'Free' || plan.name === 'Pro' ? '/register' : '/contact'}
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                  plan.highlight
                    ? 'bg-primary-500 text-white hover:bg-primary-400'
                    : 'border border-border bg-transparent text-slate-950 hover:bg-slate-100 dark:text-white dark:hover:bg-white/10'
                }`}
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingTable() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Plan comparison</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Everything you need to pick the right launch plan.</p>
            </div>
            <ShieldIcon className="h-6 w-6 text-primary-500" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-left text-sm">
              <thead className="bg-primary-50 dark:bg-primary-950/30">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-950 dark:text-white">Feature</th>
                  <th className="px-6 py-4 font-semibold text-slate-950 dark:text-white">Free</th>
                  <th className="px-6 py-4 font-semibold text-slate-950 dark:text-white">Basic</th>
                  <th className="px-6 py-4 font-semibold text-slate-950 dark:text-white">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparisons.map((row) => (
                  <tr key={row.feature}>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{row.feature}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{row.free}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{row.basic}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20 text-white sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(52,211,153,0.15),_transparent_40%)]" />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-400/20 bg-primary-400/10 px-4 py-2 text-sm text-primary-100">
          <SparkIcon className="h-4 w-4" />
          Launch-ready clinic platform
        </div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to Transform Your Clinic Operations Today?
        </h2>
        <p className="mt-4 text-lg leading-8 text-primary-100/90">
          Start your free trial today or book a demo to see how Clinicall helps health centers scale operations and deliver a premium patient journey.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-400 to-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:from-primary-300 hover:to-primary-400"
          >
            <SparkIcon className="h-4 w-4" />
            Start Free Trial
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 backdrop-blur-sm"
          >
            <CalendarIcon className="h-4 w-4" />
            Book Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
