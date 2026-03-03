import { api } from '../../lib/api';
import type { Contact } from '../contacts/api';

export type BandContactLink = {
  contactId: string;
  bandId: string;
  relationshipRole: string | null;
  relationshipNotes: string | null;
  createdAt: string;
  contact: Contact;
};

export type BandDetail = {
  id: string;
  name: string;
  genre: string | null;
  country: string | null;
  website: string | null;
  instagram: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  contacts: BandContactLink[];
};

export async function fetchBand(id: string) {
  const res = await api.get<BandDetail>(`/bands/${id}`);
  return res.data;
}

export async function addBandContact(input: {
  bandId: string;
  contactId: string;
  relationshipRole?: string;
  relationshipNotes?: string;
}) {
  const res = await api.post(`/bands/${input.bandId}/contacts`, {
    contactId: input.contactId,
    relationshipRole: input.relationshipRole,
    relationshipNotes: input.relationshipNotes,
  });
  return res.data;
}

export async function removeBandContact(input: {
  bandId: string;
  contactId: string;
}) {
  const res = await api.delete(
    `/bands/${input.bandId}/contacts/${input.contactId}`,
  );
  return res.data;
}
