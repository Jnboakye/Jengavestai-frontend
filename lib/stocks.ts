// Stock data seam for JengaVest.
//
// These call the backend (FastAPI + yfinance) for live prices and history:
//   GET /stocks                    -> fetchStocks()
//   GET /stocks/{ticker}/quote     -> fetchQuote()
//   GET /stocks/{ticker}/history   -> fetchHistory()
//
// Every call falls back to a bundled catalogue / synthetic series when the
// backend is unreachable (asleep, offline, or not yet running), so the UI
// always works. Set NEXT_PUBLIC_API_URL to your backend to get live data.

import { Stock } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export type StockRange = '1D' | '1W' | '1M' | '1Y' | '5Y';
export const RANGES: StockRange[] = ['1D', '1W', '1M', '1Y', '5Y'];

export interface HistoryPoint {
  t: string;
  value: number;
}

// Bundled fallback catalogue (also supplies indicative list prices).
const CATALOGUE: Stock[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology', price: 189.42, change: 1.8 },
  { ticker: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', price: 412.10, change: 2.1 },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', price: 178.30, change: 0.9 },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer', price: 186.55, change: -0.6 },
  { ticker: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', price: 121.40, change: 3.4 },
  { ticker: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', price: 512.20, change: 1.2 },
  { ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive', price: 246.80, change: -2.3 },
  { ticker: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Financials', price: 428.90, change: 0.3 },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financials', price: 208.15, change: 0.7 },
  { ticker: 'V', name: 'Visa Inc.', sector: 'Financials', price: 275.60, change: 0.4 },
  { ticker: 'MA', name: 'Mastercard Inc.', sector: 'Financials', price: 462.30, change: 0.5 },
  { ticker: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare', price: 512.75, change: -0.9 },
  { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', price: 152.40, change: 0.2 },
  { ticker: 'LLY', name: 'Eli Lilly and Co.', sector: 'Healthcare', price: 812.30, change: 1.5 },
  { ticker: 'WMT', name: 'Walmart Inc.', sector: 'Consumer', price: 68.90, change: 1.1 },
  { ticker: 'PG', name: 'Procter & Gamble', sector: 'Consumer', price: 167.20, change: 0.1 },
  { ticker: 'HD', name: 'Home Depot Inc.', sector: 'Consumer', price: 342.10, change: -0.4 },
  { ticker: 'DIS', name: 'Walt Disney Co.', sector: 'Communication', price: 98.65, change: 1.6 },
  { ticker: 'NFLX', name: 'Netflix Inc.', sector: 'Communication', price: 645.30, change: 2.8 },
  { ticker: 'KO', name: 'Coca-Cola Co.', sector: 'Consumer', price: 62.15, change: 0.3 },
  { ticker: 'PEP', name: 'PepsiCo Inc.', sector: 'Consumer', price: 168.40, change: -0.2 },
  { ticker: 'XOM', name: 'Exxon Mobil Corp.', sector: 'Energy', price: 114.80, change: -1.1 },
  { ticker: 'CVX', name: 'Chevron Corporation', sector: 'Energy', price: 156.20, change: -0.8 },
  { ticker: 'BAC', name: 'Bank of America', sector: 'Financials', price: 39.85, change: 0.6 },
  { ticker: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', price: 512.90, change: 1.4 },
  { ticker: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', price: 268.50, change: 0.9 },
  { ticker: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology', price: 158.70, change: 2.6 },
  { ticker: 'NKE', name: 'Nike Inc.', sector: 'Consumer', price: 76.40, change: 0.5 },
  { ticker: 'SPY', name: 'S&P 500 ETF', sector: 'ETF', price: 521.30, change: 1.2 },
  { ticker: 'QQQ', name: 'Invesco QQQ ETF', sector: 'ETF', price: 458.70, change: 1.5 },
  { ticker: 'BTC', name: 'Bitcoin', sector: 'Crypto', price: 67204, change: -0.8 },
  { ticker: 'ETH', name: 'Ethereum', sector: 'Crypto', price: 3512, change: 1.4 },
  { ticker: 'SOL', name: 'Solana', sector: 'Crypto', price: 148.20, change: 2.6 },
  { ticker: 'XRP', name: 'XRP', sector: 'Crypto', price: 0.61, change: -1.2 },
  { ticker: 'DOGE', name: 'Dogecoin', sector: 'Crypto', price: 0.12, change: 3.1 },
  { ticker: 'ADA', name: 'Cardano', sector: 'Crypto', price: 0.45, change: 0.5 },
];

const BY_TICKER = new Map(CATALOGUE.map((s) => [s.ticker, s]));

/** Full list of tradable stocks (from backend, with indicative prices). */
export async function fetchStocks(): Promise<Stock[]> {
  try {
    const res = await fetch(`${API_URL}/stocks`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const list: { ticker: string; name: string; sector: string }[] = data.stocks || [];
      if (list.length) {
        return list.map((s) => ({
          ticker: s.ticker,
          name: s.name,
          sector: s.sector,
          price: BY_TICKER.get(s.ticker)?.price ?? 0,
          change: BY_TICKER.get(s.ticker)?.change ?? 0,
        }));
      }
    }
  } catch {
    /* backend unreachable — fall back */
  }
  return CATALOGUE;
}

export async function searchStocks(query: string): Promise<Stock[]> {
  const all = await fetchStocks();
  const q = query.trim().toLowerCase();
  if (!q) return all;
  return all.filter((s) => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
}

/** Live quotes for many tickers at once → map keyed by ticker. */
export async function fetchQuotes(
  tickers: string[],
): Promise<Record<string, { price: number; change: number }>> {
  if (tickers.length === 0) return {};
  try {
    const res = await fetch(`${API_URL}/stocks/quotes?symbols=${tickers.join(',')}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const map: Record<string, { price: number; change: number }> = {};
      for (const q of data.quotes || []) {
        if (q.price != null) map[q.ticker] = { price: q.price, change: q.change ?? 0 };
      }
      return map;
    }
  } catch {
    /* fall back to empty (list keeps indicative prices) */
  }
  return {};
}

/** Search the full symbol universe via the backend (falls back to local filter). */
export async function searchSymbols(query: string): Promise<Stock[]> {
  const q = query.trim();
  if (!q) return fetchStocks();
  try {
    const res = await fetch(`${API_URL}/stocks/search?q=${encodeURIComponent(q)}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const results = (data.results || []) as { ticker: string; name: string; sector: string }[];
      if (results.length) return results.map((r) => ({ ...r, price: 0, change: 0 }));
    }
  } catch {
    /* fall back to local filter */
  }
  const all = await fetchStocks();
  const lower = q.toLowerCase();
  return all.filter((s) => s.ticker.toLowerCase().includes(lower) || s.name.toLowerCase().includes(lower));
}

/** Live quote for one ticker (falls back to the bundled snapshot). */
export async function fetchQuote(ticker: string): Promise<Stock | undefined> {
  try {
    const res = await fetch(`${API_URL}/stocks/${ticker}/quote`, { cache: 'no-store' });
    if (res.ok) {
      const q = await res.json();
      return { ticker: q.ticker, name: q.name, sector: q.sector, price: q.price, change: q.change };
    }
  } catch {
    /* fall back */
  }
  return getStockSync(ticker);
}

/** Historical series for a ticker + range (falls back to a synthetic series). */
export async function fetchHistory(ticker: string, range: StockRange): Promise<HistoryPoint[]> {
  try {
    const res = await fetch(`${API_URL}/stocks/${ticker}/history?range=${range}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.points?.length) return data.points as HistoryPoint[];
    }
  } catch {
    /* fall back */
  }
  return syntheticSeries(ticker, range);
}

/** Synchronous lookup used to enrich holdings already held in memory. */
export function getStockSync(ticker: string): Stock | undefined {
  return BY_TICKER.get(ticker);
}

// ── Synthetic fallback series ────────────────────────────────────────────
const RANGE_POINTS: Record<StockRange, number> = {
  '1D': 78,
  '1W': 65,
  '1M': 22,
  '1Y': 52,
  '5Y': 60,
};

/** Deterministic price series seeded by ticker, ending at the current price. */
export function syntheticSeries(ticker: string, range: StockRange): HistoryPoint[] {
  const stock = getStockSync(ticker);
  const base = stock ? stock.price : 100;
  const points = RANGE_POINTS[range];
  let seed = range.length;
  for (let c = 0; c < ticker.length; c++) seed += ticker.charCodeAt(c) * (c + 1);
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const vol = range === '1D' ? 0.006 : range === '1W' ? 0.012 : range === '1M' ? 0.02 : 0.035;
  const series: HistoryPoint[] = [];
  let v = base * (1 - (range === '5Y' ? 0.4 : range === '1Y' ? 0.15 : 0.03) * rand());
  for (let i = 0; i < points; i++) {
    v = v * (1 + (rand() - 0.48) * vol);
    series.push({ t: String(i), value: Math.round(v * 100) / 100 });
  }
  series[points - 1] = { t: String(points - 1), value: base };
  return series;
}
