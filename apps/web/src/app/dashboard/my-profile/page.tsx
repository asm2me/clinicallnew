import { redirect } from 'next/navigation';

import {
  crudInputClassName,
} from '@/components/dashboard/crud-form-template';
import { DashboardShell } from '@/components/dashboard/shell';
import { getSettingsData } from '@/lib/queries/settings';

import { updateProfileAction } from '../settings/actions';

type MyProfilePageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function getParamValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function buttonClassName() {
  return 'btn-primary rounded-xl px-4 py-2.5';
}

function statusTooltip(action: string, subject: string) {
  return `${action} ${subject}. Success or error status will appear at the top of My profile.`;
}

export default async function MyProfilePage({ searchParams }: MyProfilePageProps) {
  const data = await getSettingsData();

  if (!data?.profile?.id) {
    redirect('/login');
  }
  const message = getParamValue(searchParams?.message);
  const error = getParamValue(searchParams?.error);

  return (
    <DashboardShell
      title="My profile"
      description="Update your personal details and review your assigned workspace access."
      role={data.profile.role}
    >
      <div className="space-y-6">
        {message ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        <section className="odoo-panel space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">My profile</h2>
              <p className="text-sm text-slate-500">
                Update your contact details and display title.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="odoo-badge">{data.profile.role}</span>
              {data.profile.tenantName ? <span className="odoo-badge">{data.profile.tenantName}</span> : null}
              {data.profile.clinicName ? <span className="odoo-badge">{data.profile.clinicName}</span> : null}
            </div>
          </div>

          <form action={updateProfileAction} className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Name</span>
              <input
                className={crudInputClassName()}
                defaultValue={data.profile.name}
                name="name"
                required
                type="text"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                className={`${crudInputClassName()} bg-slate-50 text-slate-500`}
                defaultValue={data.profile.email}
                disabled
                type="email"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Phone</span>
              <input
                className={crudInputClassName()}
                defaultValue={data.profile.phone}
                name="phone"
                placeholder="Optional"
                type="tel"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Title</span>
              <input
                className={crudInputClassName()}
                defaultValue={data.profile.title}
                name="title"
                placeholder="Optional"
                type="text"
              />
            </label>

            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-sm text-slate-600">
                Changes update your account record immediately across the dashboard.
              </div>

              <button
                className={buttonClassName()}
                title={statusTooltip('Save', 'your profile')}
                type="submit"
              >
                Save profile
              </button>
            </div>
          </form>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="odoo-kpi">
            <p className="text-sm text-slate-500">Role</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{data.profile.role}</p>
            <p className="mt-2 text-sm text-slate-500">Your permissions follow this assigned role.</p>
          </div>

          <div className="odoo-kpi">
            <p className="text-sm text-slate-500">Notifications</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{data.preferences.notifications}</p>
            <p className="mt-2 text-sm text-slate-500">Preferences remain aligned with your operational scope.</p>
          </div>

          <div className="odoo-kpi">
            <p className="text-sm text-slate-500">Clinic settings</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{data.preferences.booking}</p>
            <p className="mt-2 text-sm text-slate-500">{data.preferences.timezone}</p>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
