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
    params: search?.trim() ? { search: search.trim() } : undefined,
  });
  return res.data;
}

export async function createFestival(input: {
  name: string;
  location?: string;
  website?: string;
  instagram?: string;
  startDate?: string;
  endDate?: string;
  credentialInfo?: string;
  notes?: string;
}) {
  const res = await api.post<Festival>('/festivals', input);
  return res.data;
}

export async function updateFestival(input: {
  id: string;
  data: Partial<{
    name: string | null;
    location: string | null;
    website: string | null;
    instagram: string | null;
    startDate: string | null;
    endDate: string | null;
    credentialInfo: string | null;
    notes: string | null;
  }>;
}) {
  const res = await api.patch<Festival>(`/festivals/${input.id}`, input.data);
  return res.data;
}

export async function deleteFestival(id: string) {
  const res = await api.delete<{ id: string }>(`/festivals/${id}`);
  return res.data;
}
