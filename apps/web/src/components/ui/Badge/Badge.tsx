import styles from './Badge.module.scss';

export type BadgeTone = 'default' | 'ok' | 'warn' | 'danger';

export function Badge({
  children,
  tone = 'default',
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
}) {
  const cls =
    tone === 'ok'
      ? `${styles.badge} ${styles.ok}`
      : tone === 'warn'
        ? `${styles.badge} ${styles.warn}`
        : tone === 'danger'
          ? `${styles.badge} ${styles.danger}`
          : styles.badge;

  return (
    <span className={cls}>
      <span className={styles.dot} />
      {children}
    </span>
  );
}
