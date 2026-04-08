import React from 'react';
import styles from './Toast.module.css';

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className={styles.container} role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`${styles.toast} ${styles[t.type]}`}
          role="status"
        >
          <span className={styles.icon}>
            {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
          </span>
          <span className={styles.msg}>{t.message}</span>
          <button
            className={styles.close}
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss notification"
          >×</button>
        </div>
      ))}
    </div>
  );
}
