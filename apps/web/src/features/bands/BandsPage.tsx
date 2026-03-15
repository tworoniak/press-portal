import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  useBands,
  useCreateBand,
  useDeleteBand,
  useUpdateBand,
} from './queries';

import page from '../../components/ui/Page/Page.module.scss';
import card from '../../components/ui/Card/Card.module.scss';
import table from '../../components/ui/Table/Table.module.scss';
import { Modal } from '../../components/ui/Modal/Modal';
import Button from '../../components/ui/Button/Button';

import { Trash2 } from 'lucide-react';

type BandRow = {
  id: string;
  name: string;
  genre: string | null;
  country: string | null;
  website: string | null;
  spotifyUrl: string | null;
  instagram: string | null;
  notes: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type EditDraft = {
  id: string;
  name: string;
  genre: string;
  country: string;
  website: string;
  spotifyUrl: string;
  instagram: string;
  notes: string;
};

export default function BandsPage() {
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newGenre, setNewGenre] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [newSpotifyUrl, setNewSpotifyUrl] = useState('');
  const [newInstagram, setNewInstagram] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const bandsQ = useBands(search, true);
  const create = useCreateBand();
  const update = useUpdateBand();
  const del = useDeleteBand();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BandRow | null>(null);

  async function onAdd() {
    const name = newName.trim();
    if (!name) return;

    await create.mutateAsync({
      name,
      genre: newGenre.trim() || undefined,
      country: newCountry.trim() || undefined,
      website: newWebsite.trim() || undefined,
      spotifyUrl: newSpotifyUrl.trim() || undefined,
      instagram: newInstagram.trim() || undefined,
      notes: newNotes.trim() || undefined,
    });

    setIsCreateOpen(false);
    setNewName('');
    setNewGenre('');
    setNewCountry('');
    setNewWebsite('');
    setNewSpotifyUrl('');
    setNewInstagram('');
    setNewNotes('');
  }

  function openEdit(b: BandRow) {
    setEditDraft({
      id: b.id,
      name: b.name ?? '',
      genre: b.genre ?? '',
      country: b.country ?? '',
      website: b.website ?? '',
      spotifyUrl: b.spotifyUrl ?? '',
      instagram: b.instagram ?? '',
      notes: b.notes ?? '',
    });
    setIsEditOpen(true);
  }

  async function onSaveEdit() {
    if (!editDraft) return;

    await update.mutateAsync({
      id: editDraft.id,
      data: {
        name: editDraft.name.trim() || null,
        genre: editDraft.genre.trim() || null,
        country: editDraft.country.trim() || null,
        website: editDraft.website.trim() || null,
        spotifyUrl: editDraft.spotifyUrl.trim() || null,
        instagram: editDraft.instagram.trim() || null,
        notes: editDraft.notes.trim() || null,
      },
    });

    setIsEditOpen(false);
    setEditDraft(null);
  }

  function openDelete(b: BandRow) {
    setDeleteTarget(b);
    setIsDeleteOpen(true);
  }

  async function onConfirmDelete() {
    if (!deleteTarget) return;
    await del.mutateAsync(deleteTarget.id);
    setIsDeleteOpen(false);
    setDeleteTarget(null);
  }

  const rows = (bandsQ.data ?? []) as BandRow[];

  return (
    <div className={page.page}>
      <div className={page.container}>
        {/* Create */}
        <Modal
          title='Create band'
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
                  placeholder='RWAKE'
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Genre</span>
                <input
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  placeholder='Sludge / Doom'
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Country</span>
                <input
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  placeholder='US'
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
                <span style={{ fontSize: 12, opacity: 0.75 }}>Spotify URL</span>
                <input
                  value={newSpotifyUrl}
                  onChange={(e) => setNewSpotifyUrl(e.target.value)}
                  placeholder='https://open.spotify.com/...'
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

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Notes</span>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={4}
                  placeholder='Any notes about the band...'
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

              {/* <button
                type='button'
                onClick={() => void onAdd()}
                disabled={create.isPending || !newName.trim()}
              >
                {create.isPending ? 'Adding…' : 'Add'}
              </button> */}
            </div>
          </div>
        </Modal>

        {/* Edit */}
        <Modal
          title='Edit band'
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
                  placeholder='RWAKE'
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Genre</span>
                <input
                  value={editDraft?.genre ?? ''}
                  onChange={(e) =>
                    setEditDraft((prev) =>
                      prev ? { ...prev, genre: e.target.value } : prev,
                    )
                  }
                  placeholder='Sludge / Doom'
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Country</span>
                <input
                  value={editDraft?.country ?? ''}
                  onChange={(e) =>
                    setEditDraft((prev) =>
                      prev ? { ...prev, country: e.target.value } : prev,
                    )
                  }
                  placeholder='US'
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
                <span style={{ fontSize: 12, opacity: 0.75 }}>Spotify URL</span>
                <input
                  value={editDraft?.spotifyUrl ?? ''}
                  onChange={(e) =>
                    setEditDraft((prev) =>
                      prev ? { ...prev, spotifyUrl: e.target.value } : prev,
                    )
                  }
                  placeholder='https://open.spotify.com/...'
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
                  placeholder='Any notes about the band...'
                />
              </label>
              <Button
                variant='contained'
                color='primary'
                size='lg'
                onClick={() => void onSaveEdit()}
                disabled={update.isPending}
              >
                {update.isPending ? 'Saving…' : 'Save'}
              </Button>
              {/* <button
                type='button'
                onClick={() => void onSaveEdit()}
                disabled={update.isPending}
              >
                {update.isPending ? 'Saving…' : 'Save'}
              </button> */}
            </div>
          </div>
        </Modal>

        {/* Delete */}
        <Modal
          title='Delete band'
          open={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
        >
          <div className={card.card}>
            <div className={page.subtle} style={{ marginBottom: 10 }}>
              This cannot be undone.
            </div>

            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              {deleteTarget?.name ?? ''}
            </div>
            <div className={page.subtle} style={{ marginBottom: 14 }}>
              {deleteTarget?.genre ?? ''}
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
              {/* <button
                type='button'
                onClick={() => void onConfirmDelete()}
                disabled={del.isPending || !deleteTarget}
              >
                {del.isPending ? 'Deleting…' : 'Delete'}
              </button> */}
              <Button
                variant='outline'
                color='neutral'
                size='lg'
                onClick={() => setIsDeleteOpen(false)}
              >
                Cancel
              </Button>
              {/* <button type='button' onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </button> */}
            </div>
          </div>
        </Modal>

        {/* Header */}
        <div className={page.headerRow}>
          <h1 className={page.title}>Bands</h1>
          <div className={page.nav}>
            <Button
              variant='contained'
              color='primary'
              size='lg'
              onClick={() => setIsCreateOpen(true)}
            >
              New Band
            </Button>
            {/* <button type='button' onClick={() => setIsCreateOpen(true)}>
              New Band
            </button> */}
          </div>
        </div>

        <div className={card.card}>
          <div className={card.cardTitle}>Search</div>

          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 12, opacity: 0.75 }}>Search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Name, genre, country...'
            />
          </label>
        </div>

        <div style={{ height: 18 }} />

        {bandsQ.isLoading && <p>Loading…</p>}

        {bandsQ.isError && <p>Failed to load bands.</p>}

        {!bandsQ.isLoading && !bandsQ.isError && (
          <>
            <div className={page.subtle}>{rows.length} band(s)</div>
            <div style={{ height: 10 }} />

            <div className={table.tableWrap}>
              <table className={table.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Genre</th>
                    <th>Country</th>
                    <th>Website</th>
                    <th style={{ width: 160 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <div className={table.rowTitle}>
                          <Link to={`/bands/${b.id}`}>{b.name}</Link>
                        </div>
                      </td>
                      <td>{b.genre ?? '—'}</td>
                      <td>{b.country ?? '—'}</td>
                      <td>
                        {b.website ? (
                          <a href={b.website} target='_blank' rel='noreferrer'>
                            {b.website}
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
                            onClick={() => openEdit(b)}
                          >
                            Edit
                          </Button>

                          <Button
                            variant='outline'
                            color='danger'
                            size='lg'
                            onClick={() => openDelete(b)}
                          >
                            {/* Delete */}
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: 14, opacity: 0.75 }}>
                        No bands found.
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
