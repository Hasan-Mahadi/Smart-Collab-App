import { SignupForm } from '@/features/auth/signup-form';

export default function SignupPage() {
  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
        Create account
      </h2>
      <p className="mb-8 text-slate-500">
        Get started with SmartCollab today
      </p>
      <SignupForm />
    </div>
  );
}
