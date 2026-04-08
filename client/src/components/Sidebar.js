import React from 'react';
import { fmt } from '../utils';
import styles from './Sidebar.module.css';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '◈' },
  { id: 'expenses',  label: 'Expenses',  icon: '≡' },
  { id: 'analytics', label: 'Analytics', icon: '◉' },
];

export function Sidebar({ view, onView, total, onAdd }) {
  return (
    <aside className={styles.sidebar} role="navigation" aria-label="Main navigation">
      {/* Brand */}
      <div className={styles.brand}>
        <div className={styles.brandMark} aria-hidden="true">L</div>
        <div>
          <h1 className={styles.brandName}>Ledger</h1>
          <p className={styles.brandSub}>Expense Journal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV.map(item => (
          <button
            key={item.id}
            className={`${styles.navItem} ${view === item.id ? styles.active : ''}`}
            onClick={() => onView(item.id)}
            aria-current={view === item.id ? 'page' : undefined}
          >
            <span className={styles.navIcon} aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Add button */}
      <button className={styles.addBtn} onClick={onAdd}>
        <span aria-hidden="true">+</span>
        <span>New Expense</span>
      </button>

      {/* Total */}
      <div className={styles.footer}>
        <div className={styles.footerLabel}>Showing total</div>
        <div className={styles.footerAmt}>{fmt(total)}</div>
        <div className={styles.quill} aria-hidden="true">✦</div>
      </div>
    </aside>
  );
}
