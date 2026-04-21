import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import {
  CrudFormActions,
  CrudFormGrid,
  CrudFormModal,
  crudInputClassName,
  crudPopupTriggerClassName,
  crudSelectClassName,
} from '@/components/dashboard/crud-form-template';
import { DashboardShell } from '@/components/dashboard/shell';
import { authOptions } from '@/lib/auth';
import { getClinicsData } from '@/lib/queries/clinics';
import { statusBadge } from '@/lib/status-badge';

import { createClinicAction, deleteClinicAction, updateClinicAction } from './actions';

export const metadata: Metadata = {
  title: 'Clinics',
  description: 'Clinic and tenant management dashboard view.',
};

type ClinicsPageProps = {
  searchParams?: {
    message?: string | string[];
    error?: string | string[];
  };
};

const clinicStatuses = ['OPERATIONAL', 'LAUNCHING', 'UNDER_REVIEW', 'INACTIVE'] as const;

function getParamValue(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
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

export default async function ClinicsPage({ searchParams }: ClinicsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const data = await getClinicsData(session.user.id);
  const message = getParamValue(searchParams?.message);
  const error = getParamValue(searchParams?.error);
  const canManageClinics = data.canManageClinics;
  const isSuperAdmin = session.user.role === 'SUPER_ADMIN';

  return (
    <DashboardShell
      title="Clinics"
      description="Oversee branches, locations, and operational readiness across the tenant."
      role={session.user.role as string}
    >
      {message ? (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        {data.summary.map((item) => (
          <article key={item.label} className="odoo-panel p-5">
            <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
            <p className="mt-3 text-3xl font-bold text-foreground">{item.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{item.note}</p>
          </article>
        ))}
      </div>

      {canManageClinics ? (
        <section className="odoo-panel mt-6 space-y-4 p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Create clinic</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Add a new location and configure the operational details used throughout the dashboard.
              </p>
            </div>

            <CrudFormModal
              title="Create clinic"
              description="Add a new location and configure the operational details used throughout the dashboard."
              triggerLabel="Create clinic"
              triggerClassName={crudPopupTriggerClassName()}
            >
              <form action={createClinicAction} className="space-y-4">
                <CrudFormGrid className="grid gap-4 lg:grid-cols-2">
                  {isSuperAdmin ? (
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="font-medium text-foreground">Tenant</span>
                      <select
                        name="tenantId"
                        required
                        defaultValue=""
                        className={crudSelectClassName()}
                      >
                        <option value="" disabled>
                          Select tenant
                        </option>
                        {data.tenantOptions.map((tenant) => (
                          <option key={tenant.id} value={tenant.id}>
                            {tenant.name} ({tenant.slug})
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : data.scopedTenantId ? (
                    <input type="hidden" name="tenantId" value={data.scopedTenantId} />
                  ) : null}

                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-foreground">Clinic name</span>
                    <input
                      name="name"
                      required
                      placeholder="Downtown Care Center"
                      className={crudInputClassName()}
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-foreground">Slug</span>
                    <input
                      name="slug"
                      required
                      placeholder="downtown-care-center"
                      className={crudInputClassName()}
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-foreground">City</span>
                    <input
                      name="city"
                      required
                      placeholder="Riyadh"
                      className={crudInputClassName()}
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-foreground">Manager</span>
                    <input
                      name="manager"
                      required
                      placeholder="Amina Hassan"
                      className={crudInputClassName()}
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-foreground">Rooms</span>
                    <input
                      name="rooms"
                      type="number"
                      min="0"
                      required
                      defaultValue="0"
                      className={crudInputClassName()}
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-foreground">Status</span>
                    <select
                      name="status"
                      required
                      defaultValue="OPERATIONAL"
                      className={crudSelectClassName()}
                    >
                      {clinicStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-foreground">Phone</span>
                    <input
                      name="phone"
                      placeholder="+966..."
                      className={crudInputClassName()}
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-foreground">Email</span>
                    <input
                      name="email"
                      type="email"
                      placeholder="clinic@example.com"
                      className={crudInputClassName()}
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm lg:col-span-2">
                    <span className="font-medium text-foreground">Address line 1</span>
                    <input
                      name="addressLine1"
                      placeholder="Street and building"
                      className={crudInputClassName()}
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm lg:col-span-2">
                    <span className="font-medium text-foreground">Address line 2</span>
                    <input
                      name="addressLine2"
                      placeholder="Additional directions"
                      className={crudInputClassName()}
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-foreground">Timezone</span>
                    <input
                      name="timezone"
                      defaultValue="UTC"
                      placeholder="Asia/Riyadh"
                      className={crudInputClassName()}
                    />
                  </label>

                  <label className="mt-7 flex items-center gap-3 text-sm text-foreground">
                    <input
                      type="checkbox"
                      name="isBookingEnabled"
                      defaultChecked
                      className="h-4 w-4 rounded border-border"
                    />
                    Booking enabled
                  </label>
                </CrudFormGrid>

                <CrudFormActions>
                  <button type="submit" className={buttonClassName()}>
                    Create clinic
                  </button>
                </CrudFormActions>
              </form>
            </CrudFormModal>
          </div>
        </section>
      ) : null}

      <section className="odoo-panel mt-6 overflow-hidden">
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-semibold text-foreground">Clinic locations</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Branches and operating statuses for the selected role.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-left text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Clinic</th>
                <th className="px-6 py-4 font-semibold">City</th>
                <th className="px-6 py-4 font-semibold">Manager</th>
                <th className="px-6 py-4 font-semibold">Rooms</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border bg-card">
              {data.clinics.map((item) => (
                <tr key={item.id} className="align-top transition-colors hover:bg-muted/40">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{item.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {item.tenantName} · {item.slug}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-muted-foreground">{item.city}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.manager}</td>

                  <td className="px-6 py-4 text-muted-foreground">
                    <div>{item.rooms}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {item.patientCount} patients · {item.userCount} users
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <span className={statusBadge(item.status)}>{item.status}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.isBookingEnabled ? 'Booking enabled' : 'Booking disabled'}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {canManageClinics ? (
                      <div className="flex min-w-[320px] flex-col gap-3">
                        <CrudFormModal
                          title={`Edit ${item.name}`}
                          description="Update clinic location details, operating status, contact information, and tenant scope."
                          triggerLabel="Edit clinic"
                          triggerClassName={crudPopupTriggerClassName('secondary')}
                        >
                          <form action={updateClinicAction} className="space-y-4">
                            <input type="hidden" name="id" value={item.id} />

                            <CrudFormGrid className="grid gap-3 lg:grid-cols-2">
                              {isSuperAdmin ? (
                                <label className="flex flex-col gap-1 text-xs">
                                  <span className="font-medium uppercase tracking-wide text-muted-foreground">
                                    Tenant
                                  </span>
                                  <select
                                    name="tenantId"
                                    defaultValue={item.tenantId}
                                    required
                                    className={crudSelectClassName()}
                                  >
                                    {data.tenantOptions.map((tenant) => (
                                      <option key={tenant.id} value={tenant.id}>
                                        {tenant.name} ({tenant.slug})
                                      </option>
                                    ))}
                                  </select>
                                </label>
                              ) : (
                                <input type="hidden" name="tenantId" value={item.tenantId} />
                              )}

                              <label className="flex flex-col gap-1 text-xs">
                                <span className="font-medium uppercase tracking-wide text-muted-foreground">
                                  Clinic name
                                </span>
                                <input
                                  name="name"
                                  required
                                  defaultValue={item.name}
                                  className={crudInputClassName()}
                                />
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                <span className="font-medium uppercase tracking-wide text-muted-foreground">
                                  Slug
                                </span>
                                <input
                                  name="slug"
                                  required
                                  defaultValue={item.slug}
                                  className={crudInputClassName()}
                                />
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                <span className="font-medium uppercase tracking-wide text-muted-foreground">
                                  City
                                </span>
                                <input
                                  name="city"
                                  required
                                  defaultValue={item.city}
                                  className={crudInputClassName()}
                                />
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                <span className="font-medium uppercase tracking-wide text-muted-foreground">
                                  Manager
                                </span>
                                <input
                                  name="manager"
                                  required
                                  defaultValue={item.manager}
                                  className={crudInputClassName()}
                                />
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                <span className="font-medium uppercase tracking-wide text-muted-foreground">
                                  Rooms
                                </span>
                                <input
                                  name="rooms"
                                  type="number"
                                  min="0"
                                  required
                                  defaultValue={item.roomsValue}
                                  className={crudInputClassName()}
                                />
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                <span className="font-medium uppercase tracking-wide text-muted-foreground">
                                  Status
                                </span>
                                <select
                                  name="status"
                                  required
                                  defaultValue={item.status}
                                  className={crudSelectClassName()}
                                >
                                  {clinicStatuses.map((status) => (
                                    <option key={status} value={status}>
                                      {status}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                <span className="font-medium uppercase tracking-wide text-muted-foreground">
                                  Phone
                                </span>
                                <input
                                  name="phone"
                                  defaultValue={item.phone}
                                  className={crudInputClassName()}
                                />
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                <span className="font-medium uppercase tracking-wide text-muted-foreground">
                                  Email
                                </span>
                                <input
                                  name="email"
                                  type="email"
                                  defaultValue={item.email}
                                  className={crudInputClassName()}
                                />
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                <span className="font-medium uppercase tracking-wide text-muted-foreground">
                                  Address line 1
                                </span>
                                <input
                                  name="addressLine1"
                                  defaultValue={item.addressLine1}
                                  className={crudInputClassName()}
                                />
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                <span className="font-medium uppercase tracking-wide text-muted-foreground">
                                  Address line 2
                                </span>
                                <input
                                  name="addressLine2"
                                  defaultValue={item.addressLine2}
                                  className={crudInputClassName()}
                                />
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                <span className="font-medium uppercase tracking-wide text-muted-foreground">
                                  Timezone
                                </span>
                                <input
                                  name="timezone"
                                  defaultValue={item.timezone}
                                  className={crudInputClassName()}
                                />
                              </label>

                              <label className="flex items-center gap-2 text-sm text-foreground lg:col-span-2">
                                <input
                                  type="checkbox"
                                  name="isBookingEnabled"
                                  defaultChecked={item.isBookingEnabled}
                                  className="h-4 w-4 rounded border-border"
                                />
                                Booking enabled
                              </label>
                            </CrudFormGrid>

                            <CrudFormActions>
                              <button type="submit" className={buttonClassName('secondary')}>
                                Save changes
                              </button>
                            </CrudFormActions>
                          </form>
                        </CrudFormModal>

                        <form action={deleteClinicAction}>
                          <input type="hidden" name="id" value={item.id} />
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                          >
                            Delete clinic
                          </button>
                        </form>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">View only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardShell>
  );
}
