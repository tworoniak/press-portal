import { api } from '../../lib/api';

export type Band = {
  id: string;
  name: string;
  genre: string | null;
  country: string | null;
  website: string | null;
  spotifyUrl: string | null;
  instagram: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function fetchBands(search?: string) {
  const res = await api.get<Band[]>('/bands', {
    params: search?.trim() ? { search: search.trim() } : {},
  });
  return res.data;
}
