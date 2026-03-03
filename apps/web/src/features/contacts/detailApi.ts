import { api } from '../../lib/api';
import type { Contact } from './api';

export type NamedRef = { id: string; name: string };

export type Interaction = {
  id: string;
  type: 'EMAIL' | 'CALL' | 'TEXT' | 'DM' | 'MEETING' | 'NOTE';
  occurredAt: string;
  subject: string | null;
  notes: string | null;
  outcome: string | null;
  nextFollowUpAt: string | null;
  contactId: string;

  bandId: string | null;
  festivalId: string | null;

  band?: NamedRef | null;
  festival?: NamedRef | null;

  createdAt: string;
  updatedAt: string;
};

export type ContactDetail = Omit<Contact, 'interactions'> & {
  interactions: Interaction[];
};

export async function fetchContact(id: string) {
  const res = await api.get<ContactDetail>(`/contacts/${id}`);
  return res.data;
}

export async function createInteraction(input: {
  contactId: string;
  type: Interaction['type'];
  occurredAt?: string;
  subject?: string;
  notes?: string;
  outcome?: string;
  nextFollowUpAt?: string;
  bandId?: string;
  festivalId?: string;
}) {
  const res = await api.post<Interaction>('/interactions', input);
  return res.data;
}

export async function updateInteraction(input: {
  id: string;
  data: Partial<{
    type: Interaction['type'];
    occurredAt: string | null;
    subject: string | null;
    notes: string | null;
    outcome: string | null;
    nextFollowUpAt: string | null;
    bandId: string | null;
    festivalId: string | null;
  }>;
}) {
  const res = await api.patch<Interaction>(
    `/interactions/${input.id}`,
    input.data,
  );
  return res.data;
}

export async function deleteInteraction(id: string) {
  const res = await api.delete<{ id: string; contactId: string }>(
    `/interactions/${id}`,
  );
  return res.data;
}
