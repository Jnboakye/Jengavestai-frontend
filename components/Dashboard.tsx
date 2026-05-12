'use client';

import {
  IconWallet,
  IconTrendingUp,
  IconChartBar,
  IconShield,
  IconCloudUpload,
  IconRobot,
  IconPlus,
} from '@tabler/icons-react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  PieChart,
  Pie,
  ResponsiveContainer,
} from 'recharts';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const barData = [
  { label: 'Jan', value: 30, color: '#D1D5DB' },
  { label: '', value: 38, color: '#D1D5DB' },
  { label: 'Mar', value: 35, color: '#D1D5DB' },
  { label: '', value: 52, color: '#D1D5DB' },
  { label: 'May', value: 45, color: '#5DCAA5' },
  { label: '', value: 60, color: '#5DCAA5' },
  { label: 'Jul', value: 55, color: '#1D9E75' },
  { label: '', value: 68, color: '#1D9E75' },
  { label: 'Sep', value: 62, color: '#1D9E75' },
  { label: '', value: 74, color: '#1D9E75' },
  { label: 'Nov', value: 70, color: '#1D9E75' },
  { label: 'Now', value: 88, color: '#1D9E75' },
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

const news = [
  { title: 'S&P 500 hits 3-month high on tech earnings', source: 'Reuters', time: '2h ago', sentiment: 'Positive' },
  { title: 'Fed signals rates elevated through mid-2026', source: 'Bloomberg', time: '4h ago', sentiment: 'Watch' },
  { title: 'Apple beats Q3 — revenue up 8% YoY', source: 'FT', time: '6h ago', sentiment: 'Positive' },
];

const metrics = [
  {
    label: 'Portfolio value',
    value: '$24,381',
    sub: '+$571 today',
    subColor: 'text-green-600',
    icon: IconWallet,
  },
  {
    label: 'Day gain',
    value: '+$571',
    sub: 'Best day this week',
    subColor: 'text-green-600',
    icon: IconTrendingUp,
  },
  {
    label: 'S&P 500',
    value: '5,842',
    sub: '+1.2% today',
    subColor: 'text-green-600',
    icon: IconChartBar,
  },
  {
    label: 'Risk score',
    value: 'Moderate',
    sub: 'Based on holdings',
    subColor: 'text-gray-500',
    icon: IconShield,
  },
];

const sentimentBadge = (s: string) => {
  if (s === 'Positive') return 'bg-green-50 text-green-600';
  if (s === 'Negative') return 'bg-red-50 text-red-600';
  return 'bg-yellow-50 text-yellow-700';
};

export default function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Topbar */}
      <div className="px-6 py-3.5 bg-white border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-[13px] font-medium text-gray-900">
            Good evening, Jeffrey
          </h1>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Here is your portfolio overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 text-[11px] text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse"></span>
            Live
          </div>
          <button
            onClick={() => onNavigate('documents')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 text-[11px] text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <IconCloudUpload size={13} />
            Upload PDF
          </button>
          <button
            onClick={() => onNavigate('analyst')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#111827] text-white text-[11px] hover:bg-gray-800 transition-colors"
          >
            <IconRobot size={13} />
            Ask AI
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="p-4 flex flex-col gap-3">

        {/* Metric cards */}
        <div className="grid grid-cols-4 gap-3">
          {metrics.map(({ label, value, sub, subColor, icon: Icon }) => (
            <div
              key={label}
              className="bg-white border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-center gap-1.5 mb-3">
                <Icon size={12} className="text-gray-400" />
                <p className="text-[10px] text-gray-500">{label}</p>
              </div>
              <p className="text-[20px] font-medium text-gray-900 tracking-tight">
                {value}
              </p>
              <p className={`text-[11px] mt-1.5 ${subColor}`}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid gap-3" style={{ gridTemplateColumns: '3fr 2fr' }}>

          {/* Portfolio performance */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[12px] font-medium text-gray-900">
                Portfolio performance
              </h3>
              <span className="text-[10px] text-gray-400">YTD</span>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart
                data={barData}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                barCategoryGap="25%"
              >
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: '#9CA3AF' }}
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

          {/* Allocation */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-[12px] font-medium text-gray-900 mb-4">
              Allocation
            </h3>
            <div className="flex items-center gap-3">
              <PieChart width={90} height={90}>
                <Pie
                  data={allocationData}
                  cx={45}
                  cy={45}
                  innerRadius={26}
                  outerRadius={42}
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
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[11px] text-gray-500">{name}</span>
                    </div>
                    <span className="text-[11px] font-medium text-gray-900">
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
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200">
              <h3 className="text-[12px] font-medium text-gray-900">Holdings</h3>
              <button className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600">
                <IconPlus size={12} />
                Add
              </button>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Name', 'Ticker', 'Price', 'Change'].map(col => (
                    <th
                      key={col}
                      className="px-4 py-2 text-left text-[10px] text-gray-500 font-normal"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {holdings.map((h, i) => (
                  <tr
                    key={h.ticker}
                    className={i < holdings.length - 1 ? 'border-b border-gray-200' : ''}
                  >
                    <td className="px-4 py-3 text-[12px] text-gray-900">{h.name}</td>
                    <td className="px-4 py-3 text-[12px] text-gray-500">{h.ticker}</td>
                    <td className="px-4 py-3 text-[12px] text-gray-900">{h.price}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        h.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {h.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Market news */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200">
              <h3 className="text-[12px] font-medium text-gray-900">Market news</h3>
              <button
                onClick={() => onNavigate('news')}
                className="text-[11px] text-gray-400 hover:text-gray-600"
              >
                View all
              </button>
            </div>
            <div>
              {news.map((item, i) => (
                <div
                  key={i}
                  className={`px-4 py-3 ${i < news.length - 1 ? 'border-b border-gray-200' : ''}`}
                >
                  <div className="flex items-start gap-2 mb-1">
                    <p className="text-[11px] text-gray-900 leading-snug flex-1">
                      {item.title}
                    </p>
                    <span className={`shrink-0 text-[9px] px-1.5 py-0.5 rounded font-medium ${sentimentBadge(item.sentiment)}`}>
                      {item.sentiment}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    {item.source} · {item.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}