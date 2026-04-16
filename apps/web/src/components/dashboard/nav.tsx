'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = { href: string; label: string; icon: string };

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: '▤' },
  { href: '/dashboard/appointments', label: 'Appointments', icon: '📅' },
  { href: '/dashboard/patients', label: 'Patients', icon: '👤' },
  { href: '/dashboard/clinics', label: 'Clinics', icon: '🏥' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: '📊' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
];

type DashboardNavProps = { role: string };

export function DashboardNav({ role }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard navigation" className="space-y-0.5">
      {navItems.map((item) => {
        // Exact match for root /dashboard, prefix match for sub-routes
        const isActive =
          item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={[
              'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            ].join(' ')}
          >
            <span
              className={[
                'flex h-6 w-6 items-center justify-center rounded-md text-xs transition-colors',
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'bg-transparent text-muted-foreground group-hover:text-foreground',
              ].join(' ')}
              aria-hidden="true"
            >
              {item.icon}
            </span>
            {item.label}
            {isActive && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export { navItems as dashboardNavItems };