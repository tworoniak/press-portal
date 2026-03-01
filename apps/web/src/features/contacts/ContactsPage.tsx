import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContacts, useCreateContact } from './queries';

const STATUSES = [
  '',
  'NOT_CONTACTED',
  'CONTACTED',
  'RESPONDED',
  'CONFIRMED',
  'PUBLISHED',
  'ARCHIVED',
] as const;

function fmtDate(dt: string) {
  const d = new Date(dt);
  return d.toLocaleString();
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

export default function ContactsPage() {
  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<(typeof STATUSES)[number]>('');
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
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <h1 style={{ margin: 0 }}>Contacts</h1>
        <span style={{ opacity: 0.7 }}>
          <Link to='/dashboard'>Dashboard</Link>
        </span>
      </div>

      {/* Filters */}
      <div
        style={{
          marginTop: 16,
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr auto',
          gap: 12,
          alignItems: 'end',
        }}
      >
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ fontSize: 12, opacity: 0.75 }}>Search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Name, email, company...'
          />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ fontSize: 12, opacity: 0.75 }}>Status</span>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as (typeof STATUSES)[number])
            }
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s ? s.replaceAll('_', ' ') : 'Any'}
              </option>
            ))}
          </select>
        </label>

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

      {/* Quick add */}
      <div
        style={{
          marginTop: 16,
          padding: 12,
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius: 10,
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 10 }}>Quick add</div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1.2fr 1fr 1.2fr auto',
            gap: 10,
            alignItems: 'end',
          }}
        >
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

      {/* Results */}
      <div style={{ marginTop: 18 }}>
        {isLoading && <p>Loading…</p>}
        {isError && (
          <p>
            Error:{' '}
            {error instanceof Error ? error.message : 'Failed to load contacts'}
          </p>
        )}

        {!isLoading && !isError && (
          <>
            <div style={{ marginBottom: 10, opacity: 0.75, fontSize: 14 }}>
              {data?.length ?? 0} contact(s)
            </div>

            <div
              style={{
                border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: 10,
                overflow: 'hidden',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr
                    style={{
                      textAlign: 'left',
                      background: 'rgba(0,0,0,0.04)',
                    }}
                  >
                    <th style={{ padding: 10 }}>Name</th>
                    <th style={{ padding: 10 }}>Company / Role</th>
                    <th style={{ padding: 10 }}>Status</th>
                    <th style={{ padding: 10 }}>Last contacted</th>
                    <th style={{ padding: 10 }}>Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((c) => (
                    <tr
                      key={c.id}
                      style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}
                    >
                      <td style={{ padding: 10 }}>
                        <div style={{ fontWeight: 600 }}>
                          <Link to={`/contacts/${c.id}`}>{displayName(c)}</Link>
                        </div>
                        <div style={{ fontSize: 12, opacity: 0.75 }}>
                          {c.email ?? ''}
                        </div>
                      </td>

                      <td style={{ padding: 10 }}>
                        <div>{c.company ?? '—'}</div>
                        <div style={{ fontSize: 12, opacity: 0.75 }}>
                          {c.role ?? '—'}
                        </div>
                      </td>

                      <td style={{ padding: 10 }}>
                        {c.status?.replaceAll('_', ' ') ?? '—'}
                      </td>

                      <td style={{ padding: 10 }}>
                        {c.lastContactedAt ? fmtDate(c.lastContactedAt) : '—'}
                      </td>

                      <td style={{ padding: 10 }}>
                        {c.tags?.length ? c.tags.join(', ') : '—'}
                      </td>
                    </tr>
                  ))}
                  {data?.length === 0 && (
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
