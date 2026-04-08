/**
 * hooks/useExpenses.js
 * ────────────────────
 * Custom hook that owns all expense data fetching and mutation.
 * Keeps components free of fetch/state logic.
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useExpenses(filters) {
  const [expenses, setExpenses]   = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [error,    setError]      = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { sortBy: filters.sortBy, order: filters.order };
      if (filters.category !== 'All') params.category = filters.category;
      if (filters.year)  params.year  = filters.year;
      if (filters.month) params.month = filters.month;
      setExpenses(await api.getExpenses(params));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.year, filters.month, filters.sortBy, filters.order]); // eslint-disable-line

  useEffect(() => { load(); }, [load]);

  /** Create and refresh */
  const create = useCallback(async (data) => {
    const saved = await api.createExpense(data);
    setExpenses(prev => [saved, ...prev]);
    return saved;
  }, []);

  /** Update in-place and refresh */
  const update = useCallback(async (id, data) => {
    const updated = await api.updateExpense(id, data);
    setExpenses(prev => prev.map(e => e._id === id ? updated : e));
    return updated;
  }, []);

  /** Remove from list */
  const remove = useCallback(async (id) => {
    await api.deleteExpense(id);
    setExpenses(prev => prev.filter(e => e._id !== id));
  }, []);

  return { expenses, loading, error, reload: load, create, update, remove };
}
