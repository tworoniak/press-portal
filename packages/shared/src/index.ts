// Shared types for press-portal API responses.
// Import these in both apps/api (return types) and apps/web (query types)
// instead of redeclaring them inline.

export type InteractionType = 'EMAIL' | 'CALL' | 'TEXT' | 'DM' | 'MEETING' | 'NOTE';

export type OutreachStatus =
  | 'NOT_CONTACTED'
  | 'CONTACTED'
  | 'RESPONDED'
  | 'CONFIRMED'
  | 'PUBLISHED'
  | 'ARCHIVED';

export type UserRole = 'ADMIN' | 'USER';

export type ContactSummary = {
  id: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  company: string | null;
  role: string | null;
  status: OutreachStatus;
  tags: string[];
  lastContactedAt: string | null;
};

export type BandSummary = {
  id: string;
  name: string;
  genre: string | null;
  country: string | null;
  website: string | null;
  spotifyUrl: string | null;
  instagram: string | null;
  notes: string | null;
};

export type FestivalSummary = {
  id: string;
  name: string;
  location: string | null;
  website: string | null;
  instagram: string | null;
  startDate: string | null;
  endDate: string | null;
  credentialInfo: string | null;
  notes: string | null;
};

export type InteractionSummary = {
  id: string;
  type: InteractionType;
  occurredAt: string;
  subject: string | null;
  notes: string | null;
  outcome: string | null;
  nextFollowUpAt: string | null;
  contactId: string;
  bandId: string | null;
  festivalId: string | null;
};

export type DashboardSummary = {
  due: number;
  soon: number;
  scheduled: number;
  totalContacts: number;
  totalBands: number;
  totalFestivals: number;
};
