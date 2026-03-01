import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createInteraction, fetchContact } from './detailApi';
import type { ContactDetail, Interaction } from './detailApi';

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

    onSuccess: async (created: Interaction) => {
      // optimistic append (so UI updates immediately)
      qc.setQueryData<ContactDetail>(['contact', contactId], (prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          interactions: [created, ...(prev.interactions ?? [])],
          // optional: keep list/dashboard consistent
          lastContactedAt: new Date().toISOString(),
        };
      });

      // IMPORTANT: refetch from server to ensure canonical ordering/shape
      await qc.invalidateQueries({ queryKey: ['contact', contactId] });

      // refresh other pages
      await qc.invalidateQueries({ queryKey: ['contacts'] });
      await qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
