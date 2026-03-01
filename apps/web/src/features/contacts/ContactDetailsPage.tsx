import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useContact, useCreateInteraction } from './detailQueries';

function fmt(dt: string) {
  return new Date(dt).toLocaleString();
}

export default function ContactDetailPage() {
  const { id = '' } = useParams();
  const { data, isLoading, isError } = useContact(id);
  const create = useCreateInteraction(id);

  const [type, setType] = useState<'EMAIL' | 'CALL' | 'DM' | 'NOTE'>('EMAIL');
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');

  const title = useMemo(() => {
    if (!data) return '';
    return (
      data.displayName ||
      [data.firstName, data.lastName].filter(Boolean).join(' ') ||
      data.email ||
      '(no name)'
    );
  }, [data]);

  if (isLoading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (isError || !data) return <div style={{ padding: 24 }}>Not found.</div>;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <Link to='/contacts'>← Back to Contacts</Link>

      <h1 style={{ marginTop: 12 }}>{title}</h1>
      <div style={{ opacity: 0.8 }}>
        {data.company ? data.company : ''} {data.role ? `• ${data.role}` : ''}
      </div>
      <div style={{ marginTop: 6, fontSize: 14 }}>
        {data.email ? <span>{data.email}</span> : null}
        {data.tags?.length ? <span> • {data.tags.join(', ')}</span> : null}
      </div>

      <hr style={{ margin: '18px 0' }} />

      <h2>Log Interaction</h2>
      <div style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ fontSize: 12, opacity: 0.75 }}>Type</span>
          <select
            value={type}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setType(e.target.value as 'EMAIL' | 'CALL' | 'DM' | 'NOTE')
            }
          >
            <option value='EMAIL'>Email</option>
            <option value='CALL'>Call</option>
            <option value='DM'>DM</option>
            <option value='NOTE'>Note</option>
          </select>
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ fontSize: 12, opacity: 0.75 }}>Subject</span>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ fontSize: 12, opacity: 0.75 }}>Notes</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </label>

        <button
          onClick={() => {
            create.mutate({
              contactId: id,
              type,
              subject: subject.trim() || undefined,
              notes: notes.trim() || undefined,
            });
            setSubject('');
            setNotes('');
          }}
          disabled={create.isPending}
        >
          {create.isPending ? 'Saving…' : 'Save interaction'}
        </button>
      </div>

      <hr style={{ margin: '18px 0' }} />

      <h2>Timeline</h2>
      {data.interactions?.length ? (
        <ul style={{ paddingLeft: 16 }}>
          {data.interactions.map((it) => (
            <li key={it.id} style={{ marginBottom: 12 }}>
              <div>
                <strong>{it.type}</strong> • <span>{fmt(it.occurredAt)}</span>
              </div>
              {it.subject ? <div>{it.subject}</div> : null}
              {it.notes ? (
                <div style={{ opacity: 0.85, whiteSpace: 'pre-wrap' }}>
                  {it.notes}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ opacity: 0.75 }}>No interactions yet.</p>
      )}
    </div>
  );
}
