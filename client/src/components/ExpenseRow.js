import React from 'react';
import { CATEGORY_META } from '../constants';
import { fmt, fmtDate } from '../utils';
import styles from './ExpenseRow.module.css';

export function ExpenseRow({ expense: e, onEdit, onDelete, compact }) {
  const meta = CATEGORY_META[e.category] || CATEGORY_META.Other;

  return (
    <div className={`${styles.row} ${compact ? styles.compact : ''}`}>
      {/* Category icon */}
      <div
        className={styles.icon}
        style={{ background: meta.bg, color: meta.color }}
        aria-label={e.category}
        role="img"
      >
        {meta.icon}
      </div>

      {/* Info */}
      <div className={styles.info}>
        <div className={styles.titleLine}>
          <span className={styles.title}>{e.title}</span>
        </div>
        {!compact && e.description && (
          <div className={styles.desc}>{e.description}</div>
        )}
        <div className={styles.meta}>
          <span
            className={styles.catTag}
            style={{ color: meta.color, background: meta.bg }}
          >{e.category}</span>
          <span className={styles.sep} aria-hidden="true">·</span>
          <span className={styles.date}>{fmtDate(e.date)}</span>
        </div>
      </div>

      {/* Amount */}
      <div className={styles.amount}>{fmt(e.amount)}</div>

      {/* Actions */}
      <div className={styles.actions} role="group" aria-label={`Actions for ${e.title}`}>
        <button
          className={`${styles.actionBtn} ${styles.editBtn}`}
          onClick={() => onEdit(e)}
          aria-label={`Edit ${e.title}`}
        >
          <span aria-hidden="true">✎</span>
        </button>
        <button
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
          onClick={() => onDelete(e)}
          aria-label={`Delete ${e.title}`}
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>
    </div>
  );
}
