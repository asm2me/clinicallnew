'use client';

import { useQuery } from '@tanstack/react-query';
import { appointmentsApi } from '@/lib/api';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { Calendar, Users, TrendingUp, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AppointmentsCalendar } from '@/components/appointments/AppointmentsCalendar';
import { TodayAppointments } from '@/components/appointments/TodayAppointments';
import { RevenueChart } from '@/components/dashboard/RevenueChart';

export default function DashboardPage() {
  const now   = new Date();
  const start = format(startOfMonth(now), 'yyyy-MM-dd');
  const end   = format(endOfMonth(now), 'yyyy-MM-dd');

  const { data: stats } = useQuery({
    queryKey: ['appointment-stats', start, end],
    queryFn:  () => appointmentsApi.stats(start, end).then((r) => r.data.stats),
  });

  const { data: todayData } = useQuery({
    queryKey: ['appointments-today'],
    queryFn:  () => appointmentsApi.today().then((r) => r.data),
    refetchInterval: 30_000, // live refresh every 30s
  });

  const statCards = [
    { title: 'Total Appointments',   value: stats?.total     ?? 0, icon: Calendar,    color: 'blue',   change: '+12%' },
    { title: 'Confirmed',            value: stats?.confirmed  ?? 0, icon: CheckCircle, color: 'green',  change: '+8%' },
    { title: 'Pending',              value: stats?.pending    ?? 0, icon: Clock,       color: 'yellow', change: '-3%' },
    { title: 'Revenue (This Month)', value: `$${stats?.revenue?.toFixed(2) ?? '0.00'}`, icon: DollarSign, color: 'purple', change: '+22%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {format(now, 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatsCard key={card.title} {...card} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <RevenueChart />
          <TodayAppointments data={todayData} />
        </div>
        <div>
          <AppointmentsCalendar />
        </div>
      </div>
    </div>
  );
}
