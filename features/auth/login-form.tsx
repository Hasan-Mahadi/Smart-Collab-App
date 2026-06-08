'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError('');
    try {
      const res = await authService.login(data);
      setAuth(res.user, res.accessToken, res.refreshToken);
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (type: 'admin' | 'manager' | 'member') => {
    setLoading(true);
    setError('');
    try {
      const fn = {
        admin: authService.demoAdmin,
        manager: authService.demoManager,
        member: authService.demoMember,
      }[type];
      const res = await fn();
      setAuth(res.user, res.accessToken, res.refreshToken);
      router.push('/dashboard');
    } catch {
      setError('Demo login failed. Please run database seed first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        <Button type="submit" className="w-full" loading={loading}>
          Sign In
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-slate-500 dark:bg-slate-900">
            Quick Demo Login
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <Button
          variant="outline"
          onClick={() => handleDemo('admin')}
          disabled={loading}
        >
          Admin Demo
        </Button>
        <Button
          variant="outline"
          onClick={() => handleDemo('manager')}
          disabled={loading}
        >
          Project Manager Demo
        </Button>
        <Button
          variant="outline"
          onClick={() => handleDemo('member')}
          disabled={loading}
        >
          Team Member Demo
        </Button>
      </div>

      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-indigo-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
