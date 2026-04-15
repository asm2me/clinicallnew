'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title:   string;
  value:   string | number;
  icon:    LucideIcon;
  color:   'blue' | 'green' | 'yellow' | 'purple' | 'red';
  change?: string;
}

const colorMap = {
  blue:   'bg-blue-50   text-blue-600   dark:bg-blue-900/20   dark:text-blue-400',
  green:  'bg-green-50  text-green-600  dark:bg-green-900/20  dark:text-green-400',
  yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  red:    'bg-red-50    text-red-600    dark:bg-red-900/20    dark:text-red-400',
};

export function StatsCard({ title, value, icon: Icon, color, change }: StatsCardProps) {
  const isPositive = change?.startsWith('+');

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={cn('p-2.5 rounded-lg', colorMap[color])}>
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <span className={cn(
            'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
            isPositive ? 'text-green-700 bg-green-50 dark:bg-green-900/20' : 'text-red-700 bg-red-50 dark:bg-red-900/20'
          )}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{title}</p>
      </div>
    </div>
  );
}
