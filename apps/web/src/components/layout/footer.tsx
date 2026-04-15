import Link from 'next/link';

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Login', href: '/login' },
  { label: 'Register', href: '/register' },
  { label: 'Forgot Password', href: '/forgot-password' }
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
              Clinicall
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
              Premium SaaS marketing for clinic software, subscriptions, and patient growth.
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm sm:grid-cols-4">
            {footerLinks.map((item) => (
              <Link key={item.href} href={item.href} className="text-muted-foreground transition hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-10 text-sm text-muted-foreground">© 2026 Clinicall. All rights reserved.</p>
      </div>
    </footer>
  );
}