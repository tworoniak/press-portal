// import { useQuery } from '@tanstack/react-query';
// import {
//   fetchFollowUps,
//   fetchNewContacts,
//   fetchRecent,
//   fetchDashboardOverview,
// } from './api';

// export function useDashboard() {
//   const followups = useQuery({
//     queryKey: ['dashboard', 'followups'],
//     queryFn: fetchFollowUps,
//   });

//   const recent = useQuery({
//     queryKey: ['dashboard', 'recent'],
//     queryFn: fetchRecent,
//   });

//   const fresh = useQuery({
//     queryKey: ['dashboard', 'new'],
//     queryFn: fetchNewContacts,
//   });

//   return { followups, recent, fresh };
// }

// export function useDashboardOverview() {
//   return useQuery({
//     queryKey: ['dashboard', 'overview'],
//     queryFn: fetchDashboardOverview,
//     staleTime: 30_000,
//   });
// }

import { useQuery } from '@tanstack/react-query';
import { fetchDashboardOverview } from './api';

export function useDashboardOverview() {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: fetchDashboardOverview,
    staleTime: 30_000,
  });
}
