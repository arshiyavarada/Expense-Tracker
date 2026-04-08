/**
 * components/ExpenseForm.js
 * ─────────────────────────
 * Modal form for creating and editing expenses.
 * Includes inline validation, focus trapping, and accessible markup.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CATEGORIES, CATEGORY_META } from '../constants';
import { toInputDate, today } from '../utils';
import styles from './ExpenseForm.module.css';

const EMPTY = { title: '', amount: '', category: 'Food', date: today(), description: '' };

export function ExpenseForm({ expense, onSave, onClose }) {
  const isEdit = Boolean(expense);
  const [form, setForm]     = useState(isEdit ? {
    title:       expense.title,
    amount:      expense.amount,
    category:    expense.category,
    date:        toInputDate(expense.date),
    description: expense.description || '',
  } : EMPTY);
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  const firstRef   = useRef();
  const backdropRef = useRef();

  // Auto-focus first field on mount
  useEffect(() => { firstRef.current?.focus(); }, []);

  // Focus trap — keep Tab inside the modal
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key !== 'Tab') return;
    const focusable = backdropRef.current?.querySelectorAll(
      'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable?.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }, [onClose]);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }));
  };

  /** Client-side validation — returns true if valid */
  const validate = () => {
    const errs = {};
    if (!form.title.trim())        errs.title  = 'Title is required';
    if (!form.amount || form.amount <= 0) errs.amount = 'Enter a valid amount';
    if (!form.date)                errs.date   = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSave({ ...form, amount: parseFloat(form.amount) });
    } catch (err) {
      setErrors({ _global: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const meta = CATEGORY_META[form.category];

  return (
    <div
      className={styles.backdrop}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={handleKeyDown}
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-title"
    >
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerDeco} aria-hidden="true">
              {isEdit ? '✎' : '+'}
            </div>
            <h2 id="form-title" className={styles.title}>
              {isEdit ? 'Edit Expense' : 'New Expense'}
            </h2>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close form"
          >×</button>
        </div>

        {/* Global error */}
        {errors._global && (
          <div className={styles.globalError} role="alert">
            ⚠ {errors._global}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          {/* Title */}
          <div className={`${styles.field} ${errors.title ? styles.hasError : ''}`}>
            <label htmlFor="f-title" className={styles.label}>Title *</label>
            <input
              ref={firstRef}
              id="f-title"
              className={styles.input}
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. Weekly groceries"
              maxLength={120}
              aria-required="true"
              aria-describedby={errors.title ? 'err-title' : undefined}
            />
            {errors.title && <span id="err-title" className={styles.errMsg} role="alert">{errors.title}</span>}
          </div>

          {/* Amount + Category row */}
          <div className={styles.row}>
            <div className={`${styles.field} ${errors.amount ? styles.hasError : ''}`}>
              <label htmlFor="f-amount" className={styles.label}>Amount (AUD) *</label>
              <div className={styles.amtWrap}>
                <span className={styles.amtPrefix} aria-hidden="true">$</span>
                <input
                  id="f-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  className={`${styles.input} ${styles.amtInput}`}
                  value={form.amount}
                  onChange={e => set('amount', e.target.value)}
                  placeholder="0.00"
                  aria-required="true"
                  aria-describedby={errors.amount ? 'err-amount' : undefined}
                />
              </div>
              {errors.amount && <span id="err-amount" className={styles.errMsg} role="alert">{errors.amount}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="f-cat" className={styles.label}>Category *</label>
              <select
                id="f-cat"
                className={styles.input}
                value={form.category}
                onChange={e => set('category', e.target.value)}
                aria-required="true"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{CATEGORY_META[c].icon} {c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div className={`${styles.field} ${errors.date ? styles.hasError : ''}`}>
            <label htmlFor="f-date" className={styles.label}>Date *</label>
            <input
              id="f-date"
              type="date"
              className={styles.input}
              value={form.date}
              onChange={e => set('date', e.target.value)}
              aria-required="true"
              aria-describedby={errors.date ? 'err-date' : undefined}
            />
            {errors.date && <span id="err-date" className={styles.errMsg} role="alert">{errors.date}</span>}
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label htmlFor="f-desc" className={styles.label}>
              Description <span className={styles.optional}>(optional)</span>
            </label>
            <textarea
              id="f-desc"
              className={`${styles.input} ${styles.textarea}`}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Add a note…"
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Category preview pill */}
          <div
            className={styles.catPreview}
            style={{ background: meta.bg, borderColor: meta.color, color: meta.color }}
            aria-label={`Selected category: ${form.category}`}
          >
            {meta.icon} {form.category}
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >Cancel</button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
