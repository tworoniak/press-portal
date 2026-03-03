import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useContact, useCreateInteraction } from './detailQueries';
import { SelectField } from '../../components/SelectField/SelectField';
import { Timeline } from '../../components/ui/Timeline/Timeline';

import page from '../../components/ui/Page/Page.module.scss';
import card from '../../components/ui/Card/Card.module.scss';
import { TagRow } from '../../components/ui/Tag/TagRow';

import { useBands } from '../bands/queries';
import { useFestivals } from '../festivals/queries';

type InteractionType = 'EMAIL' | 'CALL' | 'DM' | 'NOTE';

const INTERACTION_OPTIONS = [
  { value: 'EMAIL', label: 'Email' },
  { value: 'CALL', label: 'Call' },
  { value: 'DM', label: 'DM' },
  { value: 'NOTE', label: 'Note' },
] as const satisfies readonly { value: InteractionType; label: string }[];

type NamedRef = { id: string; name: string };

export default function ContactDetailPage() {
  const { id = '' } = useParams();
  const { data, isLoading, isError } = useContact(id);
  const create = useCreateInteraction(id);

  const [outcome, setOutcome] = useState('');
  const [type, setType] = useState<InteractionType>('EMAIL');
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [nextFollowUpAt, setNextFollowUpAt] = useState<string>('');

  // ✅ band/festival search + selection
  const [bandSearch, setBandSearch] = useState('');
  const [festivalSearch, setFestivalSearch] = useState('');
  const [selectedBand, setSelectedBand] = useState<NamedRef | null>(null);
  const [selectedFestival, setSelectedFestival] = useState<NamedRef | null>(
    null,
  );

  const bandsQ = useBands(bandSearch, !selectedBand);
  const festivalsQ = useFestivals(festivalSearch, !selectedFestival);

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

          <div style={{ display: 'grid', gap: 10, maxWidth: 620 }}>
            <SelectField<InteractionType>
              label='Type'
              value={type}
              options={INTERACTION_OPTIONS}
              onChange={setType}
            />

            {/* Band search */}
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.75 }}>
                Band (optional)
              </span>

              {selectedBand ? (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ fontWeight: 600 }}>{selectedBand.name}</div>
                  <button
                    type='button'
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedBand(null);
                      setBandSearch('');
                    }}
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <>
                  <input
                    value={bandSearch}
                    onChange={(e) => setBandSearch(e.target.value)}
                    placeholder="Type 2+ chars (e.g. 'RWAKE')"
                  />

                  {bandSearch.trim().length >= 2 && (
                    <div
                      style={{
                        border: '1px solid rgba(0,0,0,0.12)',
                        borderRadius: 10,
                        padding: 8,
                      }}
                    >
                      {bandsQ.isLoading && (
                        <div style={{ opacity: 0.75 }}>Searching…</div>
                      )}
                      {bandsQ.isError && (
                        <div style={{ opacity: 0.75 }}>
                          Failed to load bands.
                        </div>
                      )}
                      {!bandsQ.isLoading && !bandsQ.isError && (
                        <>
                          {(bandsQ.data ?? []).slice(0, 8).map((b) => (
                            <button
                              key={b.id}
                              type='button'
                              onMouseDown={(e) => e.preventDefault()} // prevents input blur weirdness
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedBand({ id: b.id, name: b.name });
                                setBandSearch(b.name); // <-- keep it visible (optional)
                              }}
                              style={{
                                display: 'block',
                                width: '100%',
                                textAlign: 'left',
                                padding: '8px 10px',
                                borderRadius: 8,
                              }}
                            >
                              {b.name}
                              {b.genre ? (
                                <span style={{ opacity: 0.7 }}>
                                  {' '}
                                  • {b.genre}
                                </span>
                              ) : null}
                            </button>
                          ))}
                          {(bandsQ.data?.length ?? 0) === 0 && (
                            <div style={{ opacity: 0.75 }}>No matches yet.</div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </label>

            {/* Festival search */}
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.75 }}>
                Festival (optional)
              </span>

              {selectedFestival ? (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ fontWeight: 600 }}>{selectedFestival.name}</div>
                  <button
                    type='button'
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedFestival(null);
                      setFestivalSearch('');
                    }}
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <>
                  <input
                    value={festivalSearch}
                    onChange={(e) => setFestivalSearch(e.target.value)}
                    placeholder="Type 2+ chars (e.g. 'Maryland')"
                  />
                  {festivalSearch.trim().length >= 2 && (
                    <div
                      style={{
                        border: '1px solid rgba(0,0,0,0.12)',
                        borderRadius: 10,
                        padding: 8,
                      }}
                    >
                      {festivalsQ.isLoading && (
                        <div style={{ opacity: 0.75 }}>Searching…</div>
                      )}
                      {festivalsQ.isError && (
                        <div style={{ opacity: 0.75 }}>
                          Failed to load festivals.
                        </div>
                      )}
                      {!festivalsQ.isLoading && !festivalsQ.isError && (
                        <>
                          {(festivalsQ.data ?? []).slice(0, 8).map((f) => (
                            <button
                              key={f.id}
                              type='button'
                              onMouseDown={(e) => e.preventDefault()} // prevents input blur weirdness
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedFestival({
                                  id: f.id,
                                  name: f.name,
                                });
                                setFestivalSearch(f.name); // <-- keep it visible (optional)
                              }}
                              style={{
                                display: 'block',
                                width: '100%',
                                textAlign: 'left',
                                padding: '8px 10px',
                                borderRadius: 8,
                              }}
                            >
                              {f.name}
                              {f.location ? (
                                <span style={{ opacity: 0.7 }}>
                                  {' '}
                                  • {f.location}
                                </span>
                              ) : null}
                            </button>
                          ))}
                          {(festivalsQ.data?.length ?? 0) === 0 && (
                            <div style={{ opacity: 0.75 }}>No matches yet.</div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </label>

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
                  bandId: selectedBand?.id,
                  festivalId: selectedFestival?.id,
                });

                setSubject('');
                setNotes('');
                setNextFollowUpAt('');
                setOutcome('');
                setSelectedBand(null);
                setSelectedFestival(null);
                setBandSearch('');
                setFestivalSearch('');
              }}
              disabled={create.isPending}
            >
              {create.isPending ? 'Saving…' : 'Save interaction'}
            </button>
          </div>
        </div>

        <div style={{ height: 14 }} />

        {/* Timeline now shows chips if Timeline component supports it.
            If your Timeline just renders fields, we’ll update it next. */}
        <Timeline items={data.interactions ?? []} />

        <div style={{ height: 10 }} />
        <div className={page.subtle}>
          <Link to='/contacts'>← Back to Contacts</Link>
        </div>
      </div>
    </div>
  );
}
