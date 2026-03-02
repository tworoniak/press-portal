import { api } from '../../lib/api';
import type { Contact } from './api';

type NamedRef = { id: string; name: string };

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

export type ContactDetail = Contact & {
  interactions: Interaction[];
};

export async function fetchContact(id: string) {
  const res = await api.get<ContactDetail>(`/contacts/${id}`);
  return res.data;
}

// export async function createInteraction(input: {
//   contactId: string;
//   type: Interaction['type'];
//   occurredAt?: string;
//   subject?: string;
//   notes?: string;
//   outcome?: string;
//   nextFollowUpAt?: string;
//   bandId?: string;
//   festivalId?: string;
// }) {
//   const res = await api.post<Interaction>('/interactions', {
//     type: input.type,
//     occurredAt: input.occurredAt,
//     subject: input.subject,
//     notes: input.notes,
//     outcome: input.outcome,
//     nextFollowUpAt: input.nextFollowUpAt,
//     contact: { connect: { id: input.contactId } },
//     ...(input.bandId ? { band: { connect: { id: input.bandId } } } : {}),
//     ...(input.festivalId
//       ? { festival: { connect: { id: input.festivalId } } }
//       : {}),
//   });

//   return res.data;
// }

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
