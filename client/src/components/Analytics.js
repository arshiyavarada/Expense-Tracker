/**
 * components/Analytics.js
 * ────────────────────────
 * Analytics view: SVG donut chart, monthly bar chart, summary table.
 * Charts are hand-rolled SVG — no external chart library needed.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { CATEGORY_META, MONTHS } from '../constants';
import { fmt } from '../utils';
import { api } from '../services/api';
import { Spinner, ErrorBanner } from './Dashboard';
import styles from './Analytics.module.css';

export function Analytics({ filterYear }) {
  const [categoryData, setCategoryData] = useState([]);
  const [trendData,    setTrendData]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = filterYear ? { year: filterYear } : {};
      const [cat, trend] = await Promise.all([
        api.getByCategory(params),
        api.getMonthlyTrend(params),
      ]);
      setCategoryData(cat);
      setTrendData(trend);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filterYear]);

  useEffect(() => { load(); }, [load]);

  const total = categoryData.reduce((s, d) => s + d.total, 0);

  if (loading) return <Spinner />;
  if (error)   return <ErrorBanner message={error} />;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.heading}>Analytics</h2>
          <p className={styles.sub}>
            {filterYear ? `Year ${filterYear}` : 'All time'} · {fmt(total)} total
          </p>
        </div>
      </header>

      {categoryData.length === 0 ? (
        <div className={styles.noData}>
          <p>No data available for this period. Try adjusting the year filter.</p>
        </div>
      ) : (
        <>
          <div className={styles.topGrid}>
            {/* Donut chart */}
            <section className={styles.card} aria-labelledby="donut-heading">
              <h3 id="donut-heading" className={styles.cardTitle}>Spending Breakdown</h3>
              <DonutChart data={categoryData} total={total} />
              <Legend data={categoryData} total={total} />
            </section>

            {/* Bar chart */}
            <section className={styles.card} aria-labelledby="trend-heading">
              <h3 id="trend-heading" className={styles.cardTitle}>Monthly Trend</h3>
              {trendData.length === 0
                ? <p className={styles.noData}>No monthly data.</p>
                : <BarChart data={trendData} />
              }
            </section>
          </div>

          {/* Summary table */}
          <section className={styles.card} aria-labelledby="table-heading">
            <h3 id="table-heading" className={styles.cardTitle}>Category Summary</h3>
            <SummaryTable data={categoryData} total={total} />
          </section>
        </>
      )}
    </div>
  );
}

// ── Donut Chart ───────────────────────────────────────────────────────────────

function DonutChart({ data, total }) {
  const SIZE = 200, R = 72, INNER = 44, CX = SIZE / 2, CY = SIZE / 2;
  let angle = -Math.PI / 2; // start at top

  const slices = data.map(d => {
    const sweep = (d.total / total) * 2 * Math.PI;
    const startA = angle;
    angle += sweep;
    const endA = angle;
    const x1 = CX + R * Math.cos(startA), y1 = CY + R * Math.sin(startA);
    const x2 = CX + R * Math.cos(endA),   y2 = CY + R * Math.sin(endA);
    const ix1 = CX + INNER * Math.cos(startA), iy1 = CY + INNER * Math.sin(startA);
    const ix2 = CX + INNER * Math.cos(endA),   iy2 = CY + INNER * Math.sin(endA);
    const large = sweep > Math.PI ? 1 : 0;
    return {
      ...d,
      path: `M${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} L${ix2},${iy2} A${INNER},${INNER} 0 ${large},0 ${ix1},${iy1}Z`
    };
  });

  return (
    <div className={styles.donutWrap}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className={styles.donutSvg}
        role="img"
        aria-label="Spending breakdown donut chart"
      >
        {slices.map(s => (
          <path
            key={s._id}
            d={s.path}
            fill={CATEGORY_META[s._id]?.color || '#999'}
            opacity="0.88"
            className={styles.slice}
          >
            <title>{s._id}: {fmt(s.total)} ({((s.total/total)*100).toFixed(1)}%)</title>
          </path>
        ))}
        {/* Centre text */}
        <text x={CX} y={CY - 7} textAnchor="middle" className={styles.donutTop}>Total</text>
        <text x={CX} y={CY + 12} textAnchor="middle" className={styles.donutVal}>
          {fmt(total).replace('A$', '$')}
        </text>
      </svg>
    </div>
  );
}

// ── Legend ────────────────────────────────────────────────────────────────────

function Legend({ data, total }) {
  return (
    <ul className={styles.legend} aria-label="Category legend">
      {data.map(d => {
        const meta = CATEGORY_META[d._id];
        return (
          <li key={d._id} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: meta?.color }} aria-hidden="true" />
            <span className={styles.legendLabel}>{meta?.icon} {d._id}</span>
            <span className={styles.legendAmt}>{fmt(d.total)}</span>
            <span className={styles.legendPct}>{((d.total / total) * 100).toFixed(1)}%</span>
          </li>
        );
      })}
    </ul>
  );
}

// ── Bar Chart ─────────────────────────────────────────────────────────────────

function BarChart({ data }) {
  const maxVal = Math.max(...data.map(d => d.total), 1);

  return (
    <div className={styles.barChart} role="img" aria-label="Monthly spending bar chart">
      {data.map((d, i) => {
        const pct = (d.total / maxVal) * 100;
        return (
          <div key={i} className={styles.barCol}>
            <div className={styles.barWrap}>
              <div
                className={styles.bar}
                style={{ height: `${pct}%` }}
                title={`${MONTHS[d._id.month - 1]} ${d._id.year}: ${fmt(d.total)}`}
              />
            </div>
            <div className={styles.barLabel}>{MONTHS[d._id.month - 1]}</div>
            <div className={styles.barAmt}>{fmt(d.total).replace('A$', '$')}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── Summary Table ─────────────────────────────────────────────────────────────

function SummaryTable({ data, total }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col" className={styles.right}>Transactions</th>
            <th scope="col" className={styles.right}>Total</th>
            <th scope="col" className={styles.right}>Average</th>
            <th scope="col">Share</th>
          </tr>
        </thead>
        <tbody>
          {data.map(d => {
            const meta = CATEGORY_META[d._id];
            const pct  = (d.total / total) * 100;
            return (
              <tr key={d._id}>
                <td>
                  <div className={styles.catCell}>
                    <span className={styles.catDot} style={{ background: meta?.color }} aria-hidden="true" />
                    <span>{meta?.icon} {d._id}</span>
                  </div>
                </td>
                <td className={`${styles.right} ${styles.mono}`}>{d.count}</td>
                <td className={`${styles.right} ${styles.mono}`}>{fmt(d.total)}</td>
                <td className={`${styles.right} ${styles.mono}`}>{fmt(d.total / d.count)}</td>
                <td>
                  <div className={styles.shareCell}>
                    <div className={styles.shareBar}>
                      <div
                        className={styles.shareFill}
                        style={{ width: `${pct}%`, background: meta?.color }}
                      />
                    </div>
                    <span className={styles.sharePct}>{pct.toFixed(1)}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
