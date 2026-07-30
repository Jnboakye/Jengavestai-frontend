'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { IconSearch, IconPlus, IconCheck } from '@tabler/icons-react';
import { LineChart, Line, YAxis, Tooltip } from 'recharts';
import { Stock } from '@/types';
import {
  fetchStocks,
  fetchQuotes,
  searchSymbols,
  fetchQuote,
  fetchHistory,
  syntheticSeries,
  RANGES,
  StockRange,
  HistoryPoint,
} from '@/lib/stocks';
import { usePortfolio, fmtUsd2 } from '@/lib/portfolio';
import AddHoldingModal from '@/components/AddHoldingModal';

const changeClass = (c: number) => (c >= 0 ? 'text-green-600' : 'text-red-600');
const changeBadge = (c: number) => (c >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600');
const fmtChange = (c: number) => `${c >= 0 ? '+' : ''}${c.toFixed(1)}%`;

export default function MarketsPage() {
  const { holdings } = usePortfolio();
  const [catalogue, setCatalogue] = useState<Stock[]>([]);
  const [quotes, setQuotes] = useState<Record<string, { price: number; change: number }>>({});
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Stock[] | null>(null); // null = show catalogue
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<Stock | null>(null);
  const [quote, setQuote] = useState<Stock | null>(null);
  const [range, setRange] = useState<StockRange>('1M');
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [loadingChart, setLoadingChart] = useState(false);
  const [adding, setAdding] = useState<Stock | null>(null);

  // Load catalogue, then live prices for it.
  useEffect(() => {
    fetchStocks().then((data) => {
      setCatalogue(data);
      setSelected((cur) => cur ?? data[0] ?? null);
      fetchQuotes(data.map((s) => s.ticker)).then(setQuotes);
    });
  }, []);

  // Debounced full-universe search.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!query.trim()) {
      setResults(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    timer.current = setTimeout(async () => {
      const r = await searchSymbols(query);
      setResults(r);
      setSearching(false);
    }, 300);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [query]);

  // Live quote when the selected stock changes.
  useEffect(() => {
    if (!selected) return;
    let active = true;
    setQuote(selected);
    fetchQuote(selected.ticker).then((q) => { if (active && q) setQuote(q); });
    return () => { active = false; };
  }, [selected]);

  // History when stock or range changes.
  useEffect(() => {
    if (!selected) return;
    let active = true;
    setLoadingChart(true);
    fetchHistory(selected.ticker, range).then((pts) => {
      if (active) { setHistory(pts); setLoadingChart(false); }
    });
    return () => { active = false; };
  }, [selected, range]);

  // Measure the chart's width ourselves (ResponsiveContainer measures 0 in
  // some Next/React setups, which leaves the chart blank).
  const chartWrap = useRef<HTMLDivElement | null>(null);
  const [chartW, setChartW] = useState(300);
  useEffect(() => {
    const el = chartWrap.current;
    if (!el) return;
    const update = () => setChartW(Math.max(el.clientWidth, 120));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [selected?.ticker]);

  const owned = useMemo(() => new Set(holdings.map((h) => h.ticker)), [holdings]);

  // Catalogue rows with live prices merged in.
  const catalogueRows = useMemo(
    () => catalogue.map((s) => {
      const live = quotes[s.ticker];
      return live ? { ...s, price: live.price, change: live.change } : s;
    }),
    [catalogue, quotes],
  );

  const rows = results ?? catalogueRows;
  const detail = quote ?? selected;
  const chartData = history.length ? history : (detail ? syntheticSeries(detail.ticker, range) : []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <div className="px-6 py-3.5 bg-white border-b border-gray-200">
        <h1 className="text-[13px] font-medium text-gray-900">Markets</h1>
        <p className="text-[11px] text-gray-500 mt-0.5">Search any stock, view live data, and add it to your portfolio</p>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-[1fr_360px] gap-3">
        {/* List */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <IconSearch size={14} className="text-gray-400 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search any stock — e.g. Coca-Cola, KO, Airbnb…"
                className="flex-1 bg-transparent outline-none text-[12px] text-gray-900 placeholder-gray-400"
              />
              {searching && <span className="text-[10px] text-gray-400">…</span>}
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            {rows.map((s) => {
              const hasPrice = s.price > 0;
              return (
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
                    {hasPrice ? (
                      <>
                        <p className="text-[12px] text-gray-900">{fmtUsd2(s.price)}</p>
                        <p className={`text-[11px] ${changeClass(s.change)}`}>{fmtChange(s.change)}</p>
                      </>
                    ) : (
                      <p className="text-[11px] text-gray-400">{s.sector}</p>
                    )}
                  </div>
                </button>
              );
            })}
            {rows.length === 0 && !searching && (
              <p className="text-[12px] text-gray-400 text-center py-10">No stocks match “{query}”.</p>
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 h-fit md:sticky md:top-4">
          {detail ? (
            <>
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-[15px] font-semibold text-gray-900">{detail.ticker}</p>
                  <p className="text-[11px] text-gray-500">{detail.name}</p>
                </div>
                {detail.price > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${changeBadge(detail.change)}`}>
                    {fmtChange(detail.change)}
                  </span>
                )}
              </div>
              <p className="text-[24px] font-semibold text-gray-900 tracking-tight mb-1">
                {detail.price > 0 ? fmtUsd2(detail.price) : '—'}
              </p>
              <p className="text-[11px] text-gray-400 mb-3">{detail.sector}</p>

              {/* Timeframe tabs */}
              <div className="flex gap-1 mb-2">
                {RANGES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`flex-1 text-[11px] py-1 rounded-md transition-colors ${
                      range === r ? 'bg-[#111827] text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Chart */}
              <div ref={chartWrap} style={{ width: '100%', height: 140 }} className="mb-4 overflow-hidden">
                {loadingChart ? (
                  <div className="w-full h-full flex items-center justify-center text-[11px] text-gray-400">
                    Loading {range}…
                  </div>
                ) : (
                  <LineChart
                    width={chartW}
                    height={140}
                    data={chartData}
                    margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
                  >
                    <YAxis domain={['dataMin', 'dataMax']} hide />
                    <Tooltip
                      formatter={(v) => fmtUsd2(Number(v))}
                      labelFormatter={() => ''}
                      contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E5E7EB' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={detail.change >= 0 ? '#1D9E75' : '#dc2626'}
                      strokeWidth={1.5}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                )}
              </div>

              <button
                onClick={() => setAdding(detail)}
                disabled={detail.price <= 0}
                className="w-full flex items-center justify-center gap-1.5 bg-[#111827] text-white text-[12px] rounded-lg py-2.5 hover:bg-black transition-colors disabled:opacity-40"
              >
                {owned.has(detail.ticker) ? <IconCheck size={14} /> : <IconPlus size={14} />}
                {owned.has(detail.ticker) ? 'Add more' : 'Add to portfolio'}
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
