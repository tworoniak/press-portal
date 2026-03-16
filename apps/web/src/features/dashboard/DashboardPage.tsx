import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge } from '../../components/ui/Badge/Badge';
import { useDashboardOverview } from './queries';

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

function fmtDate(dt: string | null) {
  if (!dt) return '—';
  return new Date(dt).toLocaleDateString();
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

const pieColors = ['#ef4444', '#f59e0b', '#7c5cff'];

export default function DashboardPage() {
  const overview = useDashboardOverview();

  if (overview.isLoading) {
    return (
      <div className={page.page}>
        <div className={page.container}>
          <div className={page.headerRow}>
            <h1 className={page.title}>Dashboard</h1>
          </div>
          <div className={page.subtle}>Loading dashboard…</div>
        </div>
      </div>
    );
  }

  if (overview.isError || !overview.data) {
    return (
      <div className={page.page}>
        <div className={page.container}>
          <div className={page.headerRow}>
            <h1 className={page.title}>Dashboard</h1>
          </div>
          <div className={page.subtle}>Failed to load dashboard.</div>
        </div>
      </div>
    );
  }

  const {
    summary,
    pipeline,
    interactionsLast7Days,
    followups,
    recentContacts,
    freshContacts,
    recentInteractions,
    upcomingFestivals,
  } = overview.data;

  return (
    <div className={page.page}>
      <div className={page.container}>
        <div className={page.headerRow}>
          <div>
            <h1 className={page.title}>Dashboard</h1>
            <div className={page.subtle}>Your press outreach overview</div>
          </div>
        </div>

        {/* KPI row */}
        <div className={styles.summary}>
          <div className={`${styles.summaryCard} ${styles.kpiDanger}`}>
            <div className={styles.summaryLabel}>Due</div>
            <div className={styles.summaryValue}>{summary.due}</div>
            <div className={styles.summaryHint}>Overdue follow-ups</div>
          </div>

          <div className={`${styles.summaryCard} ${styles.kpiWarn}`}>
            <div className={styles.summaryLabel}>Due soon</div>
            <div className={styles.summaryValue}>{summary.soon}</div>
            <div className={styles.summaryHint}>Next 3 days</div>
          </div>

          <div className={`${styles.summaryCard} ${styles.kpiDefault}`}>
            <div className={styles.summaryLabel}>Scheduled</div>
            <div className={styles.summaryValue}>{summary.scheduled}</div>
            <div className={styles.summaryHint}>Future reminders</div>
          </div>

          {/* <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Contacts</div>
            <div className={styles.summaryValue}>{summary.totalContacts}</div>
            <div className={styles.summaryHint}>Total tracked contacts</div>
          </div> */}
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Contacts</div>
            <div className={styles.summaryValue}>{summary.totalContacts}</div>
            <div className={styles.summaryHint}>Total tracked contacts</div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Bands</div>
            <div className={styles.summaryValue}>{summary.totalBands}</div>
            <div className={styles.summaryHint}>Total tracked bands</div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Festivals</div>
            <div className={styles.summaryValue}>{summary.totalFestivals}</div>
            <div className={styles.summaryHint}>Upcoming and archived</div>
          </div>
        </div>

        {/* Charts row */}
        <div className={styles.chartGrid}>
          {/* Pie/Donut Chart */}
          <section className={card.card}>
            <div className={styles.chartHeader}>
              <h2 className={card.cardTitle}>Follow-up pipeline</h2>
              <div className={page.subtle}>Due vs soon vs scheduled</div>
            </div>

            <div className={styles.chartWrap}>
              <ResponsiveContainer width='100%' height={260}>
                <PieChart>
                  <Pie
                    data={pipeline}
                    dataKey='value'
                    nameKey='name'
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={0}
                  >
                    {pipeline.map((entry, index) => (
                      <Cell
                        key={`${entry.name}-${index}`}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      padding: '4px 8px',
                    }}
                    itemStyle={{
                      color: '#e2e8f0',
                      fontSize: '13px',
                    }}
                    labelStyle={{
                      color: '#94a3b8',
                      fontSize: '12px',
                      marginBottom: '4px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.legend}>
              {pipeline.map((item, index) => (
                <div key={item.name} className={styles.legendItem}>
                  <span
                    className={styles.legendDot}
                    style={{
                      backgroundColor: pieColors[index % pieColors.length],
                    }}
                  />
                  <span>{item.name}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </section>

          {/* Bar Chart */}
          <section className={card.card}>
            <div className={styles.chartHeader}>
              <h2 className={card.cardTitle}>Interactions this week</h2>
              <div className={page.subtle}>Last 7 days</div>
            </div>

            <div className={styles.chartWrap}>
              <ResponsiveContainer width='100%' height={260}>
                <BarChart data={interactionsLast7Days}>
                  <CartesianGrid
                    stroke='rgba(255,255,255,0.08)'
                    vertical={false}
                  />
                  <XAxis
                    dataKey='day'
                    tick={{ fill: 'rgba(255,255,255,0.65)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: 'rgba(255,255,255,0.65)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                    }}
                    itemStyle={{
                      color: '#e2e8f0',
                      fontSize: '13px',
                    }}
                    labelStyle={{
                      color: '#94a3b8',
                      fontSize: '12px',
                      marginBottom: '4px',
                    }}
                    cursor={{ fill: 'transparent' }}
                  />
                  <Bar
                    dataKey='count'
                    barSize='30'
                    // radius={[8, 8, 0, 0]}
                    fill='#7c5cff'
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Lists */}
        <div className={styles.grid}>
          <section className={card.card}>
            <h2 className={card.cardTitle}>Follow-ups</h2>

            {followups.length ? (
              <ul className={styles.list}>
                {followups.map((it) => {
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
              <div className={page.subtle}>You’re clear for now.</div>
            )}
          </section>

          <section className={card.card}>
            <h2 className={card.cardTitle}>Recently contacted</h2>

            {recentContacts.length ? (
              <ul className={styles.list}>
                {recentContacts.map((c) => (
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
          </section>

          <section className={card.card}>
            <h2 className={card.cardTitle}>New / not contacted</h2>

            {freshContacts.length ? (
              <ul className={styles.list}>
                {freshContacts.map((c) => (
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
          </section>
        </div>

        <div className={styles.grid}>
          <section className={card.card}>
            <h2 className={card.cardTitle}>Upcoming festivals</h2>

            {upcomingFestivals.length ? (
              <ul className={styles.list}>
                {upcomingFestivals.map((f) => (
                  <li key={f.id} className={styles.listItem}>
                    <div className={styles.itemTitle}>
                      <Link to={`/festivals/${f.id}`}>{f.name}</Link>
                    </div>
                    <div className={page.subtle} style={{ marginTop: 4 }}>
                      {f.location ?? '—'}
                      {f.startDate ? ` • ${fmtDate(f.startDate)}` : ''}
                      {f.endDate ? ` – ${fmtDate(f.endDate)}` : ''}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={page.subtle}>No upcoming festivals.</div>
            )}
          </section>

          <section className={card.card}>
            <h2 className={card.cardTitle}>Recent interactions</h2>

            {recentInteractions.length ? (
              <ul className={styles.list}>
                {recentInteractions.map((it) => (
                  <li key={it.id} className={styles.listItem}>
                    <div className={styles.itemRow}>
                      <div className={styles.itemTitle}>
                        <Link to={`/contacts/${it.contact.id}`}>
                          {nameOf(it.contact)}
                        </Link>
                      </div>
                      <Badge tone='primary'>{it.type}</Badge>
                    </div>

                    <div className={page.subtle} style={{ marginTop: 4 }}>
                      {fmt(it.occurredAt)}
                      {it.subject ? ` • ${it.subject}` : ''}
                      {it.band ? ` • ${it.band.name}` : ''}
                      {it.festival ? ` • ${it.festival.name}` : ''}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={page.subtle}>No recent interactions yet.</div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
