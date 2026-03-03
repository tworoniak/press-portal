import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { SelectField } from '../../components/SelectField/SelectField';
import { Timeline } from '../../components/ui/Timeline/Timeline';

import page from '../../components/ui/Page/Page.module.scss';
import card from '../../components/ui/Card/Card.module.scss';
import { TagRow } from '../../components/ui/Tag/TagRow';
import { Modal } from '../../components/ui/Modal/Modal';
import type { Interaction } from './detailApi';
import {
  useContact,
  useCreateInteraction,
  useUpdateInteraction,
  useDeleteInteraction,
  useAddContactBand,
  useRemoveContactBand,
} from './detailQueries';

import { useBands, useCreateBand } from '../bands/queries';
import { useFestivals, useCreateFestival } from '../festivals/queries';

type InteractionType = 'EMAIL' | 'CALL' | 'DM' | 'NOTE';

type NamedRef = { id: string; name: string };

const INTERACTION_OPTIONS = [
  { value: 'EMAIL', label: 'Email' },
  { value: 'CALL', label: 'Call' },
  { value: 'DM', label: 'DM' },
  { value: 'NOTE', label: 'Note' },
] as const satisfies readonly { value: InteractionType; label: string }[];

export default function ContactDetailPage() {
  const { id = '' } = useParams();
  const { data, isLoading, isError } = useContact(id);
  const create = useCreateInteraction(id);

  const [outcome, setOutcome] = useState('');
  const [type, setType] = useState<InteractionType>('EMAIL');
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [nextFollowUpAt, setNextFollowUpAt] = useState<string>('');

  const updateIt = useUpdateInteraction(id);
  const delIt = useDeleteInteraction(id);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Interaction | null>(null);

  const [editType, setEditType] = useState<InteractionType>('EMAIL');
  const [editSubject, setEditSubject] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editOutcome, setEditOutcome] = useState('');
  const [editNextFollowUpAt, setEditNextFollowUpAt] = useState('');
  // edit modal: band/festival search + selection
  const [editBandSearch, setEditBandSearch] = useState('');
  const [editFestivalSearch, setEditFestivalSearch] = useState('');
  const [editSelectedBand, setEditSelectedBand] = useState<NamedRef | null>(
    null,
  );
  const [editSelectedFestival, setEditSelectedFestival] =
    useState<NamedRef | null>(null);

  const editBandsQ = useBands(editBandSearch, !editSelectedBand);
  const editFestivalsQ = useFestivals(
    editFestivalSearch,
    !editSelectedFestival,
  );

  const addBand = useAddContactBand(id);
  const removeBand = useRemoveContactBand(id);

  const [repBandSearch, setRepBandSearch] = useState('');
  const [repSelectedBand, setRepSelectedBand] = useState<NamedRef | null>(null);

  const repBandsQ = useBands(repBandSearch, !repSelectedBand);

  const createBand = useCreateBand();
  const createFestival = useCreateFestival();

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

  function openEdit(it: Interaction) {
    setEditing(it);
    setEditType(it.type as InteractionType);
    setEditSubject(it.subject ?? '');
    setEditNotes(it.notes ?? '');
    setEditOutcome(it.outcome ?? '');
    setEditNextFollowUpAt(
      it.nextFollowUpAt ? it.nextFollowUpAt.slice(0, 16) : '',
    );

    // ✅ prefill selected band/festival (prefer included objects)
    setEditSelectedBand(
      it.band ? { id: it.band.id, name: it.band.name } : null,
    );
    setEditSelectedFestival(
      it.festival ? { id: it.festival.id, name: it.festival.name } : null,
    );

    // clear search fields
    setEditBandSearch('');
    setEditFestivalSearch('');

    setEditOpen(true);
  }

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

        {/* Represents Bands */}
        <div className={card.card}>
          <div className={card.cardTitle}>Represents bands</div>

          {/* existing associations */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(data.bands ?? []).length ? (
              data.bands.map((cb) => (
                <div
                  key={cb.band.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 10px',
                    border: '1px solid rgba(0,0,0,0.12)',
                    borderRadius: 999,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{cb.band.name}</span>
                  <button
                    type='button'
                    onClick={() => removeBand.mutate(cb.band.id)}
                    disabled={removeBand.isPending}
                    style={{ opacity: 0.8 }}
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <div style={{ opacity: 0.75 }}>No bands linked yet.</div>
            )}
          </div>

          <div style={{ height: 12 }} />

          {/* add association */}
          <label style={{ display: 'grid', gap: 6, maxWidth: 520 }}>
            <span style={{ fontSize: 12, opacity: 0.75 }}>Add band</span>

            {repSelectedBand ? (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ fontWeight: 600 }}>{repSelectedBand.name}</div>
                <button
                  type='button'
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.preventDefault();
                    setRepSelectedBand(null);
                    setRepBandSearch('');
                  }}
                >
                  Clear
                </button>

                <button
                  type='button'
                  disabled={addBand.isPending}
                  onClick={async () => {
                    await addBand.mutateAsync(repSelectedBand.id);
                    setRepSelectedBand(null);
                    setRepBandSearch('');
                  }}
                >
                  {addBand.isPending ? 'Adding…' : 'Add'}
                </button>
              </div>
            ) : (
              <>
                <input
                  value={repBandSearch}
                  onChange={(e) => setRepBandSearch(e.target.value)}
                  placeholder="Type 2+ chars (e.g. 'RWAKE')"
                />

                {repBandSearch.trim().length >= 2 ? (
                  <div
                    onMouseDown={(e) => e.preventDefault()}
                    style={{
                      border: '1px solid rgba(0,0,0,0.12)',
                      borderRadius: 10,
                      padding: 8,
                    }}
                  >
                    {repBandsQ.isLoading && (
                      <div style={{ opacity: 0.75 }}>Searching…</div>
                    )}
                    {repBandsQ.isError && (
                      <div style={{ opacity: 0.75 }}>Failed to load bands.</div>
                    )}

                    {!repBandsQ.isLoading && !repBandsQ.isError ? (
                      <>
                        {(repBandsQ.data ?? []).slice(0, 8).map((b) => (
                          <button
                            key={b.id}
                            type='button'
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setRepSelectedBand({ id: b.id, name: b.name });
                              setRepBandSearch('');
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
                          </button>
                        ))}

                        {(repBandsQ.data?.length ?? 0) === 0 ? (
                          <div style={{ display: 'grid', gap: 8 }}>
                            <div style={{ opacity: 0.75 }}>No matches.</div>
                            <button
                              type='button'
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                const name = repBandSearch.trim();
                                if (name.length < 2) return;

                                const created = await createBand.mutateAsync({
                                  name,
                                });
                                setRepSelectedBand({
                                  id: created.id,
                                  name: created.name,
                                });
                                setRepBandSearch('');
                              }}
                              disabled={createBand.isPending}
                              style={{ padding: '8px 10px', borderRadius: 8 }}
                            >
                              {createBand.isPending
                                ? 'Creating…'
                                : `Create "${repBandSearch.trim()}"`}
                            </button>
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                ) : null}
              </>
            )}
          </label>
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

              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  value={selectedBand ? selectedBand.name : bandSearch}
                  onChange={(e) => {
                    setSelectedBand(null);
                    setBandSearch(e.target.value);
                  }}
                  placeholder="Type 2+ chars (e.g. 'RWAKE')"
                  disabled={Boolean(selectedBand)}
                />

                {selectedBand ? (
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
                ) : null}
              </div>

              {/* Dropdown */}
              {!selectedBand && bandSearch.trim().length >= 2 ? (
                <div
                  onMouseDown={(e) => e.preventDefault()} // ✅ keeps input from blurring before click registers
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
                    <div style={{ opacity: 0.75 }}>Failed to load bands.</div>
                  )}

                  {!bandsQ.isLoading && !bandsQ.isError && (
                    <>
                      {(bandsQ.data ?? []).slice(0, 8).map((b) => (
                        <button
                          key={b.id}
                          type='button'
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedBand({ id: b.id, name: b.name });
                            setBandSearch(''); // optional now; input shows selectedBand.name
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
                            <span style={{ opacity: 0.7 }}> • {b.genre}</span>
                          ) : null}
                        </button>
                      ))}

                      {(bandsQ.data?.length ?? 0) === 0 ? (
                        <div style={{ display: 'grid', gap: 8 }}>
                          <div style={{ opacity: 0.75 }}>No matches.</div>
                          <button
                            type='button'
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              const name = bandSearch.trim();
                              if (name.length < 2) return;

                              const created = await createBand.mutateAsync({
                                name,
                              });
                              setSelectedBand({
                                id: created.id,
                                name: created.name,
                              });
                              setBandSearch('');
                            }}
                            disabled={createBand.isPending}
                            style={{ padding: '8px 10px', borderRadius: 8 }}
                          >
                            {createBand.isPending
                              ? 'Creating…'
                              : `Create "${bandSearch.trim()}"`}
                          </button>
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              ) : null}

              {/* tiny debug (optional) */}
              {/* <div style={{ fontSize: 12, opacity: 0.7 }}>selectedBandId: {selectedBand?.id ?? '(none)'}</div> */}
            </label>

            {/* Festival search */}
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.75 }}>
                Festival (optional)
              </span>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  value={
                    selectedFestival ? selectedFestival.name : festivalSearch
                  }
                  onChange={(e) => {
                    setSelectedFestival(null);
                    setFestivalSearch(e.target.value);
                  }}
                  placeholder="Type 2+ chars (e.g. 'Maryland')"
                  disabled={Boolean(selectedFestival)}
                />

                {selectedFestival ? (
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
                ) : null}
              </div>

              {!selectedFestival && festivalSearch.trim().length >= 2 ? (
                <div
                  onMouseDown={(e) => e.preventDefault()}
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
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedFestival({ id: f.id, name: f.name });
                            setFestivalSearch('');
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

                      {(festivalsQ.data?.length ?? 0) === 0 ? (
                        <div style={{ display: 'grid', gap: 8 }}>
                          <div style={{ opacity: 0.75 }}>No matches.</div>
                          <button
                            type='button'
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              const name = festivalSearch.trim();
                              if (name.length < 2) return;

                              const created = await createFestival.mutateAsync({
                                name,
                              });
                              setSelectedFestival({
                                id: created.id,
                                name: created.name,
                              });
                              setFestivalSearch('');
                            }}
                            disabled={createFestival.isPending}
                            style={{ padding: '8px 10px', borderRadius: 8 }}
                          >
                            {createFestival.isPending
                              ? 'Creating…'
                              : `Create "${festivalSearch.trim()}"`}
                          </button>
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              ) : null}
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

        {/* Edit Modal */}
        <Modal
          title='Edit interaction'
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setEditing(null);
          }}
        >
          {editing ? (
            <div style={{ display: 'grid', gap: 10, maxWidth: 560 }}>
              <SelectField<InteractionType>
                label='Type'
                value={editType}
                options={INTERACTION_OPTIONS}
                onChange={setEditType}
              />

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Band</span>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    value={
                      editSelectedBand ? editSelectedBand.name : editBandSearch
                    }
                    onChange={(e) => {
                      setEditSelectedBand(null);
                      setEditBandSearch(e.target.value);
                    }}
                    placeholder="Type 2+ chars (e.g. 'RWAKE')"
                    disabled={Boolean(editSelectedBand)}
                  />

                  {editSelectedBand ? (
                    <button
                      type='button'
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditSelectedBand(null);
                        setEditBandSearch('');
                      }}
                    >
                      Clear
                    </button>
                  ) : null}
                </div>

                {!editSelectedBand && editBandSearch.trim().length >= 2 ? (
                  <div
                    onMouseDown={(e) => e.preventDefault()}
                    style={{
                      border: '1px solid rgba(0,0,0,0.12)',
                      borderRadius: 10,
                      padding: 8,
                    }}
                  >
                    {editBandsQ.isLoading && (
                      <div style={{ opacity: 0.75 }}>Searching…</div>
                    )}
                    {editBandsQ.isError && (
                      <div style={{ opacity: 0.75 }}>Failed to load bands.</div>
                    )}
                    {!editBandsQ.isLoading && !editBandsQ.isError && (
                      <>
                        {(editBandsQ.data ?? []).slice(0, 8).map((b) => (
                          <button
                            key={b.id}
                            type='button'
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setEditSelectedBand({ id: b.id, name: b.name });
                              setEditBandSearch('');
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
                              <span style={{ opacity: 0.7 }}> • {b.genre}</span>
                            ) : null}
                          </button>
                        ))}
                        {(editBandsQ.data?.length ?? 0) === 0 ? (
                          <div style={{ display: 'grid', gap: 8 }}>
                            <div style={{ opacity: 0.75 }}>No matches.</div>
                            <button
                              type='button'
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                const name = editBandSearch.trim();
                                if (name.length < 2) return;

                                const created = await createBand.mutateAsync({
                                  name,
                                });

                                setEditSelectedBand({
                                  id: created.id,
                                  name: created.name,
                                });
                                setEditBandSearch('');
                              }}
                              disabled={createBand.isPending}
                              style={{ padding: '8px 10px', borderRadius: 8 }}
                            >
                              {createBand.isPending
                                ? 'Creating…'
                                : `Create "${editBandSearch.trim()}"`}
                            </button>
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                ) : null}
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Festival</span>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    value={
                      editSelectedFestival
                        ? editSelectedFestival.name
                        : editFestivalSearch
                    }
                    onChange={(e) => {
                      setEditSelectedFestival(null);
                      setEditFestivalSearch(e.target.value);
                    }}
                    placeholder="Type 2+ chars (e.g. 'Maryland')"
                    disabled={Boolean(editSelectedFestival)}
                  />

                  {editSelectedFestival ? (
                    <button
                      type='button'
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditSelectedFestival(null);
                        setEditFestivalSearch('');
                      }}
                    >
                      Clear
                    </button>
                  ) : null}
                </div>

                {!editSelectedFestival &&
                editFestivalSearch.trim().length >= 2 ? (
                  <div
                    onMouseDown={(e) => e.preventDefault()}
                    style={{
                      border: '1px solid rgba(0,0,0,0.12)',
                      borderRadius: 10,
                      padding: 8,
                    }}
                  >
                    {editFestivalsQ.isLoading && (
                      <div style={{ opacity: 0.75 }}>Searching…</div>
                    )}
                    {editFestivalsQ.isError && (
                      <div style={{ opacity: 0.75 }}>
                        Failed to load festivals.
                      </div>
                    )}
                    {!editFestivalsQ.isLoading && !editFestivalsQ.isError && (
                      <>
                        {(editFestivalsQ.data ?? []).slice(0, 8).map((f) => (
                          <button
                            key={f.id}
                            type='button'
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setEditSelectedFestival({
                                id: f.id,
                                name: f.name,
                              });
                              setEditFestivalSearch('');
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
                        {(editFestivalsQ.data?.length ?? 0) === 0 ? (
                          <div style={{ display: 'grid', gap: 8 }}>
                            <div style={{ opacity: 0.75 }}>No matches.</div>
                            <button
                              type='button'
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                const name = editFestivalSearch.trim();
                                if (name.length < 2) return;

                                const created =
                                  await createFestival.mutateAsync({ name });

                                setEditSelectedFestival({
                                  id: created.id,
                                  name: created.name,
                                });
                                setEditFestivalSearch('');
                              }}
                              disabled={createFestival.isPending}
                              style={{ padding: '8px 10px', borderRadius: 8 }}
                            >
                              {createFestival.isPending
                                ? 'Creating…'
                                : `Create "${editFestivalSearch.trim()}"`}
                            </button>
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                ) : null}
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Subject</span>
                <input
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Outcome</span>
                <input
                  value={editOutcome}
                  onChange={(e) => setEditOutcome(e.target.value)}
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Notes</span>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={4}
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>
                  Next follow-up
                </span>
                <input
                  type='datetime-local'
                  value={editNextFollowUpAt}
                  onChange={(e) => setEditNextFollowUpAt(e.target.value)}
                />
              </label>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type='button'
                  disabled={updateIt.isPending}
                  onClick={async () => {
                    await updateIt.mutateAsync({
                      id: editing.id,
                      data: {
                        type: editType,
                        subject: editSubject.trim() ? editSubject.trim() : null,
                        notes: editNotes.trim() ? editNotes.trim() : null,
                        outcome: editOutcome.trim() ? editOutcome.trim() : null,
                        nextFollowUpAt: editNextFollowUpAt
                          ? new Date(editNextFollowUpAt).toISOString()
                          : null,
                        bandId: editSelectedBand ? editSelectedBand.id : null,
                        festivalId: editSelectedFestival
                          ? editSelectedFestival.id
                          : null,
                      },
                    });

                    setEditOpen(false);
                    setEditing(null);
                  }}
                >
                  {updateIt.isPending ? 'Saving…' : 'Save'}
                </button>

                <button
                  type='button'
                  onClick={() => {
                    setEditOpen(false);
                    setEditing(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
        </Modal>

        <div style={{ height: 14 }} />

        <Timeline
          items={data.interactions ?? []}
          onEdit={(it) => openEdit(it as Interaction)}
          onDelete={async (interactionId) => {
            const ok = confirm('Delete this interaction?');
            if (!ok) return;
            await delIt.mutateAsync(interactionId);
          }}
        />

        <div style={{ height: 10 }} />
        <div className={page.subtle}>
          <Link to='/contacts'>← Back to Contacts</Link>
        </div>
      </div>
    </div>
  );
}
