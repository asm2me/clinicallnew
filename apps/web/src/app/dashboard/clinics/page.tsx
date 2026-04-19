import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { DashboardShell } from '@/components/dashboard/shell';
import { authOptions } from '@/lib/auth';
import { statusBadge } from '@/lib/status-badge';
import { getClinicsData } from '@/lib/queries/clinics';

import { createClinicAction, deleteClinicAction, updateClinicAction } from './actions';

export const metadata: Metadata = {
  title: 'Clinics',
  description: 'Clinic and tenant management dashboard view.'
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
        <section className="odoo-panel mt-6 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">Create clinic</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a new location and configure the operational details used throughout the dashboard.
            </p>
          </div>

          <form action={createClinicAction} className="grid gap-4 lg:grid-cols-2">
            {isSuperAdmin ? (
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-foreground">Tenant</span>
                <select
                  name="tenantId"
                  required
                  defaultValue=""
                  className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
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
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-foreground">Slug</span>
              <input
                name="slug"
                required
                placeholder="downtown-care-center"
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-foreground">City</span>
              <input
                name="city"
                required
                placeholder="Riyadh"
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-foreground">Manager</span>
              <input
                name="manager"
                required
                placeholder="Amina Hassan"
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
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
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-foreground">Status</span>
              <select
                name="status"
                required
                defaultValue="OPERATIONAL"
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
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
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-foreground">Email</span>
              <input
                name="email"
                type="email"
                placeholder="clinic@example.com"
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm lg:col-span-2">
              <span className="font-medium text-foreground">Address line 1</span>
              <input
                name="addressLine1"
                placeholder="Street and building"
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm lg:col-span-2">
              <span className="font-medium text-foreground">Address line 2</span>
              <input
                name="addressLine2"
                placeholder="Additional directions"
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-foreground">Timezone</span>
              <input
                name="timezone"
                defaultValue="UTC"
                placeholder="Asia/Riyadh"
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
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

            <div className="lg:col-span-2">
              <button type="submit" className="btn-primary">
                Create clinic
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="odoo-panel mt-6 overflow-hidden">
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-semibold text-foreground">Clinic locations</h2>
          <p className="mt-1 text-sm text-muted-foreground">Branches and operating statuses for the selected role.</p>
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
                        <details className="rounded-lg border border-border bg-background/60">
                          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-foreground">
                            Edit clinic
                          </summary>
                          <div className="border-t border-border p-4">
                            <form action={updateClinicAction} className="grid gap-3">
                              <input type="hidden" name="id" value={item.id} />

                              {isSuperAdmin ? (
                                <label className="flex flex-col gap-1 text-xs">
                                  <span className="font-medium uppercase tracking-wide text-muted-foreground">Tenant</span>
                                  <select
                                    name="tenantId"
                                    defaultValue={item.tenantId}
                                    required
                                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
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
                                <span className="font-medium uppercase tracking-wide text-muted-foreground">Clinic name</span>
                                <input
                                  name="name"
                                  required
                                  defaultValue={item.name}
                                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                />
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                <span className="font-medium uppercase tracking-wide text-muted-foreground">Slug</span>
                                <input
                                  name="slug"
                                  required
                                  defaultValue={item.slug}
                                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                />
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                <span className="font-medium uppercase tracking-wide text-muted-foreground">City</span>
                                <input
                                  name="city"
                                  required
                                  defaultValue={item.city}
                                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                />
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                <span className="font-medium uppercase tracking-wide text-muted-foreground">Manager</span>
                                <input
                                  name="manager"
                                  required
                                  defaultValue={item.manager}
                                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                />
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                <span className="font-medium uppercase tracking-wide text-muted-foreground">Rooms</span>
                                <input
                                  name="rooms"
                                  type="number"
                                  min="0"
                                  required
                                  defaultValue={item.roomsValue}
                                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                />
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                <span className="font-medium uppercase tracking-wide text-muted-foreground">Status</span>
                                <select
                                  name="status"
                                  required
                                  defaultValue={item.status}
                                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                >
                                  {clinicStatuses.map((status) => (
                                    <option key={status} value={status}>
                                      {status}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                <span className="font-medium uppercase tracking-wide text-muted-foreground">Phone</span>
                                <input
                                  name="phone"
                                  defaultValue={item.phone}
                                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                />
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                <span className="font-medium uppercase tracking-wide text-muted-foreground">Email</span>
                                <input
                                  name="email"
                                  type="email"
                                  defaultValue={item.email}
                                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                />
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                <span className="font-medium uppercase tracking-wide text-muted-foreground">Address line 1</span>
                                <input
                                  name="addressLine1"
                                  defaultValue={item.addressLine1}
                                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                />
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                <span className="font-medium uppercase tracking-wide text-muted-foreground">Address line 2</span>
                                <input
                                  name="addressLine2"
                                  defaultValue={item.addressLine2}
                                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                />
                              </label>

                              <label className="flex flex-col gap-1 text-xs">
                                <span className="font-medium uppercase tracking-wide text-muted-foreground">Timezone</span>
                                <input
                                  name="timezone"
                                  defaultValue={item.timezone}
                                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                />
                              </label>

                              <label className="flex items-center gap-2 text-sm text-foreground">
                                <input
                                  type="checkbox"
                                  name="isBookingEnabled"
                                  defaultChecked={item.isBookingEnabled}
                                  className="h-4 w-4 rounded border-border"
                                />
                                Booking enabled
                              </label>

                              <div className="flex flex-wrap gap-2">
                                <button type="submit" className="btn-primary px-4 py-2">
                                  Save changes
                                </button>
                              </div>
                            </form>
                          </div>
                        </details>

                        <form action={deleteClinicAction}>
                          <input type="hidden" name="id" value={item.id} />
                          <button type="submit" className="odoo-button-secondary text-red-600 hover:bg-red-50 hover:text-red-700">
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