'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Stock, Holding, EnrichedHolding, PortfolioTotals } from '@/types';
import { getStockSync, fetchQuotes } from '@/lib/stocks';
import { authedFetch } from '@/lib/session';
import { useAuth } from '@/lib/auth-provider';

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

  return { ...h, name, sector, price, change, shares, currentValue, dayGainUsd: currentValue - prevValue };
}

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const { mode, userId } = useAuth();
  const useDb = mode === 'account' && !!userId && userId !== 'guest';

  const [raw, setRaw] = useState<Holding[]>([]);
  const [ready, setReady] = useState(false);
  const [live, setLive] = useState<LiveMap>({});

  // Load holdings from the backend (signed in) or localStorage (guest).
  useEffect(() => {
    let active = true;
    setReady(false);
    (async () => {
      if (useDb) {
        try {
          const res = await authedFetch('/portfolio');
          if (res.ok) {
            const data = await res.json();
            const rows: Holding[] = (data.holdings || []).map((h: Holding) => ({
              ...h,
              price: h.purchasePrice,
              change: 0,
            }));
            if (active) setRaw(rows);
          } else if (active) {
            setRaw([]);
          }
        } catch {
          if (active) setRaw([]);
        }
      } else {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          setRaw(stored ? JSON.parse(stored) : []);
        } catch {
          setRaw([]);
        }
      }
      if (active) setReady(true);
    })();
    return () => { active = false; };
  }, [useDb, userId]);

  // Persist to localStorage in guest mode (DB writes are per-operation).
  useEffect(() => {
    if (!ready || useDb) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    } catch {
      /* ignore */
    }
  }, [raw, ready, useDb]);

  // Live prices for held tickers.
  const tickersKey = useMemo(() => raw.map((h) => h.ticker).sort().join(','), [raw]);
  useEffect(() => {
    if (!ready) return;
    const tickers = tickersKey ? tickersKey.split(',') : [];
    if (tickers.length === 0) { setLive({}); return; }
    let active = true;
    fetchQuotes(tickers).then((m) => { if (active) setLive(m); });
    return () => { active = false; };
  }, [tickersKey, ready]);

  const addHolding = useCallback((stock: Stock, amountUsd: number) => {
    if (!stock || !stock.price || amountUsd <= 0) return;

    const existing = raw.find((h) => h.ticker === stock.ticker);
    let next: Holding;
    if (existing) {
      const oldShares = existing.amountUsd / existing.purchasePrice;
      const newShares = amountUsd / stock.price;
      const totalAmount = existing.amountUsd + amountUsd;
      const totalShares = oldShares + newShares;
      next = { ...existing, amountUsd: totalAmount, purchasePrice: totalAmount / totalShares, price: stock.price, change: stock.change };
    } else {
      next = {
        ticker: stock.ticker,
        name: stock.name,
        sector: stock.sector,
        amountUsd,
        purchasePrice: stock.price,
        price: stock.price,
        change: stock.change,
        addedAt: new Date().toISOString(),
      };
    }

    setRaw((prev) =>
      prev.some((h) => h.ticker === stock.ticker)
        ? prev.map((h) => (h.ticker === stock.ticker ? next : h))
        : [...prev, next],
    );

    if (useDb) {
      authedFetch('/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: stock.ticker,
          name: stock.name,
          sector: stock.sector,
          amount_usd: amountUsd,
          price: stock.price,
        }),
      }).catch(() => {});
    }
  }, [raw, useDb]);

  const removeHolding = useCallback((ticker: string) => {
    setRaw((prev) => prev.filter((h) => h.ticker !== ticker));
    if (useDb) authedFetch(`/portfolio/${ticker}`, { method: 'DELETE' }).catch(() => {});
  }, [useDb]);

  const reset = useCallback(() => {
    setRaw([]);
    if (useDb) authedFetch('/portfolio', { method: 'DELETE' }).catch(() => {});
  }, [useDb]);

  const holdings = useMemo(() => raw.map((h) => enrich(h, live[h.ticker])), [raw, live]);

  const totals = useMemo<PortfolioTotals>(() => {
    const invested = holdings.reduce((s, h) => s + h.amountUsd, 0);
    const value = holdings.reduce((s, h) => s + h.currentValue, 0);
    const dayGainUsd = holdings.reduce((s, h) => s + h.dayGainUsd, 0);
    const prev = value - dayGainUsd;
    const dayGainPct = prev > 0 ? (dayGainUsd / prev) * 100 : 0;
    return { invested, value, dayGainUsd, dayGainPct };
  }, [holdings]);

  const val: PortfolioContextValue = { ready, holdings, totals, addHolding, removeHolding, reset };

  return <PortfolioContext.Provider value={val}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within a PortfolioProvider');
  return ctx;
}

export const fmtUsd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export const fmtUsd2 = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
