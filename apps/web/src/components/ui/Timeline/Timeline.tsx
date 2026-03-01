import styles from './Timeline.module.scss';

export type TimelineItem = {
  id: string;
  type: string;
  occurredAt: string;
  subject: string | null;
  notes: string | null;
  nextFollowUpAt: string | null;
};

function fmt(dt: string) {
  return new Date(dt).toLocaleString();
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  if (!items?.length)
    return <div className={styles.empty}>No interactions yet.</div>;

  return (
    <div className={styles.timeline}>
      {items.map((it) => (
        <div key={it.id} className={styles.item}>
          <div className={styles.header}>
            <div className={styles.left}>
              <div className={styles.type}>{it.type}</div>
              <div className={styles.meta}>• {fmt(it.occurredAt)}</div>
              {it.nextFollowUpAt ? (
                <div className={styles.meta}>
                  • Follow-up: {fmt(it.nextFollowUpAt)}
                </div>
              ) : null}
            </div>
          </div>

          {it.subject ? (
            <div className={styles.subject}>{it.subject}</div>
          ) : null}
          {it.notes ? <div className={styles.notes}>{it.notes}</div> : null}
        </div>
      ))}
    </div>
  );
}
