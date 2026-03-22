import { api } from '../../lib/api';

export type ContactFollowUp = {
  id: string;
  nextFollowUpAt: string | null;
};

export type Contact = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  role: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  location: string | null;
  timezone: string | null;
  notes: string | null;
  doNotContact: boolean;
  tags: string[];
  status: string;
  lastContactedAt: string | null;
  createdAt: string;
  updatedAt: string;
  interactions?: ContactFollowUp[];
};

export type CreateContactInput = Partial<
  Pick<
    Contact,
    | 'firstName'
    | 'lastName'
    | 'displayName'
    | 'role'
    | 'company'
    | 'email'
    | 'phone'
    | 'website'
    | 'location'
    | 'timezone'
    | 'notes'
    | 'doNotContact'
    | 'tags'
    | 'status'
  >
>;

export type UpdateContactInput = Partial<
  Pick<
    Contact,
    | 'firstName'
    | 'lastName'
    | 'displayName'
    | 'role'
    | 'company'
    | 'email'
    | 'phone'
    | 'website'
    | 'location'
    | 'timezone'
    | 'notes'
    | 'doNotContact'
    | 'tags'
    | 'status'
  >
>;

export type ContactFilters = {
  search?: string;
  status?: string;
  tag?: string;
  needsFollowUp?: boolean;
};

export async function fetchContacts(filters?: ContactFilters) {
  const res = await api.get<Contact[]>('/contacts', {
    params: {
      ...(filters?.search ? { search: filters.search } : {}),
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.tag ? { tag: filters.tag } : {}),
      ...(filters?.needsFollowUp ? { needsFollowUp: true } : {}),
    },
  });
  return res.data;
}

export async function createContact(input: CreateContactInput) {
  const res = await api.post<Contact>('/contacts', input);
  return res.data;
}

export async function updateContact(input: {
  id: string;
  data: UpdateContactInput;
}) {
  const res = await api.patch<Contact>(`/contacts/${input.id}`, input.data);
  return res.data;
}

export async function deleteContact(id: string) {
  const res = await api.delete<Contact>(`/contacts/${id}`);
  return res.data;
}
