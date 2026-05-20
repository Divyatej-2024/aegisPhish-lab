'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Campaign } from '@/types';

interface CampaignListProps {
  campaigns?: Campaign[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

export const CampaignList: React.FC<CampaignListProps> = ({
  campaigns = [],
  isLoading = false,
  onDelete,
  isDeleting = false,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!campaigns.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <EmptyState
            title="No campaigns yet"
            description="Create your first phishing campaign to get started"
            icon="📧"
            action={{
              label: 'Create Campaign',
              href: '/campaigns/new',
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-white">{campaign.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : campaign.status === 'scheduled'
                        ? 'bg-blue-500/20 text-blue-400'
                        : campaign.status === 'draft'
                        ? 'bg-gray-500/20 text-gray-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  {campaign.description && (
                    <p className="text-muted-foreground text-sm mt-2">{campaign.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Created {new Date(campaign.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/campaigns/${campaign.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                  {campaign.status === 'draft' && (
                    <Link href={`/campaigns/${campaign.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(campaign.id)}
                    disabled={isDeleting}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};
