'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Stock, Holding, EnrichedHolding, PortfolioTotals } from '@/types';
import { getStockSync, fetchQuotes } from '@/lib/stocks';

const STORAGE_KEY = 'jengavest.holdings';

type LiveMap = Record<string, { price: number; change: number }>;

interface PortfolioContextValue {
  ready: boolean;
  holdings: EnrichedHolding[];
  totals: PortfolioTotals;
  addHolding: (stock: Stock, amountUsd: number) => void;
  removeHolding: (ticker: string) => void;
  reset: () => void;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

function enrich(h: Holding, live?: { price: number; change: number }): EnrichedHolding {
  const fallback = getStockSync(h.ticker);
  const price = live?.price ?? h.price ?? fallback?.price ?? h.purchasePrice;
  const change = live?.change ?? h.change ?? fallback?.change ?? 0;
  const name = h.name ?? fallback?.name ?? h.ticker;
  const sector = h.sector ?? fallback?.sector ?? '—';

  const shares = h.amountUsd / h.purchasePrice;
  const currentValue = shares * price;
  const prevValue = currentValue / (1 + change / 100);

  return {
    ...h,
    name,
    sector,
    price,
    change,
    shares,
    currentValue,
    dayGainUsd: currentValue - prevValue,
  };
}

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<Holding[]>([]);
  const [ready, setReady] = useState(false);
  const [live, setLive] = useState<LiveMap>({});

  // Load once on mount (client only).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRaw(JSON.parse(stored));
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  // Persist on change (after the initial load).
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    } catch {
      /* ignore quota errors */
    }
  }, [raw, ready]);

  // Refresh live prices for held tickers whenever the set of holdings changes.
  const tickersKey = useMemo(() => raw.map((h) => h.ticker).sort().join(','), [raw]);
  useEffect(() => {
    if (!ready) return;
    const tickers = tickersKey ? tickersKey.split(',') : [];
    if (tickers.length === 0) {
      setLive({});
      return;
    }
    let active = true;
    fetchQuotes(tickers).then((m) => { if (active) setLive(m); });
    return () => { active = false; };
  }, [tickersKey, ready]);

  const addHolding = useCallback((stock: Stock, amountUsd: number) => {
    if (!stock || !stock.price || amountUsd <= 0) return;
    setRaw((prev) => {
      const existing = prev.find((h) => h.ticker === stock.ticker);
      if (existing) {
        const oldShares = existing.amountUsd / existing.purchasePrice;
        const newShares = amountUsd / stock.price;
        const totalAmount = existing.amountUsd + amountUsd;
        const totalShares = oldShares + newShares;
        return prev.map((h) =>
          h.ticker === stock.ticker
            ? { ...h, amountUsd: totalAmount, purchasePrice: totalAmount / totalShares, price: stock.price, change: stock.change }
            : h,
        );
      }
      return [
        ...prev,
        {
          ticker: stock.ticker,
          name: stock.name,
          sector: stock.sector,
          amountUsd,
          purchasePrice: stock.price,
          price: stock.price,
          change: stock.change,
          addedAt: new Date().toISOString(),
        },
      ];
    });
  }, []);

  const removeHolding = useCallback((ticker: string) => {
    setRaw((prev) => prev.filter((h) => h.ticker !== ticker));
  }, []);

  const reset = useCallback(() => setRaw([]), []);

  const holdings = useMemo(
    () => raw.map((h) => enrich(h, live[h.ticker])),
    [raw, live],
  );

  const totals = useMemo<PortfolioTotals>(() => {
    const invested = holdings.reduce((s, h) => s + h.amountUsd, 0);
    const value = holdings.reduce((s, h) => s + h.currentValue, 0);
    const dayGainUsd = holdings.reduce((s, h) => s + h.dayGainUsd, 0);
    const prev = value - dayGainUsd;
    const dayGainPct = prev > 0 ? (dayGainUsd / prev) * 100 : 0;
    return { invested, value, dayGainUsd, dayGainPct };
  }, [holdings]);

  const val: PortfolioContextValue = {
    ready,
    holdings,
    totals,
    addHolding,
    removeHolding,
    reset,
  };

  return <PortfolioContext.Provider value={val}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within a PortfolioProvider');
  return ctx;
}

// Small shared formatting helpers.
export const fmtUsd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export const fmtUsd2 = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
