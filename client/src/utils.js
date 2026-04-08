/** Format a number as AUD currency */
export const fmt = (n) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(n ?? 0);

/** Format a date string as "5 Jan 2025" */
export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });

/** Convert a date to YYYY-MM-DD for <input type="date"> */
export const toInputDate = (d) =>
  new Date(d).toISOString().split('T')[0];

/** Today as YYYY-MM-DD */
export const today = () => new Date().toISOString().split('T')[0];
