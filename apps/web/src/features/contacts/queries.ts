import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createContact,
  fetchContacts,
  type ContactFilters,
  type CreateContactInput,
} from './api';

export function useContacts(filters?: ContactFilters) {
  return useQuery({
    queryKey: ['contacts', filters ?? {}],
    queryFn: () => fetchContacts(filters),
  });
}

export function useCreateContact() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateContactInput) => createContact(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['contacts'] });
      await qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
