import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import page from '../../components/ui/Page/Page.module.scss';
import card from '../../components/ui/Card/Card.module.scss';
import list from '../../components/ui/ResourceList/ResourceList.module.scss';
import { Badge, type BadgeTone } from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';

import { useFollowUpQueue } from './queries';
import type { FollowUpQueueItem } from './api';

type FilterKey = 'all' | 'due' | 'soon' | 'scheduled';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'due', label: 'Due' },
  { key: 'soon', label: 'Due soon' },
  { key: 'scheduled', label: 'Scheduled' },
];

function msUntil(dt: string) {
  return new Date(dt).getTime() - Date.now();
}

function followUpTone(nextFollowUpAt: string | null): {
  tone: BadgeTone;
  label: string;
} {
  if (!nextFollowUpAt) return { tone: 'default', label: '' };

  const ms = msUntil(nextFollowUpAt);
  const day = 24 * 60 * 60 * 1000;

  if (ms <= 0) return { tone: 'danger', label: 'Due' };
  if (ms <= 3 * day) return { tone: 'warn', label: 'Soon' };
  return { tone: 'primary', label: 'Scheduled' };
}

function bucketForItem(nextFollowUpAt: string): FilterKey {
  const ms = msUntil(nextFollowUpAt);
  const day = 24 * 60 * 60 * 1000;
  if (ms <= 0) return 'due';
  if (ms <= 3 * day) return 'soon';
  return 'scheduled';
}

function nameOf(c: FollowUpQueueItem['contact']) {
  return (
    c.displayName ||
    [c.firstName, c.lastName].filter(Boolean).join(' ') ||
    c.email ||
    '(no name)'
  );
}

function fmt(dt: string) {
  return new Date(dt).toLocaleString();
}

export default function FollowUpsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get('filter');
  const filter: FilterKey =
    raw === 'due' || raw === 'soon' || raw === 'scheduled' || raw === 'all'
      ? raw
      : 'all';

  const queue = useFollowUpQueue();

  const filtered = useMemo(() => {
    const items = queue.data ?? [];
    if (filter === 'all') return items;
    return items.filter((it) => bucketForItem(it.nextFollowUpAt) === filter);
  }, [queue.data, filter]);

  function setFilter(next: FilterKey) {
    setSearchParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        if (next === 'all') p.delete('filter');
        else p.set('filter', next);
        return p;
      },
      { replace: true },
    );
  }

  if (queue.isLoading) {
    return (
      <div className={page.page}>
        <div className={page.container}>
          <div className={page.headerRow}>
            <h1 className={page.title}>Follow-ups</h1>
          </div>
          <div className={page.subtle}>Loading…</div>
        </div>
      </div>
    );
  }

  if (queue.isError) {
    return (
      <div className={page.page}>
        <div className={page.container}>
          <div className={page.headerRow}>
            <h1 className={page.title}>Follow-ups</h1>
          </div>
          <div className={page.subtle}>Failed to load follow-ups.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={page.page}>
      <div className={page.container}>
        <div className={page.headerRow}>
          <div>
            <h1 className={page.title}>Follow-ups</h1>
            <div className={page.subtle}>
              Interactions with a next follow-up date, soonest first
            </div>
          </div>
        </div>

        <div className={card.card}>
          <div className={card.cardTitle}>Filter</div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              alignItems: 'center',
            }}
          >
            {FILTERS.map((f) => (
              <Button
                key={f.key}
                variant={filter === f.key ? 'contained' : 'outline'}
                color={filter === f.key ? 'primary' : 'neutral'}
                size='lg'
                type='button'
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>

        <div style={{ height: 14 }} />

        <div className={page.subtle}>
          {filtered.length} item(s)
          {filter !== 'all' ? ` (filtered)` : ''}
        </div>
        <div style={{ height: 10 }} />

        <div className={list.list}>
          {filtered.map((it) => {
            const chip = followUpTone(it.nextFollowUpAt);

            return (
              <article key={it.id} className={list.item}>
                <div className={list.itemHeader}>
                  <div className={list.titleBlock}>
                    <div className={list.title}>
                      <Link to={`/contacts/${it.contact.id}`}>
                        {nameOf(it.contact)}
                      </Link>
                    </div>
                    {it.contact.company ? (
                      <div className={list.sub}>{it.contact.company}</div>
                    ) : null}
                  </div>
                  <div className={list.badges}>
                    <Badge tone={chip.tone}>{chip.label}</Badge>
                    <Badge tone='default'>{it.type}</Badge>
                  </div>
                </div>

                <div className={list.meta}>
                  <div className={list.metaCell}>
                    <div className={list.metaLabel}>Follow-up due</div>
                    <div className={list.metaValue}>{fmt(it.nextFollowUpAt)}</div>
                  </div>
                  <div className={list.metaCell}>
                    <div className={list.metaLabel}>Subject</div>
                    <div className={list.metaValue}>
                      {it.subject ?? <span className={list.muted}>—</span>}
                    </div>
                  </div>
                  <div className={list.metaCell}>
                    <div className={list.metaLabel}>Outcome</div>
                    <div className={list.metaValue}>
                      {it.outcome ?? <span className={list.muted}>—</span>}
                    </div>
                  </div>
                </div>

                {(it.band || it.festival) && (
                  <div
                    style={{
                      marginTop: 10,
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 8,
                      fontSize: 13,
                    }}
                  >
                    {it.band ? (
                      <Link
                        to={`/bands/${it.band.id}`}
                        style={{ fontWeight: 600 }}
                      >
                        Band: {it.band.name}
                      </Link>
                    ) : null}
                    {it.festival ? (
                      <Link
                        to={`/festivals/${it.festival.id}`}
                        style={{ fontWeight: 600 }}
                      >
                        Festival: {it.festival.name}
                      </Link>
                    ) : null}
                  </div>
                )}

                <div className={list.actions}>
                  <Link
                    to={`/contacts/${it.contact.id}`}
                    className={list.actionLink}
                  >
                    Open contact
                  </Link>
                </div>
              </article>
            );
          })}

          {filtered.length === 0 ? (
            <div className={list.empty}>
              {filter === 'all'
                ? 'No scheduled follow-ups.'
                : 'Nothing in this filter.'}
            </div>
          ) : null}
        </div>

        <div style={{ height: 14 }} />
        <div className={page.subtle}>
          <Link to='/dashboard'>← Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
