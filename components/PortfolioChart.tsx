'use client';

import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const holdings = [
  { name: 'Apple Inc.', ticker: 'AAPL', qty: 50, price: '$189.42', value: '$9,471', change: '+1.8%', up: true },
  { name: 'Microsoft Corporation', ticker: 'MSFT', qty: 30, price: '$412.10', value: '$12,363', change: '+2.1%', up: true },
  { name: 'S&P 500 ETF', ticker: 'SPY', qty: 25, price: '$521.30', value: '$13,033', change: '+1.2%', up: true },
  { name: 'Bitcoin', ticker: 'BTC', qty: 0.5, price: '$67,204', value: '$33,602', change: '-0.8%', up: false },
  { name: 'Ethereum', ticker: 'ETH', qty: 5, price: '$2,450', value: '$12,250', change: '-1.2%', up: false },
];

const allocationData = [
  { name: 'Stocks', value: 40, color: '#1D9E75' },
  { name: 'ETFs', value: 20, color: '#378ADD' },
  { name: 'Crypto', value: 14, color: '#EF9F27' },
  { name: 'Bonds', value: 26, color: '#D3D1C7' },
];

function changeStyle(up: boolean) {
  return up ? { bg: '#F0FDF4', text: '#059669' } : { bg: '#FEF2F2', text: '#dc2626' };
}

export default function PortfolioPage() {
  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: 'var(--color-main-bg)' }}>
      {/* Header */}
      <div
        className="shrink-0 px-6 py-4 border-b"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}
      >
        <h1 className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Portfolio</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Complete list of your holdings</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Holdings table */}
        <div
          className="rounded-lg border overflow-hidden"
          style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}
        >
          <div
            className="px-4 py-3 border-b"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <h3 className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>All holdings</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['Name', 'Ticker', 'Qty', 'Price', 'Value', 'Change'].map((col) => (
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
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-primary)' }}>{h.qty}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-primary)' }}>{h.price}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-primary)' }}>{h.value}</td>
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

        {/* Allocation donut */}
        <div
          className="rounded-lg border p-4"
          style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}
        >
          <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>Asset allocation</h3>
          <div className="flex items-center gap-8">
            <PieChart width={150} height={150}>
              <Pie
                data={allocationData}
                cx={75}
                cy={75}
                innerRadius={42}
                outerRadius={68}
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
            <div className="flex flex-col gap-3">
              {allocationData.map(({ name, value, color }) => (
                <div key={name} className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <div>
                    <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{name}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
