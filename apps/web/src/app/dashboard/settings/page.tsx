import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import {
  CrudFormActions,
  CrudFormGrid,
  CrudFormModal,
  crudInputClassName,
  crudPopupTriggerClassName,
  crudSelectClassName,
} from '../../../components/dashboard/crud-form-template';
import { DashboardShell } from '../../../components/dashboard/shell';
import { authOptions } from '../../../lib/auth';
import { getSettingsData } from '../../../lib/queries/settings';
import {
  createTenantAction,
  createUserAction,
  deleteTenantAction,
  deleteUserAction,
  updateProfileAction,
  updateTenantAction,
  updateUserAction,
} from './actions';

const ALL_ROLES = ['SUPER_ADMIN', 'TENANT_ADMIN', 'DOCTOR', 'STAFF', 'PATIENT'] as const;
const TENANT_ADMIN_ROLES = ['TENANT_ADMIN', 'DOCTOR', 'STAFF', 'PATIENT'] as const;
const TENANT_STATUSES = ['ACTIVE', 'TRIALING', 'SUSPENDED', 'ARCHIVED'] as const;

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

function statusTooltip(action: string, subject: string) {
  return `${action} ${subject}. Success or error status will appear at the top of Settings.`;
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

        {data.profile.role === 'SUPER_ADMIN' || data.profile.role === 'TENANT_ADMIN' ? (
          <section className="space-y-6">
            {data.profile.role === 'SUPER_ADMIN' ? (
              <div className="odoo-panel space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Create tenant</h2>
                  <p className="text-sm text-slate-500">
                    Create a new tenant workspace for a clinic organization.
                  </p>
                </div>

                <div className="flex justify-start">
                  <CrudFormModal
                    title="Create tenant"
                    description="Create a new tenant workspace for a clinic organization."
                    triggerLabel="Create tenant"
                    triggerClassName={crudPopupTriggerClassName()}
                  >
                    <form action={createTenantAction} className="space-y-4">
                      <CrudFormGrid>
                        <label className="space-y-2">
                          <span className="text-sm font-medium text-slate-700">Tenant name</span>
                          <input className={crudInputClassName()} name="name" required type="text" />
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm font-medium text-slate-700">Slug</span>
                          <input className={crudInputClassName()} name="slug" required type="text" />
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm font-medium text-slate-700">Status</span>
                          <select
                            className={crudSelectClassName()}
                            defaultValue="TRIALING"
                            name="status"
                            required
                          >
                            {TENANT_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm font-medium text-slate-700">Website name</span>
                          <input className={crudInputClassName()} name="websiteName" type="text" />
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm font-medium text-slate-700">Support email</span>
                          <input className={crudInputClassName()} name="supportEmail" type="email" />
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm font-medium text-slate-700">Support phone</span>
                          <input className={crudInputClassName()} name="supportPhone" type="tel" />
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm font-medium text-slate-700">Timezone</span>
                          <input
                            className={crudInputClassName()}
                            defaultValue="UTC"
                            name="timezone"
                            required
                            type="text"
                          />
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm font-medium text-slate-700">Locale</span>
                          <input
                            className={crudInputClassName()}
                            defaultValue="en"
                            name="locale"
                            required
                            type="text"
                          />
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm font-medium text-slate-700">Subscription plan</span>
                          <input className={crudInputClassName()} name="subscriptionPlan" type="text" />
                        </label>

                        <label className="space-y-2 md:col-span-2 xl:col-span-3">
                          <span className="text-sm font-medium text-slate-700">Subscription status</span>
                          <input className={crudInputClassName()} name="subscriptionStatus" type="text" />
                        </label>
                      </CrudFormGrid>

                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-slate-900">Initial tenant admin (optional)</h3>
                          <p className="text-sm text-slate-500">
                            Create the first tenant administrator together with the tenant workspace.
                          </p>
                        </div>

                        <CrudFormGrid>
                          <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">Admin name</span>
                            <input className={crudInputClassName()} name="tenantAdminName" type="text" />
                          </label>

                          <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">Admin email</span>
                            <input className={crudInputClassName()} name="tenantAdminEmail" type="email" />
                          </label>

                          <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">Admin password</span>
                            <input
                              className={crudInputClassName()}
                              minLength={6}
                              name="tenantAdminPassword"
                              type="password"
                            />
                          </label>
                        </CrudFormGrid>
                      </div>

                      <CrudFormActions>
                        <button
                          className={buttonClassName()}
                          title={statusTooltip('Create', 'a tenant')}
                          type="submit"
                        >
                          Create tenant
                        </button>
                      </CrudFormActions>
                    </form>
                  </CrudFormModal>
                </div>
              </div>
            ) : null}

            <section id="tenant-management" className="odoo-panel space-y-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Tenant management</h2>
                  <p className="text-sm text-slate-500">
                    {data.profile.role === 'SUPER_ADMIN'
                      ? 'Review tenant workspaces, usage, and subscription metadata.'
                      : 'Review and update your tenant workspace settings.'}
                  </p>
                </div>

                <span className="text-sm text-slate-500">
                  {data.tenants.length} tenant{data.tenants.length === 1 ? '' : 's'} configured
                </span>
              </div>

              <div className="grid gap-4">
                {data.tenants.map((tenant) => (
                  <div key={tenant.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="font-medium text-slate-900">{tenant.name}</div>
                        <div className="text-sm text-slate-500">
                          {tenant.slug} · {tenant.status}
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-3 md:items-end">
                        <div className="flex flex-wrap gap-2 text-xs text-slate-500 md:justify-end">
                          <span className="odoo-badge">{tenant.clinicCount} clinics</span>
                          <span className="odoo-badge">{tenant.userCount} users</span>
                          <span className="odoo-badge">{tenant.patientCount} patients</span>
                          <span className="odoo-badge">{tenant.appointmentCount} appointments</span>
                        </div>

                        <CrudFormModal
                          title={`Edit ${tenant.name}`}
                          description="Update tenant workspace details, subscription metadata, and regional defaults."
                          triggerLabel="Edit tenant"
                          triggerClassName={crudPopupTriggerClassName('secondary')}
                        >
                          <form action={updateTenantAction} className="space-y-4">
                            <input name="tenantId" type="hidden" value={tenant.id} />

                            <CrudFormGrid>
                              <label className="space-y-2">
                                <span className="text-sm font-medium text-slate-700">Tenant name</span>
                                <input
                                  className={crudInputClassName()}
                                  defaultValue={tenant.name}
                                  name="name"
                                  required
                                  type="text"
                                />
                              </label>

                              <label className="space-y-2">
                                <span className="text-sm font-medium text-slate-700">Slug</span>
                                <input
                                  className={crudInputClassName()}
                                  defaultValue={tenant.slug}
                                  name="slug"
                                  required
                                  type="text"
                                />
                              </label>

                              <label className="space-y-2">
                                <span className="text-sm font-medium text-slate-700">Status</span>
                                <select
                                  className={crudSelectClassName()}
                                  defaultValue={tenant.status}
                                  name="status"
                                  required
                                >
                                  {TENANT_STATUSES.map((status) => (
                                    <option key={status} value={status}>
                                      {status}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <label className="space-y-2">
                                <span className="text-sm font-medium text-slate-700">Website name</span>
                                <input
                                  className={crudInputClassName()}
                                  defaultValue={tenant.websiteName ?? ''}
                                  name="websiteName"
                                  type="text"
                                />
                              </label>

                              <label className="space-y-2">
                                <span className="text-sm font-medium text-slate-700">Support email</span>
                                <input
                                  className={crudInputClassName()}
                                  defaultValue={tenant.supportEmail ?? ''}
                                  name="supportEmail"
                                  type="email"
                                />
                              </label>

                              <label className="space-y-2">
                                <span className="text-sm font-medium text-slate-700">Support phone</span>
                                <input
                                  className={crudInputClassName()}
                                  defaultValue={tenant.supportPhone ?? ''}
                                  name="supportPhone"
                                  type="tel"
                                />
                              </label>

                              <label className="space-y-2">
                                <span className="text-sm font-medium text-slate-700">Timezone</span>
                                <input
                                  className={crudInputClassName()}
                                  defaultValue={tenant.timezone}
                                  name="timezone"
                                  required
                                  type="text"
                                />
                              </label>

                              <label className="space-y-2">
                                <span className="text-sm font-medium text-slate-700">Locale</span>
                                <input
                                  className={crudInputClassName()}
                                  defaultValue={tenant.locale}
                                  name="locale"
                                  required
                                  type="text"
                                />
                              </label>

                              <label className="space-y-2">
                                <span className="text-sm font-medium text-slate-700">Subscription plan</span>
                                <input
                                  className={crudInputClassName()}
                                  defaultValue={tenant.subscriptionPlan ?? ''}
                                  name="subscriptionPlan"
                                  type="text"
                                />
                              </label>

                              <label className="space-y-2 md:col-span-2 xl:col-span-3">
                                <span className="text-sm font-medium text-slate-700">Subscription status</span>
                                <input
                                  className={crudInputClassName()}
                                  defaultValue={tenant.subscriptionStatus ?? ''}
                                  name="subscriptionStatus"
                                  type="text"
                                />
                              </label>
                            </CrudFormGrid>

                            <CrudFormActions>
                              <button
                                className={buttonClassName('secondary')}
                                title={statusTooltip('Save', 'tenant changes')}
                                type="submit"
                              >
                                Save tenant changes
                              </button>
                            </CrudFormActions>
                          </form>
                        </CrudFormModal>
                      </div>
                    </div>

                    {data.profile.role === 'SUPER_ADMIN' ? (
                      <details className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 md:max-w-md">
                        <summary className="cursor-pointer list-none text-sm font-medium text-red-700">
                          Delete tenant
                        </summary>

                        <form action={deleteTenantAction} className="mt-4 grid gap-3">
                          <input name="tenantId" type="hidden" value={tenant.id} />

                          <div className="rounded-md border border-red-200 bg-white px-3 py-2 text-xs text-red-700">
                            This permanently deletes the tenant and its scoped records. Type{' '}
                            <span className="font-semibold">{tenant.slug}</span> to confirm.
                          </div>

                          <label className="space-y-1">
                            <span className="text-xs font-medium uppercase tracking-wide text-red-700">
                              Confirmation
                            </span>
                            <input
                              className={crudInputClassName()}
                              name="confirmationText"
                              placeholder={tenant.slug}
                              required
                              type="text"
                            />
                          </label>

                          <div className="flex justify-end">
                            <button
                              className={buttonClassName('danger')}
                              title={statusTooltip('Delete', 'this tenant permanently')}
                              type="submit"
                            >
                              Delete tenant permanently
                            </button>
                          </div>
                        </form>
                      </details>
                    ) : null}
                  </div>
                ))}

                {data.tenants.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
                    No tenants have been created yet.
                  </div>
                ) : null}
              </div>
            </section>
          </section>
        ) : null}

        {data.canManageUsers ? (
          <section className="space-y-6">
            <div className="odoo-panel space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Create user</h2>
                <p className="text-sm text-slate-500">
                  Add a new dashboard user within your permitted scope.
                </p>
              </div>

              <div className="flex justify-start">
                <CrudFormModal
                  title="Create user"
                  description="Add a new dashboard user within your permitted scope."
                  triggerLabel="Create user"
                  triggerClassName={crudPopupTriggerClassName()}
                >
                  <form action={createUserAction} className="space-y-4">
                    <CrudFormGrid>
                      <label className="space-y-2">
                        <span className="text-sm font-medium text-slate-700">Name</span>
                        <input className={crudInputClassName()} name="name" required type="text" />
                      </label>

                      <label className="space-y-2">
                        <span className="text-sm font-medium text-slate-700">Email</span>
                        <input className={crudInputClassName()} name="email" required type="email" />
                      </label>

                      <label className="space-y-2">
                        <span className="text-sm font-medium text-slate-700">Password</span>
                        <input
                          className={crudInputClassName()}
                          minLength={6}
                          name="password"
                          required
                          type="password"
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="text-sm font-medium text-slate-700">Role</span>
                        <select
                          className={crudSelectClassName()}
                          defaultValue={roleOptions[0]}
                          name="role"
                          required
                        >
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
                          <select className={crudSelectClassName()} defaultValue="" name="tenantId">
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
                        <select className={crudSelectClassName()} defaultValue="" name="clinicId">
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
                        <input className={crudInputClassName()} name="phone" type="tel" />
                      </label>

                      <label className="space-y-2">
                        <span className="text-sm font-medium text-slate-700">Title</span>
                        <input className={crudInputClassName()} name="title" type="text" />
                      </label>
                    </CrudFormGrid>

                    <CrudFormActions>
                      <button
                        className={buttonClassName()}
                        title={statusTooltip('Create', 'a user')}
                        type="submit"
                      >
                        Create user
                      </button>
                    </CrudFormActions>
                  </form>
                </CrudFormModal>
              </div>
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
                              <CrudFormModal
                                title={`Edit ${user.name}`}
                                description="Update the user's account details, role, scope assignments, and optional password."
                                triggerLabel="Edit user"
                                triggerClassName={crudPopupTriggerClassName('secondary')}
                              >
                                <form action={updateUserAction} className="space-y-4">
                                  <input name="userId" type="hidden" value={user.id} />

                                  <CrudFormGrid className="grid gap-3 md:grid-cols-2">
                                    <label className="space-y-1">
                                      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Name
                                      </span>
                                      <input
                                        className={crudInputClassName()}
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
                                        className={crudInputClassName()}
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
                                        className={crudSelectClassName()}
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
                                          className={crudSelectClassName()}
                                          defaultValue={user.tenantId ?? ''}
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
                                        className={crudSelectClassName()}
                                        defaultValue={user.clinicId ?? ''}
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
                                        className={crudInputClassName()}
                                        defaultValue={user.phone ?? ''}
                                        name="phone"
                                        type="tel"
                                      />
                                    </label>

                                    <label className="space-y-1">
                                      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Title
                                      </span>
                                      <input
                                        className={crudInputClassName()}
                                        defaultValue={user.title ?? ''}
                                        name="title"
                                        type="text"
                                      />
                                    </label>

                                    <label className="space-y-1 md:col-span-2">
                                      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        New password
                                      </span>
                                      <input
                                        className={crudInputClassName()}
                                        minLength={6}
                                        name="password"
                                        placeholder="Leave blank to keep current password"
                                        type="password"
                                      />
                                    </label>
                                  </CrudFormGrid>

                                  <CrudFormActions>
                                    <button
                                      className={buttonClassName('secondary')}
                                      title={statusTooltip('Save', 'user changes')}
                                      type="submit"
                                    >
                                      Save changes
                                    </button>
                                  </CrudFormActions>
                                </form>
                              </CrudFormModal>

                              {user.role === 'SUPER_ADMIN' ? (
                                <div
                                  className="w-full rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800"
                                  title="Super admin users are protected and cannot be deleted."
                                >
                                  Super admin users are protected and cannot be deleted.
                                </div>
                              ) : (
                                <details className="w-full rounded-lg border border-red-200 bg-red-50 p-3">
                                  <summary className="cursor-pointer list-none text-sm font-medium text-red-700">
                                    Delete user
                                  </summary>

                                  <form action={deleteUserAction} className="mt-4 grid gap-3">
                                    <input name="userId" type="hidden" value={user.id} />

                                    <div className="rounded-md border border-red-200 bg-white px-3 py-2 text-xs text-red-700">
                                      This permanently deletes the user and cascades their related records. Type{' '}
                                      <span className="font-semibold">{user.email}</span> to confirm.
                                    </div>

                                    <label className="space-y-1">
                                      <span className="text-xs font-medium uppercase tracking-wide text-red-700">
                                        Confirmation
                                      </span>
                                      <input
                                        className={crudInputClassName()}
                                        name="confirmationText"
                                        placeholder={user.email}
                                        required
                                        type="text"
                                      />
                                    </label>

                                    <div className="flex justify-end">
                                      <button
                                        className={buttonClassName('danger')}
                                        title={statusTooltip('Delete', 'this user permanently')}
                                        type="submit"
                                      >
                                        Delete permanently
                                      </button>
                                    </div>
                                  </form>
                                </details>
                              )}
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
