import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchBand, removeBandContact } from './detailApi';
import { api } from '../../lib/api';

export function useBand(id: string) {
  return useQuery({
    queryKey: ['band', id],
    queryFn: () => fetchBand(id),
    enabled: Boolean(id),
  });
}

export function useAddBandContact(bandId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      contactId: string;
      relationshipRole?: string;
      relationshipNotes?: string;
    }) => api.post(`/bands/${bandId}/contacts`, input).then((r) => r.data),

    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['band', bandId] });
      await qc.invalidateQueries({ queryKey: ['contacts'] });
      await qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useRemoveBandContact(bandId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (contactId: string) => removeBandContact({ bandId, contactId }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['band', bandId] });
    },
  });
}
