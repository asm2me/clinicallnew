import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { DashboardShell } from '../../../components/dashboard/shell';
import { authOptions } from '../../../lib/auth';
import { getSettingsData } from '../../../lib/queries/settings';
import {
  createUserAction,
  deleteUserAction,
  updateProfileAction,
  updateUserAction,
} from './actions';

const ALL_ROLES = ['SUPER_ADMIN', 'TENANT_ADMIN', 'DOCTOR', 'STAFF', 'PATIENT'] as const;
const TENANT_ADMIN_ROLES = ['TENANT_ADMIN', 'DOCTOR', 'STAFF', 'PATIENT'] as const;

type SettingsPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function getParamValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function getRoleOptions(role: string) {
  return role === 'SUPER_ADMIN' ? ALL_ROLES : TENANT_ADMIN_ROLES;
}

function buttonClassName(variant: 'primary' | 'secondary' | 'danger' = 'primary') {
  if (variant === 'secondary') {
    return 'inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50';
  }

  if (variant === 'danger') {
    return 'inline-flex items-center justify-center rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100';
  }

  return 'inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700';
}

function inputClassName() {
  return 'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200';
}

function selectClassName() {
  return inputClassName();
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const data = await getSettingsData(session.user.id);
  const message = getParamValue(searchParams?.message);
  const error = getParamValue(searchParams?.error);
  const roleOptions = getRoleOptions(data.profile.role);

  return (
    <DashboardShell
      title="Settings"
      description="Manage your profile and administrative access."
      role={session.user.role as string}
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
                className={inputClassName()}
                defaultValue={data.profile.name}
                name="name"
                required
                type="text"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                className={`${inputClassName()} bg-slate-50 text-slate-500`}
                defaultValue={data.profile.email}
                disabled
                type="email"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Phone</span>
              <input
                className={inputClassName()}
                defaultValue={data.profile.phone}
                name="phone"
                placeholder="Optional"
                type="tel"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Title</span>
              <input
                className={inputClassName()}
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

              <button className={buttonClassName()} type="submit">
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

        {data.canManageUsers ? (
          <section className="space-y-6">
            <div className="odoo-panel space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Create user</h2>
                <p className="text-sm text-slate-500">
                  Add a new dashboard user within your permitted scope.
                </p>
              </div>

              <form action={createUserAction} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Name</span>
                  <input className={inputClassName()} name="name" required type="text" />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Email</span>
                  <input className={inputClassName()} name="email" required type="email" />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Password</span>
                  <input className={inputClassName()} minLength={6} name="password" required type="password" />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Role</span>
                  <select className={selectClassName()} defaultValue={roleOptions[0]} name="role" required>
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>

                {data.profile.role === 'SUPER_ADMIN' ? (
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Tenant</span>
                    <select className={selectClassName()} defaultValue="" name="tenantId">
                      <option value="">Select tenant</option>
                      {data.tenants.map((tenant) => (
                        <option key={tenant.id} value={tenant.id}>
                          {tenant.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Clinic</span>
                  <select className={selectClassName()} defaultValue="" name="clinicId">
                    <option value="">No clinic assignment</option>
                    {data.clinics.map((clinic) => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.name}
                        {clinic.tenantName ? ` — ${clinic.tenantName}` : ''}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Phone</span>
                  <input className={inputClassName()} name="phone" type="tel" />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Title</span>
                  <input className={inputClassName()} name="title" type="text" />
                </label>

                <div className="md:col-span-2 xl:col-span-3 flex justify-end">
                  <button className={buttonClassName()} type="submit">
                    Create user
                  </button>
                </div>
              </form>
            </div>

            <section className="odoo-panel space-y-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">User management</h2>
                  <p className="text-sm text-slate-500">
                    Review, update, and remove users you are allowed to manage.
                  </p>
                </div>

                <span className="text-sm text-slate-500">
                  {data.users.length} user{data.users.length === 1 ? '' : 's'} in scope
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-500">User</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-500">Role</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-500">Tenant</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-500">Clinic</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-500">Contact</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-500">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white">
                    {data.users.map((user) => {
                      const rowRoleOptions = getRoleOptions(data.profile.role);

                      return (
                        <tr key={user.id} className="align-top">
                          <td className="px-4 py-4">
                            <div className="font-medium text-slate-900">{user.name}</div>
                            <div className="text-slate-500">{user.email}</div>
                          </td>

                          <td className="px-4 py-4">
                            <span className="odoo-badge">{user.role}</span>
                          </td>

                          <td className="px-4 py-4 text-slate-600">{user.tenantName || '—'}</td>
                          <td className="px-4 py-4 text-slate-600">{user.clinicName || '—'}</td>

                          <td className="px-4 py-4 text-slate-600">
                            <div>{user.phone || '—'}</div>
                            <div className="text-slate-500">{user.title || '—'}</div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex flex-col items-start gap-3">
                              <details className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <summary className="cursor-pointer list-none text-sm font-medium text-slate-700">
                                  Edit user
                                </summary>

                                <form action={updateUserAction} className="mt-4 grid gap-3">
                                  <input name="userId" type="hidden" value={user.id} />

                                  <label className="space-y-1">
                                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                      Name
                                    </span>
                                    <input
                                      className={inputClassName()}
                                      defaultValue={user.name}
                                      name="name"
                                      required
                                      type="text"
                                    />
                                  </label>

                                  <label className="space-y-1">
                                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                      Email
                                    </span>
                                    <input
                                      className={inputClassName()}
                                      defaultValue={user.email}
                                      name="email"
                                      required
                                      type="email"
                                    />
                                  </label>

                                  <label className="space-y-1">
                                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                      Role
                                    </span>
                                    <select
                                      className={selectClassName()}
                                      defaultValue={user.role}
                                      name="role"
                                      required
                                    >
                                      {rowRoleOptions.map((role) => (
                                        <option key={role} value={role}>
                                          {role}
                                        </option>
                                      ))}
                                    </select>
                                  </label>

                                  {data.profile.role === 'SUPER_ADMIN' ? (
                                    <label className="space-y-1">
                                      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Tenant
                                      </span>
                                      <select
                                        className={selectClassName()}
                                        defaultValue={user.tenantId}
                                        name="tenantId"
                                      >
                                        <option value="">Select tenant</option>
                                        {data.tenants.map((tenant) => (
                                          <option key={tenant.id} value={tenant.id}>
                                            {tenant.name}
                                          </option>
                                        ))}
                                      </select>
                                    </label>
                                  ) : null}

                                  <label className="space-y-1">
                                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                      Clinic
                                    </span>
                                    <select
                                      className={selectClassName()}
                                      defaultValue={user.clinicId}
                                      name="clinicId"
                                    >
                                      <option value="">No clinic assignment</option>
                                      {data.clinics.map((clinic) => (
                                        <option key={clinic.id} value={clinic.id}>
                                          {clinic.name}
                                          {clinic.tenantName ? ` — ${clinic.tenantName}` : ''}
                                        </option>
                                      ))}
                                    </select>
                                  </label>

                                  <label className="space-y-1">
                                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                      Phone
                                    </span>
                                    <input
                                      className={inputClassName()}
                                      defaultValue={user.phone}
                                      name="phone"
                                      type="tel"
                                    />
                                  </label>

                                  <label className="space-y-1">
                                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                      Title
                                    </span>
                                    <input
                                      className={inputClassName()}
                                      defaultValue={user.title}
                                      name="title"
                                      type="text"
                                    />
                                  </label>

                                  <label className="space-y-1">
                                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                      New password
                                    </span>
                                    <input
                                      className={inputClassName()}
                                      minLength={6}
                                      name="password"
                                      placeholder="Leave blank to keep current password"
                                      type="password"
                                    />
                                  </label>

                                  <div className="flex justify-end">
                                    <button className={buttonClassName('secondary')} type="submit">
                                      Save changes
                                    </button>
                                  </div>
                                </form>
                              </details>

                              <form action={deleteUserAction}>
                                <input name="userId" type="hidden" value={user.id} />
                                <button className={buttonClassName('danger')} type="submit">
                                  Delete
                                </button>
                              </form>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {data.users.length === 0 ? (
                      <tr>
                        <td className="px-4 py-6 text-center text-slate-500" colSpan={6}>
                          No users are available in your scope.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>
          </section>
        ) : null}
      </div>
    </DashboardShell>
  );
}
