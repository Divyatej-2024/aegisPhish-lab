'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Aegis Phish Lab
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The modern human attack surface training platform. Simulate, measure, and improve your organization's security awareness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button variant="primary" size="lg">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-lg">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-xl font-semibold text-white mb-2">Campaign Management</h3>
            <p className="text-muted-foreground">Create, schedule, and launch phishing campaigns with ease</p>
          </div>
          <div className="glass p-8 rounded-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">Real-time Analytics</h3>
            <p className="text-muted-foreground">Track opens, clicks, and submissions with detailed metrics</p>
          </div>
          <div className="glass p-8 rounded-lg">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-white mb-2">User Management</h3>
            <p className="text-muted-foreground">Manage departments, teams, and individual users</p>
          </div>
        </div>
      </div>
    </div>
  );
}
