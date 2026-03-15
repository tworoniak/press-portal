import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.scss';
import clsx from 'clsx';

type Variant = 'contained' | 'outline';
type Color = 'primary' | 'danger' | 'neutral';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  color?: Color;
  size?: Size;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  iconOnly?: boolean;
}

const Button = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'md',
  startIcon,
  endIcon,
  iconOnly = false,
  className,
  ...props
}: ButtonProps) => {
  const classes = clsx(
    styles.button,
    styles[variant],
    styles[color],
    styles[size],
    iconOnly && styles.iconOnly,
    className,
  );

  return (
    <button type='button' className={classes} {...props}>
      {startIcon && <span className={styles.icon}>{startIcon}</span>}

      {!iconOnly && children}

      {endIcon && <span className={styles.icon}>{endIcon}</span>}
    </button>
  );
};

export default Button;
