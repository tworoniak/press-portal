import { useQuery } from '@tanstack/react-query';
import { fetchFollowUps, fetchNewContacts, fetchRecent } from './api';

export function useDashboard() {
  const followups = useQuery({
    queryKey: ['dashboard', 'followups'],
    queryFn: fetchFollowUps,
  });

  const recent = useQuery({
    queryKey: ['dashboard', 'recent'],
    queryFn: fetchRecent,
  });

  const fresh = useQuery({
    queryKey: ['dashboard', 'new'],
    queryFn: fetchNewContacts,
  });

  return { followups, recent, fresh };
}
