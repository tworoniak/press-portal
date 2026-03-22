import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import styles from '../../components/ui/EntityDetailLayout/EntityDetailPage.module.scss';
import page from '../../components/ui/Page/Page.module.scss';
import card from '../../components/ui/Card/Card.module.scss';
import Button from '../../components/ui/Button/Button';
import { Chip } from '../../components/ui/Chip/Chip';
import Avatar from '../../components/ui/Avatar/Avatar';
import {
  Timeline,
  type TimelineItem,
} from '../../components/ui/Timeline/Timeline';
import { X, Globe, Instagram } from 'lucide-react';

import {
  useFestival,
  useAddFestivalContact,
  useRemoveFestivalContact,
} from './detailQueries';
import type { FestivalInteraction } from './detailApi';
import { useContactSearch } from '../contacts/searchQueries';

type NamedRef = { id: string; label: string };

function contactLabel(c: {
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}) {
  return (
    c.displayName ||
    [c.firstName, c.lastName].filter(Boolean).join(' ') ||
    c.email ||
    '(no name)'
  );
}

function fmtDate(dt: string | null) {
  if (!dt) return null;
  return new Date(dt).toLocaleDateString();
}

function festivalInteractionsToTimeline(
  items: FestivalInteraction[],
): TimelineItem[] {
  return items.map((it) => ({
    id: it.id,
    type: it.type,
    occurredAt: it.occurredAt,
    subject: it.subject,
    notes: it.notes,
    outcome: it.outcome,
    nextFollowUpAt: it.nextFollowUpAt,
    band: it.band,
    contact: {
      id: it.contact.id,
      name: contactLabel(it.contact),
    },
  }));
}

function DetailRow({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailValue}>
        {icon}
        <span>{children}</span>
      </span>
    </div>
  );
}

