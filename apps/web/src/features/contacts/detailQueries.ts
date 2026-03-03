import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createInteraction,
  deleteInteraction,
  fetchContact,
  updateInteraction,
  type ContactDetail,
  type Interaction,
} from './detailApi';

export function useContact(id: string) {
  return useQuery({
    queryKey: ['contact', id],
    queryFn: () => fetchContact(id),
    enabled: Boolean(id),
  });
}

function upsertInteraction(list: Interaction[], updated: Interaction) {
  const idx = list.findIndex((x) => x.id === updated.id);
  if (idx === -1) return [updated, ...list];
  const copy = list.slice();
  copy[idx] = updated;
  // keep newest first by occurredAt
  copy.sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );
  return copy;
}

export function useCreateInteraction(contactId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof createInteraction>[0]) =>
      createInteraction(input),
    onSuccess: async (created) => {
      qc.setQueryData<ContactDetail>(['contact', contactId], (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          interactions: upsertInteraction(prev.interactions ?? [], created),
          lastContactedAt: new Date().toISOString(),
        };
      });

      await qc.invalidateQueries({ queryKey: ['contacts'] });
      await qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateInteraction(contactId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateInteraction,
    onSuccess: async (updated) => {
      qc.setQueryData<ContactDetail>(['contact', contactId], (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          interactions: upsertInteraction(prev.interactions ?? [], updated),
        };
      });

      await qc.invalidateQueries({ queryKey: ['contacts'] });
      await qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteInteraction(contactId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteInteraction,
    onSuccess: async (deleted) => {
      qc.setQueryData<ContactDetail>(['contact', contactId], (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          interactions: (prev.interactions ?? []).filter(
            (x) => x.id !== deleted.id,
          ),
        };
      });

      await qc.invalidateQueries({ queryKey: ['contacts'] });
      await qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
