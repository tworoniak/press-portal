import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  LayoutDashboard,
  Music,
  Plus,
  User,
  Users,
} from 'lucide-react';

import { useContactSearch } from '../../../features/contacts/searchQueries';
import { useBands, useCreateBand } from '../../../features/bands/queries';
import {
  useFestivals,
  useCreateFestival,
} from '../../../features/festivals/queries';

import styles from './CommandPalette.module.scss';

type NavResult =
  | { kind: 'contact'; id: string; title: string; subtitle?: string }
  | { kind: 'band'; id: string; title: string; subtitle?: string }
  | { kind: 'festival'; id: string; title: string; subtitle?: string };

type CreateResult =
  | { kind: 'create-band'; name: string }
  | { kind: 'create-festival'; name: string };

type ActionResult = {
  kind: 'action';
  id: string;
  title: string;
  subtitle?: string;
  actionType:
    | 'go-dashboard'
    | 'go-contacts'
    | 'go-bands'
    | 'go-festivals'
    | 'create-contact';
};

type Result = NavResult | CreateResult | ActionResult;

const RECENT_KEY = 'pp_palette_recent';
const RECENT_MAX = 10;

function contactTitle(c: {
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

function isNavResult(r: Result): r is NavResult {
  return r.kind === 'contact' || r.kind === 'band' || r.kind === 'festival';
}

function readRecent(): NavResult[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((x): x is NavResult => {
      return (
        !!x &&
        typeof x === 'object' &&
        'kind' in x &&
        'id' in x &&
        'title' in x &&
        (x.kind === 'contact' || x.kind === 'band' || x.kind === 'festival') &&
        typeof x.id === 'string' &&
        typeof x.title === 'string'
      );
    });
  } catch {
    return [];
  }
}

function writeRecent(next: NavResult[]) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(next.slice(0, RECENT_MAX)));
}

function pushRecent(r: NavResult) {
  const prev = readRecent();
  const without = prev.filter((x) => !(x.kind === r.kind && x.id === r.id));
  writeRecent([r, ...without]);
}

function iconFor(r: Result) {
  switch (r.kind) {
    case 'contact':
      return <User size={14} />;
    case 'band':
      return <Music size={14} />;
    case 'festival':
      return <CalendarDays size={14} />;
    case 'create-band':
    case 'create-festival':
      return <Plus size={14} />;
    case 'action':
      switch (r.actionType) {
        case 'go-dashboard':
          return <LayoutDashboard size={14} />;
        case 'go-contacts':
        case 'create-contact':
          return <Users size={14} />;
        case 'go-bands':
          return <Music size={14} />;
        case 'go-festivals':
          return <CalendarDays size={14} />;
        default:
          return <Plus size={14} />;
      }
    default:
      return null;
  }
}

function labelForKind(r: Result) {
  switch (r.kind) {
    case 'contact':
      return 'contact';
    case 'band':
      return 'band';
    case 'festival':
      return 'festival';
    case 'create-band':
    case 'create-festival':
      return 'create';
    case 'action':
      return 'action';
    default:
      return '';
  }
}

