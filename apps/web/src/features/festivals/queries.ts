import { useQuery } from '@tanstack/react-query';
import { fetchFestivals } from './api';

export function useFestivals(search: string, enabled = true) {
  return useQuery({
    queryKey: ['festivals', { search }],
    queryFn: () => fetchFestivals(search),
    enabled: enabled && search.trim().length >= 2,
    staleTime: 60_000,
  });
}
