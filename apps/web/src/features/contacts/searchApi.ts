import { api } from '../../lib/api';
import type { Contact } from './api';

export async function searchContacts(q: string) {
  const res = await api.get<Contact[]>('/contacts', { params: { search: q } });
  return res.data;
}
