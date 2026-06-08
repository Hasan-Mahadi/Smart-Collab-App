'use client';

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Bell,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/team', label: 'Team', icon: Users, adminOnly: true },
  { href: '/notifications', label: 'Notifications', icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6 dark:border-slate-700">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm">
          SC
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            SmartCollab
          </h1>
          <p className="text-xs text-slate-500">Project Management</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          if (item.adminOnly && user?.role !== 'ADMIN') return null;
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4 dark:border-slate-700">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
              {user?.name}
            </p>
            <p className="truncate text-xs text-slate-500">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
          <Settings className="h-4 w-4 text-slate-400" />
        </div>
      </div>
    </aside>
  );
}
