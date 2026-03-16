import styles from './Tag.module.scss';
import { Chip } from '../Chip/Chip';

export function TagRow({ tags }: { tags: string[] }) {
  if (!tags?.length) return <span style={{ opacity: 0.6 }}>—</span>;

  return (
    <div className={styles.tagRow}>
      {tags.map((t) => (
        <Chip key={t} tone='default'>
          {/* <span key={t} className={styles.tag}> */}
          {t}
          {/* </span> */}
        </Chip>
      ))}
    </div>
  );
}
