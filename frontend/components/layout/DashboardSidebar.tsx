'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Calendar, Users, UserCircle, Building2,
  Stethoscope, Globe, CreditCard, BarChart2, Settings, LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { href: '/dashboard',           label: 'Dashboard',      icon: LayoutDashboard, roles: ['clinic_admin', 'receptionist', 'doctor'] },
  { href: '/dashboard/appointments',label: 'Appointments', icon: Calendar,         roles: ['clinic_admin', 'receptionist', 'doctor', 'patient'] },
  { href: '/dashboard/doctors',   label: 'Doctors',        icon: Stethoscope,     roles: ['clinic_admin', 'receptionist'] },
  { href: '/dashboard/patients',  label: 'Patients',       icon: UserCircle,      roles: ['clinic_admin', 'receptionist', 'doctor'] },
  { href: '/dashboard/branches',  label: 'Branches',       icon: Building2,       roles: ['clinic_admin'] },
  { href: '/dashboard/website-builder', label: 'Website',  icon: Globe,           roles: ['clinic_admin'] },
  { href: '/dashboard/billing',   label: 'Billing',        icon: CreditCard,      roles: ['clinic_admin'] },
  { href: '/dashboard/reports',   label: 'Reports',        icon: BarChart2,       roles: ['clinic_admin'] },
  { href: '/dashboard/settings',  label: 'Settings',       icon: Settings,        roles: ['clinic_admin'] },
];

export function DashboardSidebar() {
  const pathname  = usePathname();
  const { user, logout } = useAuthStore();
  const userRole  = user?.role ?? '';

  const visibleItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white">ClinicPro</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon    = item.icon;
          const active  = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userRole.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
