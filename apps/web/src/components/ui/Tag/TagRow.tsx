import styles from './Tag.module.scss';

export function TagRow({ tags }: { tags: string[] }) {
  if (!tags?.length) return <span style={{ opacity: 0.6 }}>—</span>;

  return (
    <div className={styles.tagRow}>
      {tags.map((t) => (
        <span key={t} className={styles.tag}>
          {t}
        </span>
      ))}
    </div>
  );
}
