'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth';
import { useForm } from '@/hooks/useForm';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuthStore();
  const [submitError, setSubmitError] = useState('');

  const { values, errors, isLoading, handleChange, handleSubmit } = useForm({
    initialValues: { email: '', password: '' },
    onSubmit: async (data) => {
      try {
        await login(data.email, data.password);
        router.push('/dashboard');
      } catch (error: any) {
        setSubmitError(error.response?.data?.message || 'Login failed. Please try again.');
      }
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {submitError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {submitError}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            isLoading={isLoading}
          >
            Sign In
          </Button>

          <p className="text-center text-muted-foreground text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
