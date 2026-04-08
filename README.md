# Ledger — Personal Expense Tracker

> Assignment 1 · COMP[XXXX] · Dynamic Web Interface to a Database System

A single-page application for tracking personal expenses. Users can log, categorise, edit, and analyse their spending across customisable time periods — all without a single page reload.

---

## Problem Statement

Managing personal finances is difficult when spending data lives across bank apps, spreadsheets, and receipts. Ledger provides a unified, frictionless interface where users can log expenses as they happen, categorise them meaningfully, and immediately see where their money is going through visual summaries and trend charts. The goal is to lower the barrier to financial self-awareness.

---

## Tech Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| Frontend    | React 18 (Create React App), CSS Modules        |
| Styling     | CSS Variables, Cormorant Garamond + Syne fonts  |
| Backend     | Node.js 18, Express 4                           |
| Database    | MongoDB 6 + Mongoose 8 (ODM)                    |
| HTTP client | Native `fetch()` API                            |
| Deployment  | Static React build served by Express            |

---

## Features

- **Dashboard** — Summary stats (total, average, top category), horizontal category breakdown bars, and recent transactions at a glance
- **Expenses list** — Full paginated list of all expenses with staggered entry animations
- **Analytics** — SVG donut chart by category, monthly bar chart trend, and a detailed summary table
- **Add / Edit expenses** — Modal form with inline validation, focus trapping, and accessible labels
- **Delete with confirmation** — Confirm dialog prevents accidental deletion
- **Live filtering** — Filter by year, month, and category; sort by date, amount, or title
- **Toast notifications** — Non-blocking feedback after every create, update, or delete
- **Responsive design** — Sidebar collapses gracefully on mobile screens
- **Accessible UI** — ARIA roles, `aria-label` on all icon buttons, keyboard-navigable modals, focus trap, visible focus rings, and sufficient colour contrast
- **Error handling** — API failures show an in-page error banner (the app never goes blank)
- **Seeded sample data** — 36 realistic expenses spanning 6 months for immediate demo use

---

## Folder Structure

```
ledger/
├── client/                        # React single-page app
│   ├── public/
│   │   └── index.html             # ← The one and only HTML file
│   └── src/
│       ├── components/            # UI components (one file per component)
│       │   ├── Analytics.js/.css  # Donut chart, bar chart, summary table
│       │   ├── ConfirmDialog.js   # Accessible delete confirmation modal
│       │   ├── Dashboard.js       # Overview page with stat cards
│       │   ├── ExpenseForm.js     # Create/edit modal with validation
│       │   ├── ExpenseList.js     # Full expense list view
│       │   ├── ExpenseRow.js      # Single expense row with actions
│       │   ├── FilterBar.js       # Year/month/category/sort controls
│       │   ├── Sidebar.js         # Navigation sidebar
│       │   └── Toast.js           # Toast notification system
│       ├── hooks/
│       │   ├── useExpenses.js     # Data fetching & mutation hook
│       │   └── useToast.js        # Toast state management hook
│       ├── services/
│       │   └── api.js             # Centralised fetch() API layer
│       ├── App.js                 # Root component, top-level state
│       ├── App.module.css         # App shell layout
│       ├── constants.js           # Categories, colours, shared config
│       ├── index.css              # Global reset & CSS variables
│       ├── index.js               # React entry point
│       └── utils.js               # Formatting helpers (currency, date)
│
├── server/
│   ├── index.js                   # Express server + all REST API routes
│   ├── seed.js                    # Seed script (36 sample expenses)
│   └── package.json
│
├── database/
│   └── expenses.json              # MongoDB export (for submission)
│
├── package.json                   # Root scripts
└── README.md
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB Community](https://www.mongodb.com/try/download/community) running locally on port `27017`, or a [MongoDB Atlas](https://cloud.mongodb.com/) URI

### 1. Install dependencies

```bash
# From the project root
cd server && npm install
cd ../client && npm install
```

### 2. Configure the database (optional)

By default the server connects to `mongodb://localhost:27017/ledger`.

To use a custom URI, set the environment variable before starting:

```bash
export MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/ledger"
```

Or create `server/.env`:
```
MONGO_URI=mongodb+srv://...
PORT=3001
```

### 3. Seed sample data

```bash
cd server && npm run seed
# ✅ Seeded 36 expenses (Jan – Jun 2025)
```

Alternatively, import via `mongoimport`:

```bash
mongoimport --db ledger --collection expenses \
  --file database/expenses.json --jsonArray
```

