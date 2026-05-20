'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.16),_transparent_35%),#020617]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Human Attack Surface Training Platform
            </motion.h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Build phishing resilience with campaign planning, real-time training analytics, and team-aware security awareness for your organization.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/login">
                <Button variant="primary">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">Get Started</Button>
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">Platform highlights</h2>
            <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
              <li>• Secure JWT authentication with RBAC roles</li>
              <li>• Campaign management, scheduling, and tracking</li>
              <li>• Dashboard analytics for opens, clicks, and submissions</li>
              <li>• Team + department management for organizations</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
