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
        return 'badge-positive';
      case 'Negative':
        return 'badge-negative';
      case 'Watch':
        return 'badge-watch';
      default:
        return 'badge-watch';
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="p-4 grid grid-cols-2 gap-3">
        {dummyNews.map((news, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">{news.title}</h3>
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{news.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{news.source}</span>
                <span>{new Date(news.date).toLocaleDateString()}</span>
              </div>
              <span className={getSentimentColor(news.sentiment)}>{news.sentiment}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}