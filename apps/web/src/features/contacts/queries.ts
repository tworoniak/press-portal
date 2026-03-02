import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createContact,
  deleteContact,
  fetchContacts,
  updateContact,
} from './api';

export function useContacts(filters: {
  search?: string;
  status?: string;
  tag?: string;
  needsFollowUp?: boolean;
}) {
  return useQuery({
    queryKey: ['contacts', filters],
    queryFn: () => fetchContacts(filters),
  });
}

export function useCreateContact() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createContact,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['contacts'] });
      await qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateContact() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateContact,
    onMutate: async (vars) => {
      // Optimistically update any cached contacts lists
      await qc.cancelQueries({ queryKey: ['contacts'] });

      const snapshots = qc
        .getQueriesData({ queryKey: ['contacts'] })
        .map(([key, data]) => [key, data] as const);

      qc.setQueriesData({ queryKey: ['contacts'] }, (prev) => {
        if (!Array.isArray(prev)) return prev;
        return prev.map((c) => (c.id === vars.id ? { ...c, ...vars.data } : c));
      });

      // Also update detail cache if present
      qc.setQueryData(['contact', vars.id], (prev: unknown) => {
        if (!prev || typeof prev !== 'object') return prev;
        return { ...(prev as object), ...(vars.data as object) };
      });

      return { snapshots };
    },
    onError: (_err, _vars, ctx) => {
      // rollback
      ctx?.snapshots?.forEach(([key, data]) => qc.setQueryData(key, data));
    },
    onSuccess: async (_updated, vars) => {
      await qc.invalidateQueries({ queryKey: ['contacts'] });
      await qc.invalidateQueries({ queryKey: ['contact', vars.id] });
      await qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteContact() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteContact,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['contacts'] });

      const snapshots = qc
        .getQueriesData({ queryKey: ['contacts'] })
        .map(([key, data]) => [key, data] as const);

      qc.setQueriesData({ queryKey: ['contacts'] }, (prev) => {
        if (!Array.isArray(prev)) return prev;
        return prev.filter((c) => c.id !== id);
      });

      return { snapshots };
    },
    onError: (_err, _id, ctx) => {
      ctx?.snapshots?.forEach(([key, data]) => qc.setQueryData(key, data));
    },
    onSuccess: async (_deleted, id) => {
      await qc.invalidateQueries({ queryKey: ['contacts'] });
      await qc.removeQueries({ queryKey: ['contact', id] });
      await qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
