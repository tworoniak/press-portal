import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useDashboard } from './queries';
import { Badge } from '../../components/ui/Badge/Badge';

import page from '../../components/ui/Page/Page.module.scss';
import card from '../../components/ui/Card/Card.module.scss';
import styles from './DashboardPage.module.scss';

function msUntil(dt: string) {
  return new Date(dt).getTime() - Date.now();
}

function followUpTone(nextFollowUpAt: string | null) {
  if (!nextFollowUpAt) return { tone: 'default' as const, label: '' };

  const ms = msUntil(nextFollowUpAt);
  const day = 24 * 60 * 60 * 1000;

  if (ms <= 0) return { tone: 'danger' as const, label: 'Due' };
  if (ms <= 3 * day) return { tone: 'warn' as const, label: 'Soon' };
  return { tone: 'default' as const, label: 'Scheduled' };
}

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

  const summary = useMemo(() => {
    const items = followups.data ?? [];
    let due = 0;
    let soon = 0;
    let scheduled = 0;

    for (const it of items) {
      const chip = followUpTone(it.nextFollowUpAt);
      if (chip.label === 'Due') due += 1;
      else if (chip.label === 'Soon') soon += 1;
      else if (chip.label === 'Scheduled') scheduled += 1;
    }

    return { due, soon, scheduled };
  }, [followups.data]);

  return (
    <div className={page.page}>
      <div className={page.container}>
        <div className={page.headerRow}>
          <h1 className={page.title}>Dashboard</h1>
          {/* <div className={page.nav}>
            <Link to='/contacts'>Contacts</Link>
          </div> */}
        </div>

        {/* Summary row */}
        <div className={styles.summary}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Due</div>
            <div className={styles.summaryValue}>{summary.due}</div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Due soon</div>
            <div className={styles.summaryValue}>{summary.soon}</div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Scheduled</div>
            <div className={styles.summaryValue}>{summary.scheduled}</div>
          </div>
        </div>

        {/* 3-column responsive grid */}
        <div className={styles.grid}>
          {/* Follow-ups */}
          <section className={card.card}>
            <h2 className={card.cardTitle}>Follow-ups</h2>

            {followups.isLoading && <div className={page.subtle}>Loading…</div>}
            {followups.isError && (
              <div className={page.subtle}>Failed to load.</div>
            )}

            {!followups.isLoading && !followups.isError && (
              <>
                {followups.data?.length ? (
                  <ul className={styles.list}>
                    {followups.data.map((it) => {
                      const chip = followUpTone(it.nextFollowUpAt);

                      return (
                        <li key={it.id} className={styles.listItem}>
                          <div className={styles.itemRow}>
                            <div className={styles.itemTitle}>
                              <Link to={`/contacts/${it.contact.id}`}>
                                {nameOf(it.contact)}
                              </Link>
                            </div>

                            {chip.label ? (
                              <Badge tone={chip.tone}>{chip.label}</Badge>
                            ) : null}
                          </div>

                          <div className={page.subtle} style={{ marginTop: 4 }}>
                            {it.nextFollowUpAt
                              ? `Due: ${fmt(it.nextFollowUpAt)}`
                              : ''}
                            {it.subject ? ` • ${it.subject}` : ''}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className={page.subtle}>Nothing due right now.</div>
                )}
              </>
            )}
          </section>

          {/* Recently contacted */}
          <section className={card.card}>
            <h2 className={card.cardTitle}>Recently contacted</h2>

            {recent.isLoading && <div className={page.subtle}>Loading…</div>}
            {recent.isError && (
              <div className={page.subtle}>Failed to load.</div>
            )}

            {!recent.isLoading && !recent.isError && (
              <>
                {recent.data?.length ? (
                  <ul className={styles.list}>
                    {recent.data.map((c) => (
                      <li key={c.id} className={styles.listItem}>
                        <div className={styles.itemTitle}>
                          <Link to={`/contacts/${c.id}`}>{nameOf(c)}</Link>
                        </div>
                        <div className={page.subtle} style={{ marginTop: 4 }}>
                          {c.lastContactedAt ? fmt(c.lastContactedAt) : ''}
                          {c.company ? ` • ${c.company}` : ''}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={page.subtle}>No recent contacts yet.</div>
                )}
              </>
            )}
          </section>

          {/* New / Not contacted */}
          <section className={card.card}>
            <h2 className={card.cardTitle}>New / not contacted</h2>

            {fresh.isLoading && <div className={page.subtle}>Loading…</div>}
            {fresh.isError && (
              <div className={page.subtle}>Failed to load.</div>
            )}

            {!fresh.isLoading && !fresh.isError && (
              <>
                {fresh.data?.length ? (
                  <ul className={styles.list}>
                    {fresh.data.map((c) => (
                      <li key={c.id} className={styles.listItem}>
                        <div className={styles.itemTitle}>
                          <Link to={`/contacts/${c.id}`}>{nameOf(c)}</Link>
                        </div>
                        <div className={page.subtle} style={{ marginTop: 4 }}>
                          {c.email ?? ''}
                          {c.tags?.length ? ` • ${c.tags.join(', ')}` : ''}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={page.subtle}>
                    Everyone has interactions logged.
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
