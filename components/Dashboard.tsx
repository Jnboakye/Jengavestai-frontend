'use client';

import React from 'react';
import { IconCloudUpload, IconBrain } from '@tabler/icons-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardProps) {
  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--color-main-bg)' }}>
      {/* Topbar */}
      <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}>
        <div>
          <h1 className="text-xl font-medium" style={{ color: 'var(--color-text-primary)' }}>Good evening, Jeffrey</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Here is your portfolio overview</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'var(--color-card-bg)' }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-live)' }}></div>
            <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Live</span>
          </div>
          <button
            onClick={() => onNavigate('documents')}
            className="flex items-center gap-2 px-3 py-2 rounded"
            style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)', borderWidth: '1px', color: 'var(--color-text-secondary)' }}
          >
            <IconCloudUpload size={16} />
            <span className="text-sm">Upload PDF</span>
          </button>
          <button
            onClick={() => onNavigate('analyst')}
            className="flex items-center gap-2 px-3 py-2 rounded text-white"
            style={{ backgroundColor: '#111827' }}
          >
            <IconBrain size={16} />
            <span className="text-sm">Ask AI</span>
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Metrics Row */}
        <div className="grid grid-cols-4 gap-3">
          <MetricCard label="Portfolio value" value="$24,381" change="+$571 today" color="neutral" />
          <MetricCard label="Day gain" value="+$571" change="Best day this week" color="success" />
          <MetricCard label="S&P 500" value="5,842" change="+1.2% today" color="neutral" />
          <MetricCard label="Risk score" value="Moderate" change="Based on holdings" color="neutral" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 rounded-lg border p-4" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Portfolio performance</h3>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>YTD</span>
            </div>
            <PortfolioChart />
          </div>
          <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}>
            <h3 className="text-sm font-medium mb-4">Allocation</h3>
            <AllocationChart />
          </div>
        </div>

        {/* Holdings and News Row */}
        <div className="grid grid-cols-3 gap-3 pb-4">
          <div className="col-span-2 rounded-lg border overflow-hidden" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="text-sm font-medium">Holdings</h3>
              <button className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Add</button>
            </div>
            <HoldingsTable />
          </div>
          <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="text-sm font-medium">Market news</h3>
              <button 
                onClick={() => onNavigate('news')}
                className="text-xs" 
                style={{ color: 'var(--color-text-muted)' }}
              >
                View all
              </button>
            </div>
            <NewsList onNavigate={onNavigate} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  change,
  color,
}: {
  label: string;
  value: string;
  change: string;
  color: 'neutral' | 'success' | 'danger';
}) {
  return (
    <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}>
      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
      <p className="text-2xl font-medium mt-2" style={{ color: 'var(--color-text-primary)' }}>{value}</p>
      {change && (
        <p className={`text-xs mt-2 ${color === 'success' ? '' : ''}`} style={{ color: color === 'success' ? 'var(--color-positive)' : 'var(--color-text-muted)' }}>
          {change}
        </p>
      )}
    </div>
  );
}

