import styles from './Timeline.module.scss';

export type TimelineItem = {
  id: string;
  type: string;
  occurredAt: string;
  subject: string | null;
  notes: string | null;
  outcome: string | null;
  nextFollowUpAt: string | null;
  band?: { id: string; name: string } | null;
  festival?: { id: string; name: string } | null;
};

function fmt(dt: string) {
  return new Date(dt).toLocaleString();
}

export function Timeline({
  items,
  onEdit,
  onDelete,
}: {
  items: TimelineItem[];
  onEdit?: (item: TimelineItem) => void;
  onDelete?: (id: string) => void;
}) {
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

              {it.band?.name ? (
                <span className={styles.chip}>Band: {it.band.name}</span>
              ) : null}
              {it.festival?.name ? (
                <span className={styles.chip}>
                  Festival: {it.festival.name}
                </span>
              ) : null}

              {it.nextFollowUpAt ? (
                <div className={styles.meta}>
                  • Follow-up: {fmt(it.nextFollowUpAt)}
                </div>
              ) : null}
            </div>

            {onEdit || onDelete ? (
              <div className={styles.actions}>
                {onEdit ? (
                  <button type='button' onClick={() => onEdit(it)}>
                    Edit
                  </button>
                ) : null}
                {onDelete ? (
                  <button
                    type='button'
                    onClick={() => onDelete(it.id)}
                    className={styles.danger}
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          {it.outcome ? (
            <div className={styles.meta}>Outcome: {it.outcome}</div>
          ) : null}
          {it.subject ? (
            <div className={styles.subject}>{it.subject}</div>
          ) : null}
          {it.notes ? <div className={styles.notes}>{it.notes}</div> : null}
        </div>
      ))}
    </div>
  );
}
