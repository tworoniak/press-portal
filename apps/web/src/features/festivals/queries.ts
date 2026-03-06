import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createFestival,
  deleteFestival,
  fetchFestivals,
  updateFestival,
} from './api';

export function useFestivals(search = '', enabled = true) {
  const trimmed = search.trim();

  return useQuery({
    queryKey: ['festivals', { search: trimmed }],
    queryFn: () => fetchFestivals(trimmed || undefined),
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

export function useUpdateFestival() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateFestival,
    onSuccess: async (_data, variables) => {
      await qc.invalidateQueries({ queryKey: ['festivals'] });
      await qc.invalidateQueries({ queryKey: ['festival', variables.id] });
    },
  });
}

export function useDeleteFestival() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteFestival,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['festivals'] });
    },
  });
}
