'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { AppRole } from "@/lib/auth";
import { canAccessDashboardSection, type DashboardSection } from "@/lib/permissions";

type NavItem = {
  label: string;
  href: string;
  section: DashboardSection;
};

const navItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard', section: 'overview' },
  { label: 'Appointments', href: '/dashboard/appointments', section: 'appointments' },
  { label: 'Patients', href: '/dashboard/patients', section: 'patients' },
  { label: 'Clinics', href: '/dashboard/clinics', section: 'clinics' },
  { label: 'Users', href: '/dashboard/users', section: 'users' },
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    section: 'analytics',
  },
  {
    label: 'Tenants',
    href: '/dashboard/settings#tenant-management',
    section: 'tenants',
  },
  { label: 'Settings', href: '/dashboard/settings', section: 'settings' },
];

export interface DashboardNavProps {
  role: AppRole;
}

function navMeta(item: NavItem) {
  switch (item.label) {
    case 'Overview':
      return 'Daily brief';
    case 'Appointments':
      return 'Schedule flow';
    case 'Patients':
      return 'Care records';
    case 'Clinics':
      return 'Locations';
    case 'Users':
      return 'Access control';
    case 'Analytics':
      return 'Performance';
    case 'Tenants':
      return 'Workspace admin';
    case 'Settings':
      return 'Preferences';
    default:
      return 'Workspace';
  }
}

export function DashboardNav({ role }: DashboardNavProps) {
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    const syncHash = () => setCurrentHash(window.location.hash);

    syncHash();
    window.addEventListener('hashchange', syncHash);

    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  const visibleItems = navItems.filter((item) => canAccessDashboardSection(role, item.section));

  return (
    <nav aria-label="Dashboard navigation" className="space-y-4">
      <div>
        <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Workspace navigation
        </p>

        <div className="mt-3 space-y-2">
          {visibleItems.map((item, index) => {
            const [itemPath, itemHash] = item.href.split('#');
            const normalizedHash = itemHash ? `#${itemHash}` : '';
            const isActive = normalizedHash
              ? pathname === itemPath && currentHash === normalizedHash
              : item.href === '/dashboard'
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "group flex items-center gap-3 rounded-2xl border px-3 py-3 transition",
                  isActive
                    ? "border-primary/30 bg-primary/10 text-foreground shadow-sm"
                    : "border-transparent text-muted-foreground hover:border-border/70 hover:bg-background/80 hover:text-foreground",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border text-xs font-semibold transition",
                    isActive
                      ? "border-primary/30 bg-background text-primary"
                      : "border-border/70 bg-card text-muted-foreground group-hover:text-foreground",
                  ].join(" ")}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className={[
                      "block truncate text-sm font-medium",
                      isActive ? "text-foreground" : "text-foreground/90 group-hover:text-foreground",
                    ].join(" ")}
                  >
                    {item.label}
                  </span>
                  <span
                    className={[
                      "mt-1 block truncate text-xs uppercase tracking-[0.18em]",
                      isActive ? "text-primary/80" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {navMeta(item)}
                  </span>
                </span>

                <span
                  className={[
                    "h-2.5 w-2.5 shrink-0 rounded-full transition",
                    isActive ? "bg-primary" : "bg-border group-hover:bg-foreground/20",
                  ].join(" ")}
                />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-background/75 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Navigation note
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The workspace list only reveals destinations available to the active role.
        </p>
      </div>
    </nav>
  );
}

export { navItems as dashboardNavItems };
