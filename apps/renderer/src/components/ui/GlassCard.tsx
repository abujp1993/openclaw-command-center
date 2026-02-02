import { ReactNode, HTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './GlassCard.module.css';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'subtle';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function GlassCard({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={clsx(
        styles.card,
        styles[variant],
        styles[`padding-${padding}`],
        hover && styles.hover,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
