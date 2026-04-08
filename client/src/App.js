/**
 * App.js
 * ──────
 * Root component. Owns top-level state: current view, filters,
 * modal visibility, and toast notifications.
 * All data fetching is delegated to the useExpenses hook.
 */

import React, { useState } from 'react';
import { Sidebar }        from './components/Sidebar';
import { FilterBar }      from './components/FilterBar';
import { Dashboard }      from './components/Dashboard';
import { ExpenseList }    from './components/ExpenseList';
import { Analytics }      from './components/Analytics';
import { ExpenseForm }    from './components/ExpenseForm';
import { ConfirmDialog }  from './components/ConfirmDialog';
import { ToastContainer } from './components/Toast';
import { useExpenses }    from './hooks/useExpenses';
import { useToast }       from './hooks/useToast';
import { CURRENT_YEAR }   from './constants';
import styles from './App.module.css';

const DEFAULT_FILTERS = {
  year:     String(CURRENT_YEAR),
  month:    '',
  category: 'All',
  sortBy:   'date',
  order:    'desc',
};

export default function App() {
  // ── View & filter state ──────────────────────────────────────────────────
  const [view,    setView]    = useState('dashboard');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // ── Modal state ──────────────────────────────────────────────────────────
  const [formTarget,   setFormTarget]   = useState(null); // null | { mode: 'create'|'edit', expense? }
  const [deleteTarget, setDeleteTarget] = useState(null); // null | expense object

  // ── Data & mutations ─────────────────────────────────────────────────────
  const { expenses, loading, error, create, update, remove } = useExpenses(filters);
  const { toasts, toast, dismiss } = useToast();

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSave = async (formData) => {
    const isEdit = formTarget.mode === 'edit';
    await (isEdit
      ? update(formTarget.expense._id, formData)
      : create(formData)
    );
    setFormTarget(null);
    toast(isEdit ? 'Expense updated' : 'Expense added');
  };

  const handleDelete = async () => {
    const name = deleteTarget.title;
    await remove(deleteTarget._id);
    setDeleteTarget(null);
    toast(`"${name}" deleted`, 'error');
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.app}>
      {/* Sidebar navigation */}
      <Sidebar
        view={view}
        onView={setView}
        total={total}
        onAdd={() => setFormTarget({ mode: 'create' })}
      />

      {/* Main content area */}
      <div className={styles.main}>
        {/* Persistent filter bar (hidden on analytics — analytics fetches its own data) */}
        {view !== 'analytics' && (
          <FilterBar filters={filters} onChange={setFilters} />
        )}
        {/* Show year filter only on analytics */}
        {view === 'analytics' && (
          <FilterBar
            filters={filters}
            onChange={setFilters}
            analyticsMode
          />
        )}

        <div className={styles.content}>
          {view === 'dashboard' && (
            <Dashboard
              expenses={expenses}
              loading={loading}
              error={error}
              onEdit={e  => setFormTarget({ mode: 'edit', expense: e })}
              onDelete={setDeleteTarget}
              onAdd={() => setFormTarget({ mode: 'create' })}
            />
          )}

          {view === 'expenses' && (
            <ExpenseList
              expenses={expenses}
              loading={loading}
              error={error}
              onEdit={e  => setFormTarget({ mode: 'edit', expense: e })}
              onDelete={setDeleteTarget}
              onAdd={() => setFormTarget({ mode: 'create' })}
            />
          )}

          {view === 'analytics' && (
            <Analytics filterYear={filters.year} />
          )}
        </div>
      </div>

      {/* ── Modals ── */}

      {formTarget && (
        <ExpenseForm
          expense={formTarget.expense}
          onSave={handleSave}
          onClose={() => setFormTarget(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={`Delete "${deleteTarget.title}"?`}
          message="This action cannot be undone. The expense will be permanently removed."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
