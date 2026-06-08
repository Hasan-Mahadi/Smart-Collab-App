import { LoginForm } from '@/features/auth/login-form';

export default function LoginPage() {
  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
        Welcome back
      </h2>
      <p className="mb-8 text-slate-500">
        Sign in to your account to continue
      </p>
      <LoginForm />
    </div>
  );
}
