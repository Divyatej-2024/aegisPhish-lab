import type { Metadata } from 'next';
import { Navbar } from '@/components/dashboard/Navbar';
import '@/globals.css';

export const metadata: Metadata = {
  title: 'Aegis Phish Lab - Human Attack Surface Training',
  description: 'Cloud-native cybersecurity awareness and phishing simulation platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
