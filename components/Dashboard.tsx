'use client';

import React from 'react';
import { BarChart, Bar, Cell, XAxis, PieChart, Pie, ResponsiveContainer } from 'recharts';
import { IconCloudUpload, IconBrain, IconSquare } from '@tabler/icons-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const barData = [
  { label: 'Jan', value: 65, color: '#374151' },
  { label: '', value: 70, color: '#374151' },
  { label: 'Mar', value: 68, color: '#374151' },
  { label: '', value: 74, color: '#374151' },
  { label: 'May', value: 78, color: '#5DCAA5' },
  { label: '', value: 82, color: '#5DCAA5' },
  { label: 'Jul', value: 85, color: '#1D9E75' },
  { label: '', value: 88, color: '#1D9E75' },
  { label: 'Sep', value: 86, color: '#1D9E75' },
  { label: '', value: 89, color: '#1D9E75' },
  { label: 'Nov', value: 92, color: '#1D9E75' },
  { label: 'Now', value: 95, color: '#1D9E75' },
];

const allocationData = [
  { name: 'Stocks', value: 40, color: '#1D9E75' },
  { name: 'ETFs', value: 20, color: '#378ADD' },
  { name: 'Crypto', value: 14, color: '#EF9F27' },
  { name: 'Bonds', value: 26, color: '#D3D1C7' },
];

const holdings = [
  { name: 'Apple Inc.', ticker: 'AAPL', price: '$189.42', change: '+1.8%', up: true },
  { name: 'Microsoft', ticker: 'MSFT', price: '$412.10', change: '+2.1%', up: true },
  { name: 'S&P 500 ETF', ticker: 'SPY', price: '$521.30', change: '+1.2%', up: true },
  { name: 'Bitcoin', ticker: 'BTC', price: '$67,204', change: '-0.8%', up: false },
];

const newsItems = [
  { title: 'S&P 500 hits 3-month high on tech earnings', source: 'Bloomberg', time: '2h ago', sentiment: 'Positive' },
  { title: 'Fed signals rates elevated through mid-2026', source: 'Bloomberg', time: '4h ago', sentiment: 'Watch' },
  { title: 'Apple beats Q3 — revenue up 8% YoY', source: 'FT', time: '6h ago', sentiment: 'Positive' },
];

function sentimentStyle(s: string) {
  if (s === 'Positive') return { bg: '#F0FDF4', text: '#059669' };
  if (s === 'Negative') return { bg: '#FEF2F2', text: '#dc2626' };
  return { bg: '#FFFBEB', text: '#b45309' };
}

function changeStyle(up: boolean) {
  return up ? { bg: '#F0FDF4', text: '#059669' } : { bg: '#FEF2F2', text: '#dc2626' };
}

export default function DashboardPage({ onNavigate }: DashboardProps) {
  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: 'var(--color-main-bg)' }}>
      {/* Topbar */}
      <div
        className="shrink-0 px-6 py-3 flex items-center justify-between border-b"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}
      >
        <div>
          <h1 className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            Good evening, Jeffrey
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            Here is your portfolio overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
              style={{ backgroundColor: '#34d399' }}
            />
            Live
          </div>
          <button
            onClick={() => onNavigate('documents')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-secondary)',
              backgroundColor: 'transparent',
            }}
          >
            <IconCloudUpload size={13} />
            Upload PDF
          </button>
          <button
            onClick={() => onNavigate('analyst')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-white"
            style={{ backgroundColor: '#111827' }}
          >
            <IconBrain size={13} />
            Ask AI
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Metric cards */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Portfolio value', value: '$24,381', sub: '+$571 today', subColor: 'var(--color-text-muted)' },
            { label: 'Day gain', value: '+$571', sub: 'Best day this week', subColor: '#34d399' },
            { label: 'S&P 500', value: '5,842', sub: '+1.2% today', subColor: 'var(--color-text-muted)' },
            { label: 'Risk score', value: 'Moderate', sub: 'Based on holdings', subColor: 'var(--color-text-muted)' },
          ].map(({ label, value, sub, subColor }) => (
            <div
              key={label}
              className="rounded-lg border p-4"
              style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}
            >
              <div className="flex items-center gap-1.5 mb-3">
                <IconSquare size={11} stroke={1.5} style={{ color: 'var(--color-text-muted)' }} />
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
              </div>
              <p className="text-2xl font-medium" style={{ color: 'var(--color-text-primary)' }}>{value}</p>
              <p className="text-xs mt-2" style={{ color: subColor }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid gap-3" style={{ gridTemplateColumns: '3fr 2fr' }}>
          {/* Portfolio performance bar chart */}
          <div
            className="rounded-lg border p-4"
            style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                Portfolio performance
              </h3>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>YTD</span>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barCategoryGap="25%">
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)' }}
                  interval={0}
                />
                <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Allocation donut */}
          <div
            className="rounded-lg border p-4"
            style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}
          >
            <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Allocation
            </h3>
            <div className="flex items-center gap-3">
              <PieChart width={110} height={110}>
                <Pie
                  data={allocationData}
                  cx={55}
                  cy={55}
                  innerRadius={32}
                  outerRadius={52}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  strokeWidth={0}
                >
                  {allocationData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="flex flex-col gap-2 flex-1">
                {allocationData.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{name}</span>
                    </div>
                    <span className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>
                      {value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Holdings and news row */}
        <div className="grid gap-3 pb-4" style={{ gridTemplateColumns: '3fr 2fr' }}>
          {/* Holdings table */}
          <div
            className="rounded-lg border overflow-hidden"
            style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}
          >
            <div
              className="px-4 py-3 flex items-center justify-between border-b"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <h3 className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Holdings</h3>
              <div className="flex items-center gap-1">
                <IconSquare size={11} stroke={1.5} style={{ color: 'var(--color-text-muted)' }} />
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Add</span>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['Name', 'Ticker', 'Price', 'Change'].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-2 text-left text-xs font-medium"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {holdings.map((h, i) => {
                  const cs = changeStyle(h.up);
                  return (
                    <tr
                      key={h.ticker}
                      style={{ borderBottom: i < holdings.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                    >
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-primary)' }}>{h.name}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>{h.ticker}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-primary)' }}>{h.price}</td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{ backgroundColor: cs.bg, color: cs.text }}
                        >
                          {h.change}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Market news */}
          <div
            className="rounded-lg border overflow-hidden"
            style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}
          >
            <div
              className="px-4 py-3 flex items-center justify-between border-b"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <h3 className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Market news</h3>
              <button
                onClick={() => onNavigate('news')}
                className="text-xs"
                style={{ color: 'var(--color-text-muted)' }}
              >
                View all
              </button>
            </div>
            <div>
              {newsItems.map((item, i) => {
                const ss = sentimentStyle(item.sentiment);
                return (
                  <div
                    key={i}
                    className="px-4 py-3"
                    style={{ borderBottom: i < newsItems.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <p className="text-xs leading-snug flex-1" style={{ color: 'var(--color-text-primary)' }}>
                        {item.title}
                      </p>
                      <span
                        className="shrink-0 px-1.5 py-0.5 rounded text-xs font-medium"
                        style={{ backgroundColor: ss.bg, color: ss.text }}
                      >
                        {item.sentiment}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {item.source} · {item.time}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
