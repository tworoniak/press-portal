import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createInteraction, fetchContact } from './detailApi';

export function useContact(id: string) {
  return useQuery({
    queryKey: ['contact', id],
    queryFn: () => fetchContact(id),
    enabled: Boolean(id),
  });
}

export function useCreateInteraction(contactId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof createInteraction>[0]) =>
      createInteraction(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['contact', contactId] });
      await qc.invalidateQueries({ queryKey: ['contacts'] });
      await qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
