import React from 'react';
import { CATEGORY_META } from '../constants';
import { fmt } from '../utils';
import { ExpenseRow } from './ExpenseRow';
import styles from './Dashboard.module.css';

export function Dashboard({ expenses, loading, error, onEdit, onDelete, onAdd }) {
  const total     = expenses.reduce((s, e) => s + e.amount, 0);
  const avg       = expenses.length ? total / expenses.length : 0;
  const recent    = expenses.slice(0, 6);

  // Tally by category
  const byCat = {};
  expenses.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + e.amount; });
  const sortedCats = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const topCat = sortedCats[0];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.heading}>Overview</h2>
          <p className={styles.sub}>Your spending at a glance</p>
        </div>
        <button className={styles.addBtn} onClick={onAdd}>
          <span aria-hidden="true">+</span> New Expense
        </button>
      </header>

      {/* Stat cards */}
      <div className={styles.stats} role="region" aria-label="Summary statistics">
        <StatCard label="Total Spent"    value={fmt(total)} sub={`${expenses.length} transactions`} accent />
        <StatCard label="Average"        value={fmt(avg)}   sub="per transaction" />
        <StatCard
          label="Top Category"
          value={topCat ? `${CATEGORY_META[topCat[0]]?.icon} ${topCat[0]}` : '—'}
          sub={topCat ? fmt(topCat[1]) : 'No data'}
          style={topCat ? { color: CATEGORY_META[topCat[0]]?.color } : {}}
        />
        <StatCard label="Categories"     value={Object.keys(byCat).length} sub="active this period" />
      </div>

      <div className={styles.grid}>
        {/* Category breakdown */}
        <section className={styles.card} aria-labelledby="cat-heading">
          <h3 id="cat-heading" className={styles.cardTitle}>By Category</h3>
          {sortedCats.length === 0
            ? <p className={styles.empty}>No data yet.</p>
            : sortedCats.map(([cat, amt]) => {
                const meta = CATEGORY_META[cat];
                const pct  = total > 0 ? (amt / total) * 100 : 0;
                return (
                  <div key={cat} className={styles.catRow}>
                    <div className={styles.catLabel}>
                      <span className={styles.catIcon} style={{ background: meta.bg }}>{meta.icon}</span>
                      <span className={styles.catName}>{cat}</span>
                    </div>
                    <div className={styles.catBar}>
                      <div
                        className={styles.catFill}
                        style={{ width: `${pct}%`, background: meta.color }}
                        role="presentation"
                      />
                    </div>
                    <div className={styles.catRight}>
                      <span className={styles.catAmt}>{fmt(amt)}</span>
                      <span className={styles.catPct}>{pct.toFixed(0)}%</span>
                    </div>
                  </div>
                );
              })
          }
        </section>

        {/* Recent transactions */}
        <section className={styles.card} aria-labelledby="recent-heading">
          <h3 id="recent-heading" className={styles.cardTitle}>Recent Transactions</h3>
          {loading ? (
            <Spinner />
          ) : error ? (
            <ErrorBanner message={error} />
          ) : recent.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>No expenses yet.</p>
              <button className={styles.emptyBtn} onClick={onAdd}>Add your first one</button>
            </div>
          ) : (
            <div className={styles.list}>
              {recent.map(e => (
                <ExpenseRow key={e._id} expense={e} onEdit={onEdit} onDelete={onDelete} compact />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, accent, style }) {
  return (
    <div className={`${styles.statCard} ${accent ? styles.statAccent : ''}`}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue} style={style}>{value}</div>
      <div className={styles.statSub}>{sub}</div>
    </div>
  );
}

export function Spinner() {
  return (
    <div className={styles.spinner} role="status" aria-label="Loading">
      <div className={styles.spinRing} />
    </div>
  );
}

export function ErrorBanner({ message }) {
  return (
    <div className={styles.error} role="alert">
      <span aria-hidden="true">⚠</span> {message}
      <br /><small>Check that the server is running and MongoDB is connected.</small>
    </div>
  );
}
