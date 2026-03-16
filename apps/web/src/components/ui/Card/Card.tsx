import type { ReactNode } from 'react';

import styles from './Card.module.scss';

type CardProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export default function Card({
  title,
  subtitle,
  actions,
  children,
  className,
  contentClassName,
}: CardProps) {
  const hasHeader = title || subtitle || actions;

  return (
    <section className={`${styles.card} ${className ?? ''}`}>
      {hasHeader ? (
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderText}>
            {title ? <h2 className={styles.cardTitle}>{title}</h2> : null}
            {subtitle ? (
              <div className={styles.cardSubtitle}>{subtitle}</div>
            ) : null}
          </div>

          {actions ? <div className={styles.cardActions}>{actions}</div> : null}
        </div>
      ) : null}

      <div className={`${styles.cardBody} ${contentClassName ?? ''}`}>
        {children}
      </div>
    </section>
  );
}
