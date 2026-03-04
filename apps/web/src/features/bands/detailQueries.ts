import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { removeBandContact } from './detailApi';
import { api } from '../../lib/api';

export type BandContactLink = {
  contactId: string;
  bandId: string;
  relationshipRole: string | null;
  relationshipNotes: string | null;
  createdAt: string;
  contact: {
    id: string;
    displayName: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    company: string | null;
    role: string | null;
  };
};

export type BandInteraction = {
  id: string;
  type: string;
  occurredAt: string;
  subject: string | null;
  notes: string | null;
  outcome: string | null;
  nextFollowUpAt: string | null;

  contact: {
    id: string;
    displayName: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    company: string | null;
    role: string | null;
  };

  festival: { id: string; name: string } | null;
};

export type BandDetail = {
  id: string;
  name: string;
  genre: string | null;
  country: string | null;
  website: string | null;
  contacts: BandContactLink[];
  interactions: BandInteraction[];
};

export function useBand(id: string) {
  return useQuery({
    queryKey: ['band', id],
    queryFn: async () => {
      const res = await api.get<BandDetail>(`/bands/${id}`);
      return res.data;
    },
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
