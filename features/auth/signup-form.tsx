'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupForm = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupForm) => {
    setLoading(true);
    setError('');
    try {
      const res = await authService.signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setAuth(res.user, res.accessToken, res.refreshToken);
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Signup failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register('name')}
      />
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
      <Input
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" className="w-full" loading={loading}>
        Create Account
      </Button>
      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="text-indigo-600 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
