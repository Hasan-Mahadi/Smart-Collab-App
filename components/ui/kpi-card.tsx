import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  color?: 'indigo' | 'green' | 'amber' | 'red' | 'blue';
}

export function KpiCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'indigo',
}: KpiCardProps) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {value}
          </p>
          {trend && (
            <p className="mt-1 text-xs text-slate-500">{trend}</p>
          )}
        </div>
        <div className={cn('rounded-xl p-3', colors[color])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
