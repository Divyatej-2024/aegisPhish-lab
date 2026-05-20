'use client';

import { useQuery } from '@tanstack/react-query';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatCard } from '@/components/dashboard/StatCard';
import { apiService } from '@/lib/api-client';

type Overview = {
  campaign_count: number;
  active_campaigns: number;
  user_count: number;
  open_events: number;
  click_events: number;
  submission_events: number;
};

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery<Overview>(['dashboard', 'overview'], async () => {
    const response = await apiService.getClient().get('/dashboard/overview');
    return response.data.data;
  });

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <Sidebar active="dashboard" />
        <main className="space-y-8 p-6 lg:p-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Realtime phishing performance and organization metrics.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <StatCard title="Campaigns" value={data?.campaign_count ?? 0} description="Total active campaigns" />
            <StatCard title="Active" value={data?.active_campaigns ?? 0} description="Campaigns running now" />
            <StatCard title="Users" value={data?.user_count ?? 0} description="Team members enrolled" />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <StatCard title="Opens" value={data?.open_events ?? 0} description="Email open events" />
            <StatCard title="Clicks" value={data?.click_events ?? 0} description="Link click events" />
            <StatCard title="Submissions" value={data?.submission_events ?? 0} description="Credential submissions" />
          </div>

          {error && <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-5 text-sm text-rose-200">Unable to load dashboard overview. Please refresh.</div>}
          {isLoading && <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 text-sm text-muted-foreground">Loading analytics...</div>}
        </main>
      </div>
    </div>
  );
}
