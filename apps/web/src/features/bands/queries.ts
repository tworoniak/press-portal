import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBand, fetchBands } from './api';

export function useBands(search: string, enabled = true) {
  return useQuery({
    queryKey: ['bands', { search }],
    queryFn: () => fetchBands(search),
    enabled: enabled && search.trim().length >= 2,
    staleTime: 30_000,
  });
}

export function useCreateBand() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createBand,
    onSuccess: async () => {
      // refresh any band searches
      await qc.invalidateQueries({ queryKey: ['bands'] });
    },
  });
}
