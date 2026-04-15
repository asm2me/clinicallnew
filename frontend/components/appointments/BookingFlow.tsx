'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { appointmentsApi, doctorsApi } from '@/lib/api';
import { format } from 'date-fns';
import { Calendar, Clock, User, CheckCircle, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/useToast';

type Step = 'doctor' | 'date' | 'slot' | 'details' | 'confirm';

interface BookingData {
  doctor_id?: number;
  doctor_name?: string;
  date?: string;
  time?: string;
  type?: 'online' | 'offline';
  service_id?: number;
  notes?: string;
}

export function BookingFlow({ onSuccess }: { onSuccess?: () => void }) {
  const [step, setStep]     = useState<Step>('doctor');
  const [data, setData]     = useState<BookingData>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: doctors = [] } = useQuery({
    queryKey: ['public-doctors'],
    queryFn: () => doctorsApi.list().then((r) => r.data.data),
  });

  const { data: slots = [] } = useQuery({
    queryKey: ['slots', data.doctor_id, data.date],
    queryFn:  () => appointmentsApi.slots(data.doctor_id!, data.date!).then((r) => r.data.slots),
    enabled:  !!data.doctor_id && !!data.date,
  });

  const lockSlot = useMutation({
    mutationFn: (params: { doctor_id: number; date: string; time: string }) =>
      appointmentsApi.lockSlot(params),
  });

  const bookAppointment = useMutation({
    mutationFn: () => appointmentsApi.create(data as Record<string, unknown>),
    onSuccess: (res) => {
      toast({ title: `Appointment booked! Code: ${res.data.appointment.confirmation_code}`, variant: 'success' });
      onSuccess?.();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Booking failed.';
      toast({ title: msg, variant: 'error' });
    },
  });

  const steps: { id: Step; label: string; icon: typeof Calendar }[] = [
    { id: 'doctor',  label: 'Doctor',   icon: User },
    { id: 'date',    label: 'Date',     icon: Calendar },
    { id: 'slot',    label: 'Time',     icon: Clock },
    { id: 'details', label: 'Details',  icon: ChevronRight },
    { id: 'confirm', label: 'Confirm',  icon: CheckCircle },
  ];

  const stepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border p-6 max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              i <= stepIndex ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
            }`}>
              {i < stepIndex ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`hidden sm:block text-xs ${i <= stepIndex ? 'text-primary font-medium' : 'text-gray-400'}`}>
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div className={`h-px w-6 md:w-12 ${i < stepIndex ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step: Choose Doctor */}
      {step === 'doctor' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Select a Doctor</h2>
          <div className="grid gap-3">
            {doctors.map((doc: { id: number; name: string; specialization: Record<string, string>; consultation_fee: number; avatar?: string }) => (
              <button
                key={doc.id}
                onClick={() => { setData((d) => ({ ...d, doctor_id: doc.id, doctor_name: doc.name })); setStep('date'); }}
                className="flex items-center gap-4 p-4 border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {doc.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{doc.name}</p>
                  <p className="text-sm text-gray-500">{doc.specialization?.en ?? doc.specialization}</p>
                </div>
                <span className="text-sm font-medium text-primary">${doc.consultation_fee}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Choose Date */}
      {step === 'date' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Choose a Date</h2>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 14 }, (_, i) => {
              const d   = new Date();
              d.setDate(d.getDate() + i);
              const str = format(d, 'yyyy-MM-dd');
              return (
                <button
                  key={str}
                  onClick={() => { setData((prev) => ({ ...prev, date: str })); setStep('slot'); }}
                  className={`p-2 rounded-lg text-center text-sm transition-colors ${
                    data.date === str
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 dark:bg-gray-800 hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  <span className="block text-xs text-inherit opacity-70">{format(d, 'EEE')}</span>
                  <span className="block font-semibold">{format(d, 'd')}</span>
                </button>
              );
            })}
          </div>
          <button onClick={() => setStep('doctor')} className="text-sm text-gray-500 hover:text-primary">← Back</button>
        </div>
      )}

      {/* Step: Choose Slot */}
      {step === 'slot' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Available Times – {data.date}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {slots.map((slot: { start: string; end: string; available: boolean; locked: boolean }) => (
              <button
                key={slot.start}
                disabled={!slot.available}
                onClick={async () => {
                  await lockSlot.mutateAsync({ doctor_id: data.doctor_id!, date: data.date!, time: slot.start });
                  setData((d) => ({ ...d, time: slot.start }));
                  setStep('details');
                }}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  !slot.available
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                    : data.time === slot.start
                    ? 'bg-primary text-white'
                    : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 border border-green-200'
                }`}
              >
                {slot.start}
              </button>
            ))}
          </div>
          {slots.length === 0 && (
            <p className="text-center text-gray-500 py-8">No available slots for this date.</p>
          )}
          <button onClick={() => setStep('date')} className="text-sm text-gray-500 hover:text-primary">← Back</button>
        </div>
      )}

      {/* Step: Details */}
      {step === 'details' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appointment Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <div className="flex gap-3">
              {(['offline', 'online'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setData((d) => ({ ...d, type: t }))}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium capitalize transition-colors ${
                    data.type === t ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {t === 'online' ? '🎥 Video Call' : '🏥 In Person'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (optional)</label>
            <textarea
              value={data.notes ?? ''}
              onChange={(e) => setData((d) => ({ ...d, notes: e.target.value }))}
              rows={3}
              placeholder="Describe your symptoms or reason for visit..."
              className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep('slot')} className="flex-1 py-2.5 border rounded-lg text-sm hover:bg-gray-50">← Back</button>
            <button
              onClick={() => setStep('confirm')}
              disabled={!data.type}
              className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step: Confirm */}
      {step === 'confirm' && (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm Appointment</h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
            {[
              { label: 'Doctor', value: data.doctor_name },
              { label: 'Date', value: data.date },
              { label: 'Time', value: data.time },
              { label: 'Type', value: data.type },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">{value}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep('details')} className="flex-1 py-2.5 border rounded-lg text-sm">← Back</button>
            <button
              onClick={() => bookAppointment.mutate()}
              disabled={bookAppointment.isPending}
              className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {bookAppointment.isPending ? 'Booking…' : 'Book Appointment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
