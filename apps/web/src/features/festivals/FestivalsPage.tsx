import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useFestivals, useCreateFestival } from './queries';

import page from '../../components/ui/Page/Page.module.scss';
import card from '../../components/ui/Card/Card.module.scss';
import table from '../../components/ui/Table/Table.module.scss';
import { Modal } from '../../components/ui/Modal/Modal';

type FestivalRow = {
  id: string;
  name: string;
  location: string | null;
  website: string | null;
  startDate: string | null;
  endDate: string | null;
};

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
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');

  const festivalsQ = useFestivals(search, true);
  const create = useCreateFestival();

  async function onAdd() {
    const name = newName.trim();
    if (!name) return;

    await create.mutateAsync({
      name,
      location: newLocation.trim() || undefined,
      website: newWebsite.trim() || undefined,
      startDate: newStartDate || undefined,
      endDate: newEndDate || undefined,
    });

    setIsCreateOpen(false);
    setNewName('');
    setNewLocation('');
    setNewWebsite('');
    setNewStartDate('');
    setNewEndDate('');
  }

  const rows = (festivalsQ.data ?? []) as FestivalRow[];

  return (
    <div className={page.page}>
      <div className={page.container}>
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
                <span style={{ fontSize: 12, opacity: 0.75 }}>Start date</span>
                <input
                  type='date'
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>End date</span>
                <input
                  type='date'
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
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
          <h1 className={page.title}>Festivals</h1>
          <div className={page.nav}>
            <button type='button' onClick={() => setIsCreateOpen(true)}>
              New Festival
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
                    </tr>
                  ))}

                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: 14, opacity: 0.75 }}>
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
