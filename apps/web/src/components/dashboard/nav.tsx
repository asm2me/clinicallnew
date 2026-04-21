'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = {
  label: string;
  href: string;
  roles?: string[];
};

const navItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Appointments', href: '/dashboard/appointments' },
  { label: 'Patients', href: '/dashboard/patients' },
  { label: 'Clinics', href: '/dashboard/clinics' },
  { label: 'Users', href: '/dashboard/users', roles: ['SUPER_ADMIN', 'TENANT_ADMIN'] },
  { label: 'Analytics', href: '/dashboard/analytics' },
  {
    label: 'Tenants',
    href: '/dashboard/settings#tenant-management',
    roles: ['SUPER_ADMIN'],
  },
  { label: 'Settings', href: '/dashboard/settings' },
];

export interface DashboardNavProps {
  role: string;
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

  const visibleItems = navItems.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <nav aria-label="Dashboard navigation" className="space-y-3">
      <div className="flex flex-wrap gap-2">
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
                "group min-w-[11rem] flex-1 rounded-2xl border px-4 py-3 transition md:flex-none",
                isActive
                  ? "border-primary/40 bg-primary/10 text-foreground shadow-sm"
                  : "border-border/70 bg-card/70 text-muted-foreground hover:border-foreground/15 hover:bg-accent",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={[
                        "flex h-7 w-7 items-center justify-center rounded-full border",
                        isActive
                          ? "border-primary/30 bg-background text-primary"
                          : "border-border bg-background text-muted-foreground group-hover:text-foreground",
                      ].join(" ")}
                    >
                      <span className="text-[11px] font-semibold">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </span>
                    <span
                      className={[
                        "truncate text-sm font-medium",
                        isActive ? "text-foreground" : "text-foreground/90 group-hover:text-foreground",
                      ].join(" ")}
                    >
                      {item.label}
                    </span>
                  </div>
                  <p
                    className={[
                      "mt-2 truncate pl-9 text-xs uppercase tracking-[0.18em]",
                      isActive ? "text-primary/80" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {normalizedHash
                      ? normalizedHash.replace("#", "")
                      : itemPath
                          .replace("/dashboard", "root")
                          .replace(/\//g, " / ")}
                  </p>
                </div>
                <span
                  className={[
                    "mt-1 h-2.5 w-2.5 rounded-full",
                    isActive ? "bg-primary" : "bg-border group-hover:bg-foreground/20",
                  ].join(" ")}
                />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Dock shows only routes available to the active role.
      </div>
    </nav>
  );
}

export { navItems as dashboardNavItems };