function PortfolioChart() {
  const data = [65, 72, 68, 75, 78, 82, 85, 88, 86, 89, 92, 95];
  const max = Math.max(...data);
  const labels = ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov', 'Now'];
  const labelIndices = [0, 2, 4, 6, 8, 10, 11];

  return (
    <div className="flex items-end justify-between h-48 gap-1">
      {data.map((value, idx) => {
        let color = 'var(--color-chart-default)';
        const percentage = value / max;
        if (percentage > 0.75) color = 'var(--color-chart-high)';
        else if (percentage > 0.5) color = 'var(--color-chart-medium)';

        return (
          <div key={idx} className="flex-1 flex flex-col items-center">
            <div
              className="w-full rounded-t"
              style={{
                height: `${(value / max) * 100}%`,
                backgroundColor: color,
              }}
            ></div>
            {labelIndices.includes(idx) && (
              <p className="text-xs mt-2 text-center w-full" style={{ color: 'var(--color-text-muted)' }}>
                {labels[labelIndices.indexOf(idx)]}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AllocationChart() {
  const allocations = [
    { name: 'Stocks', value: 40, color: '#10b981' },
    { name: 'ETFs', value: 20, color: '#378ADD' },
    { name: 'Crypto', value: 14, color: '#EF9F27' },
    { name: 'Bonds', value: 26, color: '#8B8680' },
  ];

  return (
    <div>
      <div className="flex justify-center mb-4">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {allocations.reduce(
              (acc, { value, color }, idx) => {
                const prevOffset = acc.offset;
                const percentage = (value / 100) * 360;
                const startAngle = (prevOffset * Math.PI) / 180;
                const endAngle = ((prevOffset + percentage) * Math.PI) / 180;

                const x1 = 50 + 40 * Math.cos(startAngle - Math.PI / 2);
                const y1 = 50 + 40 * Math.sin(startAngle - Math.PI / 2);
                const x2 = 50 + 40 * Math.cos(endAngle - Math.PI / 2);
                const y2 = 50 + 40 * Math.sin(endAngle - Math.PI / 2);

                const largeArc = percentage > 180 ? 1 : 0;

                return {
                  elements: [
                    ...acc.elements,
                    <path
                      key={idx}
                      d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={color}
                    />,
                  ],
                  offset: prevOffset + percentage,
                };
              },
              { elements: [], offset: 0 }
            ).elements}
          </svg>
        </div>
      </div>
      <div className="space-y-2 text-xs">
        {allocations.map(({ name, value, color }) => (
          <div key={name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
              <span style={{ color: 'var(--color-text-secondary)' }}>{name}</span>
            </div>
            <span style={{ color: 'var(--color-text-primary)' }}>{value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HoldingsTable() {
  const holdings = [
    { name: 'Apple Inc.', ticker: 'AAPL', price: '$189.42', change: '+1.8%' },
    { name: 'Microsoft', ticker: 'MSFT', price: '$412.10', change: '+2.1%' },
    { name: 'S&P 500 ETF', ticker: 'SPY', price: '$521.30', change: '+1.2%' },
    { name: 'Bitcoin', ticker: 'BTC', price: '$67,204', change: '-0.8%' },
  ];

  return (
    <table className="w-full text-sm">
      <thead>
        <tr style={{ backgroundColor: 'var(--color-main-bg)', borderBottomColor: 'var(--color-border)', borderBottomWidth: '1px' }}>
          <th className="px-4 py-2 text-left font-medium text-xs" style={{ color: 'var(--color-text-muted)' }}>Name</th>
          <th className="px-4 py-2 text-left font-medium text-xs" style={{ color: 'var(--color-text-muted)' }}>Ticker</th>
          <th className="px-4 py-2 text-left font-medium text-xs" style={{ color: 'var(--color-text-muted)' }}>Price</th>
          <th className="px-4 py-2 text-left font-medium text-xs" style={{ color: 'var(--color-text-muted)' }}>Change</th>
        </tr>
      </thead>
      <tbody>
        {holdings.map((holding) => (
          <tr key={holding.ticker} style={{ borderBottomColor: 'var(--color-border)', borderBottomWidth: '1px' }}>
            <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>{holding.name}</td>
            <td className="px-4 py-3" style={{ color: 'var(--color-text-secondary)' }}>{holding.ticker}</td>
            <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-text-primary)' }}>{holding.price}</td>
            <td className="px-4 py-3">
              <span
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: holding.change.startsWith('+') ? '#10b98133' : '#ef444433',
                  color: holding.change.startsWith('+') ? '#10b981' : '#ef4444',
                }}
              >
                {holding.change}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function NewsList({ onNavigate }: { onNavigate: (page: string) => void }) {
  const news = [
    {
      title: 'S&P 500 hits 3-month high on tech earnings',
      source: 'Bloomberg',
      time: '2h ago',
      sentiment: 'Positive',
    },
    {
      title: 'Fed signals rates elevated through mid-2026',
      source: 'Financial Times',
      time: '4h ago',
      sentiment: 'Watch',
    },
    {
      title: 'Apple beats Q3 — revenue up 8% YoY',
      source: 'Reuters',
      time: '6h ago',
      sentiment: 'Positive',
    },
  ];

  return (
    <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
      {news.map((item, idx) => (
        <div key={idx} className="p-3 hover:opacity-80 cursor-pointer text-xs">
          <p className="font-medium leading-snug mb-2" style={{ color: 'var(--color-text-primary)' }}>{item.title}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span style={{ color: 'var(--color-text-muted)' }}>{item.source}</span>
              <span style={{ color: 'var(--color-text-muted)' }}>{item.time}</span>
            </div>
            <span
              className="px-2 py-1 rounded text-xs font-medium"
              style={{
                backgroundColor: item.sentiment === 'Positive' ? '#10b98133' : item.sentiment === 'Negative' ? '#ef444433' : '#f59e0b33',
                color: item.sentiment === 'Positive' ? '#10b981' : item.sentiment === 'Negative' ? '#ef4444' : '#f59e0b',
              }}
            >
              {item.sentiment}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}