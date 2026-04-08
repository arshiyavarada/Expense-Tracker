import React from 'react';
import { fmt } from '../utils';
import { ExpenseRow } from './ExpenseRow';
import { Spinner, ErrorBanner } from './Dashboard';
import styles from './ExpenseList.module.css';

export function ExpenseList({ expenses, loading, error, onEdit, onDelete, onAdd }) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.heading}>All Expenses</h2>
          <p className={styles.sub}>
            {expenses.length} {expenses.length === 1 ? 'entry' : 'entries'} · {fmt(total)} total
          </p>
        </div>
        <button className={styles.addBtn} onClick={onAdd}>
          <span aria-hidden="true">+</span> New Expense
        </button>
      </header>

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorBanner message={error} />
      ) : expenses.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon} aria-hidden="true">✦</div>
          <p className={styles.emptyText}>No expenses match your current filters.</p>
          <button className={styles.emptyBtn} onClick={onAdd}>Add an expense</button>
        </div>
      ) : (
        <div className={styles.list} role="list" aria-label="Expense entries">
          {expenses.map((e, i) => (
            <div
              key={e._id}
              role="listitem"
              style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
            >
              <ExpenseRow expense={e} onEdit={onEdit} onDelete={onDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
