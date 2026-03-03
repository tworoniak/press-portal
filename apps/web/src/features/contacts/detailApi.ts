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

export type ContactBandRef = {
  band: { id: string; name: string };
  createdAt: string;
  relationshipRole: string | null;
  relationshipNotes: string | null;
};

export type ContactFestivalRef = {
  festival: { id: string; name: string };
  createdAt: string;
  relationshipRole: string | null;
  relationshipNotes: string | null;
};

export type ContactDetail = Omit<Contact, 'interactions'> & {
  interactions: Interaction[];
  bands: ContactBandRef[];
  festivals: ContactFestivalRef[];
};

export async function fetchContact(id: string) {
  const res = await api.get<ContactDetail>(`/contacts/${id}`);
  return res.data;
}

export async function addContactBand(input: {
  contactId: string;
  bandId: string;
}) {
  const res = await api.post<ContactBandRef>(
    `/contacts/${input.contactId}/bands`,
    {
      bandId: input.bandId,
    },
  );
  return res.data;
}

export async function removeContactBand(input: {
  contactId: string;
  bandId: string;
}) {
  const res = await api.delete<{ ok: true } | unknown>(
    `/contacts/${input.contactId}/bands/${input.bandId}`,
  );
  return res.data;
}

export async function addContactFestival(input: {
  contactId: string;
  festivalId: string;
}) {
  const res = await api.post<{ id: string; name: string }>(
    `/contacts/${input.contactId}/festivals`,
    {
      festivalId: input.festivalId,
    },
  );
  return res.data;
}

export async function removeContactFestival(input: {
  contactId: string;
  festivalId: string;
}) {
  const res = await api.delete<{ ok: true } | unknown>(
    `/contacts/${input.contactId}/festivals/${input.festivalId}`,
  );
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
