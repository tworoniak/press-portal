import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBand, deleteBand, fetchBands, updateBand } from './api';

export function useBands(search = '', enabled = true) {
  const trimmed = search.trim();

  return useQuery({
    queryKey: ['bands', { search: trimmed }],
    queryFn: () => fetchBands(trimmed || undefined),
    enabled,
    staleTime: 30_000,
  });
}

export function useCreateBand() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createBand,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['bands'] });
    },
  });
}

export function useUpdateBand() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateBand,
    onSuccess: async (_data, variables) => {
      await qc.invalidateQueries({ queryKey: ['bands'] });
      await qc.invalidateQueries({ queryKey: ['band', variables.id] });
    },
  });
}

export function useDeleteBand() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteBand,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['bands'] });
    },
  });
}
