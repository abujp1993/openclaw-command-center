import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './GlassInput.module.css';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, icon, iconPosition = 'left', className, ...props }, ref) => {
    return (
      <div className={styles.wrapper}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={clsx(styles.inputWrapper, error && styles.hasError)}>
          {icon && iconPosition === 'left' && (
            <span className={styles.icon}>{icon}</span>
          )}
          <input
            ref={ref}
            className={clsx(
              styles.input,
              icon && iconPosition === 'left' && styles.hasLeftIcon,
              icon && iconPosition === 'right' && styles.hasRightIcon,
              className
            )}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <span className={styles.icon}>{icon}</span>
          )}
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';
