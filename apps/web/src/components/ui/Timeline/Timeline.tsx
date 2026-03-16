import Button from '../Button/Button';
import { Badge } from '../Badge/Badge';
import { Chip } from '../Chip/Chip';
import styles from './Timeline.module.scss';

import { Trash2, Pencil, CornerDownRight } from 'lucide-react';

type LinkedRef = {
  id: string;
  name: string;
};

export type TimelineItem = {
  id: string;
  type: string;
  occurredAt: string;
  subject: string | null;
  notes: string | null;
  outcome: string | null;
  nextFollowUpAt: string | null;
  band?: LinkedRef | null;
  festival?: LinkedRef | null;
};

type TimelineProps = {
  items: TimelineItem[];
  onEdit?: (item: TimelineItem) => void;
  onDelete?: (id: string) => void;
};

function fmt(dt: string) {
  return new Date(dt).toLocaleString();
}

function followUpMeta(nextFollowUpAt: string | null) {
  if (!nextFollowUpAt) return null;

  const ms = new Date(nextFollowUpAt).getTime() - Date.now();
  const day = 24 * 60 * 60 * 1000;

  if (ms <= 0) return { tone: 'danger' as const, label: 'Due' };
  if (ms <= 3 * day) return { tone: 'warn' as const, label: 'Soon' };
  return { tone: 'primary' as const, label: 'Scheduled' };
}

export function Timeline({ items, onEdit, onDelete }: TimelineProps) {
  if (!items?.length) {
    return <div className={styles.empty}>No interactions yet.</div>;
  }

  return (
    <div className={styles.timeline}>
      {items.map((it) => {
        const followUp = followUpMeta(it.nextFollowUpAt);

        return (
          <article key={it.id} className={styles.item}>
            <div className={styles.rail}>
              <span className={styles.dot} />
              <span className={styles.line} />
            </div>

            <div className={styles.card}>
              <div className={styles.topRow}>
                <div className={styles.metaGroup}>
                  <Badge tone='default'>{it.type}</Badge>
                  <span className={styles.metaText}>{fmt(it.occurredAt)}</span>

                  {followUp ? (
                    <Badge tone={followUp.tone}>{followUp.label}</Badge>
                  ) : null}
                </div>

                {onEdit || onDelete ? (
                  <div className={styles.actions}>
                    {onEdit ? (
                      <Button
                        variant='outline'
                        color='neutral'
                        size='sm'
                        onClick={() => onEdit(it)}
                      >
                        <Pencil size={14} />
                        Edit
                      </Button>
                    ) : null}

                    {onDelete ? (
                      <Button
                        variant='outline'
                        color='danger'
                        size='sm'
                        onClick={() => onDelete(it.id)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {it.subject ? (
                <div className={styles.subject}>{it.subject}</div>
              ) : null}

              {it.outcome ? (
                <div className={styles.outcome}>
                  <span className={styles.label}>Outcome</span>
                  <span className={styles.outcomeContent}>
                    <CornerDownRight size={12} />
                    {it.outcome}
                  </span>
                </div>
              ) : null}

              {it.notes ? <div className={styles.notes}>{it.notes}</div> : null}

              {it.band || it.festival || it.nextFollowUpAt ? (
                <div className={styles.bottomRow}>
                  <div className={styles.chips}>
                    {it.band ? (
                      <Chip tone='default'>{it.band.name}</Chip>
                    ) : null}

                    {it.festival ? (
                      <Chip tone='default'>{it.festival.name}</Chip>
                    ) : null}
                  </div>

                  {it.nextFollowUpAt ? (
                    <div className={styles.followUpDate}>
                      Follow-up: {fmt(it.nextFollowUpAt)}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
