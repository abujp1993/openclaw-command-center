import { Minus, Square, X } from 'lucide-react';
import styles from './TitleBar.module.css';

export function TitleBar() {
  const handleMinimize = () => window.openclaw?.window.minimize();
  const handleMaximize = () => window.openclaw?.window.maximize();
  const handleClose = () => window.openclaw?.window.close();

  return (
    <header className={`${styles.titleBar} drag-region`}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🦞</span>
        <span className={styles.logoText}>OpenClaw</span>
      </div>

      <div className={`${styles.controls} no-drag`}>
        <button
          className={styles.controlButton}
          onClick={handleMinimize}
          aria-label="Minimize"
        >
          <Minus size={16} />
        </button>
        <button
          className={styles.controlButton}
          onClick={handleMaximize}
          aria-label="Maximize"
        >
          <Square size={14} />
        </button>
        <button
          className={`${styles.controlButton} ${styles.closeButton}`}
          onClick={handleClose}
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </header>
  );
}
