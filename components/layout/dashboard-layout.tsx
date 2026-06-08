'use client';

import { Sidebar } from './sidebar';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated()) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="ml-64">{children}</main>
    </div>
  );
}
