'use client';

import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuthStore } from '@/store/auth';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  return (
    <div className="min-h-screen bg-background px-6 py-12 text-white">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/80 p-10 shadow-glow backdrop-blur-xl">
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to manage your organization and campaign analytics.</p>
        <LoginForm onSuccess={() => router.push('/dashboard')} login={login} />
      </div>
    </div>
  );
}
