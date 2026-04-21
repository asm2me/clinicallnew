import { redirect } from 'next/navigation';

import {
  CrudFormActions,
  CrudFormGrid,
  CrudFormModal,
  crudInputClassName,
  crudPopupTriggerClassName,
  crudSelectClassName,
} from '../../../components/dashboard/crud-form-template';
import { DashboardShell } from '../../../components/dashboard/shell';
import { getSettingsData } from '../../../lib/queries/settings';
import {
  createTenantAction,
  deleteTenantAction,
  updateTenantAction,
} from './actions';

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

function buttonClassName(variant: 'primary' | 'secondary' | 'danger' = 'primary') {
  if (variant === 'secondary') {
    return 'inline-flex items-center justify-center rounded-xl border border-border/70 bg-card/90 px-3 py-2 text-sm font-medium text-foreground transition hover:bg-accent hover:text-foreground';
  }

  if (variant === 'danger') {
    return 'inline-flex items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-100 transition hover:bg-red-500/15';
  }

  return 'inline-flex items-center justify-center rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-95';
}

function statusTooltip(action: string, subject: string) {
  return `${action} ${subject}. Success or error status will appear at the top of Settings.`;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const data = await getSettingsData();

  if (!data?.profile?.id) {
    redirect('/login');
  }
  const message = getParamValue(searchParams?.message);
  const error = getParamValue(searchParams?.error);

  return (
    <DashboardShell
      title="Settings"
      description="Manage tenant workspace configuration and administrative access."
      role={data.profile.role}
    >
      <div className="space-y-6">
        {message ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="odoo-kpi">
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{data.profile.role}</p>
            <p className="mt-2 text-sm text-muted-foreground">Your permissions follow this assigned role.</p>
          </div>

          <div className="odoo-kpi">
            <p className="text-sm text-muted-foreground">Notifications</p>
            <p className="mt-2 text-base font-semibold text-foreground">{data.preferences.notifications}</p>
            <p className="mt-2 text-sm text-muted-foreground">Preferences remain aligned with your operational scope.</p>
          </div>

          <div className="odoo-kpi">
            <p className="text-sm text-muted-foreground">Clinic settings</p>
            <p className="mt-2 text-base font-semibold text-foreground">{data.preferences.booking}</p>
            <p className="mt-2 text-sm text-muted-foreground">{data.preferences.timezone}</p>
          </div>
        </section>

        {data.profile.role === 'SUPER_ADMIN' || data.profile.role === 'TENANT_ADMIN' ? (
          <section className="space-y-6">
            {data.profile.role === 'SUPER_ADMIN' ? (
              <div className="odoo-panel space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Create tenant</h2>
                  <p className="text-sm text-muted-foreground">
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
                          <span className="text-sm font-medium text-foreground/90">Tenant name</span>
                          <input className={crudInputClassName()} name="name" required type="text" />
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm font-medium text-foreground/90">Slug</span>
                          <input className={crudInputClassName()} name="slug" required type="text" />
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm font-medium text-foreground/90">Status</span>
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
                          <span className="text-sm font-medium text-foreground/90">Website name</span>
                          <input className={crudInputClassName()} name="websiteName" type="text" />
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm font-medium text-foreground/90">Support email</span>
                          <input className={crudInputClassName()} name="supportEmail" type="email" />
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm font-medium text-foreground/90">Support phone</span>
                          <input className={crudInputClassName()} name="supportPhone" type="tel" />
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm font-medium text-foreground/90">Timezone</span>
                          <input
                            className={crudInputClassName()}
                            defaultValue="UTC"
                            name="timezone"
                            required
                            type="text"
                          />
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm font-medium text-foreground/90">Locale</span>
                          <input
                            className={crudInputClassName()}
                            defaultValue="en"
                            name="locale"
                            required
                            type="text"
                          />
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm font-medium text-foreground/90">Subscription plan</span>
                          <input className={crudInputClassName()} name="subscriptionPlan" type="text" />
                        </label>

                        <label className="space-y-2 md:col-span-2 xl:col-span-3">
                          <span className="text-sm font-medium text-foreground/90">Subscription status</span>
                          <input className={crudInputClassName()} name="subscriptionStatus" type="text" />
                        </label>
                      </CrudFormGrid>

                      <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-foreground">Initial tenant admin (optional)</h3>
                          <p className="text-sm text-muted-foreground">
                            Create the first tenant administrator together with the tenant workspace.
                          </p>
                        </div>

                        <CrudFormGrid>
                          <label className="space-y-2">
                            <span className="text-sm font-medium text-foreground/90">Admin name</span>
                            <input className={crudInputClassName()} name="tenantAdminName" type="text" />
                          </label>

                          <label className="space-y-2">
                            <span className="text-sm font-medium text-foreground/90">Admin email</span>
                            <input className={crudInputClassName()} name="tenantAdminEmail" type="email" />
                          </label>

                          <label className="space-y-2">
                            <span className="text-sm font-medium text-foreground/90">Admin password</span>
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
                  <h2 className="text-lg font-semibold text-foreground">Tenant management</h2>
                  <p className="text-sm text-muted-foreground">
                    {data.profile.role === 'SUPER_ADMIN'
                      ? 'Review tenant workspaces, usage, and subscription metadata.'
                      : 'Review and update your tenant workspace settings.'}
                  </p>
                </div>

                <span className="text-sm text-muted-foreground">
                  {data.tenants.length} tenant{data.tenants.length === 1 ? '' : 's'} configured
                </span>
              </div>

              <div className="grid gap-4">
                {data.tenants.map((tenant) => (
                  <div key={tenant.id} className="rounded-[1.75rem] border border-border/70 bg-card/90 p-4 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="font-medium text-foreground">{tenant.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {tenant.slug} · {tenant.status}
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-3 md:items-end">
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground md:justify-end">
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
                                <span className="text-sm font-medium text-foreground/90">Tenant name</span>
                                <input
                                  className={crudInputClassName()}
                                  defaultValue={tenant.name}
                                  name="name"
                                  required
                                  type="text"
                                />
                              </label>

                              <label className="space-y-2">
                                <span className="text-sm font-medium text-foreground/90">Slug</span>
                                <input
                                  className={crudInputClassName()}
                                  defaultValue={tenant.slug}
                                  name="slug"
                                  required
                                  type="text"
                                />
                              </label>

                              <label className="space-y-2">
                                <span className="text-sm font-medium text-foreground/90">Status</span>
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
                                <span className="text-sm font-medium text-foreground/90">Website name</span>
                                <input
                                  className={crudInputClassName()}
                                  defaultValue={tenant.websiteName ?? ''}
                                  name="websiteName"
                                  type="text"
                                />
                              </label>

                              <label className="space-y-2">
                                <span className="text-sm font-medium text-foreground/90">Support email</span>
                                <input
                                  className={crudInputClassName()}
                                  defaultValue={tenant.supportEmail ?? ''}
                                  name="supportEmail"
                                  type="email"
                                />
                              </label>

                              <label className="space-y-2">
                                <span className="text-sm font-medium text-foreground/90">Support phone</span>
                                <input
                                  className={crudInputClassName()}
                                  defaultValue={tenant.supportPhone ?? ''}
                                  name="supportPhone"
                                  type="tel"
                                />
                              </label>

                              <label className="space-y-2">
                                <span className="text-sm font-medium text-foreground/90">Timezone</span>
                                <input
                                  className={crudInputClassName()}
                                  defaultValue={tenant.timezone}
                                  name="timezone"
                                  required
                                  type="text"
                                />
                              </label>

                              <label className="space-y-2">
                                <span className="text-sm font-medium text-foreground/90">Locale</span>
                                <input
                                  className={crudInputClassName()}
                                  defaultValue={tenant.locale}
                                  name="locale"
                                  required
                                  type="text"
                                />
                              </label>

                              <label className="space-y-2">
                                <span className="text-sm font-medium text-foreground/90">Subscription plan</span>
                                <input
                                  className={crudInputClassName()}
                                  defaultValue={tenant.subscriptionPlan ?? ''}
                                  name="subscriptionPlan"
                                  type="text"
                                />
                              </label>

                              <label className="space-y-2 md:col-span-2 xl:col-span-3">
                                <span className="text-sm font-medium text-foreground/90">Subscription status</span>
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
                      <details className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 md:max-w-md">
                        <summary className="cursor-pointer list-none text-sm font-medium text-red-100">
                          Delete tenant
                        </summary>

                        <form action={deleteTenantAction} className="mt-4 grid gap-3">
                          <input name="tenantId" type="hidden" value={tenant.id} />

                          <div className="rounded-xl border border-red-500/30 bg-black/20 px-3 py-2 text-xs text-red-100">
                            This permanently deletes the tenant and its scoped records. Type{' '}
                            <span className="font-semibold">{tenant.slug}</span> to confirm.
                          </div>

                          <label className="space-y-1">
                            <span className="text-xs font-medium uppercase tracking-wide text-red-100">
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
                  <div className="rounded-2xl border border-dashed border-border/70 bg-card/50 px-4 py-6 text-center text-sm text-muted-foreground">
                    No tenants have been created yet.
                  </div>
                ) : null}
              </div>
            </section>
          </section>
        ) : null}
      </div>
    </DashboardShell>
  );
}
