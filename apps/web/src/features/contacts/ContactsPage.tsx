import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SelectField } from '../../components/SelectField/SelectField';
import { useContacts, useCreateContact } from './queries';

import page from '../../components/ui/Page/Page.module.scss';
import card from '../../components/ui/Card/Card.module.scss';
import table from '../../components/ui/Table/Table.module.scss';
import styles from './ContactsPage.module.scss';
import { Badge, type BadgeTone } from '../../components/ui/Badge/Badge';
import { TagRow } from '../../components/ui/Tag/TagRow';

type ContactStatus =
  | ''
  | 'NOT_CONTACTED'
  | 'CONTACTED'
  | 'RESPONDED'
  | 'CONFIRMED'
  | 'PUBLISHED'
  | 'ARCHIVED';

const STATUS_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'NOT_CONTACTED', label: 'NOT CONTACTED' },
  { value: 'CONTACTED', label: 'CONTACTED' },
  { value: 'RESPONDED', label: 'RESPONDED' },
  { value: 'CONFIRMED', label: 'CONFIRMED' },
  { value: 'PUBLISHED', label: 'PUBLISHED' },
  { value: 'ARCHIVED', label: 'ARCHIVED' },
] as const satisfies readonly { value: ContactStatus; label: string }[];

function fmtDate(dt: string) {
  return new Date(dt).toLocaleString();
}

function displayName(c: {
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

function statusTone(status: string | null | undefined): BadgeTone {
  switch (status) {
    case 'PUBLISHED':
    case 'CONFIRMED':
      return 'ok';
    case 'RESPONDED':
      return 'warn';
    case 'ARCHIVED':
      return 'default';
    case 'NOT_CONTACTED':
    case 'CONTACTED':
    default:
      return 'default';
  }
}

export default function ContactsPage() {
  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ContactStatus>('');
  const [tag, setTag] = useState('');
  const [needsFollowUp, setNeedsFollowUp] = useState(false);

  const filters = useMemo(
    () => ({
      search: search.trim() || undefined,
      status: status || undefined,
      tag: tag.trim() || undefined,
      needsFollowUp: needsFollowUp || undefined,
    }),
    [search, status, tag, needsFollowUp],
  );

  const { data, isLoading, isError, error } = useContacts(filters);
  const create = useCreateContact();

  // Quick add form
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newTags, setNewTags] = useState('Press');

  function onAdd() {
    const email = newEmail.trim();
    if (!email) return;

    const name = newName.trim();
    const [firstName, ...rest] = name.split(' ');
    const lastName = rest.length ? rest.join(' ') : undefined;

    const tags = newTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    create.mutate({
      email,
      firstName: firstName || undefined,
      lastName,
      company: newCompany.trim() || undefined,
      role: 'Publicist',
      tags,
      status: 'NOT_CONTACTED',
    });

    setNewName('');
    setNewEmail('');
    setNewCompany('');
    // keep tags
  }

  return (
    <div className={page.page}>
      <div className={page.container}>
        <div className={page.headerRow}>
          <h1 className={page.title}>Contacts</h1>
          <div className={page.nav}>
            <Link to='/dashboard'>Dashboard</Link>
          </div>
        </div>

        {/* Filters */}
        <div className={card.card}>
          <div className={card.cardTitle}>Filters</div>

          <div className={styles.filterGrid}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.75 }}>Search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Name, email, company...'
              />
            </label>

            <SelectField<ContactStatus>
              label='Status'
              value={status}
              options={STATUS_OPTIONS}
              onChange={setStatus}
            />

            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.75 }}>Tag</span>
              <input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder='Metal, Festival...'
              />
            </label>

            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type='checkbox'
                checked={needsFollowUp}
                onChange={(e) => setNeedsFollowUp(e.target.checked)}
              />
              <span style={{ fontSize: 14 }}>Needs follow-up</span>
            </label>
          </div>
        </div>

        <div style={{ height: 14 }} />

        {/* Quick add */}
        <div className={card.card}>
          <div className={card.cardTitle}>Quick add</div>

          <div className={styles.quickAddGrid}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.75 }}>Name</span>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder='Jane Doe'
              />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.75 }}>Email *</span>
              <input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder='jane@label.com'
              />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.75 }}>Company</span>
              <input
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder='Metal PR Co'
              />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.75 }}>Tags (comma)</span>
              <input
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder='Press, Metal, US'
              />
            </label>

            <button
              onClick={onAdd}
              disabled={create.isPending || !newEmail.trim()}
            >
              {create.isPending ? 'Adding…' : 'Add'}
            </button>
          </div>
        </div>

        <div style={{ height: 18 }} />

        {/* Results */}
        {isLoading && <p>Loading…</p>}

        {isError && (
          <p>
            Error:{' '}
            {error instanceof Error ? error.message : 'Failed to load contacts'}
          </p>
        )}

        {!isLoading && !isError && (
          <>
            <div className={page.subtle}>{data?.length ?? 0} contact(s)</div>
            <div style={{ height: 10 }} />

            <div className={table.tableWrap}>
              <table className={table.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company / Role</th>
                    <th>Status</th>
                    <th>Last contacted</th>
                    <th>Tags</th>
                  </tr>
                </thead>

                <tbody>
                  {data?.map((c) => {
                    const label = c.status?.replaceAll('_', ' ') ?? '—';
                    const tone = statusTone(c.status);

                    return (
                      <tr key={c.id}>
                        <td>
                          <div className={table.rowTitle}>
                            <Link to={`/contacts/${c.id}`}>
                              {displayName(c)}
                            </Link>
                          </div>
                          <div className={table.smallMuted}>
                            {c.email ?? ''}
                          </div>
                        </td>

                        <td>
                          <div>{c.company ?? '—'}</div>
                          <div className={table.smallMuted}>
                            {c.role ?? '—'}
                          </div>
                        </td>

                        <td>
                          <Badge tone={tone}>{label}</Badge>
                        </td>

                        <td>
                          {c.lastContactedAt ? fmtDate(c.lastContactedAt) : '—'}
                        </td>

                        <td>
                          <TagRow tags={c.tags ?? []} />
                        </td>
                      </tr>
                    );
                  })}

                  {(data?.length ?? 0) === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: 14, opacity: 0.75 }}>
                        No contacts match these filters.
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
