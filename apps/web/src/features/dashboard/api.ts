import { api } from '../../lib/api';

export type DashboardContact = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  email: string | null;
  company: string | null;
  role: string | null;
  status: string;
  lastContactedAt: string | null;
  tags: string[];
  createdAt: string;
};

export type FollowUpItem = {
  id: string;
  type: string;
  subject: string | null;
  nextFollowUpAt: string | null;
  occurredAt: string;
  contact: DashboardContact;
};

export async function fetchFollowUps() {
  const res = await api.get<FollowUpItem[]>('/dashboard/followups');
  return res.data;
}

export async function fetchRecent() {
  const res = await api.get<DashboardContact[]>('/dashboard/recent');
  return res.data;
}

export async function fetchNewContacts() {
  const res = await api.get<DashboardContact[]>('/dashboard/new');
  return res.data;
}
