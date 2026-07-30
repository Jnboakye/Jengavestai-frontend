// Shared types for the JengaVest demo UI.

export type Sentiment = 'Positive' | 'Negative' | 'Watch';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface NewsItem {
  title: string;
  description: string;
  source: string;
  date: string;
  time: string;
  sentiment: Sentiment;
}

export interface Conversation {
  title: string;
  preview: string;
  date: string;
}

// A tradable instrument returned by the stock "backend".
export interface Stock {
  ticker: string;
  name: string;
  sector: string;
  price: number;        // current price in USD
  change: number;       // today's move, percent (e.g. 1.8 or -0.6)
}

// A position the user added. It stores a snapshot of the stock (name, sector,
// price at purchase) so any stock works — not just the bundled catalogue.
export interface Holding {
  ticker: string;
  name: string;
  sector: string;
  amountUsd: number;    // amount invested at purchase
  purchasePrice: number;
  price: number;        // last known price (snapshot at add; refreshed live)
  change: number;       // last known day change %
  addedAt: string;      // ISO timestamp
}

// A holding with derived figures.
export interface EnrichedHolding extends Holding {
  shares: number;         // amountUsd / purchasePrice
  currentValue: number;   // shares * current price
  dayGainUsd: number;     // today's $ move on the position
}

export interface PortfolioTotals {
  invested: number;
  value: number;
  dayGainUsd: number;
  dayGainPct: number;
}
