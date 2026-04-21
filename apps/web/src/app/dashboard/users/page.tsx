import { redirect } from 'next/navigation';

import {
  CrudFormActions,
  CrudFormGrid,
  CrudFormModal,
  crudInputClassName,
  crudPopupTriggerClassName,
  crudSelectClassName,
} from '@/components/dashboard/crud-form-template';
import { DashboardShell } from '@/components/dashboard/shell';
import { getUsersPageData } from '@/lib/queries/users';

import {
  createUserAction,
  deleteUserAction,
  updateUserAction,
} from '../settings/actions';
import { startUserImpersonationAction } from './impersonation-actions';

type UsersPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function getParamValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function buttonClassName(variant: 'primary' | 'secondary' | 'danger' | 'warning' = 'primary') {
  if (variant === 'secondary') {
    return 'inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50';
  }

  if (variant === 'danger') {
    return 'inline-flex items-center justify-center rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100';
  }

  if (variant === 'warning') {
    return 'inline-flex items-center justify-center rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 transition hover:bg-amber-100';
  }

  return 'inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700';
}

function statusTooltip(action: string, subject: string) {
  return `${action} ${subject}. Success or error status will appear at the top of Users.`;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const data = await getUsersPageData();

  if (!data) {
    redirect('/login');
  }

  const message = getParamValue(searchParams?.message);
  const error = getParamValue(searchParams?.error);

  return (
    <DashboardShell
      title="Users"
      description="Create, update, impersonate, and manage users within your allowed scope."
      role={data.actor.role}
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

        {data.actor.role === 'TENANT_ADMIN' && !data.actor.tenantId ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Your account is missing a tenant assignment. Contact a super admin before managing users.
          </div>
        ) : (
          <>
            <section className="odoo-panel space-y-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Create user</h2>
                  <p className="text-sm text-slate-500">
                    Add a new dashboard user within your permitted scope.
                  </p>
                </div>

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
                          defaultValue={data.roleOptions[0]}
                          name="role"
                          required
                        >
                          {data.roleOptions.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </label>

                      {data.actor.role === 'SUPER_ADMIN' ? (
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
                              {clinic.tenant?.name ? ` — ${clinic.tenant.name}` : ''}
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
            </section>

            <section className="odoo-panel space-y-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">User management</h2>
                  <p className="text-sm text-slate-500">
                    Review, update, remove, or impersonate users you are allowed to manage.
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
                      const rowRoleOptions = data.roleOptions;
                      const isProtectedSuperAdmin = user.role === 'SUPER_ADMIN';

                      return (
                        <tr key={user.id} className="align-top">
                          <td className="px-4 py-4">
                            <div className="font-medium text-slate-900">{user.name}</div>
                            <div className="text-slate-500">{user.email}</div>
                          </td>

                          <td className="px-4 py-4">
                            <span className="odoo-badge">{user.role}</span>
                          </td>

                          <td className="px-4 py-4 text-slate-600">{user.tenant?.name || '—'}</td>
                          <td className="px-4 py-4 text-slate-600">{user.clinic?.name || '—'}</td>

                          <td className="px-4 py-4 text-slate-600">
                            <div>{user.phone || '—'}</div>
                            <div className="text-slate-500">{user.title || '—'}</div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex flex-col items-start gap-3">
                              {data.actor.role === 'SUPER_ADMIN' && !isProtectedSuperAdmin ? (
                                <form action={startUserImpersonationAction}>
                                  <input name="userId" type="hidden" value={user.id} />
                                  <button
                                    className={buttonClassName('warning')}
                                    title="Impersonate this user and switch the dashboard into their scoped view."
                                    type="submit"
                                  >
                                    Impersonate user
                                  </button>
                                </form>
                              ) : null}

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

                                    {data.actor.role === 'SUPER_ADMIN' ? (
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
                                            {clinic.tenant?.name ? ` — ${clinic.tenant.name}` : ''}
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

                              {isProtectedSuperAdmin ? (
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
          </>
        )}
      </div>
    </DashboardShell>
  );
}