export default function FestivalDetailPage() {
  const { id = '' } = useParams();

  const festQ = useFestival(id);
  const add = useAddFestivalContact(id);
  const remove = useRemoveFestivalContact(id);

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<NamedRef | null>(null);
  const [relationshipRole, setRelationshipRole] = useState('');
  const [relationshipNotes, setRelationshipNotes] = useState('');

  const searchQ = useContactSearch(search, !selected);

  const title = useMemo(() => festQ.data?.name ?? 'Festival', [festQ.data]);

  const timelineItems = useMemo(
    () =>
      festQ.data?.interactions?.length
        ? festivalInteractionsToTimeline(festQ.data.interactions)
        : [],
    [festQ.data?.interactions],
  );

  const dateSummary = useMemo(() => {
    const f = festQ.data;
    if (!f) return null;
    const start = fmtDate(f.startDate);
    const end = fmtDate(f.endDate);
    if (!start && !end) return null;
    if (start && end) return `${start} – ${end}`;
    return start ?? end;
  }, [festQ.data]);

  if (festQ.isLoading) {
    return (
      <div className={page.page}>
        <div className={page.container}>Loading…</div>
      </div>
    );
  }

  if (festQ.isError || !festQ.data) {
    return (
      <div className={page.page}>
        <div className={page.container}>Not found.</div>
      </div>
    );
  }

  const fest = festQ.data;

  return (
    <div className={page.page}>
      <div className={page.container}>
        <div className={page.headerRow}>
          <h1 className={page.title}>{title}</h1>
        </div>

        <div className={styles.pageGrid}>
          <div className={styles.sidebar}>
            <div className={styles.profileCard}>
              <div className={styles.profileTop}>
                <Avatar name={fest.name} size='xl' />
                <div className={styles.profileText}>
                  <div className={styles.profileName}>{fest.name}</div>
                  <div className={styles.profileMeta}>
                    {[dateSummary, fest.location].filter(Boolean).join(' · ') ||
                      '—'}
                  </div>
                </div>
              </div>

              <div className={styles.profileDetails}>
                {fest.website ? (
                  <DetailRow icon={<Globe size={14} />}>
                    <a href={fest.website} target='_blank' rel='noreferrer'>
                      {fest.website}
                    </a>
                  </DetailRow>
                ) : null}

                {fest.instagram ? (
                  <DetailRow icon={<Instagram size={14} />}>
                    <a href={fest.instagram} target='_blank' rel='noreferrer'>
                      {fest.instagram}
                    </a>
                  </DetailRow>
                ) : null}
              </div>
            </div>

            {fest.credentialInfo ? (
              <div className={card.card}>
                <div className={card.cardTitle}>Credential info</div>
                <div style={{ whiteSpace: 'pre-wrap', opacity: 0.9 }}>
                  {fest.credentialInfo}
                </div>
              </div>
            ) : null}

            {fest.notes ? (
              <div className={card.card}>
                <div className={card.cardTitle}>Notes</div>
                <div style={{ whiteSpace: 'pre-wrap', opacity: 0.9 }}>
                  {fest.notes}
                </div>
              </div>
            ) : null}

            <div className={card.card}>
              <div className={card.cardTitle}>Press contacts</div>

              <div className={styles.chipRow}>
                {fest.contacts?.length ? (
                  fest.contacts.map((link) => (
                    <Chip key={link.contactId} tone='default'>
                      <Link
                        to={`/contacts/${link.contactId}`}
                        style={{
                          fontWeight: 600,
                          fontSize: 12,
                          textDecoration: 'none',
                        }}
                      >
                        {contactLabel(link.contact)}
                      </Link>

                      <Button
                        variant='no-outline'
                        color='neutral'
                        size='sm'
                        shape='round'
                        onClick={() => remove.mutate(link.contactId)}
                        disabled={remove.isPending}
                      >
                        <X size={14} />
                      </Button>
                    </Chip>
                  ))
                ) : (
                  <div style={{ opacity: 0.75 }}>No contacts linked yet.</div>
                )}
              </div>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Add contact</span>

                {selected ? (
                  <div style={{ display: 'grid', gap: 10 }}>
                    <div
                      style={{ display: 'flex', gap: 10, alignItems: 'center' }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 12 }}>
                        {selected.label}
                      </div>
                      <Button
                        variant='contained'
                        color='primary'
                        size='lg'
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSelected(null);
                          setSearch('');
                        }}
                      >
                        Clear
                      </Button>
                    </div>

                    <input
                      value={relationshipRole}
                      onChange={(e) => setRelationshipRole(e.target.value)}
                      placeholder='Relationship role (optional) e.g. Talent buyer / Press / Promoter'
                    />

                    <textarea
                      value={relationshipNotes}
                      onChange={(e) => setRelationshipNotes(e.target.value)}
                      rows={3}
                      placeholder='Relationship notes (optional)'
                    />

                    <Button
                      variant='contained'
                      color='primary'
                      size='xl'
                      disabled={add.isPending}
                      onClick={async () => {
                        await add.mutateAsync({
                          contactId: selected.id,
                          relationshipRole: relationshipRole.trim() || undefined,
                          relationshipNotes:
                            relationshipNotes.trim() || undefined,
                        });

                        setSelected(null);
                        setSearch('');
                        setRelationshipRole('');
                        setRelationshipNotes('');
                      }}
                    >
                      {add.isPending ? 'Adding…' : 'Add'}
                    </Button>
                  </div>
                ) : (
                  <>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder='Type 2+ chars (name/email/company)…'
                    />

                    {search.trim().length >= 2 ? (
                      <div
                        onMouseDown={(e) => e.preventDefault()}
                        style={{
                          border: '1px solid rgba(0,0,0,0.12)',
                          borderRadius: 10,
                          padding: 8,
                        }}
                      >
                        {searchQ.isLoading && (
                          <div style={{ opacity: 0.75 }}>Searching…</div>
                        )}
                        {searchQ.isError && (
                          <div style={{ opacity: 0.75 }}>
                            Failed to load contacts.
                          </div>
                        )}

                        {!searchQ.isLoading && !searchQ.isError && (
                          <>
                            {(searchQ.data ?? []).slice(0, 8).map((c) => (
                              <Button
                                variant='contained'
                                color='primary'
                                size='xl'
                                key={c.id}
                                type='button'
                                style={{
                                  width: '100%',
                                  marginBottom: '8px',
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSelected({
                                    id: c.id,
                                    label: contactLabel(c),
                                  });
                                  setSearch('');
                                }}
                              >
                                {contactLabel(c)}
                                {c.company ? (
                                  <span style={{ opacity: 0.7 }}>
                                    {' '}
                                    • {c.company}
                                  </span>
                                ) : null}
                              </Button>
                            ))}

                            {(searchQ.data?.length ?? 0) === 0 ? (
                              <div style={{ opacity: 0.75 }}>No matches.</div>
                            ) : null}
                          </>
                        )}
                      </div>
                    ) : null}
                  </>
                )}
              </label>
            </div>
          </div>

          <div className={styles.main}>
            <div className={card.card}>
              <div className={styles.sectionHeader}>
                <div>
                  <div className={card.cardTitle}>Interactions</div>
                  <div className={page.subtle}>
                    Log new entries from a contact’s page
                  </div>
                </div>
              </div>
            </div>

            <Timeline items={timelineItems} />

            <div style={{ height: 10 }} />
            <div className={page.subtle}>
              <Link to='/festivals'>← Back to Festivals</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
