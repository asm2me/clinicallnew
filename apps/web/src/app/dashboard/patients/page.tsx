import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import {
  CrudFormActions,
  CrudFormGrid,
  CrudFormModal,
  crudInputClassName,
  crudPopupTriggerClassName,
  crudSelectClassName,
  crudTextAreaClassName,
} from '@/components/dashboard/crud-form-template';
import { DashboardShell } from '@/components/dashboard/shell';
import { authOptions } from '@/lib/auth';
import { getPatientsData } from '@/lib/queries/patients';

import {
  createPatientAction,
  deletePatientAction,
  updatePatientAction,
} from './actions';

type PatientsPageProps = {
  searchParams?: {
    message?: string;
    error?: string;
  };
};

function getBadgeClass(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === 'ACTIVE') {
    return 'odoo-badge bg-emerald-100 text-emerald-700';
  }

  if (normalized === 'INACTIVE') {
    return 'odoo-badge bg-slate-200 text-slate-700';
  }

  if (normalized.includes('FOLLOW') || normalized.includes('REVIEW')) {
    return 'odoo-badge bg-amber-100 text-amber-700';
  }

  return 'odoo-badge';
}

function Banner({
  tone,
  children,
}: {
  tone: 'success' | 'error';
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm ${
        tone === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-rose-200 bg-rose-50 text-rose-700'
      }`}
    >
      {children}
    </div>
  );
}

function FormField({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  type = 'text',
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-600">
      <span className="font-medium text-slate-700">{label}</span>
      <input
        className={crudInputClassName()}
        defaultValue={defaultValue ?? ''}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  );
}

export default async function PatientsPage({ searchParams }: PatientsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const data = await getPatientsData(session.user.id);
  const canCreate = data.canMutate && data.clinicOptions.length > 0;

  return (
    <DashboardShell role={session.user.role as string}>
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-slate-900">Patients</h1>
          <p className="text-sm text-slate-500">
            Manage patient records, clinic assignments, and chart details.
          </p>
        </div>

        {searchParams?.message ? <Banner tone="success">{searchParams.message}</Banner> : null}
        {searchParams?.error ? <Banner tone="error">{searchParams.error}</Banner> : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="odoo-kpi">
            <p className="text-sm text-slate-500">Total patients</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{data.stats.totalPatients}</p>
          </div>
          <div className="odoo-kpi">
            <p className="text-sm text-slate-500">Active</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{data.stats.activePatients}</p>
          </div>
          <div className="odoo-kpi">
            <p className="text-sm text-slate-500">Inactive</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{data.stats.inactivePatients}</p>
          </div>
          <div className="odoo-kpi">
            <p className="text-sm text-slate-500">Seen this month</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{data.stats.seenThisMonth}</p>
          </div>
        </section>

        {data.canMutate ? (
          <section className="odoo-panel space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-slate-900">Create patient</h2>
                <p className="text-sm text-slate-500">
                  Add a new patient record and assign it to a clinic within your allowed scope.
                </p>
              </div>

              {canCreate ? (
                <CrudFormModal
                  title="Create patient"
                  description="Add a new patient record and assign it to a clinic within your allowed scope."
                  triggerLabel="Create patient"
                  triggerClassName={crudPopupTriggerClassName()}
                >
                  <form action={createPatientAction} className="space-y-4">
                    <CrudFormGrid className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <FormField label="Patient name" name="name" placeholder="John Doe" required />
                      <FormField label="MRN" name="mrn" placeholder="MRN-1001" required />

                      <label className="flex flex-col gap-2 text-sm text-slate-600">
                        <span className="font-medium text-slate-700">Clinic</span>
                        <select className={crudSelectClassName()} name="clinicId" required>
                          <option value="">Select clinic</option>
                          {data.clinicOptions.map((clinic) => (
                            <option key={clinic.id} value={clinic.id}>
                              {clinic.name} {clinic.city ? `(${clinic.city})` : ''}
                            </option>
                          ))}
                        </select>
                      </label>

                      <FormField label="Status" name="status" placeholder="ACTIVE" required />
                      <FormField label="Email" name="email" placeholder="patient@example.com" type="email" />
                      <FormField label="Phone" name="phone" placeholder="+1 555 0100" />
                      <FormField label="Team" name="team" placeholder="Care team" />
                      <FormField label="Gender" name="gender" placeholder="FEMALE" />
                      <FormField label="Emergency contact" name="emergencyContact" placeholder="Contact name" />
                      <FormField label="Emergency phone" name="emergencyPhone" placeholder="+1 555 0111" />
                      <FormField label="Last visit" name="lastVisit" type="date" />

                      <label className="flex flex-col gap-2 text-sm text-slate-600 md:col-span-2 xl:col-span-4">
                        <span className="font-medium text-slate-700">Notes</span>
                        <textarea
                          className={crudTextAreaClassName()}
                          name="notes"
                          placeholder="Clinical notes or care context"
                        />
                      </label>
                    </CrudFormGrid>

                    <CrudFormActions>
                      <button
                        className="inline-flex items-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                        type="submit"
                      >
                        Create patient
                      </button>
                    </CrudFormActions>
                  </form>
                </CrudFormModal>
              ) : null}
            </div>

            {!canCreate ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                You need at least one accessible clinic before creating patients.
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="odoo-panel">
          <div className="mb-4 flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-slate-900">Patient registry</h2>
            <p className="text-sm text-slate-500">Review patient records, details, and clinic ownership.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="px-4 py-3 font-medium">Patient</th>
                  <th className="px-4 py-3 font-medium">MRN</th>
                  <th className="px-4 py-3 font-medium">Clinic</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Last visit</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {data.patients.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-sm text-slate-500" colSpan={7}>
                      No patients found for your current scope.
                    </td>
                  </tr>
                ) : (
                  data.patients.map((patient) => (
                    <tr key={patient.id} className="align-top">
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-900">{patient.name}</div>
                        <div className="mt-1 text-xs text-slate-500">{patient.team || 'No team assigned'}</div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{patient.mrn}</td>
                      <td className="px-4 py-4 text-slate-600">{patient.clinicName}</td>
                      <td className="px-4 py-4">
                        <span className={getBadgeClass(patient.status)}>{patient.status}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-slate-700">{patient.email || '—'}</div>
                        <div className="mt-1 text-xs text-slate-500">{patient.phone || 'No phone'}</div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{patient.lastVisitLabel}</td>
                      <td className="px-4 py-4">
                        {data.canMutate ? (
                          <div className="flex min-w-[20rem] flex-col gap-3">
                            <CrudFormModal
                              title={`Edit ${patient.name}`}
                              description="Update patient demographics, clinic assignment, status, and chart notes."
                              triggerLabel="Edit patient"
                              triggerClassName={crudPopupTriggerClassName('secondary')}
                            >
                              <form action={updatePatientAction} className="space-y-4">
                                <input name="id" type="hidden" value={patient.id} />

                                <CrudFormGrid className="grid gap-3 md:grid-cols-2">
                                  <FormField label="Patient name" name="name" defaultValue={patient.name} required />
                                  <FormField label="MRN" name="mrn" defaultValue={patient.mrn} required />

                                  <label className="flex flex-col gap-2 text-sm text-slate-600">
                                    <span className="font-medium text-slate-700">Clinic</span>
                                    <select
                                      className={crudSelectClassName()}
                                      defaultValue={patient.clinicId}
                                      name="clinicId"
                                      required
                                    >
                                      <option value="">Select clinic</option>
                                      {data.clinicOptions.map((clinic) => (
                                        <option key={clinic.id} value={clinic.id}>
                                          {clinic.name} {clinic.city ? `(${clinic.city})` : ''}
                                        </option>
                                      ))}
                                    </select>
                                  </label>

                                  <FormField label="Status" name="status" defaultValue={patient.status} required />
                                  <FormField
                                    label="Email"
                                    name="email"
                                    defaultValue={patient.email}
                                    type="email"
                                  />
                                  <FormField label="Phone" name="phone" defaultValue={patient.phone} />
                                  <FormField label="Team" name="team" defaultValue={patient.team} />
                                  <FormField label="Gender" name="gender" defaultValue={patient.gender} />
                                  <FormField
                                    label="Emergency contact"
                                    name="emergencyContact"
                                    defaultValue={patient.emergencyContact}
                                  />
                                  <FormField
                                    label="Emergency phone"
                                    name="emergencyPhone"
                                    defaultValue={patient.emergencyPhone}
                                  />
                                  <FormField
                                    label="Last visit"
                                    name="lastVisit"
                                    defaultValue={patient.lastVisitValue}
                                    type="date"
                                  />

                                  <label className="flex flex-col gap-2 text-sm text-slate-600 md:col-span-2">
                                    <span className="font-medium text-slate-700">Notes</span>
                                    <textarea
                                      className={crudTextAreaClassName()}
                                      defaultValue={patient.notes ?? ''}
                                      name="notes"
                                    />
                                  </label>
                                </CrudFormGrid>

                                <CrudFormActions>
                                  <button
                                    className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                                    type="submit"
                                  >
                                    Save changes
                                  </button>
                                </CrudFormActions>
                              </form>
                            </CrudFormModal>

                            <form action={deletePatientAction}>
                              <input name="id" type="hidden" value={patient.id} />
                              <button
                                className="inline-flex items-center justify-center rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                                type="submit"
                              >
                                Delete patient
                              </button>
                            </form>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">Read only</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
