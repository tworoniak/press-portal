import { Link } from 'react-router-dom';
import { useDashboard } from './queries';

function fmt(dt: string) {
  return new Date(dt).toLocaleString();
}

type NamedContact = {
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
};

function nameOf(c: NamedContact) {
  return (
    c.displayName ||
    [c.firstName, c.lastName].filter(Boolean).join(' ') ||
    c.email ||
    '(no name)'
  );
}

export default function DashboardPage() {
  const { followups, recent, fresh } = useDashboard();

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <span style={{ opacity: 0.7 }}>
          <Link to='/contacts'>Contacts</Link>
        </span>
      </div>

      <div
        style={{
          marginTop: 18,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 16,
          alignItems: 'start',
        }}
      >
        {/* Follow-ups due */}
        <section
          style={{
            border: '1px solid rgba(0,0,0,0.12)',
            borderRadius: 10,
            padding: 14,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Follow-ups due</h2>
          {followups.isLoading && <p>Loading…</p>}
          {followups.isError && <p>Failed to load.</p>}
          {!followups.isLoading && !followups.isError && (
            <>
              {followups.data?.length ? (
                <ul style={{ paddingLeft: 16 }}>
                  {followups.data.map((it) => (
                    <li key={it.id} style={{ marginBottom: 10 }}>
                      <div style={{ fontWeight: 600 }}>
                        <Link to={`/contacts/${it.contact.id}`}>
                          {nameOf(it.contact)}
                        </Link>
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.75 }}>
                        {it.nextFollowUpAt
                          ? `Due: ${fmt(it.nextFollowUpAt)}`
                          : ''}
                        {it.subject ? ` • ${it.subject}` : ''}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ opacity: 0.75 }}>Nothing due right now.</p>
              )}
            </>
          )}
        </section>

        {/* Recently contacted */}
        <section
          style={{
            border: '1px solid rgba(0,0,0,0.12)',
            borderRadius: 10,
            padding: 14,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Recently contacted</h2>
          {recent.isLoading && <p>Loading…</p>}
          {recent.isError && <p>Failed to load.</p>}
          {!recent.isLoading && !recent.isError && (
            <>
              {recent.data?.length ? (
                <ul style={{ paddingLeft: 16 }}>
                  {recent.data.map((c) => (
                    <li key={c.id} style={{ marginBottom: 10 }}>
                      <div style={{ fontWeight: 600 }}>
                        <Link to={`/contacts/${c.id}`}>{nameOf(c)}</Link>
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.75 }}>
                        {c.lastContactedAt ? fmt(c.lastContactedAt) : ''}
                        {c.company ? ` • ${c.company}` : ''}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ opacity: 0.75 }}>No recent contacts yet.</p>
              )}
            </>
          )}
        </section>

        {/* New / Not contacted */}
        <section
          style={{
            border: '1px solid rgba(0,0,0,0.12)',
            borderRadius: 10,
            padding: 14,
          }}
        >
          <h2 style={{ marginTop: 0 }}>New / not contacted</h2>
          {fresh.isLoading && <p>Loading…</p>}
          {fresh.isError && <p>Failed to load.</p>}
          {!fresh.isLoading && !fresh.isError && (
            <>
              {fresh.data?.length ? (
                <ul style={{ paddingLeft: 16 }}>
                  {fresh.data.map((c) => (
                    <li key={c.id} style={{ marginBottom: 10 }}>
                      <div style={{ fontWeight: 600 }}>
                        <Link to={`/contacts/${c.id}`}>{nameOf(c)}</Link>
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.75 }}>
                        {c.email ?? ''}
                        {c.tags?.length ? ` • ${c.tags.join(', ')}` : ''}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ opacity: 0.75 }}>
                  Everyone has interactions logged.
                </p>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
