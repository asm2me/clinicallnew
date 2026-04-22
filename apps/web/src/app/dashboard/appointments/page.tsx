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
import { authOptions, type AppRole } from '@/lib/auth';
import { canAccessDashboardSection } from '@/lib/permissions';
import { getAppointmentsData } from '@/lib/queries/appointments';

import {
  createAppointmentAction,
  deleteAppointmentAction,
  updateAppointmentAction,
} from './actions';

type SearchParams = {
  message?: string | string[];
  error?: string | string[];
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function toDateTimeLocalValue(value: Date | string | null) {
  if (!value) {
    return '';
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function formatDateTime(value: Date | string | null) {
  if (!value) {
    return '—';
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="odoo-kpi">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function TextInput({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  type = 'text',
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'datetime-local';
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={crudInputClassName()}
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={3}
        className={crudTextAreaClassName()}
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  defaultValue,
  required,
  renderOptionLabel,
}: {
  label: string;
  name: string;
  options: Array<{ id: string }>;
  defaultValue?: string;
  required?: boolean;
  renderOptionLabel: (option: any) => string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        required={required}
        className={crudSelectClassName()}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option: any) => (
          <option key={option.id} value={option.id}>
            {renderOptionLabel(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

function buttonClassName(variant: 'primary' | 'secondary' | 'danger' = 'primary') {
  if (variant === 'secondary') {
    return 'odoo-button-secondary';
  }

  if (variant === 'danger') {
    return 'inline-flex items-center justify-center rounded-xl border border-rose-400/35 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,241,242,0.95))] px-3 py-2.5 text-sm font-medium text-rose-700 shadow-[0_5px_0_rgba(251,113,133,0.38),0_14px_24px_-18px_rgba(136,19,55,0.3)] transition hover:-translate-y-0.5 hover:bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(255,228,230,0.96))] hover:shadow-[0_7px_0_rgba(251,113,133,0.42),0_18px_28px_-18px_rgba(136,19,55,0.34)] active:translate-y-[3px] active:shadow-[0_2px_0_rgba(251,113,133,0.38)]';
  }

  return 'btn-primary rounded-xl px-4 py-2.5';
}

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const role = session.user.role as AppRole;

  if (!canAccessDashboardSection(role, 'appointments')) {
    redirect('/dashboard?error=You%20do%20not%20have%20permission%20to%20view%20appointments.');
  }

  const data = await getAppointmentsData(session.user.id);
  const message = getSingleValue(searchParams?.message);
  const error = getSingleValue(searchParams?.error);

  return (
    <DashboardShell
      title="Appointments"
      description="Manage the schedule, assign patients and doctors, and keep clinic calendars up to date."
      role={role}
    >
      <div className="space-y-6">
        {message ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total appointments" value={data.summary.total} />
          <MetricCard label="Today" value={data.summary.today} />
          <MetricCard label="Upcoming" value={data.summary.upcoming} />
          <MetricCard label="Completed" value={data.summary.completed} />
        </section>

        {data.canManage ? (
          <section className="odoo-panel space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Create appointment</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Use the allowed clinic, patient, and doctor options in your current scope.
                </p>
              </div>

              <CrudFormModal
                title="Create appointment"
                description="Schedule a new appointment using the clinic, patient, and doctor options available in your current scope."
                triggerLabel="Create appointment"
                triggerClassName={crudPopupTriggerClassName()}
              >
                <form action={createAppointmentAction} className="space-y-4">
                  <CrudFormGrid className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    <SelectField
                      label="Clinic"
                      name="clinicId"
                      options={data.clinicOptions}
                      required
                      renderOptionLabel={(clinic: { id: string; name: string }) => clinic.name}
                    />
                    <SelectField
                      label="Patient"
                      name="patientId"
                      options={data.patientOptions}
                      required
                      renderOptionLabel={(patient: { name: string; mrn: string | null }) =>
                        patient.mrn ? `${patient.name} (${patient.mrn})` : patient.name
                      }
                    />
                    <SelectField
                      label="Doctor"
                      name="doctorId"
                      options={data.doctorOptions}
                      required
                      renderOptionLabel={(doctor: { name: string; email: string | null }) =>
                        doctor.email ? `${doctor.name} (${doctor.email})` : doctor.name
                      }
                    />
                    <TextInput label="Starts at" name="startsAt" type="datetime-local" required />
                    <TextInput label="Ends at" name="endsAt" type="datetime-local" />
                    <TextInput label="Status" name="status" placeholder="SCHEDULED" required />
                    <TextInput label="Source" name="source" placeholder="Phone, portal, walk-in" />
                    <TextInput label="Reason" name="reason" placeholder="Follow-up, consultation" />
                    <div className="lg:col-span-2 xl:col-span-3">
                      <TextArea label="Notes" name="notes" placeholder="Add any scheduling notes" />
                    </div>
                  </CrudFormGrid>

                  <CrudFormActions>
                    <button type="submit" className={buttonClassName()}>
                      Create appointment
                    </button>
                  </CrudFormActions>
                </form>
              </CrudFormModal>
            </div>
          </section>
        ) : null}

        <section className="odoo-panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Schedule</h2>
              <p className="mt-1 text-sm text-slate-500">
                Review upcoming appointments and update their details.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-5 py-3 font-medium">Date & time</th>
                  <th className="px-5 py-3 font-medium">Clinic</th>
                  <th className="px-5 py-3 font-medium">Patient</th>
                  <th className="px-5 py-3 font-medium">Doctor</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Reason</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {data.appointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-sm text-slate-500">
                      No appointments found in your current scope.
                    </td>
                  </tr>
                ) : null}

                {data.appointments.map((appointment) => (
                  <tr key={appointment.id} className="align-top">
                    <td className="px-5 py-4 text-slate-700">
                      <div className="font-medium text-slate-900">
                        {formatDateTime(appointment.startsAt)}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        Ends {formatDateTime(appointment.endsAt)}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-700">{appointment.clinicName}</td>

                    <td className="px-5 py-4 text-slate-700">
                      <div className="font-medium text-slate-900">{appointment.patientName}</div>
                      <div className="mt-1 text-xs text-slate-500">{appointment.patientMrn ?? '—'}</div>
                    </td>

                    <td className="px-5 py-4 text-slate-700">{appointment.doctorName}</td>

                    <td className="px-5 py-4">
                      <span className="odoo-badge">{appointment.status}</span>
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {appointment.reason || <span className="text-slate-400">—</span>}
                    </td>

                    <td className="px-5 py-4">
                      {data.canManage ? (
                        <div className="space-y-3">
                          <CrudFormModal
                            title={`Edit appointment for ${appointment.patientName}`}
                            description="Update appointment timing, assignments, status, and scheduling notes."
                            triggerLabel="Edit appointment"
                            triggerClassName={crudPopupTriggerClassName('secondary')}
                          >
                            <form action={updateAppointmentAction} className="space-y-4">
                              <input type="hidden" name="id" value={appointment.id} />

                              <CrudFormGrid className="grid gap-3 lg:grid-cols-2">
                                <SelectField
                                  label="Clinic"
                                  name="clinicId"
                                  options={data.clinicOptions}
                                  defaultValue={appointment.clinicId}
                                  required
                                  renderOptionLabel={(clinic: { id: string; name: string }) => clinic.name}
                                />
                                <SelectField
                                  label="Patient"
                                  name="patientId"
                                  options={data.patientOptions}
                                  defaultValue={appointment.patientId}
                                  required
                                  renderOptionLabel={(patient: { name: string; mrn: string | null }) =>
                                    patient.mrn ? `${patient.name} (${patient.mrn})` : patient.name
                                  }
                                />
                                <SelectField
                                  label="Doctor"
                                  name="doctorId"
                                  options={data.doctorOptions}
                                  defaultValue={appointment.doctorId}
                                  required
                                  renderOptionLabel={(doctor: { name: string; email: string | null }) =>
                                    doctor.email ? `${doctor.name} (${doctor.email})` : doctor.name
                                  }
                                />
                                <TextInput
                                  label="Starts at"
                                  name="startsAt"
                                  type="datetime-local"
                                  defaultValue={toDateTimeLocalValue(appointment.startsAt)}
                                  required
                                />
                                <TextInput
                                  label="Ends at"
                                  name="endsAt"
                                  type="datetime-local"
                                  defaultValue={toDateTimeLocalValue(appointment.endsAt)}
                                />
                                <TextInput
                                  label="Status"
                                  name="status"
                                  defaultValue={appointment.status}
                                  required
                                />
                                <TextInput label="Source" name="source" defaultValue={appointment.source} />
                                <TextInput label="Reason" name="reason" defaultValue={appointment.reason} />
                                <div className="lg:col-span-2">
                                  <TextArea label="Notes" name="notes" defaultValue={appointment.notes} />
                                </div>
                              </CrudFormGrid>

                              <CrudFormActions>
                                <button type="submit" className={buttonClassName('secondary')}>
                                  Save changes
                                </button>
                              </CrudFormActions>
                            </form>
                          </CrudFormModal>

                          <form action={deleteAppointmentAction}>
                            <input type="hidden" name="id" value={appointment.id} />
                            <button
                              type="submit"
                              className={buttonClassName('danger')}
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
