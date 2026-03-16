import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import page from '../../components/ui/Page/Page.module.scss';
import card from '../../components/ui/Card/Card.module.scss';
import Button from '../../components/ui/Button/Button';
import { Chip } from '../../components/ui/Chip/Chip';
import { X } from 'lucide-react';
import {
  useBand,
  useAddBandContact,
  useRemoveBandContact,
} from './detailQueries';
import { useContactSearch } from '../contacts/searchQueries';

type NamedRef = { id: string; label: string };

function fmt(dt: string) {
  return new Date(dt).toLocaleString();
}

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

// function contactLabel(c: {
//   displayName: string | null;
//   firstName: string | null;
//   lastName: string | null;
//   email: string | null;
// }) {
//   return (
//     c.displayName ||
//     [c.firstName, c.lastName].filter(Boolean).join(' ') ||
//     c.email ||
//     '(no name)'
//   );
// }

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
          {/* <div className={page.nav}>
            <Link to='/contacts'>Contacts</Link>
            <Link to='/dashboard'>Dashboard</Link>
          </div> */}
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

          <div style={{ height: 12 }} />

          {/* Add contact */}
          <label style={{ display: 'grid', gap: 6, maxWidth: 560 }}>
            <span style={{ fontSize: 12, opacity: 0.75 }}>Add contact</span>

            {selected ? (
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
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
                      relationshipNotes: relationshipNotes.trim() || undefined,
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
                              setSelected({ id: c.id, label: contactLabel(c) });
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

          {/* Recent interactions */}
          <div style={{ height: 14 }} />

          <div className={card.card}>
            <div className={card.cardTitle}>Recent interactions</div>

            {(band.interactions?.length ?? 0) > 0 ? (
              <div style={{ display: 'grid', gap: 12 }}>
                {band.interactions.slice(0, 10).map((it) => (
                  <div
                    key={it.id}
                    style={{
                      border: '1px solid rgba(0,0,0,0.10)',
                      borderRadius: 12,
                      padding: 12,
                    }}
                  >
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <div style={{ fontWeight: 700 }}>{it.type}</div>
                      <div style={{ opacity: 0.75 }}>
                        • {fmt(it.occurredAt)}
                      </div>

                      {it.nextFollowUpAt ? (
                        <div style={{ opacity: 0.75 }}>
                          • Follow-up: {fmt(it.nextFollowUpAt)}
                        </div>
                      ) : null}

                      {it.festival ? (
                        <div style={{ opacity: 0.75 }}>
                          • Festival: {it.festival.name}
                        </div>
                      ) : null}
                    </div>

                    <div style={{ marginTop: 6, fontSize: 14 }}>
                      <span style={{ opacity: 0.75 }}>Contact:</span>{' '}
                      <Link to={`/contacts/${it.contact.id}`}>
                        {contactLabel(it.contact)}
                      </Link>
                      {it.contact.company ? (
                        <span style={{ opacity: 0.75 }}>
                          {' '}
                          • {it.contact.company}
                        </span>
                      ) : null}
                    </div>

                    {it.subject ? (
                      <div style={{ marginTop: 8, fontWeight: 600 }}>
                        {it.subject}
                      </div>
                    ) : null}

                    {it.outcome ? (
                      <div style={{ marginTop: 6, opacity: 0.85 }}>
                        <span style={{ fontWeight: 600 }}>Outcome:</span>{' '}
                        {it.outcome}
                      </div>
                    ) : null}

                    {it.notes ? (
                      <div
                        style={{
                          marginTop: 6,
                          opacity: 0.9,
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {it.notes}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ opacity: 0.75 }}>
                No interactions for this band yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
