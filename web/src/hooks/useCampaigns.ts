import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api-client';
import type { Campaign, CampaignStats, EmailTemplate } from '@/types';

export const useCampaigns = (organizationId?: string) => {
  return useQuery({
    queryKey: ['campaigns', organizationId],
    queryFn: async () => {
      const response = await apiService.getClient().get('/campaigns');
      return response.data.data as Campaign[];
    },
    enabled: !!organizationId,
  });
};

export const useCampaign = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: async () => {
      const response = await apiService.getClient().get(`/campaigns/${campaignId}`);
      return response.data.data as Campaign;
    },
    enabled: !!campaignId,
  });
};

export const useCampaignStats = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaign-stats', campaignId],
    queryFn: async () => {
      const response = await apiService.getClient().get(`/campaigns/${campaignId}/stats`);
      return response.data.data as CampaignStats;
    },
    enabled: !!campaignId,
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Campaign>) => {
      const response = await apiService.getClient().post('/campaigns', data);
      return response.data.data as Campaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Campaign>) => {
      const response = await apiService.getClient().put(`/campaigns/${id}`, data);
      return response.data.data as Campaign;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', data.id] });
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignId: string) => {
      await apiService.getClient().delete(`/campaigns/${campaignId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};
