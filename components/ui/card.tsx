import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'text-lg font-semibold text-slate-900 dark:text-slate-100',
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}
