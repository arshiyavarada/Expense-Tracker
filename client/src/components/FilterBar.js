import React from 'react';
import { CATEGORIES, MONTHS, YEARS } from '../constants';
import styles from './FilterBar.module.css';

export function FilterBar({ filters, onChange }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className={styles.bar} role="search" aria-label="Filter expenses">
      <div className={styles.group}>
        <label htmlFor="filter-year" className={styles.label}>Year</label>
        <select
          id="filter-year"
          className={styles.select}
          value={filters.year}
          onChange={e => set('year', e.target.value)}
        >
          <option value="">All time</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className={styles.group}>
        <label htmlFor="filter-month" className={styles.label}>Month</label>
        <select
          id="filter-month"
          className={styles.select}
          value={filters.month}
          onChange={e => set('month', e.target.value)}
        >
          <option value="">All months</option>
          {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
      </div>

      <div className={styles.group}>
        <label htmlFor="filter-cat" className={styles.label}>Category</label>
        <select
          id="filter-cat"
          className={styles.select}
          value={filters.category}
          onChange={e => set('category', e.target.value)}
        >
          <option>All</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className={styles.group}>
        <label htmlFor="filter-sort" className={styles.label}>Sort by</label>
        <select
          id="filter-sort"
          className={styles.select}
          value={filters.sortBy}
          onChange={e => set('sortBy', e.target.value)}
        >
          <option value="date">Date</option>
          <option value="amount">Amount</option>
          <option value="title">Title</option>
        </select>
      </div>

      <button
        className={styles.dirBtn}
        onClick={() => set('order', filters.order === 'desc' ? 'asc' : 'desc')}
        aria-label={`Sort ${filters.order === 'desc' ? 'ascending' : 'descending'}`}
        title="Toggle sort direction"
      >
        {filters.order === 'desc' ? '↓' : '↑'}
      </button>
    </div>
  );
}
