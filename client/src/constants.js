/** Shared constants used across components */

export const CATEGORIES = [
  'Food', 'Transport', 'Housing', 'Entertainment',
  'Health', 'Shopping', 'Education', 'Other'
];

export const CATEGORY_META = {
  Food:          { icon: '🍜', color: '#c0622a', bg: '#fdf3ea' },
  Transport:     { icon: '🚇', color: '#2563a8', bg: '#eef3fc' },
  Housing:       { icon: '🏠', color: '#6b4c11', bg: '#fdf8ee' },
  Entertainment: { icon: '🎭', color: '#7c3d8c', bg: '#f7eefb' },
  Health:        { icon: '💊', color: '#1a6b4a', bg: '#eef7f3' },
  Shopping:      { icon: '🛍',  color: '#c05a5a', bg: '#fdf0f0' },
  Education:     { icon: '📚', color: '#1d5f8a', bg: '#eef5fb' },
  Other:         { icon: '📎', color: '#5a5a5a', bg: '#f3f3f3' },
};

export const MONTHS = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec'
];

export const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = [2023, 2024, 2025, 2026];
