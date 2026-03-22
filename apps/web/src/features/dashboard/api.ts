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

export type FollowUpQueueItem = {
  id: string;
  type: string;
  occurredAt: string;
  subject: string | null;
  notes: string | null;
  outcome: string | null;
  nextFollowUpAt: string;
  contact: {
    id: string;
    displayName: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    company: string | null;
    role: string | null;
  };
  band: { id: string; name: string } | null;
  festival: { id: string; name: string } | null;
};

export async function fetchFollowUpQueue(limit = 100) {
  const res = await api.get<FollowUpQueueItem[]>('/dashboard/follow-up-queue', {
    params: { limit },
  });
  return res.data;
}
