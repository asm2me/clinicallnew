import Link from 'next/link';

const productLinks = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
];

const companyLinks = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/login', label: 'Log in' },
  { href: '/register', label: 'Register' },
];

function ArrowIcon() {
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

export function Footer() {
  return (
    <footer className="px-4 pb-8 pt-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-border bg-card/70 shadow-[0_32px_100px_-64px_rgba(0,0,0,0.6)]">
        <div className="grid gap-10 px-6 py-10 sm:px-8 lg:grid-cols-[1.4fr_0.8fr_0.9fr] lg:px-10 lg:py-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-border bg-background/80 px-4 py-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                CL
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Clinicall
                </p>
                <p className="text-sm text-foreground">Care operations, designed with intention.</p>
              </div>
            </div>

            <div className="max-w-xl space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Move from scattered admin to a calm operating rhythm.
              </h2>
              <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                Clinicall brings scheduling, communication, documentation, and team visibility into a
                single system so every clinic day feels measurable, coordinated, and human.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
              >
                Start free
                <ArrowIcon />
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition hover:bg-accent"
              >
                Talk to our team
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Product
            </p>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 text-sm text-foreground transition hover:text-primary"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Company
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/80 px-6 py-4 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>Built for independent practices, care groups, and high-trust clinical teams.</p>
            <p>© 2025 Clinicall. Editorial clarity for operational care.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}