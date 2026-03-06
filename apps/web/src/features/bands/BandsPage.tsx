import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useBands, useCreateBand } from './queries';

import page from '../../components/ui/Page/Page.module.scss';
import card from '../../components/ui/Card/Card.module.scss';
import table from '../../components/ui/Table/Table.module.scss';
import { Modal } from '../../components/ui/Modal/Modal';

type BandRow = {
  id: string;
  name: string;
  genre: string | null;
  country: string | null;
  website: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export default function BandsPage() {
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newGenre, setNewGenre] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newWebsite, setNewWebsite] = useState('');

  const bandsQ = useBands(search || '', true);
  const create = useCreateBand();

  async function onAdd() {
    const name = newName.trim();
    if (!name) return;

    await create.mutateAsync({
      name,
      genre: newGenre.trim() || undefined,
      country: newCountry.trim() || undefined,
      website: newWebsite.trim() || undefined,
    });

    setIsCreateOpen(false);
    setNewName('');
    setNewGenre('');
    setNewCountry('');
    setNewWebsite('');
  }

  const rows = (bandsQ.data ?? []) as BandRow[];

  return (
    <div className={page.page}>
      <div className={page.container}>
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

              <button
                type='button'
                onClick={() => void onAdd()}
                disabled={create.isPending || !newName.trim()}
              >
                {create.isPending ? 'Adding…' : 'Add'}
              </button>
            </div>
          </div>
        </Modal>

        <div className={page.headerRow}>
          <h1 className={page.title}>Bands</h1>
          <div className={page.nav}>
            <button type='button' onClick={() => setIsCreateOpen(true)}>
              New Band
            </button>
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
                    </tr>
                  ))}

                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: 14, opacity: 0.75 }}>
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
