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
import { X, Globe, Instagram, Music2 } from 'lucide-react';

import {
  useBand,
  useAddBandContact,
  useRemoveBandContact,
  type BandInteraction,
} from './detailQueries';
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

function bandInteractionsToTimeline(items: BandInteraction[]): TimelineItem[] {
  return items.map((it) => ({
    id: it.id,
    type: it.type,
    occurredAt: it.occurredAt,
    subject: it.subject,
    notes: it.notes,
    outcome: it.outcome,
    nextFollowUpAt: it.nextFollowUpAt,
    festival: it.festival,
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

export default function BandDetailPage() {
  const { id = '' } = useParams();
  const bandQ = useBand(id);

  const add = useAddBandContact(id);
  const remove = useRemoveBandContact(id);

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<NamedRef | null>(null);
  const [relationshipRole, setRelationshipRole] = useState('');
  const [relationshipNotes, setRelationshipNotes] = useState('');

  const searchQ = useContactSearch(search, !selected);

  const title = useMemo(() => bandQ.data?.name ?? 'Band', [bandQ.data]);

  const timelineItems = useMemo(
    () =>
      bandQ.data?.interactions?.length
        ? bandInteractionsToTimeline(bandQ.data.interactions)
        : [],
    [bandQ.data?.interactions],
  );

  if (bandQ.isLoading)
    return (
      <div className={page.page}>
        <div className={page.container}>Loading…</div>
      </div>
    );
  if (bandQ.isError || !bandQ.data)
    return (
      <div className={page.page}>
        <div className={page.container}>Not found.</div>
      </div>
    );

  const band = bandQ.data;

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
                <Avatar name={band.name} size='xl' />
                <div className={styles.profileText}>
                  <div className={styles.profileName}>{band.name}</div>
                  <div className={styles.profileMeta}>
                    {[band.genre, band.country].filter(Boolean).join(' · ') ||
                      '—'}
                  </div>
                </div>
              </div>

              <div className={styles.profileDetails}>
                {band.website ? (
                  <DetailRow icon={<Globe size={14} />}>
                    <a href={band.website} target='_blank' rel='noreferrer'>
                      {band.website}
                    </a>
                  </DetailRow>
                ) : null}

                {band.instagram ? (
                  <DetailRow icon={<Instagram size={14} />}>
                    <a href={band.instagram} target='_blank' rel='noreferrer'>
                      {band.instagram}
                    </a>
                  </DetailRow>
                ) : null}

                {band.spotifyUrl ? (
                  <DetailRow icon={<Music2 size={14} />}>
                    <a href={band.spotifyUrl} target='_blank' rel='noreferrer'>
                      Spotify
                    </a>
                  </DetailRow>
                ) : null}
              </div>
            </div>

            {band.notes ? (
              <div className={card.card}>
                <div className={card.cardTitle}>Notes</div>
                <div style={{ whiteSpace: 'pre-wrap', opacity: 0.9 }}>
                  {band.notes}
                </div>
              </div>
            ) : null}

            <div className={card.card}>
              <div className={card.cardTitle}>Press contacts</div>

              <div className={styles.chipRow}>
                {band.contacts?.length ? (
                  band.contacts.map((link) => (
                    <Chip key={link.contactId} tone='default'>
                      <Link
                        to={`/contacts/${link.contactId}`}
                        style={{ fontWeight: 600, textDecoration: 'none' }}
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
                        title='Remove'
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
                      placeholder='Relationship role (optional) e.g. Publicist / Label'
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
                                key={c.id}
                                variant='contained'
                                color='primary'
                                size='xl'
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
              <Link to='/bands'>← Back to Bands</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
