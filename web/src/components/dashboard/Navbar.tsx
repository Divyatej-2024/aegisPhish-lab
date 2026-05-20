'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="glass border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AP</span>
          </div>
          <span className="text-xl font-bold text-white hidden sm:inline">Aegis Phish Lab</span>
        </Link>

        {user && (
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col items-end">
              <p className="text-sm font-medium text-white">{user.first_name} {user.last_name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-smooth"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
