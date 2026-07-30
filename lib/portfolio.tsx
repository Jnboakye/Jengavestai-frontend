'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Holding, EnrichedHolding, PortfolioTotals } from '@/types';
import { getStockSync } from '@/lib/stocks';

const STORAGE_KEY = 'jengavest.holdings';

interface PortfolioContextValue {
  ready: boolean;
  holdings: EnrichedHolding[];
  totals: PortfolioTotals;
  addHolding: (ticker: string, amountUsd: number) => void;
  removeHolding: (ticker: string) => void;
  reset: () => void;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

function enrich(h: Holding): EnrichedHolding | null {
  const stock = getStockSync(h.ticker);
  if (!stock) return null;
  const shares = h.amountUsd / h.purchasePrice;
  const currentValue = shares * stock.price;
  const prevValue = currentValue / (1 + stock.change / 100);
  return {
    ...stock,
    ...h,
    shares,
    currentValue,
    dayGainUsd: currentValue - prevValue,
  };
}

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<Holding[]>([]);
  const [ready, setReady] = useState(false);

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

  const addHolding = useCallback((ticker: string, amountUsd: number) => {
    const stock = getStockSync(ticker);
    if (!stock || amountUsd <= 0) return;
    setRaw((prev) => {
      const existing = prev.find((h) => h.ticker === ticker);
      if (existing) {
        const oldShares = existing.amountUsd / existing.purchasePrice;
        const newShares = amountUsd / stock.price;
        const totalAmount = existing.amountUsd + amountUsd;
        const totalShares = oldShares + newShares;
        return prev.map((h) =>
          h.ticker === ticker
            ? { ...h, amountUsd: totalAmount, purchasePrice: totalAmount / totalShares }
            : h,
        );
      }
      return [
        ...prev,
        { ticker, amountUsd, purchasePrice: stock.price, addedAt: new Date().toISOString() },
      ];
    });
  }, []);

  const removeHolding = useCallback((ticker: string) => {
    setRaw((prev) => prev.filter((h) => h.ticker !== ticker));
  }, []);

  const reset = useCallback(() => setRaw([]), []);

  const holdings = useMemo(
    () => raw.map(enrich).filter((h): h is EnrichedHolding => h !== null),
    [raw],
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
