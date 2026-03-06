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
    params: search?.trim() ? { search: search.trim() } : undefined,
  });
  return res.data;
}

export async function createBand(input: {
  name: string;
  genre?: string;
  country?: string;
  website?: string;
  spotifyUrl?: string;
  instagram?: string;
  notes?: string;
}) {
  const res = await api.post<Band>('/bands', input);
  return res.data;
}

export async function updateBand(input: {
  id: string;
  data: Partial<{
    name: string | null;
    genre: string | null;
    country: string | null;
    website: string | null;
    spotifyUrl: string | null;
    instagram: string | null;
    notes: string | null;
  }>;
}) {
  const res = await api.patch<Band>(`/bands/${input.id}`, input.data);
  return res.data;
}

export async function deleteBand(id: string) {
  const res = await api.delete<{ id: string }>(`/bands/${id}`);
  return res.data;
}
