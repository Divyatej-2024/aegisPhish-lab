'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth';
import { useForm } from '@/hooks/useForm';

export const RegisterForm: React.FC<{ defaultOrgId?: string }> = ({ defaultOrgId = '' }) => {
  const router = useRouter();
  const { register } = useAuthStore();
  const [submitError, setSubmitError] = useState('');

  const { values, errors, isLoading, handleChange, handleSubmit } = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      organizationId: defaultOrgId,
    },
    onSubmit: async (data) => {
      if (data.password !== data.confirmPassword) {
        setSubmitError('Passwords do not match');
        return;
      }

      try {
        await register(data.email, data.password, data.firstName, data.lastName, data.organizationId);
        router.push('/login');
      } catch (error: any) {
        setSubmitError(error.response?.data?.message || 'Registration failed. Please try again.');
      }
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {submitError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              type="text"
              name="firstName"
              placeholder="John"
              value={values.firstName}
              onChange={handleChange}
              error={errors.firstName}
              required
            />
            <Input
              label="Last Name"
              type="text"
              name="lastName"
              placeholder="Doe"
              value={values.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required
            />
          </div>

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

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            isLoading={isLoading}
          >
            Create Account
          </Button>

          <p className="text-center text-muted-foreground text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
