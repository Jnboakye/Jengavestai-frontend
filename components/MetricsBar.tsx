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
    description: 'Federal Reserve officials hint at possible interest rate reductions',
    source: 'Bloomberg',
    date: '2024-01-15',
    sentiment: 'Positive',
  },
  {
    title: 'Tech stocks rally on AI optimism',
    description: 'Major technology companies surge on strong artificial intelligence prospects',
    source: 'Reuters',
    date: '2024-01-14',
    sentiment: 'Positive',
  },
  {
    title: 'Oil prices surge amid geopolitical tensions',
    description: 'Crude oil markets respond to escalating international conflicts',
    source: 'CNBC',
    date: '2024-01-13',
    sentiment: 'Negative',
  },
  {
    title: 'Cryptocurrency market recovery gains momentum',
    description: 'Digital assets show signs of stabilization after recent downturn',
    source: 'CoinDesk',
    date: '2024-01-12',
    sentiment: 'Watch',
  },
  {
    title: 'Manufacturing sector shows unexpected growth',
    description: 'Industrial production rises above economist expectations',
    source: 'WSJ',
    date: '2024-01-11',
    sentiment: 'Positive',
  },
  {
    title: 'Consumer spending slows in December',
    description: 'Holiday retail sales disappoint forecast estimates',
    source: 'Financial Times',
    date: '2024-01-10',
    sentiment: 'Negative',
  },
];

export default function MarketNews() {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive':
        return '#10b98133';
      case 'Negative':
        return '#ef444433';
      case 'Watch':
        return '#f59e0b33';
      default:
        return '#f59e0b33';
    }
  };

  const getSentimentTextColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive':
        return '#10b981';
      case 'Negative':
        return '#ef4444';
      case 'Watch':
        return '#f59e0b';
      default:
        return '#f59e0b';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--color-main-bg)' }}>
      <div className="p-4 grid grid-cols-2 gap-3">
        {dummyNews.map((news, idx) => (
          <div key={idx} className="rounded-lg border p-4 hover:shadow-md transition-shadow" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}>
            <h3 className="text-sm font-medium mb-2 line-clamp-2" style={{ color: 'var(--color-text-primary)' }}>{news.title}</h3>
            <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>{news.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <span>{news.source}</span>
                <span>{new Date(news.date).toLocaleDateString()}</span>
              </div>
              <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: getSentimentColor(news.sentiment), color: getSentimentTextColor(news.sentiment) }}>
                {news.sentiment}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}