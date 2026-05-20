import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register - Aegis Phish Lab',
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
