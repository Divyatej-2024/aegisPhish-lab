'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useCampaigns, useDeleteCampaign } from '@/hooks/useCampaigns';
import { StatCard } from '@/components/dashboard/StatCard';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { CampaignList } from '@/components/campaigns/CampaignList';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/Loading';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const { data: campaigns = [], isLoading } = useCampaigns(user?.organization_id);
  const { mutate: deleteCampaign, isPending: isDeleting } = useDeleteCampaign();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Calculate statistics
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;
  const totalTargets = campaigns.reduce((sum, c) => sum + (c.targets?.length || 0), 0);

  // Sample chart data
  const chartData = [
    { name: 'Jan', opens: 400, clicks: 240, submissions: 120 },
    { name: 'Feb', opens: 300, clicks: 139, submissions: 85 },
    { name: 'Mar', opens: 200, clicks: 98, submissions: 45 },
    { name: 'Apr', opens: 278, clicks: 180, submissions: 92 },
    { name: 'May', opens: 189, clicks: 140, submissions: 67 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back, {user?.first_name}!</p>
        </div>
        <Link href="/campaigns/new">
          <Button variant="primary">Create Campaign</Button>
        </Link>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Campaigns"
          value={campaigns.length}
          change={12}
          trend="up"
          icon="📊"
        />
        <StatCard
          title="Active Campaigns"
          value={activeCampaigns}
          change={5}
          trend="up"
          icon="🚀"
        />
        <StatCard
          title="Total Targets"
          value={totalTargets}
          change={8}
          trend="up"
          icon="👥"
        />
        <StatCard
          title="Avg Click Rate"
          value="42.5%"
          change={3}
          trend="down"
          icon="📈"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnalyticsChart
          title="Campaign Performance"
          data={chartData}
          type="line"
          dataKey="opens"
        />
        <AnalyticsChart
          title="User Actions"
          data={[
            { name: 'Opened', value: 65 },
            { name: 'Clicked', value: 28 },
            { name: 'Submitted', value: 7 },
          ]}
          type="pie"
          dataKey="value"
        />
      </div>

      {/* Campaigns Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Campaigns</CardTitle>
          <Link href="/campaigns">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <CampaignList
            campaigns={campaigns.slice(0, 5)}
            isLoading={isLoading}
            onDelete={(id) => deleteCampaign(id)}
            isDeleting={isDeleting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