### 4. Run in development

Open **two terminals**:

```bash
# Terminal 1 — backend API (port 3001)
cd server && npm run dev

# Terminal 2 — React dev server (port 3000)
cd client && npm start
```

The React dev server proxies `/api/*` requests to port `3001` automatically (configured in `client/package.json` via the `"proxy"` field).

### 5. Build for production

```bash
cd client && npm run build   # compiles React → client/build/
cd ../server && npm start    # serves everything on port 3001
# Visit http://localhost:3001
```

---

## API Reference

All routes are prefixed with `/api`.

| Method | Endpoint                      | Description                      |
|--------|-------------------------------|----------------------------------|
| GET    | `/expenses`                   | List expenses (filterable)       |
| GET    | `/expenses/:id`               | Single expense                   |
| POST   | `/expenses`                   | Create expense                   |
| PUT    | `/expenses/:id`               | Update expense                   |
| DELETE | `/expenses/:id`               | Delete expense                   |
| GET    | `/analytics/by-category`      | Totals grouped by category       |
| GET    | `/analytics/monthly-trend`    | Monthly spending totals          |

**Query parameters for `GET /expenses`:**

| Param      | Example  | Description                          |
|------------|----------|--------------------------------------|
| `category` | `Food`   | Filter by category                   |
| `year`     | `2025`   | Filter by year                       |
| `month`    | `3`      | Filter by month (1–12)               |
| `sortBy`   | `amount` | Sort field: `date`, `amount`, `title`|
| `order`    | `asc`    | Direction: `asc` or `desc`           |

---

## Database Schema

```js
// MongoDB collection: expenses
{
  title:       String,   // required, max 120 chars
  amount:      Number,   // required, min 0.01 (AUD)
  category:    String,   // required, enum: [Food, Transport, Housing,
                         //   Entertainment, Health, Shopping, Education, Other]
  date:        Date,     // required
  description: String,   // optional, max 500 chars
  createdAt:   Date,     // auto-generated (Mongoose timestamps)
  updatedAt:   Date,     // auto-generated (Mongoose timestamps)
}
```

---

## Challenges Overcome

**1. SVG donut chart without a library.** Rendering the category breakdown as an SVG donut required manually computing arc paths using trigonometry (`Math.cos`, `Math.sin`), converting cumulative percentage values into start/end angles, and handling the "large arc" flag correctly for slices greater than 180°. Getting the inner radius cutout and the centred label to align precisely across different data sets took considerable iteration.

**2. Accessible modal focus trapping.** Simply opening a modal isn't enough — keyboard users need Tab and Shift+Tab to cycle within the modal without escaping to the background. This required querying all focusable elements inside the dialog on each keydown event and manually redirecting focus at the boundaries, while also restoring focus to the trigger element on close.

**3. Stale closure in the useExpenses hook.** The `load` function inside the custom hook had a dependency on filter values. Early versions recreated `load` on every render, causing infinite fetch loops. The fix was to correctly list the five individual filter properties (not the whole object reference) in `useCallback`'s dependency array, so the function only re-runs when a filter actually changes.

**4. MongoDB aggregation for analytics.** Computing category totals and monthly trends on the client by filtering the full expense list worked in development, but would break at scale. Replacing this with server-side `$group` and `$sum` aggregation pipelines required learning Mongoose's `.aggregate()` API and correctly constructing the `$match` date-range stage to respect the active year filter.

**5. Consistent currency and date formatting across locales.** Using raw `toFixed(2)` for currency produced inconsistent results across browsers. Switching to `Intl.NumberFormat` with `{ style: 'currency', currency: 'AUD' }` and `toLocaleDateString` with explicit options ensured output was consistent and readable on all target platforms.

---

## Assignment Checklist

- [x] Single-page application — one `index.html`, React rewrites DOM in place
- [x] **C**reate — add expense via modal form
- [x] **R**ead — dashboard, expense list, analytics (3 views)
- [x] **U**pdate — edit any expense inline via modal
- [x] **D**elete — remove with confirmation dialog
- [x] Category breakdown view (bars + donut chart)
- [x] Monthly trend view (bar chart + summary table)
- [x] Toast notifications for all mutations
- [x] Accessible (ARIA, keyboard nav, focus trap, contrast)
- [x] Responsive mobile layout
- [x] Error handling — server-down banner, form validation
- [x] Database export in `database/expenses.json`
- [x] Seed script for easy setup

---

## License

MIT — free for academic and personal use.
