'use client';

import React from 'react';
import { IconCloudUpload, IconBrain } from '@tabler/icons-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardProps) {
  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Topbar */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium">Good evening, John</h1>
          <p className="text-sm text-gray-500 mt-1">Here's your portfolio summary</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-live)' }}></div>
            <span className="text-xs font-medium">Live</span>
          </div>
          <button
            onClick={() => onNavigate('documents')}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            <IconCloudUpload size={16} />
            <span className="text-sm">Upload PDF</span>
          </button>
          <button
            onClick={() => onNavigate('analyst')}
            className="flex items-center gap-2 px-3 py-2 rounded text-white"
            style={{ backgroundColor: 'var(--color-sidebar-bg)' }}
          >
            <IconBrain size={16} />
            <span className="text-sm">Ask AI</span>
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {/* Metrics Row */}
          <div className="grid grid-cols-4 gap-3">
            <MetricCard label="Portfolio value" value="$24,381" change="+$571 today" color="neutral" />
            <MetricCard label="Day gain" value="+$571" change="Best day this week" color="success" />
            <MetricCard label="S&P 500" value="5,842" change="+1.2% today" color="neutral" />
            <MetricCard label="Risk score" value="Moderate" change="" color="neutral" />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium mb-3">Portfolio performance</h3>
              <PortfolioChart />
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium mb-3">Allocation</h3>
              <AllocationChart />
            </div>
          </div>

          {/* Holdings and News Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium">Holdings</h3>
              </div>
              <HoldingsTable />
            </div>
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium">Market news</h3>
              </div>
              <NewsList onNavigate={onNavigate} />
            </div>
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
    <div className="bg-white rounded-lg border border-gray-200 p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-medium mt-2">{value}</p>
      {change && (
        <p className={`text-xs mt-1 ${color === 'success' ? 'text-green-600' : 'text-gray-500'}`}>
          {change}
        </p>
      )}
    </div>
  );
}

function PortfolioChart() {
  const data = [65, 72, 68, 75, 78, 82, 85, 88, 86, 89, 92, 95];
  const max = Math.max(...data);

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
            {[0, 2, 4, 6, 8, 10, 11].includes(idx) && (
              <p className="text-xs text-gray-500 mt-2 text-center w-full">
                {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov', 'Now'][
                  [0, 2, 4, 6, 8, 10, 11].indexOf(idx)
                ]}
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
    { name: 'Stocks', value: 40, color: '#1D9E75' },
    { name: 'ETFs', value: 20, color: '#378ADD' },
    { name: 'Crypto', value: 14, color: '#EF9F27' },
    { name: 'Bonds', value: 26, color: '#D3D1C7' },
  ];

  return (
    <div>
      <div className="flex justify-center mb-3">
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
      <div className="space-y-1 text-xs">
        {allocations.map(({ name, value, color }) => (
          <div key={name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
              <span className="text-gray-600">{name}</span>
            </div>
            <span className="font-medium">{value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HoldingsTable() {
  const holdings = [
    { name: 'Apple', ticker: 'AAPL', price: '$189.42', change: '+1.8%' },
    { name: 'Microsoft', ticker: 'MSFT', price: '$412.10', change: '+2.1%' },
    { name: 'S&P 500 ETF', ticker: 'SPY', price: '$521.30', change: '+1.2%' },
    { name: 'Bitcoin', ticker: 'BTC', price: '$67,204', change: '-0.8%' },
  ];

  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-4 py-2 text-left font-medium text-gray-600">Name</th>
          <th className="px-4 py-2 text-left font-medium text-gray-600">Ticker</th>
          <th className="px-4 py-2 text-left font-medium text-gray-600">Price</th>
          <th className="px-4 py-2 text-left font-medium text-gray-600">Change</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {holdings.map((holding) => (
          <tr key={holding.ticker} className="hover:bg-gray-50">
            <td className="px-4 py-2 text-gray-900">{holding.name}</td>
            <td className="px-4 py-2 text-gray-600">{holding.ticker}</td>
            <td className="px-4 py-2 text-gray-900 font-medium">{holding.price}</td>
            <td className="px-4 py-2">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  holding.change.startsWith('+')
                    ? 'badge-positive'
                    : 'badge-negative'
                }`}
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
      title: 'Fed signals potential rate cuts',
      source: 'Bloomberg',
      time: '2h ago',
      sentiment: 'Positive',
    },
    {
      title: 'Tech stocks rally on AI optimism',
      source: 'Reuters',
      time: '4h ago',
      sentiment: 'Positive',
    },
    {
      title: 'Oil prices surge amid tensions',
      source: 'CNBC',
      time: '1d ago',
      sentiment: 'Negative',
    },
  ];

  return (
    <div className="divide-y divide-gray-200">
      {news.map((item, idx) => (
        <div key={idx} className="p-3 hover:bg-gray-50 cursor-pointer text-xs">
          <p className="font-medium text-gray-900 leading-snug mb-1">{item.title}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">{item.source}</span>
              <span className="text-gray-400">{item.time}</span>
            </div>
            <span
              className={
                item.sentiment === 'Positive'
                  ? 'badge-positive'
                  : item.sentiment === 'Negative'
                  ? 'badge-negative'
                  : 'badge-watch'
              }
            >
              {item.sentiment}
            </span>
          </div>
        </div>
      ))}
      <div className="p-3">
        <button
          onClick={() => onNavigate('news')}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 w-full text-center"
        >
          View all
        </button>
      </div>
    </div>
  );
}