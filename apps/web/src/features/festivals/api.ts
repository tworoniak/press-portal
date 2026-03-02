import { api } from '../../lib/api';

export type Festival = {
  id: string;
  name: string;
  location: string | null;
  website: string | null;
  instagram: string | null;
  startDate: string | null;
  endDate: string | null;
  credentialInfo: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function fetchFestivals(search?: string) {
  const res = await api.get<Festival[]>('/festivals', {
    params: search?.trim() ? { search: search.trim() } : {},
  });
  return res.data;
}
