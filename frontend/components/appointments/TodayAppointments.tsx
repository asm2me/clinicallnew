'use client';

import { Calendar, Clock, User } from 'lucide-react';

interface TodayAppointmentsProps {
  data?: {
    data: Array<{
      id: number;
      patient: { user: { name: string } };
      doctor: { user: { name: string } };
      scheduled_at: string;
      status: string;
    }>;
  };
}

const statusColors: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export function TodayAppointments({ data }: TodayAppointmentsProps) {
  const appointments = data?.data ?? [];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Today's Appointments</h3>
        <span className="text-xs text-gray-500">{appointments.length} total</span>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No appointments today</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.slice(0, 8).map((apt) => (
            <div key={apt.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                {apt.patient?.user?.name?.charAt(0) ?? 'P'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {apt.patient?.user?.name}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(apt.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  <span className="mx-1">·</span>
                  Dr. {apt.doctor?.user?.name}
                </p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColors[apt.status] ?? ''}`}>
                {apt.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
