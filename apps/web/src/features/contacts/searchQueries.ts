import { useQuery } from '@tanstack/react-query';
import { searchContacts } from './searchApi';

export function useContactSearch(search: string, enabled = true) {
  return useQuery({
    queryKey: ['contactSearch', { search }],
    queryFn: () => searchContacts(search),
    enabled: enabled && search.trim().length >= 2,
    staleTime: 30_000,
  });
}
