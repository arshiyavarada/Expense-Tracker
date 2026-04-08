import React, { useEffect, useRef } from 'react';
import styles from './ConfirmDialog.module.css';

export function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  const cancelRef = useRef();

  useEffect(() => { cancelRef.current?.focus(); }, []);

  const handleKey = (e) => {
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div
      className={styles.backdrop}
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
      onKeyDown={handleKey}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
    >
      <div className={styles.dialog}>
        <div className={styles.iconWrap} aria-hidden="true">⚠</div>
        <h3 id="confirm-title" className={styles.title}>{title}</h3>
        <p id="confirm-desc" className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button
            ref={cancelRef}
            className={styles.cancelBtn}
            onClick={onCancel}
          >Keep it</button>
          <button
            className={styles.deleteBtn}
            onClick={onConfirm}
          >Yes, delete</button>
        </div>
      </div>
    </div>
  );
}
