'use client';

import { useState } from 'react';
import { useForm } from '@/hooks/useForm';
import { Button } from '@/components/ui/Button';
import { LoginData } from '@/types';

interface LoginFormProps {
  login: (data: LoginData) => Promise<void>;
  onSuccess: () => void;
}

export function LoginForm({ login, onSuccess }: LoginFormProps) {
  const { values, handleChange, handleSubmit, errors, isLoading } = useForm({
    email: '',
    password: '',
  });
  const [serverError, setServerError] = useState('');

  return (
    <form
      className="mt-8 space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit(async () => {
          try {
            await login(values);
            onSuccess();
          } catch (error: any) {
            setServerError(error?.response?.data?.message || 'Invalid login credentials');
          }
        });
      }}
    >
      {serverError ? <div className="rounded-2xl bg-rose-500/10 p-3 text-sm text-rose-200">{serverError}</div> : null}
      <label className="block space-y-2 text-sm">
        <span>Email</span>
        <input
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          required
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span>Password</span>
        <input
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          required
        />
      </label>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
