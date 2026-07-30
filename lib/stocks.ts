// Stock "backend" seam for the JengaVest demo.
//
// Today these functions return a bundled catalogue so the whole app works with
// no server. They are written to look and behave like async network calls, so
// wiring them to a real backend later is a one-function change: replace the body
// of each with a `fetch` to your API and keep the same return types.
//
//   export async function fetchStocks(): Promise<Stock[]> {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stocks`);
//     return res.json();
//   }
//
// The component layer never imports the catalogue directly — it only calls
// these functions — so nothing else needs to change.

import { Stock } from '@/types';

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
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Full list of tradable stocks. */
export async function fetchStocks(): Promise<Stock[]> {
  await wait(150);
  return CATALOGUE;
}

/** Filter by ticker or company name. */
export async function searchStocks(query: string): Promise<Stock[]> {
  await wait(120);
  const q = query.trim().toLowerCase();
  if (!q) return CATALOGUE;
  return CATALOGUE.filter(
    (s) => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q),
  );
}

/** A single quote — the "view this stock" call. */
export async function fetchQuote(ticker: string): Promise<Stock | undefined> {
  await wait(200);
  return CATALOGUE.find((s) => s.ticker === ticker);
}

/** Synchronous lookup used to enrich holdings that are already in memory. */
export function getStockSync(ticker: string): Stock | undefined {
  return CATALOGUE.find((s) => s.ticker === ticker);
}

/**
 * Deterministic ~30-point price series for a stock's detail sparkline.
 * Seeded by ticker so the same stock always draws the same shape.
 */
export function priceSeries(ticker: string, points = 30): { i: number; value: number }[] {
  const stock = getStockSync(ticker);
  const base = stock ? stock.price : 100;
  let seed = 0;
  for (let c = 0; c < ticker.length; c++) seed += ticker.charCodeAt(c) * (c + 1);
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const series: { i: number; value: number }[] = [];
  let v = base * (0.9 + rand() * 0.05);
  for (let i = 0; i < points; i++) {
    v = v * (1 + (rand() - 0.48) * 0.03);
    series.push({ i, value: Math.round(v * 100) / 100 });
  }
  // End the series at the current price so the chart lines up with the quote.
  series[points - 1] = { i: points - 1, value: base };
  return series;
}
