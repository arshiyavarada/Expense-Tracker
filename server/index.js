/**
 * server/index.js
 * ───────────────
 * Express REST API for the Ledger expense tracker.
 * Connects to MongoDB via Mongoose and exposes CRUD endpoints
 * plus two aggregation routes used by the Analytics view.
 */

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');

const app  = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ledger';

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
// Serve the production React build from /client/build
app.use(express.static(path.join(__dirname, '../client/build')));

// ── MongoDB Connection ────────────────────────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅  MongoDB connected →', MONGO_URI))
  .catch(err => { console.error('❌  MongoDB error:', err.message); process.exit(1); });

// ── Expense Schema & Model ────────────────────────────────────────────────────
const expenseSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true, maxlength: 120 },
  amount:      { type: Number, required: true, min: 0.01 },
  category:    {
    type: String, required: true,
    enum: ['Food','Transport','Housing','Entertainment','Health','Shopping','Education','Other']
  },
  date:        { type: Date, required: true },
  description: { type: String, trim: true, maxlength: 500, default: '' },
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);

// ── Helper: async error wrapper ───────────────────────────────────────────────
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ── CRUD Routes ───────────────────────────────────────────────────────────────

// READ — list expenses with optional filters & sorting
app.get('/api/expenses', asyncHandler(async (req, res) => {
  const { category, month, year, sortBy = 'date', order = 'desc' } = req.query;
  const filter = {};

  if (category && category !== 'All') filter.category = category;

  if (year) {
    const y = parseInt(year);
    if (month) {
      // Filter to specific month
      const m = parseInt(month) - 1; // JS months are 0-indexed
      filter.date = { $gte: new Date(y, m, 1), $lte: new Date(y, m + 1, 0, 23, 59, 59) };
    } else {
      filter.date = { $gte: new Date(y, 0, 1), $lte: new Date(y, 11, 31, 23, 59, 59) };
    }
  }

  const sortDir = order === 'asc' ? 1 : -1;
  const expenses = await Expense.find(filter).sort({ [sortBy]: sortDir });
  res.json(expenses);
}));

// READ — single expense by ID
app.get('/api/expenses/:id', asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) return res.status(404).json({ error: 'Expense not found' });
  res.json(expense);
}));

// CREATE — new expense
app.post('/api/expenses', asyncHandler(async (req, res) => {
  const expense = new Expense(req.body);
  const saved = await expense.save();
  res.status(201).json(saved);
}));

// UPDATE — edit existing expense
app.put('/api/expenses/:id', asyncHandler(async (req, res) => {
  const updated = await Expense.findByIdAndUpdate(
    req.params.id, req.body, { new: true, runValidators: true }
  );
  if (!updated) return res.status(404).json({ error: 'Expense not found' });
  res.json(updated);
}));

// DELETE — remove expense
app.delete('/api/expenses/:id', asyncHandler(async (req, res) => {
  const deleted = await Expense.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Expense not found' });
  res.json({ message: 'Deleted', id: req.params.id });
}));

// ── Analytics Routes ──────────────────────────────────────────────────────────

// Totals grouped by category (MongoDB $group aggregation)
app.get('/api/analytics/by-category', asyncHandler(async (req, res) => {
  const match = buildYearMatch(req.query.year);
  const result = await Expense.aggregate([
    { $match: match },
    { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { total: -1 } }
  ]);
  res.json(result);
}));

// Monthly spending trend (MongoDB $group by month+year)
app.get('/api/analytics/monthly-trend', asyncHandler(async (req, res) => {
  const match = buildYearMatch(req.query.year);
  const result = await Expense.aggregate([
    { $match: match },
    {
      $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' } },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);
  res.json(result);
}));

/** Builds a date-range $match stage for aggregations */
function buildYearMatch(year) {
  if (!year) return {};
  const y = parseInt(year);
  return { date: { $gte: new Date(y, 0, 1), $lte: new Date(y, 11, 31, 23, 59, 59) } };
}

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('API error:', err.message);
  const status = err.name === 'ValidationError' ? 400 : 500;
  res.status(status).json({ error: err.message });
});

// ── Catch-all: serve React SPA ────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => console.log(`🚀  Server → http://localhost:${PORT}`));
