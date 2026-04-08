/**
 * server/seed.js
 * ──────────────
 * Populates MongoDB with sample expense data for development/demo.
 * Run with: node seed.js
 */

const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ledger';

const Expense = mongoose.model('Expense', new mongoose.Schema({
  title: String, amount: Number, category: String, date: Date, description: String
}));

const SAMPLES = [
  // January 2025
  { title: 'Grocery run', amount: 84.50, category: 'Food', date: new Date('2025-01-05'), description: 'Weekly groceries from Woolworths' },
  { title: 'Monthly rent', amount: 1800.00, category: 'Housing', date: new Date('2025-01-01'), description: 'January rent' },
  { title: 'Opal card top-up', amount: 50.00, category: 'Transport', date: new Date('2025-01-08'), description: 'Public transport credit' },
  { title: 'Netflix', amount: 22.99, category: 'Entertainment', date: new Date('2025-01-10'), description: 'Monthly streaming' },
  { title: 'GP appointment', amount: 40.00, category: 'Health', date: new Date('2025-01-12'), description: 'Gap payment' },
  { title: 'Udemy course', amount: 19.99, category: 'Education', date: new Date('2025-01-15'), description: 'React + TypeScript' },
  { title: 'Dinner out', amount: 145.00, category: 'Food', date: new Date('2025-01-18'), description: 'Special occasion' },
  { title: 'Sony headphones', amount: 299.00, category: 'Shopping', date: new Date('2025-01-20'), description: 'WH-1000XM5' },
  { title: 'Pharmacy', amount: 32.40, category: 'Health', date: new Date('2025-01-22'), description: 'Prescriptions' },
  { title: 'Uber rides', amount: 67.20, category: 'Transport', date: new Date('2025-01-25'), description: 'Weekend trips' },
  // February 2025
  { title: 'Grocery run', amount: 91.10, category: 'Food', date: new Date('2025-02-03'), description: 'Weekly groceries' },
  { title: 'Monthly rent', amount: 1800.00, category: 'Housing', date: new Date('2025-02-01'), description: 'February rent' },
  { title: 'Cinema tickets', amount: 48.00, category: 'Entertainment', date: new Date('2025-02-08'), description: 'Date night' },
  { title: 'Coffee subscription', amount: 39.00, category: 'Food', date: new Date('2025-02-11'), description: 'Monthly beans' },
  { title: 'Gym membership', amount: 59.95, category: 'Health', date: new Date('2025-02-14'), description: 'Monthly fee' },
  { title: 'Flight to Melbourne', amount: 189.00, category: 'Transport', date: new Date('2025-02-20'), description: 'Jetstar sale' },
  { title: 'Textbooks', amount: 55.80, category: 'Education', date: new Date('2025-02-22'), description: 'Semester books' },
  // March 2025
  { title: 'Monthly rent', amount: 1800.00, category: 'Housing', date: new Date('2025-03-01'), description: 'March rent' },
  { title: 'Grocery run', amount: 78.30, category: 'Food', date: new Date('2025-03-06'), description: 'Weekly groceries' },
  { title: 'Electricity bill', amount: 134.50, category: 'Housing', date: new Date('2025-03-10'), description: 'Q1 electricity' },
  { title: 'Spotify', amount: 12.99, category: 'Entertainment', date: new Date('2025-03-12'), description: 'Music streaming' },
  { title: 'Running shoes', amount: 179.00, category: 'Shopping', date: new Date('2025-03-15'), description: 'Nike Pegasus' },
  { title: 'UX workshop', amount: 99.00, category: 'Education', date: new Date('2025-03-18'), description: 'Online course' },
  { title: 'Pharmacy', amount: 28.00, category: 'Health', date: new Date('2025-03-22'), description: 'Vitamins' },
  // April 2025
  { title: 'Monthly rent', amount: 1800.00, category: 'Housing', date: new Date('2025-04-01'), description: 'April rent' },
  { title: 'Easter groceries', amount: 95.40, category: 'Food', date: new Date('2025-04-04'), description: 'Long weekend shop' },
  { title: 'Train tickets', amount: 36.00, category: 'Transport', date: new Date('2025-04-10'), description: 'Blue Mountains trip' },
  { title: 'Family lunch', amount: 88.00, category: 'Food', date: new Date('2025-04-15'), description: 'Easter Sunday' },
  // May 2025
  { title: 'Monthly rent', amount: 1800.00, category: 'Housing', date: new Date('2025-05-01'), description: 'May rent' },
  { title: 'Grocery run', amount: 82.60, category: 'Food', date: new Date('2025-05-05'), description: 'Weekly groceries' },
  { title: 'Concert tickets', amount: 220.00, category: 'Entertainment', date: new Date('2025-05-10'), description: 'Live music' },
  { title: 'Internet bill', amount: 79.00, category: 'Housing', date: new Date('2025-05-15'), description: 'Monthly internet' },
  // June 2025
  { title: 'Monthly rent', amount: 1800.00, category: 'Housing', date: new Date('2025-06-01'), description: 'June rent' },
  { title: 'Grocery run', amount: 88.20, category: 'Food', date: new Date('2025-06-07'), description: 'Weekly groceries' },
  { title: 'Tax accountant', amount: 250.00, category: 'Other', date: new Date('2025-06-20'), description: 'EOFY return' },
  { title: 'Laptop bag', amount: 89.00, category: 'Shopping', date: new Date('2025-06-25'), description: 'Peak Design' },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  await Expense.deleteMany({});
  await Expense.insertMany(SAMPLES);
  console.log(`✅  Seeded ${SAMPLES.length} expenses`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
