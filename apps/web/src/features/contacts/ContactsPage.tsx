import { useState } from 'react';
import { useContacts, useCreateContact } from './queries';

export default function ContactsPage() {
  const { data, isLoading, isError, error } = useContacts();
  const create = useCreateContact();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  function onAdd() {
    const trimmed = email.trim();
    if (!trimmed) return;

    const [firstName, ...rest] = name.trim().split(' ');
    const lastName = rest.length ? rest.join(' ') : undefined;

    create.mutate({
      email: trimmed,
      firstName: firstName || undefined,
      lastName,
      role: 'Publicist',
      company: 'Unknown',
      tags: ['Press'],
    });

    setEmail('');
    setName('');
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>Contacts</h1>

      <div style={{ display: 'flex', gap: 12, margin: '16px 0' }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Name (optional)'
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
        />
        <button onClick={onAdd} disabled={create.isPending}>
          {create.isPending ? 'Adding…' : 'Add'}
        </button>
      </div>

      {isLoading && <p>Loading…</p>}
      {isError && (
        <p>
          Error:{' '}
          {error instanceof Error ? error.message : 'Failed to load contacts'}
        </p>
      )}

      <ul style={{ paddingLeft: 16 }}>
        {data?.map((c) => {
          const display =
            c.displayName ||
            [c.firstName, c.lastName].filter(Boolean).join(' ') ||
            c.email ||
            '(no name)';

          return (
            <li key={c.id} style={{ marginBottom: 10 }}>
              <div>
                <strong>{display}</strong>
                {c.company ? ` — ${c.company}` : ''}
                {c.role ? ` (${c.role})` : ''}
              </div>
              <div style={{ fontSize: 12, opacity: 0.75 }}>
                {c.email} {c.tags?.length ? ` • ${c.tags.join(', ')}` : ''}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
