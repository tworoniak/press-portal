import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import page from '../../components/ui/Page/Page.module.scss';
import card from '../../components/ui/Card/Card.module.scss';
import {
  useBand,
  useAddBandContact,
  useRemoveBandContact,
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
          <div className={page.nav}>
            <Link to='/contacts'>Contacts</Link>
            <Link to='/dashboard'>Dashboard</Link>
          </div>
        </div>

        <div className={page.subtle}>
          {band.genre ? band.genre : '—'}
          {band.country ? ` • ${band.country}` : ''}
          {band.website ? ` • ${band.website}` : ''}
        </div>

        <div style={{ height: 14 }} />

        {/* Linked contacts */}
        <div className={card.card}>
          <div className={card.cardTitle}>Press contacts</div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {band.contacts?.length ? (
              band.contacts.map((link) => (
                <div
                  key={link.contactId}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 10px',
                    border: '1px solid rgba(0,0,0,0.12)',
                    borderRadius: 999,
                  }}
                >
                  <Link
                    to={`/contacts/${link.contactId}`}
                    style={{ fontWeight: 600, textDecoration: 'none' }}
                  >
                    {contactLabel(link.contact)}
                  </Link>

                  <button
                    type='button'
                    onClick={() => remove.mutate(link.contactId)}
                    disabled={remove.isPending}
                    style={{ opacity: 0.8 }}
                    title='Remove'
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <div style={{ opacity: 0.75 }}>No contacts linked yet.</div>
            )}
          </div>

          <div style={{ height: 12 }} />

          {/* Add contact */}
          <label style={{ display: 'grid', gap: 6, maxWidth: 560 }}>
            <span style={{ fontSize: 12, opacity: 0.75 }}>Add contact</span>

            {selected ? (
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ fontWeight: 600 }}>{selected.label}</div>
                  <button
                    type='button'
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setSelected(null);
                      setSearch('');
                    }}
                  >
                    Clear
                  </button>
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

                <button
                  type='button'
                  disabled={add.isPending}
                  onClick={async () => {
                    await add.mutateAsync({
                      contactId: selected.id,
                      relationshipRole: relationshipRole.trim() || undefined,
                      relationshipNotes: relationshipNotes.trim() || undefined,
                    });

                    setSelected(null);
                    setSearch('');
                    setRelationshipRole('');
                    setRelationshipNotes('');
                  }}
                >
                  {add.isPending ? 'Adding…' : 'Add'}
                </button>
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
                          <button
                            key={c.id}
                            type='button'
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelected({ id: c.id, label: contactLabel(c) });
                              setSearch('');
                            }}
                            style={{
                              display: 'block',
                              width: '100%',
                              textAlign: 'left',
                              padding: '8px 10px',
                              borderRadius: 8,
                            }}
                          >
                            {contactLabel(c)}
                            {c.company ? (
                              <span style={{ opacity: 0.7 }}>
                                {' '}
                                • {c.company}
                              </span>
                            ) : null}
                          </button>
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
    </div>
  );
}
