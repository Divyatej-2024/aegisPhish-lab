'use client';

import Link from 'next/link';

interface SidebarProps {
  active?: 'dashboard' | 'campaigns' | 'users';
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/campaigns', label: 'Campaigns' },
  { href: '/users', label: 'Users' },
];

export function Sidebar({ active }: SidebarProps) {
  return (
    <aside className="min-h-screen border-r border-white/10 bg-slate-950/75 p-6">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Aegis Phish Lab</p>
        <h2 className="mt-4 text-2xl font-semibold">Control Center</h2>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={`block rounded-3xl px-4 py-3 text-sm transition ${active === item.label.toLowerCase() ? 'bg-white/10 text-white' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
