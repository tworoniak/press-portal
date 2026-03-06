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
  const res = await api.get('/bands', {
    params: search ? { search } : undefined,
  });

  return res.data;
}

export async function createBand(input: {
  name: string;
  genre?: string;
  country?: string;
  website?: string;
}) {
  const res = await api.post('/bands', input);
  return res.data;
}
