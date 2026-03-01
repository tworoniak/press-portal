import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useContact, useCreateInteraction } from './detailQueries';
import { SelectField } from '../../components/SelectField/SelectField';
import { Timeline } from '../../components/ui/Timeline/Timeline';

import page from '../../components/ui/Page/Page.module.scss';
import card from '../../components/ui/Card/Card.module.scss';
import { TagRow } from '../../components/ui/Tag/TagRow';

type InteractionType = 'EMAIL' | 'CALL' | 'DM' | 'NOTE';

const INTERACTION_OPTIONS = [
  { value: 'EMAIL', label: 'Email' },
  { value: 'CALL', label: 'Call' },
  { value: 'DM', label: 'DM' },
  { value: 'NOTE', label: 'Note' },
] as const satisfies readonly { value: InteractionType; label: string }[];

// function fmt(dt: string) {
//   return new Date(dt).toLocaleString();
// }

export default function ContactDetailPage() {
  const { id = '' } = useParams();
  const { data, isLoading, isError } = useContact(id);
  const create = useCreateInteraction(id);
  const [outcome, setOutcome] = useState('');
  const [type, setType] = useState<InteractionType>('EMAIL');
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [nextFollowUpAt, setNextFollowUpAt] = useState<string>('');

  const title = useMemo(() => {
    if (!data) return '';
    return (
      data.displayName ||
      [data.firstName, data.lastName].filter(Boolean).join(' ') ||
      data.email ||
      '(no name)'
    );
  }, [data]);

  if (isLoading)
    return (
      <div className={page.page}>
        <div className={page.container}>Loading…</div>
      </div>
    );

  if (isError || !data)
    return (
      <div className={page.page}>
        <div className={page.container}>Not found.</div>
      </div>
    );

  return (
    <div className={page.page}>
      <div className={page.container}>
        <div className={page.headerRow}>
          <h1 className={page.title}>{title}</h1>
          <div className={page.nav}>
            <Link to='/contacts'>Contacts</Link>
            <Link to='/dashboard'>Dashboard</Link>
          </div>
        </div>

        <div className={page.subtle}>
          {data.company ? data.company : '—'}
          {data.role ? ` • ${data.role}` : ''}
          {data.email ? ` • ${data.email}` : ''}
        </div>

        <div style={{ height: 10 }} />

        <div className={card.card}>
          <div className={card.cardTitle}>Tags</div>
          <TagRow tags={data.tags ?? []} />
        </div>

        <div style={{ height: 14 }} />

        <div className={card.card}>
          <div className={card.cardTitle}>Log Interaction</div>

          <div
            style={{
              display: 'grid',
              gap: 10,
              maxWidth: 560,
            }}
          >
            <SelectField<InteractionType>
              label='Type'
              value={type}
              options={INTERACTION_OPTIONS}
              onChange={setType}
            />

            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.75 }}>Subject</span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.75 }}>Outcome</span>
              <input
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                placeholder='e.g. Requested promo, Confirmed coverage, No reply'
              />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.75 }}>Notes</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.75 }}>
                Next follow-up
              </span>
              <input
                type='datetime-local'
                value={nextFollowUpAt}
                onChange={(e) => setNextFollowUpAt(e.target.value)}
              />
            </label>

            <button
              onClick={() => {
                create.mutate({
                  contactId: id,
                  type,
                  subject: subject.trim() || undefined,
                  notes: notes.trim() || undefined,
                  outcome: outcome.trim() || undefined,
                  nextFollowUpAt: nextFollowUpAt
                    ? new Date(nextFollowUpAt).toISOString()
                    : undefined,
                });
                setSubject('');
                setNotes('');
                setNextFollowUpAt('');
                setOutcome('');
              }}
              disabled={create.isPending}
            >
              {create.isPending ? 'Saving…' : 'Save interaction'}
            </button>
          </div>
        </div>

        <div style={{ height: 14 }} />

        <Timeline items={data.interactions ?? []} />

        <div style={{ height: 10 }} />
        <div className={page.subtle}>
          <Link to='/contacts'>← Back to Contacts</Link>
        </div>
      </div>
    </div>
  );
}
