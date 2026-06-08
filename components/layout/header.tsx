'use client';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { useThemeStore } from '@/store/theme.store';
import { authService } from '@/services/auth.service';
import { LogOut, Moon, Sun, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title: string;
  subtitle?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function Header({
  title,
  subtitle,
  searchValue,
  onSearchChange,
}: HeaderProps) {
  const router = useRouter();
  const { refreshToken, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = async () => {
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch {
        /* ignore */
      }
    }
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-500">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {onSearchChange && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-64 rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800"
            />
          </div>
        )}

        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-slate-400" />
          ) : (
            <Moon className="h-5 w-5 text-slate-400" />
          )}
        </button>

        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
