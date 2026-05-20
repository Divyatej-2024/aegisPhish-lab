'use client';

import { useRouter } from 'next/navigation';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuthStore } from '@/store/auth';

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);

  return (
    <div className="min-h-screen bg-background px-6 py-12 text-white">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/80 p-10 shadow-glow backdrop-blur-xl">
        <h1 className="text-3xl font-semibold">Create an account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Register a new user and join your organization for security training.</p>
        <RegisterForm onSuccess={() => router.push('/dashboard')} register={register} />
      </div>
    </div>
  );
}
