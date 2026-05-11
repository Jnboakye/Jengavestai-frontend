'use client';

import React from 'react';

interface NewsCard {
  title: string;
  description: string;
  source: string;
  date: string;
  sentiment: 'Positive' | 'Negative' | 'Watch';
}

const dummyNews: NewsCard[] = [
  {
    title: 'Fed signals potential rate cuts in Q4',
    description: 'Federal Reserve officials hint at possible interest rate reductions later this year.',
    source: 'Bloomberg',
    date: '2026-05-11',
    sentiment: 'Positive',
  },
  {
    title: 'Tech stocks rally on AI optimism',
    description: 'Major technology companies surge on strong artificial intelligence growth prospects.',
    source: 'Reuters',
    date: '2026-05-11',
    sentiment: 'Positive',
  },
  {
    title: 'Oil prices surge amid geopolitical tensions',
    description: 'Crude oil markets respond to escalating international conflicts in the Middle East.',
    source: 'CNBC',
    date: '2026-05-10',
    sentiment: 'Negative',
  },
  {
    title: 'Cryptocurrency market recovery gains momentum',
    description: 'Digital assets show signs of stabilization after recent extended downturn.',
    source: 'CoinDesk',
    date: '2026-05-10',
    sentiment: 'Watch',
  },
  {
    title: 'Manufacturing sector shows unexpected growth',
    description: 'Industrial production rises above economist expectations for Q2.',
    source: 'WSJ',
    date: '2026-05-09',
    sentiment: 'Positive',
  },
  {
    title: 'Consumer spending slows in April',
    description: 'Retail sales disappoint forecast estimates as households tighten budgets.',
    source: 'Financial Times',
    date: '2026-05-09',
    sentiment: 'Negative',
  },
];

function sentimentStyle(s: string) {
  if (s === 'Positive') return { bg: '#F0FDF4', text: '#059669' };
  if (s === 'Negative') return { bg: '#FEF2F2', text: '#dc2626' };
  return { bg: '#FFFBEB', text: '#b45309' };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function MarketNews() {
  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: 'var(--color-main-bg)' }}>
      {/* Header */}
      <div
        className="shrink-0 px-6 py-4 border-b"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}
      >
        <h1 className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Market news</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Latest financial headlines</p>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {dummyNews.map((news, i) => {
            const ss = sentimentStyle(news.sentiment);
            return (
              <div
                key={i}
                className="rounded-lg border p-4"
                style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-xs font-medium leading-snug" style={{ color: 'var(--color-text-primary)' }}>
                    {news.title}
                  </h3>
                  <span
                    className="shrink-0 px-1.5 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: ss.bg, color: ss.text }}
                  >
                    {news.sentiment}
                  </span>
                </div>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {news.description}
                </p>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  <span>{news.source}</span>
                  <span>·</span>
                  <span>{formatDate(news.date)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
