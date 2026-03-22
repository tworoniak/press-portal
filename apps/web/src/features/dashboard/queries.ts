import { useQuery } from '@tanstack/react-query';
import { fetchDashboardOverview, fetchFollowUpQueue } from './api';

export function useDashboardOverview() {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: fetchDashboardOverview,
    staleTime: 30_000,
  });
}

export function useFollowUpQueue() {
  return useQuery({
    queryKey: ['dashboard', 'follow-up-queue'],
    queryFn: () => fetchFollowUpQueue(150),
    staleTime: 30_000,
  });
}
