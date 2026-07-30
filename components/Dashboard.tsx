'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  IconWallet,
  IconTrendingUp,
  IconCoin,
  IconChartPie,
  IconRobot,
  IconPlus,
  IconSearch,
} from '@tabler/icons-react';
import { PieChart, Pie, Cell } from 'recharts';
import { usePortfolio, fmtUsd, fmtUsd2 } from '@/lib/portfolio';
import { fetchNews } from '@/lib/stocks';
import { NewsArticle } from '@/types';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const SECTOR_COLORS = ['#1D9E75', '#378ADD', '#EF9F27', '#D3D1C7', '#9B7EDE', '#E06C9F', '#54B4C4'];

function timeAgo(unix: number): string {
  if (!unix) return '';
  const secs = Math.max(0, Math.floor(Date.now() / 1000 - unix));
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { holdings, totals } = usePortfolio();

  const tickerKey = holdings.map((h) => h.ticker).join(',');
  const [news, setNews] = useState<NewsArticle[]>([]);
  useEffect(() => {
    let active = true;
    fetchNews(tickerKey ? tickerKey.split(',') : []).then((a) => {
      if (active) setNews(a.slice(0, 3));
    });
    return () => { active = false; };
  }, [tickerKey]);

  const allocation = useMemo(() => {
    const bySector = new Map<string, number>();
    holdings.forEach((h) => bySector.set(h.sector, (bySector.get(h.sector) ?? 0) + h.currentValue));
    const total = [...bySector.values()].reduce((s, v) => s + v, 0) || 1;
    return [...bySector.entries()]
      .map(([name, value], i) => ({
        name,
        value: Math.round((value / total) * 100),
        color: SECTOR_COLORS[i % SECTOR_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [holdings]);

  const gainColor = totals.dayGainUsd >= 0 ? 'text-green-600' : 'text-red-600';
  const gainSign = totals.dayGainUsd >= 0 ? '+' : '';

  const metrics = [
    { label: 'Portfolio value', value: fmtUsd(totals.value), sub: `${gainSign}${fmtUsd(totals.dayGainUsd)} today`, subColor: gainColor, icon: IconWallet },
    { label: 'Day gain', value: `${gainSign}${fmtUsd(totals.dayGainUsd)}`, sub: `${gainSign}${totals.dayGainPct.toFixed(2)}%`, subColor: gainColor, icon: IconTrendingUp },
    { label: 'Total invested', value: fmtUsd(totals.invested), sub: 'Cost basis', subColor: 'text-gray-500', icon: IconCoin },
    { label: 'Holdings', value: String(holdings.length), sub: `${allocation.length} sectors`, subColor: 'text-gray-500', icon: IconChartPie },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Topbar */}
      <div className="px-4 py-3.5 bg-white border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-[13px] md:text-[13px] font-medium text-gray-900">Good evening, Jeffrey</h1>
          <p className="text-[11px] text-gray-500 mt-0.5">Here is your portfolio overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('markets')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 text-[11px] text-gray-600 hover:bg-gray-50"
          >
            <IconPlus size={13} />
            Add stock
          </button>
          <button
            onClick={() => onNavigate('analyst')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#111827] text-white text-[11px]"
          >
            <IconRobot size={13} />
            Ask AI
          </button>
        </div>
      </div>

      {holdings.length === 0 ? (
        <EmptyState onNavigate={onNavigate} />
      ) : (
        <div className="p-4 flex flex-col gap-4">
          {/* Mobile portfolio card */}
          <div className="md:hidden bg-[#111827] rounded-xl p-6">
            <p className="text-[11px] text-white/40 mb-1">Total portfolio</p>
            <p className="text-3xl font-medium text-white">{fmtUsd(totals.value)}</p>
            <p className={`text-[13px] mt-1 ${totals.dayGainUsd >= 0 ? 'text-[#34d399]' : 'text-red-400'}`}>
              {gainSign}{fmtUsd(totals.dayGainUsd)} today ({gainSign}{totals.dayGainPct.toFixed(2)}%)
            </p>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {metrics.map(({ label, value, sub, subColor, icon: Icon }) => (
              <div key={label} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <Icon size={12} className="text-gray-400" />
                  <p className="text-[11px] text-gray-500">{label}</p>
                </div>
                <p className="text-[22px] font-medium text-gray-900 tracking-tight">{value}</p>
                <p className={`text-[12px] mt-1.5 ${subColor}`}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Allocation + Holdings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Allocation */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="text-[12px] font-medium text-gray-900 mb-4">Allocation by sector</h3>
              <div className="flex items-center gap-3">
                <PieChart width={110} height={110}>
                  <Pie data={allocation} cx={55} cy={55} innerRadius={32} outerRadius={52} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
                    {allocation.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="flex flex-col gap-2 flex-1">
                  {allocation.map(({ name, value, color }) => (
                    <div key={name} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-[11px] text-gray-500">{name}</span>
                      </div>
                      <span className="text-[11px] font-medium text-gray-900">{value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Holdings */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200">
                <h3 className="text-[12px] font-medium text-gray-900">Holdings</h3>
                <button onClick={() => onNavigate('markets')} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600">
                  <IconPlus size={12} /> Add
                </button>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 text-left text-[10px] text-gray-500 font-normal">Name</th>
                    <th className="px-4 py-2 text-left text-[10px] text-gray-500 font-normal">Value</th>
                    <th className="px-4 py-2 text-left text-[10px] text-gray-500 font-normal">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h, i) => (
                    <tr key={h.ticker} className={i < holdings.length - 1 ? 'border-b border-gray-200' : ''}>
                      <td className="px-4 py-3 text-[12px] text-gray-900">
                        {h.ticker}
                        <span className="text-gray-400 hidden md:inline"> · {h.name}</span>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-gray-900">{fmtUsd2(h.currentValue)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${h.change >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {h.change >= 0 ? '+' : ''}{h.change.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Market news */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200">
              <h3 className="text-[12px] font-medium text-gray-900">Market news</h3>
              <button onClick={() => onNavigate('news')} className="text-[11px] text-gray-400 hover:text-gray-600">View all</button>
            </div>
            <div>
              {news.length === 0 ? (
                <p className="px-4 py-6 text-[11px] text-gray-400">No recent news yet.</p>
              ) : (
                news.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => onNavigate('news')}
                    className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors ${i < news.length - 1 ? 'border-b border-gray-200' : ''}`}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <p className="text-[12px] text-gray-900 leading-snug flex-1">{item.headline}</p>
                      <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded font-medium bg-gray-100 text-gray-600">{item.related}</span>
                    </div>
                    <p className="text-[10px] text-gray-400">{[item.source, timeAgo(item.datetime)].filter(Boolean).join(' · ')}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="p-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-10 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
          <IconChartPie size={22} className="text-gray-400" />
        </div>
        <h2 className="text-[15px] font-semibold text-gray-900 mb-1">Your portfolio is empty</h2>
        <p className="text-[12px] text-gray-500 max-w-xs mb-5">
          Search for stocks, check their details, and add how much you invested. Your total will build up here.
        </p>
        <button
          onClick={() => onNavigate('markets')}
          className="flex items-center gap-1.5 bg-[#111827] text-white text-[12px] rounded-lg px-4 py-2.5 hover:bg-black transition-colors"
        >
          <IconSearch size={14} />
          Browse markets
        </button>
      </div>
    </div>
  );
}
