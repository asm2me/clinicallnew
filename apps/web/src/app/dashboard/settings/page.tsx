import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { DashboardShell } from '@/components/dashboard/shell';
import { DemoBanner } from '@/components/dashboard/demo-banner';
import { statusBadge } from '@/lib/status-badge';
import { getDemoSession, type DemoRole } from '@/lib/demo-auth';
import { getSettingsDemoData } from '@/lib/demo-data';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Demo dashboard settings view.'
};

export default function SettingsPage({
  searchParams
}: {
  searchParams?: {
    role?: string;
  };
}) {
  const session = getDemoSession(searchParams?.role);
  if (!session) {
    redirect('/login');
  }

  const role = session.role as DemoRole;
  const data = getSettingsDemoData(role);

  return (
    <DashboardShell
      title="Settings"
      description="Configure account preferences, notification settings, and role-specific controls."
      role={role}
    >
      <DemoBanner message="Demo auth enabled. Settings are editable-looking UI only and do not persist." />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="odoo-panel p-6">
          <h2 className="text-xl font-semibold text-foreground">Profile</h2>
          <div className="mt-6 space-y-4">
            {data.profile.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-background p-4">
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="odoo-panel p-6">
          <h2 className="text-xl font-semibold text-foreground">Preferences</h2>
          <div className="mt-6 space-y-4">
            {data.preferences.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background px-4 py-4 transition-colors hover:bg-muted/40">
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
                </div>
                <span className={statusBadge(item.value)}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}