import { useQuery } from '@tanstack/react-query';
import { fetchBands } from './api';

export function useBands(search: string, enabled = true) {
  return useQuery({
    queryKey: ['bands', { search }],
    queryFn: () => fetchBands(search),
    enabled: enabled && search.trim().length >= 2,
    staleTime: 60_000,
  });
}
