'use client';

import { useState } from 'react';
import { useForm } from '@/hooks/useForm';
import { Button } from '@/components/ui/Button';
import { RegisterData } from '@/types';

interface RegisterFormProps {
  register: (data: RegisterData) => Promise<void>;
  onSuccess: () => void;
}

export function RegisterForm({ register, onSuccess }: RegisterFormProps) {
  const { values, handleChange, handleSubmit, isLoading } = useForm({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    organization_id: '',
  });
  const [serverError, setServerError] = useState('');

  return (
    <form
      className="mt-8 space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit(async () => {
          try {
            await register(values);
            onSuccess();
          } catch (error: any) {
            setServerError(error?.response?.data?.message || 'Unable to register');
          }
        });
      }}
    >
      {serverError ? <div className="rounded-2xl bg-rose-500/10 p-3 text-sm text-rose-200">{serverError}</div> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span>First name</span>
          <input name="first_name" value={values.first_name} onChange={handleChange} required className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
        </label>
        <label className="block space-y-2 text-sm">
          <span>Last name</span>
          <input name="last_name" value={values.last_name} onChange={handleChange} required className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
        </label>
      </div>
      <label className="block space-y-2 text-sm">
        <span>Email</span>
        <input name="email" type="email" value={values.email} onChange={handleChange} required className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
      </label>
      <label className="block space-y-2 text-sm">
        <span>Password</span>
        <input name="password" type="password" value={values.password} onChange={handleChange} required className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
      </label>
      <label className="block space-y-2 text-sm">
        <span>Organization ID</span>
        <input name="organization_id" value={values.organization_id} onChange={handleChange} placeholder="org-123" required className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
      </label>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
}
