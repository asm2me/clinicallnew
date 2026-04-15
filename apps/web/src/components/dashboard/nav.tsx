import Link from 'next/link';

type DashboardNavItem = {
  href: string;
  label: string;
};

const navItems: DashboardNavItem[] = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/appointments', label: 'Appointments' },
  { href: '/dashboard/patients', label: 'Patients' },
  { href: '/dashboard/clinics', label: 'Clinics' },
  { href: '/dashboard/analytics', label: 'Analytics' },
  { href: '/dashboard/settings', label: 'Settings' },
];

export function DashboardNav() {
  return (
    <nav aria-label="Dashboard navigation" className="space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export { navItems as dashboardNavItems };