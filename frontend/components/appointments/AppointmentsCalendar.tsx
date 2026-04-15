'use client';

import { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

export function AppointmentsCalendar() {
  const [selected, setSelected] = useState(new Date());
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Calendar</h3>
      <div className="grid grid-cols-7 gap-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d} className="text-center text-xs text-gray-500 py-2">{d}</div>
        ))}
        {Array.from({ length: 35 }, (_, i) => {
          const day = addDays(weekStart, i);
          const isToday  = isSameDay(day, new Date());
          const isActive = isSameDay(day, selected);
          return (
            <button
              key={i}
              onClick={() => setSelected(day)}
              className={`py-2 rounded-lg text-sm transition-colors ${
                isActive  ? 'bg-primary text-white'
                : isToday ? 'bg-primary/10 text-primary font-medium'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