export function CommandPalette() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const trimmed = q.trim();
  const enabled = open && trimmed.length >= 2;

  const contactsQ = useContactSearch(q, enabled);
  const bandsQ = useBands(q, enabled);
  const festivalsQ = useFestivals(q, enabled);

  const createBand = useCreateBand();
  const createFestival = useCreateFestival();

  function close() {
    setOpen(false);
    setQ('');
    setActiveIndex(0);
  }

  function setQuery(next: string) {
    setQ(next);
    setActiveIndex(0);
  }

  const quickActions: ActionResult[] = useMemo(
    () => [
      {
        kind: 'action',
        id: 'go-dashboard',
        title: 'Go to Dashboard',
        subtitle: 'Jump to your overview',
        actionType: 'go-dashboard',
      },
      {
        kind: 'action',
        id: 'go-contacts',
        title: 'Go to Contacts',
        subtitle: 'Browse and manage press contacts',
        actionType: 'go-contacts',
      },
      {
        kind: 'action',
        id: 'go-bands',
        title: 'Go to Bands',
        subtitle: 'Browse linked bands',
        actionType: 'go-bands',
      },
      {
        kind: 'action',
        id: 'go-festivals',
        title: 'Go to Festivals',
        subtitle: 'Browse linked festivals',
        actionType: 'go-festivals',
      },
      {
        kind: 'action',
        id: 'create-contact',
        title: 'Create Contact',
        subtitle: 'Open the new contact modal',
        actionType: 'create-contact',
      },
    ],
    [],
  );

  const contacts: NavResult[] = useMemo(() => {
    if (!enabled) return [];
    return (contactsQ.data ?? []).slice(0, 6).map((c) => ({
      kind: 'contact',
      id: c.id,
      title: contactTitle(c),
      subtitle: [c.company, c.email].filter(Boolean).join(' • ') || undefined,
    }));
  }, [enabled, contactsQ.data]);

  const bands: NavResult[] = useMemo(() => {
    if (!enabled) return [];
    return (bandsQ.data ?? []).slice(0, 6).map((b) => ({
      kind: 'band',
      id: b.id,
      title: b.name,
      subtitle: [b.genre, b.country].filter(Boolean).join(' • ') || undefined,
    }));
  }, [enabled, bandsQ.data]);

  const festivals: NavResult[] = useMemo(() => {
    if (!enabled) return [];
    return (festivalsQ.data ?? []).slice(0, 6).map((f) => ({
      kind: 'festival',
      id: f.id,
      title: f.name,
      subtitle: f.location || undefined,
    }));
  }, [enabled, festivalsQ.data]);

  const createActions: CreateResult[] = useMemo(() => {
    if (!enabled || trimmed.length < 2) return [];
    return [
      { kind: 'create-band', name: trimmed },
      { kind: 'create-festival', name: trimmed },
    ];
  }, [enabled, trimmed]);

  const searchResults: Result[] = useMemo(() => {
    if (!enabled) return [];
    return [...contacts, ...bands, ...festivals, ...createActions];
  }, [enabled, contacts, bands, festivals, createActions]);

  const recent = useMemo(() => (open ? readRecent() : []), [open]);

  const showRecent = open && trimmed.length < 2;
  const showQuickActions = open && trimmed.length < 2;

  const activeList: Result[] = showRecent
    ? [...quickActions, ...recent]
    : searchResults;

  const isLoading =
    enabled &&
    (contactsQ.isLoading || bandsQ.isLoading || festivalsQ.isLoading);

  const isError =
    enabled && (contactsQ.isError || bandsQ.isError || festivalsQ.isError);

  async function go(r: Result) {
    if (isNavResult(r)) {
      pushRecent(r);
    }

    if (r.kind === 'contact') navigate(`/contacts/${r.id}`);
    if (r.kind === 'band') navigate(`/bands/${r.id}`);
    if (r.kind === 'festival') navigate(`/festivals/${r.id}`);

    if (r.kind === 'create-band') {
      const created = await createBand.mutateAsync({ name: r.name });
      pushRecent({ kind: 'band', id: created.id, title: created.name });
      navigate(`/bands/${created.id}`);
    }

    if (r.kind === 'create-festival') {
      const created = await createFestival.mutateAsync({ name: r.name });
      pushRecent({ kind: 'festival', id: created.id, title: created.name });
      navigate(`/festivals/${created.id}`);
    }

    if (r.kind === 'action') {
      switch (r.actionType) {
        case 'go-dashboard':
          navigate('/dashboard');
          break;
        case 'go-contacts':
          navigate('/contacts');
          break;
        case 'go-bands':
          navigate('/bands');
          break;
        case 'go-festivals':
          navigate('/festivals');
          break;
        case 'create-contact':
          navigate('/contacts?create=1');
          break;
      }
    }

    close();
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isK = e.key.toLowerCase() === 'k';
      const mod = e.metaKey || e.ctrlKey;

      if (mod && isK) {
        e.preventDefault();
        setOpen((v) => !v);
        setQ('');
        setActiveIndex(0);
        return;
      }

      if (!open) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }

      const len = activeList.length;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => {
          if (len === 0) return 0;
          return (i + 1) % len;
        });
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => {
          if (len === 0) return 0;
          return (i - 1 + len) % len;
        });
        return;
      }

      if (e.key === 'Enter') {
        const r = activeList[activeIndex];
        if (r) {
          e.preventDefault();
          void go(r);
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, activeList, activeIndex]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      onMouseDown={close}
      role='dialog'
      aria-modal='true'
    >
      <div className={styles.panel} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <input
            ref={inputRef}
            className={styles.input}
            value={q}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search contacts, bands, festivals…'
            aria-label='Search'
          />
          <div className={styles.hint}>Esc</div>
        </div>

        <div className={styles.body}>
          {showQuickActions ? (
            <>
              <div className={styles.section}>
                <Plus size={14} /> Quick actions
              </div>
              <div className={styles.list}>
                {quickActions.map((r, idx) => (
                  <button
                    key={`action:${r.id}`}
                    type='button'
                    className={`${styles.row} ${idx === activeIndex ? styles.active : ''}`}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => void go(r)}
                  >
                    <div className={styles.rowTop}>
                      <span className={styles.kind}>
                        {iconFor(r)} {labelForKind(r)}
                      </span>
                      <span className={styles.title}>{r.title}</span>
                    </div>
                    {r.subtitle ? (
                      <div className={styles.subtitle}>{r.subtitle}</div>
                    ) : null}
                  </button>
                ))}
              </div>

              {recent.length ? (
                <>
                  <div className={styles.section}>
                    <Clock size={14} /> Recent
                  </div>
                  <div className={styles.list}>
                    {recent.slice(0, 8).map((r, idx) => {
                      const absoluteIdx = quickActions.length + idx;
                      return (
                        <button
                          key={`recent:${r.kind}:${r.id}`}
                          type='button'
                          className={`${styles.row} ${absoluteIdx === activeIndex ? styles.active : ''}`}
                          onMouseEnter={() => setActiveIndex(absoluteIdx)}
                          onClick={() => void go(r)}
                        >
                          <div className={styles.rowTop}>
                            <span className={styles.kind}>
                              {iconFor(r)} {labelForKind(r)}
                            </span>
                            <span className={styles.title}>{r.title}</span>
                          </div>
                          {r.subtitle ? (
                            <div className={styles.subtitle}>{r.subtitle}</div>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : null}
            </>
          ) : isLoading ? (
            <div className={styles.state}>Searching…</div>
          ) : isError ? (
            <div className={styles.state}>Something went wrong.</div>
          ) : searchResults.length === 0 ? (
            <div className={styles.state}>No results.</div>
          ) : (
            <>
              {contacts.length ? (
                <>
                  <div className={styles.section}>
                    <User size={14} /> Contacts
                  </div>
                  <div className={styles.list}>
                    {contacts.map((r) => {
                      const idx = searchResults.findIndex(
                        (x) =>
                          isNavResult(x) && x.kind === r.kind && x.id === r.id,
                      );
                      return (
                        <button
                          key={`${r.kind}:${r.id}`}
                          type='button'
                          className={`${styles.row} ${idx === activeIndex ? styles.active : ''}`}
                          onMouseEnter={() => setActiveIndex(idx)}
                          onClick={() => void go(r)}
                        >
                          <div className={styles.rowTop}>
                            <span className={styles.kind}>
                              {iconFor(r)} {labelForKind(r)}
                            </span>
                            <span className={styles.title}>{r.title}</span>
                          </div>
                          {r.subtitle ? (
                            <div className={styles.subtitle}>{r.subtitle}</div>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : null}

              {bands.length ? (
                <>
                  <div className={styles.section}>
                    <Music size={14} /> Bands
                  </div>
                  <div className={styles.list}>
                    {bands.map((r) => {
                      const idx = searchResults.findIndex(
                        (x) =>
                          isNavResult(x) && x.kind === r.kind && x.id === r.id,
                      );
                      return (
                        <button
                          key={`${r.kind}:${r.id}`}
                          type='button'
                          className={`${styles.row} ${idx === activeIndex ? styles.active : ''}`}
                          onMouseEnter={() => setActiveIndex(idx)}
                          onClick={() => void go(r)}
                        >
                          <div className={styles.rowTop}>
                            <span className={styles.kind}>
                              {iconFor(r)} {labelForKind(r)}
                            </span>
                            <span className={styles.title}>{r.title}</span>
                          </div>
                          {r.subtitle ? (
                            <div className={styles.subtitle}>{r.subtitle}</div>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : null}

              {festivals.length ? (
                <>
                  <div className={styles.section}>
                    <CalendarDays size={14} /> Festivals
                  </div>
                  <div className={styles.list}>
                    {festivals.map((r) => {
                      const idx = searchResults.findIndex(
                        (x) =>
                          isNavResult(x) && x.kind === r.kind && x.id === r.id,
                      );
                      return (
                        <button
                          key={`${r.kind}:${r.id}`}
                          type='button'
                          className={`${styles.row} ${idx === activeIndex ? styles.active : ''}`}
                          onMouseEnter={() => setActiveIndex(idx)}
                          onClick={() => void go(r)}
                        >
                          <div className={styles.rowTop}>
                            <span className={styles.kind}>
                              {iconFor(r)} {labelForKind(r)}
                            </span>
                            <span className={styles.title}>{r.title}</span>
                          </div>
                          {r.subtitle ? (
                            <div className={styles.subtitle}>{r.subtitle}</div>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : null}

              {createActions.length ? (
                <>
                  <div className={styles.section}>
                    <Plus size={14} /> Create
                  </div>
                  <div className={styles.list}>
                    {createActions.map((r) => {
                      const idx = searchResults.findIndex((x) => x === r);
                      const title =
                        r.kind === 'create-band'
                          ? `Create band "${r.name}"`
                          : `Create festival "${r.name}"`;

                      return (
                        <button
                          key={`${r.kind}:${r.name}`}
                          type='button'
                          className={`${styles.row} ${idx === activeIndex ? styles.active : ''}`}
                          onMouseEnter={() => setActiveIndex(idx)}
                          onClick={() => void go(r)}
                        >
                          <div className={styles.rowTop}>
                            <span className={styles.kind}>
                              {iconFor(r)} {labelForKind(r)}
                            </span>
                            <span className={styles.title}>{title}</span>
                          </div>
                          <div className={styles.subtitle}>
                            Press Enter to create and open detail page
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : null}
            </>
          )}
        </div>

        <div className={styles.footer}>
          <span>↑↓</span>
          <span>Enter</span>
          <span>Esc</span>
          <span className={styles.spacer} />
          <span className={styles.muted}>Tip: Ctrl/⌘ + K</span>
        </div>
      </div>
    </div>
  );
}
