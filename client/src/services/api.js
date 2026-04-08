/**
 * services/api.js
 * ───────────────
 * Centralised API layer. All fetch() calls live here so components
 * stay clean and the base URL is easy to change for deployment.
 */

const BASE = '/api';

/** Shared fetch wrapper — throws a readable error on non-OK responses */
async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  /** Fetch expenses with optional filters */
  getExpenses: (params = {}) =>
    request(`/expenses?${new URLSearchParams(params)}`),

  /** Create a new expense */
  createExpense: (data) =>
    request('/expenses', { method: 'POST', body: JSON.stringify(data) }),

  /** Update an existing expense by ID */
  updateExpense: (id, data) =>
    request(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  /** Delete an expense by ID */
  deleteExpense: (id) =>
    request(`/expenses/${id}`, { method: 'DELETE' }),

  /** Aggregated totals grouped by category */
  getByCategory: (params = {}) =>
    request(`/analytics/by-category?${new URLSearchParams(params)}`),

  /** Monthly spending trend data */
  getMonthlyTrend: (params = {}) =>
    request(`/analytics/monthly-trend?${new URLSearchParams(params)}`),
};
