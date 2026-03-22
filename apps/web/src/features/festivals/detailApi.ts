import { api } from '../../lib/api';

// export type FestivalContactRef = {
//   contact: {
//     id: string;
//     displayName: string | null;
//     firstName: string | null;
//     lastName: string | null;
//     email: string | null;
//     company: string | null;
//     role: string | null;
//   };
// };

type FestivalContactLink = {
  contactId: string;
  festivalId: string;
  relationshipRole: string | null;
  relationshipNotes: string | null;
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

export type FestivalInteractionContact = {
  id: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  company: string | null;
  role: string | null;
};

export type FestivalInteraction = {
  id: string;
  type: string;
  occurredAt: string;
  subject: string | null;
  notes: string | null;
  outcome: string | null;
  nextFollowUpAt: string | null;
  contact: FestivalInteractionContact;
  band: { id: string; name: string } | null;
};

export type FestivalDetail = {
  id: string;
  name: string;
  location: string | null;
  website: string | null;
  instagram: string | null;
  startDate: string | null;
  endDate: string | null;
  credentialInfo: string | null;
  notes: string | null;
  contacts: FestivalContactLink[];
  interactions: FestivalInteraction[];
};

export async function fetchFestival(id: string) {
  const res = await api.get<FestivalDetail>(`/festivals/${id}`);
  return res.data;
}

export async function addFestivalContact(input: {
  festivalId: string;
  contactId: string;
  relationshipRole?: string;
  relationshipNotes?: string;
}) {
  const res = await api.post(`/festivals/${input.festivalId}/contacts`, {
    contactId: input.contactId,
    relationshipRole: input.relationshipRole,
    relationshipNotes: input.relationshipNotes,
  });
  return res.data;
}

export async function removeFestivalContact(input: {
  festivalId: string;
  contactId: string;
}) {
  const res = await api.delete(
    `/festivals/${input.festivalId}/contacts/${input.contactId}`,
  );
  return res.data;
}
