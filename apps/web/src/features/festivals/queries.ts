import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFestival, fetchFestivals } from './api';

export function useFestivals(search = '', enabled = true) {
  return useQuery({
    queryKey: ['festivals', { search }],
    queryFn: () => fetchFestivals(search || undefined),
    enabled,
    staleTime: 30_000,
  });
}

export function useCreateFestival() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createFestival,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['festivals'] });
    },
  });
}
