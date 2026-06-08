import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  loading?: boolean;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data found',
  loading,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 font-medium text-slate-600 dark:text-slate-300',
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/50"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn('px-4 py-3 text-slate-700 dark:text-slate-300', col.className)}
                >
                  {col.render
                    ? col.render(item)
                    : (item as Record<string, unknown>)[col.key]?.toString()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-slate-500">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-lg border border-slate-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-slate-600"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-lg border border-slate-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-slate-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}
