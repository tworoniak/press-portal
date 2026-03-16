import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.scss';
import clsx from 'clsx';

type Variant = 'contained' | 'outline';
type Color = 'primary' | 'danger' | 'neutral';
type Size = 'sm' | 'md' | 'lg' | 'xl';
type Type = 'button' | 'submit';
type Shape = 'rect' | 'round';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  color?: Color;
  size?: Size;
  type?: Type;
  shape?: Shape;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  iconOnly?: boolean;
}

const Button = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'md',
  type = 'button',
  shape = 'rect',
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
    styles[shape],
    iconOnly && styles.iconOnly,
    className,
  );

  return (
    <button type={type} className={classes} {...props}>
      {startIcon && <span className={styles.icon}>{startIcon}</span>}

      {!iconOnly && children}

      {endIcon && <span className={styles.icon}>{endIcon}</span>}
    </button>
  );
};

export default Button;
