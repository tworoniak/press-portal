import { api } from '../../lib/api';

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
  timezone: string | null;
  notes: string | null;
  doNotContact: boolean;
  tags: string[];
  status: string;
  lastContactedAt: string | null;
  createdAt: string;
  updatedAt: string;
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
    | 'timezone'
    | 'notes'
    | 'doNotContact'
    | 'tags'
    | 'status'
  >
>;

export async function fetchContacts() {
  const res = await api.get<Contact[]>('/contacts');
  return res.data;
}

export async function createContact(input: CreateContactInput) {
  const res = await api.post<Contact>('/contacts', input);
  return res.data;
}
