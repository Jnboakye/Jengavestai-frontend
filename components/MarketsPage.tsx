'use client';

import { useEffect, useMemo, useState } from 'react';
import { IconSearch, IconPlus, IconCheck } from '@tabler/icons-react';
import { LineChart, Line, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Stock } from '@/types';
import { fetchStocks, priceSeries } from '@/lib/stocks';
import { usePortfolio, fmtUsd2 } from '@/lib/portfolio';
import AddHoldingModal from '@/components/AddHoldingModal';

const changeClass = (c: number) => (c >= 0 ? 'text-green-600' : 'text-red-600');
const changeBadge = (c: number) =>
  c >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600';
const fmtChange = (c: number) => `${c >= 0 ? '+' : ''}${c.toFixed(1)}%`;

export default function MarketsPage() {
  const { holdings } = usePortfolio();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Stock | null>(null);
  const [adding, setAdding] = useState<Stock | null>(null);

  useEffect(() => {
    fetchStocks().then((data) => {
      setStocks(data);
      setSelected((cur) => cur ?? data[0] ?? null);
    });
  }, []);

  const owned = useMemo(() => new Set(holdings.map((h) => h.ticker)), [holdings]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stocks;
    return stocks.filter(
      (s) => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q),
    );
  }, [stocks, query]);

  const series = useMemo(
    () => (selected ? priceSeries(selected.ticker) : []),
    [selected],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <div className="px-6 py-3.5 bg-white border-b border-gray-200">
        <h1 className="text-[13px] font-medium text-gray-900">Markets</h1>
        <p className="text-[11px] text-gray-500 mt-0.5">Search stocks, view details, and add them to your portfolio</p>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-[1fr_340px] gap-3">
        {/* List */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <IconSearch size={14} className="text-gray-400 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by ticker or name…"
                className="flex-1 bg-transparent outline-none text-[12px] text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Rows */}
          <div className="max-h-[70vh] overflow-y-auto">
            {results.map((s) => (
              <button
                key={s.ticker}
                onClick={() => setSelected(s)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selected?.ticker === s.ticker ? 'bg-gray-50' : ''
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-gray-900">{s.ticker}</span>
                    {owned.has(s.ticker) && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">Owned</span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 truncate">{s.name}</p>
                </div>
                <div className="text-right shrink-0 pl-3">
                  <p className="text-[12px] text-gray-900">{fmtUsd2(s.price)}</p>
                  <p className={`text-[11px] ${changeClass(s.change)}`}>{fmtChange(s.change)}</p>
                </div>
              </button>
            ))}
            {results.length === 0 && (
              <p className="text-[12px] text-gray-400 text-center py-10">No stocks match “{query}”.</p>
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 h-fit md:sticky md:top-4">
          {selected ? (
            <>
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-[15px] font-semibold text-gray-900">{selected.ticker}</p>
                  <p className="text-[11px] text-gray-500">{selected.name}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${changeBadge(selected.change)}`}>
                  {fmtChange(selected.change)}
                </span>
              </div>
              <p className="text-[24px] font-semibold text-gray-900 tracking-tight mb-1">
                {fmtUsd2(selected.price)}
              </p>
              <p className="text-[11px] text-gray-400 mb-3">{selected.sector}</p>

              {/* Sparkline */}
              <div style={{ width: '100%', height: 120 }} className="mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={series} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <YAxis domain={['dataMin', 'dataMax']} hide />
                    <Tooltip
                      formatter={(v) => fmtUsd2(Number(v))}
                      labelFormatter={() => ''}
                      contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E5E7EB' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={selected.change >= 0 ? '#1D9E75' : '#dc2626'}
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-gray-400 mb-4">30-day trend (illustrative)</p>

              <button
                onClick={() => setAdding(selected)}
                className="w-full flex items-center justify-center gap-1.5 bg-[#111827] text-white text-[12px] rounded-lg py-2.5 hover:bg-black transition-colors"
              >
                {owned.has(selected.ticker) ? <IconCheck size={14} /> : <IconPlus size={14} />}
                {owned.has(selected.ticker) ? 'Add more' : 'Add to portfolio'}
              </button>
            </>
          ) : (
            <p className="text-[12px] text-gray-400 text-center py-10">Select a stock to view details.</p>
          )}
        </div>
      </div>

      {adding && <AddHoldingModal stock={adding} onClose={() => setAdding(null)} />}
    </div>
  );
}
