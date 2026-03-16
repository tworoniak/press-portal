import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import styles from './ContactDetailPage.module.scss';
import page from '../../components/ui/Page/Page.module.scss';
import card from '../../components/ui/Card/Card.module.scss';

import { SelectField } from '../../components/ui/SelectField/SelectField';
import { Timeline } from '../../components/ui/Timeline/Timeline';
import { TagRow } from '../../components/ui/Tag/TagRow';
import { Modal } from '../../components/ui/Modal/Modal';
import { SearchPicker } from '../../components/ui/SearchPicker/SearchPicker';
import { Chip } from '../../components/ui/Chip/Chip';
import Button from '../../components/ui/Button/Button';
import Avatar from '../../components/ui/Avatar/Avatar';

import type { Interaction } from './detailApi';
import {
  useContact,
  useCreateInteraction,
  useUpdateInteraction,
  useDeleteInteraction,
  useAddContactBand,
  useRemoveContactBand,
  useAddContactFestival,
  useRemoveContactFestival,
} from './detailQueries';

import { useBands, useCreateBand } from '../bands/queries';
import { useFestivals, useCreateFestival } from '../festivals/queries';
import { X, Mail } from 'lucide-react';

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

  const updateIt = useUpdateInteraction(id);
  const delIt = useDeleteInteraction(id);

  const createBand = useCreateBand();
  const createFestival = useCreateFestival();

  const [createOpen, setCreateOpen] = useState(false);
  // ---- create interaction form state
  const [outcome, setOutcome] = useState('');
  const [type, setType] = useState<InteractionType>('EMAIL');
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [nextFollowUpAt, setNextFollowUpAt] = useState<string>('');

  // create interaction: band/festival picker
  const [bandSearch, setBandSearch] = useState('');
  const [festivalSearch, setFestivalSearch] = useState('');
  const [selectedBand, setSelectedBand] = useState<NamedRef | null>(null);
  const [selectedFestival, setSelectedFestival] = useState<NamedRef | null>(
    null,
  );

  const addFestival = useAddContactFestival(id);
  const removeFestival = useRemoveContactFestival(id);

  const [repFestivalSearch, setRepFestivalSearch] = useState('');
  const [repSelectedFestival, setRepSelectedFestival] =
    useState<NamedRef | null>(null);

  const repFestivalsQ = useFestivals(repFestivalSearch, !repSelectedFestival);

  const bandsQ = useBands(bandSearch, !selectedBand);
  const festivalsQ = useFestivals(festivalSearch, !selectedFestival);

  // ---- edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Interaction | null>(null);

  const [editType, setEditType] = useState<InteractionType>('EMAIL');
  const [editSubject, setEditSubject] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editOutcome, setEditOutcome] = useState('');
  const [editNextFollowUpAt, setEditNextFollowUpAt] = useState('');

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

  // ---- contact ↔ band associations
  const addBand = useAddContactBand(id);
  const removeBand = useRemoveContactBand(id);

  const [repBandSearch, setRepBandSearch] = useState('');
  const [repSelectedBand, setRepSelectedBand] = useState<NamedRef | null>(null);
  const repBandsQ = useBands(repBandSearch, !repSelectedBand);

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

    setEditSelectedBand(
      it.band ? { id: it.band.id, name: it.band.name } : null,
    );
    setEditSelectedFestival(
      it.festival ? { id: it.festival.id, name: it.festival.name } : null,
    );

    setEditBandSearch('');
    setEditFestivalSearch('');

    setEditOpen(true);
  }

  function fullName() {
    return (
      data?.displayName ||
      [data?.firstName, data?.lastName].filter(Boolean).join(' ') ||
      data?.email ||
      '(no name)'
    );
  }

  // function initialsOf(name: string) {
  //   return name
  //     .split(' ')
  //     .filter(Boolean)
  //     .slice(0, 2)
  //     .map((part) => part[0]?.toUpperCase() ?? '')
  //     .join('');
  // }

  function fmtDate(dt?: string | null) {
    if (!dt) return '—';
    return new Date(dt).toLocaleString();
  }

  function resetCreateInteractionForm() {
    setType('EMAIL');
    setSubject('');
    setNotes('');
    setOutcome('');
    setNextFollowUpAt('');
    setSelectedBand(null);
    setSelectedFestival(null);
    setBandSearch('');
    setFestivalSearch('');
  }

  async function handleCreateInteraction() {
    await create.mutateAsync({
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

    resetCreateInteractionForm();
    setCreateOpen(false);
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
        </div>

        {/* START Page Grid */}
        <div className={styles.pageGrid}>
          {/* START Sidebar */}
          <div className={styles.sidebar}>
            {/* Profile Card */}
            <div className={styles.profileCard}>
              <div className={styles.profileTop}>
                {/* Avatar */}
                <Avatar name={fullName()} size='xl' />

                <div className={styles.profileText}>
                  <div className={styles.profileName}>{fullName()}</div>

                  <div className={styles.profileMeta}>
                    {data.role ? data.role : '—'}
                    {data.company ? ` • ${data.company}` : ''}
                  </div>
                </div>
              </div>

              <div className={styles.profileDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Email</span>
                  <span className={styles.detailValue}>
                    <Mail size={14} />
                    {data.email ? (
                      <a href={`mailto:${data.email}`}>{data.email}</a>
                    ) : (
                      '—'
                    )}
                  </span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Status</span>
                  <span className={styles.detailValue}>
                    {data.status ?? '—'}
                  </span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Last contacted</span>
                  <span className={styles.detailValue}>
                    {data.lastContactedAt ? fmtDate(data.lastContactedAt) : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Card */}

            {/* Tags Card */}
            <div className={card.card}>
              <div className={card.cardTitle}>Tags</div>
              <TagRow tags={data.tags ?? []} />
            </div>

            {/* Represents Bands */}
            <div className={card.card}>
              <div className={card.cardTitle}>Represents bands</div>

              <div className={styles.chipRow}>
                {(data.bands ?? []).length ? (
                  data.bands.map((cb) => (
                    <Chip key={cb.band.id} tone='default'>
                      <Link
                        to={`/bands/${cb.band.id}`}
                        style={{
                          fontWeight: 600,
                          textDecoration: 'none',
                          color: 'inherit',
                        }}
                      >
                        {cb.band.name}
                      </Link>

                      <Button
                        variant='no-outline'
                        color='neutral'
                        size='sm'
                        shape='round'
                        onClick={(e) => {
                          e.stopPropagation(); // defensive
                          removeBand.mutate(cb.band.id);
                        }}
                      >
                        <X size={14} />
                      </Button>
                    </Chip>
                  ))
                ) : (
                  <div style={{ opacity: 0.75 }}>No bands linked yet.</div>
                )}
              </div>

              <label style={{ display: 'grid', gap: 6, maxWidth: 520 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Add band</span>

                {repSelectedBand ? (
                  <div
                    style={{ display: 'flex', gap: 10, alignItems: 'center' }}
                  >
                    <div style={{ fontWeight: 600 }}>
                      {repSelectedBand.name}
                    </div>

                    <Button
                      variant='contained'
                      color='neutral'
                      size='lg'
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.preventDefault();
                        setRepSelectedBand(null);
                        setRepBandSearch('');
                      }}
                    >
                      Clear
                    </Button>

                    <Button
                      variant='contained'
                      color='primary'
                      size='lg'
                      disabled={addBand.isPending}
                      onClick={async () => {
                        await addBand.mutateAsync(repSelectedBand.id);
                        setRepSelectedBand(null);
                        setRepBandSearch('');
                      }}
                    >
                      {addBand.isPending ? 'Adding…' : 'Add'}
                    </Button>
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
                          <div style={{ opacity: 0.75 }}>
                            Failed to load bands.
                          </div>
                        )}

                        {!repBandsQ.isLoading && !repBandsQ.isError ? (
                          <>
                            {(repBandsQ.data ?? []).slice(0, 8).map((b) => (
                              <Button
                                key={b.id}
                                variant='contained'
                                color='primary'
                                size='lg'
                                style={{
                                  // display: 'block',
                                  width: '100%',
                                  marginBottom: '8px',
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setRepSelectedBand({
                                    id: b.id,
                                    name: b.name,
                                  });
                                  setRepBandSearch('');
                                }}
                              >
                                {b.name}
                              </Button>
                            ))}

                            {(repBandsQ.data?.length ?? 0) === 0 ? (
                              <div style={{ display: 'grid', gap: 8 }}>
                                <div style={{ opacity: 0.75 }}>No matches.</div>

                                <Button
                                  variant='contained'
                                  color='primary'
                                  size='lg'
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const name = repBandSearch.trim();
                                    if (name.length < 2) return;

                                    const created =
                                      await createBand.mutateAsync({
                                        name,
                                      });

                                    setRepSelectedBand({
                                      id: created.id,
                                      name: created.name,
                                    });
                                    setRepBandSearch('');
                                  }}
                                  disabled={createBand.isPending}
                                >
                                  {createBand.isPending
                                    ? 'Creating…'
                                    : `Create "${repBandSearch.trim()}"`}
                                </Button>
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

            {/* Represents Festivals */}
            <div className={card.card}>
              <div className={card.cardTitle}>Represents festivals</div>

              {/* existing associations */}
              <div className={styles.chipRow}>
                {(data.festivals ?? []).length ? (
                  data.festivals.map((cf) => (
                    <Chip key={cf.festival.id} tone='default'>
                      <Link
                        to={`/festivals/${cf.festival.id}`}
                        style={{
                          fontWeight: 600,
                          textDecoration: 'none',
                          color: 'inherit',
                        }}
                      >
                        {cf.festival.name}
                      </Link>

                      <Button
                        variant='no-outline'
                        color='neutral'
                        size='sm'
                        shape='round'
                        onClick={() => removeFestival.mutate(cf.festival.id)}
                        disabled={removeFestival.isPending}
                      >
                        <X size={14} />
                      </Button>
                    </Chip>
                  ))
                ) : (
                  <div style={{ opacity: 0.75 }}>No festivals linked yet.</div>
                )}
              </div>

              {/* add association */}
              <label style={{ display: 'grid', gap: 6, maxWidth: 520 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>
                  Add festival
                </span>

                {repSelectedFestival ? (
                  <div
                    style={{ display: 'flex', gap: 10, alignItems: 'center' }}
                  >
                    <div style={{ fontWeight: 600 }}>
                      {repSelectedFestival.name}
                    </div>

                    <Button
                      variant='contained'
                      color='neutral'
                      size='lg'
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.preventDefault();
                        setRepSelectedFestival(null);
                        setRepFestivalSearch('');
                      }}
                    >
                      Clear
                    </Button>

                    <Button
                      variant='contained'
                      color='primary'
                      size='lg'
                      disabled={addFestival.isPending}
                      onClick={async () => {
                        await addFestival.mutateAsync(repSelectedFestival.id);
                        setRepSelectedFestival(null);
                        setRepFestivalSearch('');
                      }}
                    >
                      {addFestival.isPending ? 'Adding…' : 'Add'}
                    </Button>
                  </div>
                ) : (
                  <>
                    <input
                      value={repFestivalSearch}
                      onChange={(e) => setRepFestivalSearch(e.target.value)}
                      placeholder="Type 2+ chars (e.g. 'Maryland')"
                    />

                    {repFestivalSearch.trim().length >= 2 ? (
                      <div
                        onMouseDown={(e) => e.preventDefault()}
                        style={{
                          border: '1px solid rgba(0,0,0,0.12)',
                          borderRadius: 10,
                          padding: 8,
                        }}
                      >
                        {repFestivalsQ.isLoading && (
                          <div style={{ opacity: 0.75 }}>Searching…</div>
                        )}
                        {repFestivalsQ.isError && (
                          <div style={{ opacity: 0.75 }}>
                            Failed to load festivals.
                          </div>
                        )}

                        {!repFestivalsQ.isLoading && !repFestivalsQ.isError ? (
                          <>
                            {(repFestivalsQ.data ?? []).slice(0, 8).map((f) => (
                              <Button
                                key={f.id}
                                variant='contained'
                                color='primary'
                                size='lg'
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setRepSelectedFestival({
                                    id: f.id,
                                    name: f.name,
                                  });
                                  setRepFestivalSearch('');
                                }}
                                style={{
                                  width: '100%',
                                  marginBottom: '8px',
                                }}
                              >
                                {f.name}
                                {f.location ? (
                                  <span style={{ opacity: 0.7 }}>
                                    {' '}
                                    • {f.location}
                                  </span>
                                ) : null}
                              </Button>
                            ))}

                            {(repFestivalsQ.data?.length ?? 0) === 0 ? (
                              <div style={{ display: 'grid', gap: 8 }}>
                                <div style={{ opacity: 0.75 }}>No matches.</div>

                                <Button
                                  variant='contained'
                                  color='primary'
                                  size='lg'
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const name = repFestivalSearch.trim();
                                    if (name.length < 2) return;

                                    const created =
                                      await createFestival.mutateAsync({
                                        name,
                                      });

                                    setRepSelectedFestival({
                                      id: created.id,
                                      name: created.name,
                                    });
                                    setRepFestivalSearch('');
                                  }}
                                  disabled={createFestival.isPending}
                                >
                                  {createFestival.isPending
                                    ? 'Creating…'
                                    : `Create "${repFestivalSearch.trim()}"`}
                                </Button>
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
          </div>
          {/* END Sidebar */}

          {/* START Main Column */}
          <div className={styles.main}>
            {/* Log Interaction */}
            <div className={card.card}>
              <div className={styles.sectionHeader}>
                <div>
                  <div className={card.cardTitle}>Interactions</div>
                  <div className={page.subtle}>
                    History, follow-ups, and notes
                  </div>
                </div>

                <Button
                  variant='contained'
                  color='primary'
                  size='lg'
                  onClick={() => setCreateOpen(true)}
                >
                  Log Interaction
                </Button>
              </div>
            </div>

            {/* Interaction Modal */}
            <Modal
              title='Log Interaction'
              open={createOpen}
              onClose={() => {
                setCreateOpen(false);
                resetCreateInteractionForm();
              }}
            >
              <div className={styles.formGrid}>
                <SelectField<InteractionType>
                  label='Type'
                  value={type}
                  options={INTERACTION_OPTIONS}
                  onChange={setType}
                />

                <SearchPicker
                  label='Band (optional)'
                  placeholder="Type 2+ chars (e.g. 'RWAKE')"
                  query={bandSearch}
                  onQueryChange={setBandSearch}
                  selected={selectedBand}
                  onSelectedChange={setSelectedBand}
                  items={bandsQ.data}
                  isLoading={bandsQ.isLoading}
                  isError={bandsQ.isError}
                  getKey={(b) => b.id}
                  getName={(b) => b.name}
                  renderMeta={(b) => (b.genre ? <>• {b.genre}</> : null)}
                  onCreate={async (name) => {
                    const created = await createBand.mutateAsync({ name });
                    return { id: created.id, name: created.name };
                  }}
                  isCreating={createBand.isPending}
                  autoFocus
                />

                <SearchPicker
                  label='Festival (optional)'
                  placeholder="Type 2+ chars (e.g. 'Maryland')"
                  query={festivalSearch}
                  onQueryChange={setFestivalSearch}
                  selected={selectedFestival}
                  onSelectedChange={setSelectedFestival}
                  items={festivalsQ.data}
                  isLoading={festivalsQ.isLoading}
                  isError={festivalsQ.isError}
                  getKey={(f) => f.id}
                  getName={(f) => f.name}
                  renderMeta={(f) => (f.location ? <>• {f.location}</> : null)}
                  onCreate={async (name) => {
                    const created = await createFestival.mutateAsync({ name });
                    return { id: created.id, name: created.name };
                  }}
                  isCreating={createFestival.isPending}
                />

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Subject</span>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Outcome</span>
                  <input
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    placeholder='e.g. Requested promo, Confirmed coverage, No reply'
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Notes</span>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Next follow-up</span>
                  <input
                    type='datetime-local'
                    value={nextFollowUpAt}
                    onChange={(e) => setNextFollowUpAt(e.target.value)}
                  />
                </label>

                <div className={styles.modalActions}>
                  <Button
                    variant='contained'
                    color='primary'
                    size='lg'
                    onClick={() => void handleCreateInteraction()}
                    disabled={create.isPending}
                  >
                    {create.isPending ? 'Saving…' : 'Save interaction'}
                  </Button>

                  <Button
                    variant='contained'
                    color='neutral'
                    size='lg'
                    onClick={() => {
                      setCreateOpen(false);
                      resetCreateInteractionForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Modal>

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

                  {/* Band */}
                  <label style={{ display: 'grid', gap: 6 }}>
                    <span style={{ fontSize: 12, opacity: 0.75 }}>Band</span>

                    <div
                      style={{ display: 'flex', gap: 10, alignItems: 'center' }}
                    >
                      <input
                        value={
                          editSelectedBand
                            ? editSelectedBand.name
                            : editBandSearch
                        }
                        onChange={(e) => {
                          setEditSelectedBand(null);
                          setEditBandSearch(e.target.value);
                        }}
                        placeholder="Type 2+ chars (e.g. 'RWAKE')"
                        disabled={Boolean(editSelectedBand)}
                      />

                      {editSelectedBand ? (
                        <Button
                          variant='contained'
                          color='primary'
                          size='lg'
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setEditSelectedBand(null);
                            setEditBandSearch('');
                          }}
                        >
                          Clear
                        </Button>
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
                          <div style={{ opacity: 0.75 }}>
                            Failed to load bands.
                          </div>
                        )}
                        {!editBandsQ.isLoading && !editBandsQ.isError && (
                          <>
                            {(editBandsQ.data ?? []).slice(0, 8).map((b) => (
                              <Button
                                variant='contained'
                                color='primary'
                                size='lg'
                                key={b.id}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setEditSelectedBand({
                                    id: b.id,
                                    name: b.name,
                                  });
                                  setEditBandSearch('');
                                }}
                                style={{
                                  width: '100%',
                                  marginBottom: '8px',
                                }}
                              >
                                {b.name}
                              </Button>
                            ))}

                            {(editBandsQ.data?.length ?? 0) === 0 ? (
                              <div style={{ display: 'grid', gap: 8 }}>
                                <div style={{ opacity: 0.75 }}>No matches.</div>
                                <Button
                                  variant='contained'
                                  color='primary'
                                  size='lg'
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const name = editBandSearch.trim();
                                    if (name.length < 2) return;

                                    const created =
                                      await createBand.mutateAsync({
                                        name,
                                      });

                                    setEditSelectedBand({
                                      id: created.id,
                                      name: created.name,
                                    });
                                    setEditBandSearch('');
                                  }}
                                  disabled={createBand.isPending}
                                >
                                  {createBand.isPending
                                    ? 'Creating…'
                                    : `Create "${editBandSearch.trim()}"`}
                                </Button>
                              </div>
                            ) : null}
                          </>
                        )}
                      </div>
                    ) : null}
                  </label>

                  {/* Festival */}
                  <label style={{ display: 'grid', gap: 6 }}>
                    <span style={{ fontSize: 12, opacity: 0.75 }}>
                      Festival
                    </span>

                    <div
                      style={{ display: 'flex', gap: 10, alignItems: 'center' }}
                    >
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
                        <Button
                          variant='contained'
                          color='primary'
                          size='lg'
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setEditSelectedFestival(null);
                            setEditFestivalSearch('');
                          }}
                        >
                          Clear
                        </Button>
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
                        {!editFestivalsQ.isLoading &&
                          !editFestivalsQ.isError && (
                            <>
                              {(editFestivalsQ.data ?? [])
                                .slice(0, 8)
                                .map((f) => (
                                  <Button
                                    key={f.id}
                                    variant='contained'
                                    color='primary'
                                    size='lg'
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
                                      marginBottom: '8px',
                                      width: '100%',
                                    }}
                                  >
                                    {f.name}
                                  </Button>
                                ))}

                              {(editFestivalsQ.data?.length ?? 0) === 0 ? (
                                <div style={{ display: 'grid', gap: 8 }}>
                                  <div style={{ opacity: 0.75 }}>
                                    No matches.
                                  </div>

                                  <Button
                                    variant='contained'
                                    color='primary'
                                    size='lg'
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      e.stopPropagation();

                                      const name = editFestivalSearch.trim();
                                      if (name.length < 2) return;

                                      const created =
                                        await createFestival.mutateAsync({
                                          name,
                                        });

                                      setEditSelectedFestival({
                                        id: created.id,
                                        name: created.name,
                                      });
                                      setEditFestivalSearch('');
                                    }}
                                    disabled={createFestival.isPending}
                                  >
                                    {createFestival.isPending
                                      ? 'Creating…'
                                      : `Create "${editFestivalSearch.trim()}"`}
                                  </Button>
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
                    <Button
                      variant='contained'
                      color='primary'
                      size='lg'
                      disabled={updateIt.isPending}
                      onClick={async () => {
                        await updateIt.mutateAsync({
                          id: editing.id,
                          data: {
                            type: editType,
                            subject: editSubject.trim()
                              ? editSubject.trim()
                              : null,
                            notes: editNotes.trim() ? editNotes.trim() : null,
                            outcome: editOutcome.trim()
                              ? editOutcome.trim()
                              : null,
                            nextFollowUpAt: editNextFollowUpAt
                              ? new Date(editNextFollowUpAt).toISOString()
                              : null,
                            bandId: editSelectedBand
                              ? editSelectedBand.id
                              : null,
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
                    </Button>

                    <Button
                      variant='contained'
                      color='neutral'
                      size='lg'
                      onClick={() => {
                        setEditOpen(false);
                        setEditing(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : null}
            </Modal>

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
          {/* END Main Column */}
        </div>
        {/* END Page Grid */}
      </div>
    </div>
  );
}
