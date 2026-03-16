import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  useFestivals,
  useCreateFestival,
  useDeleteFestival,
  useUpdateFestival,
} from './queries';

import page from '../../components/ui/Page/Page.module.scss';
import card from '../../components/ui/Card/Card.module.scss';
import table from '../../components/ui/Table/Table.module.scss';
import { Modal } from '../../components/ui/Modal/Modal';
import Button from '../../components/ui/Button/Button';
import DateInput from '../../components/ui/DateInput/DateInput';

import { Trash2, Pencil } from 'lucide-react';

type FestivalRow = {
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

type EditDraft = {
  id: string;
  name: string;
  location: string;
  website: string;
  instagram: string;
  startDate: string;
  endDate: string;
  credentialInfo: string;
  notes: string;
};

function toDateInputValue(value: string | null | undefined) {
  if (!value) return '';
  return value.slice(0, 10);
}

function toIsoDateOrNull(value: string) {
  if (!value) return null;

  // use noon to avoid timezone edge cases shifting the date
  const dt = new Date(`${value}T12:00:00`);
  return Number.isNaN(dt.getTime()) ? null : dt.toISOString();
}

function fmtDate(dt: string | null) {
  if (!dt) return '—';
  return new Date(dt).toLocaleDateString();
}

export default function FestivalsPage() {
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [newInstagram, setNewInstagram] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newCredentialInfo, setNewCredentialInfo] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const festivalsQ = useFestivals(search, true);
  const create = useCreateFestival();
  const update = useUpdateFestival();
  const del = useDeleteFestival();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FestivalRow | null>(null);

  async function onAdd() {
    const name = newName.trim();
    if (!name) return;

    await create.mutateAsync({
      name,
      location: newLocation.trim() || undefined,
      website: newWebsite.trim() || undefined,
      instagram: newInstagram.trim() || undefined,
      startDate: toIsoDateOrNull(newStartDate) ?? undefined,
      endDate: toIsoDateOrNull(newEndDate) ?? undefined,
      credentialInfo: newCredentialInfo.trim() || undefined,
      notes: newNotes.trim() || undefined,
    });

    setIsCreateOpen(false);
    setNewName('');
    setNewLocation('');
    setNewWebsite('');
    setNewInstagram('');
    setNewStartDate('');
    setNewEndDate('');
    setNewCredentialInfo('');
    setNewNotes('');
  }

  function openEdit(f: FestivalRow) {
    setEditDraft({
      id: f.id,
      name: f.name ?? '',
      location: f.location ?? '',
      website: f.website ?? '',
      instagram: f.instagram ?? '',
      startDate: toDateInputValue(f.startDate),
      endDate: toDateInputValue(f.endDate),
      credentialInfo: f.credentialInfo ?? '',
      notes: f.notes ?? '',
    });
    setIsEditOpen(true);
  }

  async function onSaveEdit() {
    if (!editDraft) return;

    await update.mutateAsync({
      id: editDraft.id,
      data: {
        name: editDraft.name.trim() || null,
        location: editDraft.location.trim() || null,
        website: editDraft.website.trim() || null,
        instagram: editDraft.instagram.trim() || null,
        startDate: toIsoDateOrNull(editDraft.startDate),
        endDate: toIsoDateOrNull(editDraft.endDate),
        credentialInfo: editDraft.credentialInfo.trim() || null,
        notes: editDraft.notes.trim() || null,
      },
    });

    setIsEditOpen(false);
    setEditDraft(null);
  }

  function openDelete(f: FestivalRow) {
    setDeleteTarget(f);
    setIsDeleteOpen(true);
  }

  async function onConfirmDelete() {
    if (!deleteTarget) return;
    await del.mutateAsync(deleteTarget.id);
    setIsDeleteOpen(false);
    setDeleteTarget(null);
  }

  const rows = (festivalsQ.data ?? []) as FestivalRow[];

  return (
    <div className={page.page}>
      <div className={page.container}>
        {/* Create */}
        <Modal
          title='Create festival'
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        >
          <div className={card.card}>
            <div className={card.cardTitle}>Quick add</div>

            <div style={{ display: 'grid', gap: 10 }}>
              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Name *</span>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder='Maryland Deathfest'
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Location</span>
                <input
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder='Baltimore, MD'
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Website</span>
                <input
                  value={newWebsite}
                  onChange={(e) => setNewWebsite(e.target.value)}
                  placeholder='https://...'
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Instagram</span>
                <input
                  value={newInstagram}
                  onChange={(e) => setNewInstagram(e.target.value)}
                  placeholder='https://instagram.com/...'
                />
              </label>

              <DateInput
                label='Start date'
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
              />

              <DateInput
                label='End date'
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
              />

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>
                  Credential info
                </span>
                <textarea
                  value={newCredentialInfo}
                  onChange={(e) => setNewCredentialInfo(e.target.value)}
                  rows={3}
                  placeholder='Press credentials deadline, requirements, etc.'
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Notes</span>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={4}
                  placeholder='Any notes about the festival...'
                />
              </label>

              <Button
                variant='contained'
                color='primary'
                size='lg'
                onClick={() => void onAdd()}
                disabled={create.isPending || !newName.trim()}
              >
                {create.isPending ? 'Adding…' : 'Add'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Edit */}
        <Modal
          title='Edit festival'
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
        >
          <div className={card.card}>
            <div className={card.cardTitle}>Details</div>

            <div style={{ display: 'grid', gap: 10 }}>
              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Name</span>
                <input
                  value={editDraft?.name ?? ''}
                  onChange={(e) =>
                    setEditDraft((prev) =>
                      prev ? { ...prev, name: e.target.value } : prev,
                    )
                  }
                  placeholder='Maryland Deathfest'
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Location</span>
                <input
                  value={editDraft?.location ?? ''}
                  onChange={(e) =>
                    setEditDraft((prev) =>
                      prev ? { ...prev, location: e.target.value } : prev,
                    )
                  }
                  placeholder='Baltimore, MD'
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Website</span>
                <input
                  value={editDraft?.website ?? ''}
                  onChange={(e) =>
                    setEditDraft((prev) =>
                      prev ? { ...prev, website: e.target.value } : prev,
                    )
                  }
                  placeholder='https://...'
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Instagram</span>
                <input
                  value={editDraft?.instagram ?? ''}
                  onChange={(e) =>
                    setEditDraft((prev) =>
                      prev ? { ...prev, instagram: e.target.value } : prev,
                    )
                  }
                  placeholder='https://instagram.com/...'
                />
              </label>

              <DateInput
                label='Start date'
                value={editDraft?.startDate ?? ''}
                onChange={(e) =>
                  setEditDraft((prev) =>
                    prev ? { ...prev, startDate: e.target.value } : prev,
                  )
                }
              />

              <DateInput
                label='End date'
                value={editDraft?.endDate ?? ''}
                onChange={(e) =>
                  setEditDraft((prev) =>
                    prev ? { ...prev, endDate: e.target.value } : prev,
                  )
                }
              />

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>
                  Credential info
                </span>
                <textarea
                  value={editDraft?.credentialInfo ?? ''}
                  onChange={(e) =>
                    setEditDraft((prev) =>
                      prev ? { ...prev, credentialInfo: e.target.value } : prev,
                    )
                  }
                  rows={3}
                  placeholder='Press credentials deadline, requirements, etc.'
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Notes</span>
                <textarea
                  value={editDraft?.notes ?? ''}
                  onChange={(e) =>
                    setEditDraft((prev) =>
                      prev ? { ...prev, notes: e.target.value } : prev,
                    )
                  }
                  rows={4}
                  placeholder='Any notes about the festival...'
                />
              </label>

              <Button
                variant='contained'
                color='primary'
                size='xl'
                onClick={() => void onSaveEdit()}
                disabled={update.isPending}
              >
                {update.isPending ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete */}
        <Modal
          title='Delete festival'
          open={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
        >
          <div className={card.card}>
            <div
              className={page.subtle}
              style={{ marginBottom: 10, fontSize: 14, fontWeight: 700 }}
            >
              This cannot be undone.
            </div>

            <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 14 }}>
              {deleteTarget?.name ?? ''}
            </div>
            <div className={page.subtle} style={{ marginBottom: 14 }}>
              {deleteTarget?.location ?? ''}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Button
                variant='contained'
                color='danger'
                size='lg'
                onClick={() => void onConfirmDelete()}
                disabled={del.isPending || !deleteTarget}
              >
                {del.isPending ? 'Deleting…' : 'Delete'}
              </Button>

              <Button
                variant='outline'
                color='neutral'
                size='lg'
                onClick={() => setIsDeleteOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {/* Header */}
        <div className={page.headerRow}>
          <h1 className={page.title}>Festivals</h1>
          <div className={page.nav}>
            <Button
              variant='contained'
              color='primary'
              size='lg'
              onClick={() => setIsCreateOpen(true)}
            >
              New Festival
            </Button>
          </div>
        </div>

        <div className={card.card}>
          <div className={card.cardTitle}>Search</div>

          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 12, opacity: 0.75 }}>Search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Name, location...'
            />
          </label>
        </div>

        <div style={{ height: 18 }} />

        {festivalsQ.isLoading && <p>Loading…</p>}

        {festivalsQ.isError && <p>Failed to load festivals.</p>}

        {!festivalsQ.isLoading && !festivalsQ.isError && (
          <>
            <div className={page.subtle}>{rows.length} festival(s)</div>
            <div style={{ height: 10 }} />

            <div className={table.tableWrap}>
              <table className={table.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Dates</th>
                    <th>Website</th>
                    <th style={{ width: 160 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((f) => (
                    <tr key={f.id}>
                      <td>
                        <div className={table.rowTitle}>
                          <Link to={`/festivals/${f.id}`}>{f.name}</Link>
                        </div>
                      </td>
                      <td>{f.location ?? '—'}</td>
                      <td>
                        {fmtDate(f.startDate)}
                        {f.endDate ? ` – ${fmtDate(f.endDate)}` : ''}
                      </td>
                      <td>
                        {f.website ? (
                          <a href={f.website} target='_blank' rel='noreferrer'>
                            {f.website}
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Button
                            variant='contained'
                            color='primary'
                            size='lg'
                            onClick={() => openEdit(f)}
                          >
                            Edit
                            <Pencil size={14} />
                          </Button>

                          <Button
                            variant='outline'
                            color='danger'
                            size='lg'
                            onClick={() => openDelete(f)}
                          >
                            <span className='mobile-hidden'>Delete</span>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: 14, opacity: 0.75 }}>
                        No festivals found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
