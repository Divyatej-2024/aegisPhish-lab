import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Aegis Phish Lab',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
