// import { api } from '../../lib/api';

// export type DashboardContact = {
//   id: string;
//   firstName: string | null;
//   lastName: string | null;
//   displayName: string | null;
//   email: string | null;
//   company: string | null;
//   role: string | null;
//   status: string;
//   lastContactedAt: string | null;
//   tags: string[];
//   createdAt: string;
// };

// export type FollowUpItem = {
//   id: string;
//   type: string;
//   subject: string | null;
//   nextFollowUpAt: string | null;
//   occurredAt: string;
//   contact: DashboardContact;
// };

// export async function fetchFollowUps() {
//   const res = await api.get<FollowUpItem[]>('/dashboard/followups');
//   return res.data;
// }

// export async function fetchRecent() {
//   const res = await api.get<DashboardContact[]>('/dashboard/recent');
//   return res.data;
// }

// export async function fetchNewContacts() {
//   const res = await api.get<DashboardContact[]>('/dashboard/new');
//   return res.data;
// }

// export async function fetchDashboardOverview() {
//   const res = await api.get('/dashboard');
//   return res.data;
// }

import { api } from '../../lib/api';

export type DashboardOverview = {
  summary: {
    due: number;
    soon: number;
    scheduled: number;
    totalContacts: number;
    totalBands: number;
    totalFestivals: number;
  };
  pipeline: Array<{
    name: 'Due' | 'Soon' | 'Scheduled';
    value: number;
  }>;
  interactionsLast7Days: Array<{
    day: string;
    count: number;
  }>;
  followups: Array<{
    id: string;
    subject: string | null;
    nextFollowUpAt: string | null;
    contact: {
      id: string;
      displayName: string | null;
      firstName: string | null;
      lastName: string | null;
      email: string | null;
    };
  }>;
  recentContacts: Array<{
    id: string;
    displayName: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    company: string | null;
    lastContactedAt: string | null;
  }>;
  freshContacts: Array<{
    id: string;
    displayName: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    company: string | null;
    tags: string[];
  }>;
  recentInteractions: Array<{
    id: string;
    type: string;
    occurredAt: string;
    subject: string | null;
    contact: {
      id: string;
      displayName: string | null;
      firstName: string | null;
      lastName: string | null;
      email: string | null;
    };
    band: { id: string; name: string } | null;
    festival: { id: string; name: string } | null;
  }>;
  upcomingFestivals: Array<{
    id: string;
    name: string;
    location: string | null;
    startDate: string | null;
    endDate: string | null;
  }>;
};

export async function fetchDashboardOverview() {
  const res = await api.get<DashboardOverview>('/dashboard');
  return res.data;
}
