import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function getStatusBadge(status: string) {
  const map: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    ACTIVE: 'success',
    COMPLETED: 'info',
    ON_HOLD: 'warning',
    TODO: 'default',
    IN_PROGRESS: 'info',
    HIGH: 'danger',
    MEDIUM: 'warning',
    LOW: 'default',
  };
  return map[status] || 'default';
}
