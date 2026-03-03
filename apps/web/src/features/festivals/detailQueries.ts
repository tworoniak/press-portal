import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchFestival, removeFestivalContact } from './detailApi';
import { api } from '../../lib/api';

export function useFestival(id: string) {
  return useQuery({
    queryKey: ['festival', id],
    queryFn: () => fetchFestival(id),
    enabled: Boolean(id),
  });
}

export function useAddFestivalContact(festivalId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      contactId: string;
      relationshipRole?: string;
      relationshipNotes?: string;
    }) =>
      api.post(`/festivals/${festivalId}/contacts`, input).then((r) => r.data),

    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['festival', festivalId] });
      await qc.invalidateQueries({ queryKey: ['contacts'] });
      await qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useRemoveFestivalContact(festivalId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) =>
      removeFestivalContact({ festivalId, contactId }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['festival', festivalId] });
    },
  });
}
