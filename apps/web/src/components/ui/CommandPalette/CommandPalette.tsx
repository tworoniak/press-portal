import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useContactSearch } from '../../../features/contacts/searchQueries';
import { useBands } from '../../../features/bands/queries';
import { useFestivals } from '../../../features/festivals/queries';

import styles from './CommandPalette.module.scss';

type Result =
  | { kind: 'contact'; id: string; title: string; subtitle?: string }
  | { kind: 'band'; id: string; title: string; subtitle?: string }
  | { kind: 'festival'; id: string; title: string; subtitle?: string };

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

export function CommandPalette() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  // results enabled only when palette open + 2 chars
  const enabled = open && q.trim().length >= 2;

  const contactsQ = useContactSearch(q, enabled);
  const bandsQ = useBands(q, enabled);
  const festivalsQ = useFestivals(q, enabled);

  const results: Result[] = useMemo(() => {
    if (!enabled) return [];

    const contacts: Result[] = (contactsQ.data ?? []).slice(0, 6).map((c) => ({
      kind: 'contact',
      id: c.id,
      title: contactTitle(c),
      subtitle: [c.company, c.email].filter(Boolean).join(' • ') || undefined,
    }));

    const bands: Result[] = (bandsQ.data ?? []).slice(0, 6).map((b) => ({
      kind: 'band',
      id: b.id,
      title: b.name,
      subtitle: [b.genre, b.country].filter(Boolean).join(' • ') || undefined,
    }));

    const festivals: Result[] = (festivalsQ.data ?? [])
      .slice(0, 6)
      .map((f) => ({
        kind: 'festival',
        id: f.id,
        title: f.name,
        subtitle: f.location || undefined,
      }));

    return [...contacts, ...bands, ...festivals];
  }, [enabled, contactsQ.data, bandsQ.data, festivalsQ.data]);

  const isLoading =
    enabled &&
    (contactsQ.isLoading || bandsQ.isLoading || festivalsQ.isLoading);
  const isError =
    enabled && (contactsQ.isError || bandsQ.isError || festivalsQ.isError);

  const [activeIndex, setActiveIndex] = useState(0);

  const safeActiveIndex = results.length
    ? Math.min(activeIndex, results.length - 1)
    : 0;

  //   function close() {
  //     setOpen(false);
  //     setQ('');
  //     setActiveIndex(0);
  //   }
  function openPalette() {
    setOpen(true);
    setQ('');
    setActiveIndex(0);
  }

  function closePalette() {
    setOpen(false);
    setQ('');
    setActiveIndex(0);
  }

  const go = useCallback(
    (r: Result) => {
      if (r.kind === 'contact') navigate(`/contacts/${r.id}`);
      if (r.kind === 'band') navigate(`/bands/${r.id}`);
      if (r.kind === 'festival') navigate(`/festivals/${r.id}`);
      closePalette();
    },
    [navigate],
  );

  function setQuery(next: string) {
    setQ(next);
    setActiveIndex(0);
  }

  // ⌘K / Ctrl+K to open
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isK = e.key.toLowerCase() === 'k';
      const mod = e.metaKey || e.ctrlKey;

      if (mod && isK) {
        e.preventDefault();
        if (open) closePalette();
        else openPalette();
        return;
      }

      if (!open) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => {
          const max = results.length - 1;
          if (max < 0) return 0;
          return Math.min(i + 1, max);
        });
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }

      if (e.key === 'Enter') {
        const r = results[safeActiveIndex];
        if (r) {
          e.preventDefault();
          go(r);
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, results, activeIndex, go, safeActiveIndex]);

  // autofocus when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      onMouseDown={closePalette}
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
          {!enabled ? (
            <div className={styles.state}>Type 2+ characters…</div>
          ) : isLoading ? (
            <div className={styles.state}>Searching…</div>
          ) : isError ? (
            <div className={styles.state}>Something went wrong.</div>
          ) : results.length === 0 ? (
            <div className={styles.state}>No results.</div>
          ) : (
            <div className={styles.list}>
              {results.map((r, idx) => (
                <button
                  key={`${r.kind}:${r.id}`}
                  type='button'
                  className={`${styles.row} ${idx === safeActiveIndex ? styles.active : ''}`}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => go(r)}
                >
                  <div className={styles.rowTop}>
                    <span className={styles.kind}>{r.kind}</span>
                    <span className={styles.title}>{r.title}</span>
                  </div>
                  {r.subtitle ? (
                    <div className={styles.subtitle}>{r.subtitle}</div>
                  ) : null}
                </button>
              ))}
            </div>
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
