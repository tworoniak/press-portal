import styles from './Avatar.module.scss';

type AvatarProps = {
  name?: string | null;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

function getInitials(name?: string | null) {
  if (!name?.trim()) return '?';

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function Avatar({
  name,
  src,
  size = 'md',
  className,
}: AvatarProps) {
  return (
    <div
      className={`${styles.avatar} ${styles[size]} ${className ?? ''}`}
      aria-label={name ?? 'Avatar'}
      title={name ?? undefined}
    >
      {src ? (
        <img className={styles.image} src={src} alt={name ?? 'Avatar'} />
      ) : (
        <span className={styles.initials}>{getInitials(name)}</span>
      )}
    </div>
  );
}
