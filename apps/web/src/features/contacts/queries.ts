import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContact, fetchContacts } from './api';

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
      // invalidate ALL variants of contacts queries (all filter combos)
      await qc.invalidateQueries({ queryKey: ['contacts'] });
      // and dashboard widgets that depend on contact state
      await qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
