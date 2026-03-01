import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContact, fetchContacts, type CreateContactInput } from './api';

export function useContacts() {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: fetchContacts,
  });
}

export function useCreateContact() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateContactInput) => createContact(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}
