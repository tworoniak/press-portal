import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Chip.module.scss';

export type ChipTone = 'default';

type ChipProps = {
  children: ReactNode;
  tone?: ChipTone;
  className?: string;
};

export function Chip({ children, tone = 'default', className }: ChipProps) {
  return (
    <span className={clsx(styles.chip, styles[tone], className)}>
      {children}
    </span>
  );
}
