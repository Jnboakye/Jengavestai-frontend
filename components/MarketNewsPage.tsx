'use client';

import { NewsItem, Sentiment } from '@/types';

const news: NewsItem[] = [
  {
    title: 'S&P 500 hits 3-month high on strong tech earnings',
    source: 'Reuters',
    date: 'May 8 2026',
    time: '2h ago',
    sentiment: 'Positive',
    description: 'Major indices surged as tech giants reported stronger than expected quarterly earnings.',
  },
  {
    title: 'Fed signals rates to remain elevated through mid-2026',
    source: 'Bloomberg',
    date: 'May 8 2026',
    time: '4h ago',
    sentiment: 'Watch',
    description: 'Federal Reserve officials indicated rates would remain at current levels longer than anticipated.',
  },
  {
    title: 'Apple beats Q3 earnings — revenue up 8% year over year',
    source: 'Financial Times',
    date: 'May 8 2026',
    time: '6h ago',
    sentiment: 'Positive',
    description: 'Apple reported record services revenue and strong iPhone sales in emerging markets.',
  },
  {
    title: 'Oil prices surge amid geopolitical tensions in Middle East',
    source: 'CNBC',
    date: 'May 8 2026',
    time: '8h ago',
    sentiment: 'Negative',
    description: 'Crude oil prices jumped over 3% as escalating tensions raised supply disruption concerns.',
  },
];

const badge = (s: Sentiment) => {
  if (s === 'Positive') return 'bg-green-50 text-green-600';
  if (s === 'Negative') return 'bg-red-50 text-red-600';
  return 'bg-yellow-50 text-yellow-700';
};

export default function MarketNewsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <div className="px-6 py-3.5 bg-white border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-[13px] font-medium text-gray-900">Market news</h1>
          <p className="text-[11px] text-gray-500 mt-0.5">Sample financial headlines (demo data)</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block"></span>
          Demo
        </div>
      </div>

      {/* News grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {news.map((item, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-[13px] font-medium text-gray-900 leading-snug flex-1">
                {item.title}
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded font-medium shrink-0 ${badge(item.sentiment)}`}>
                {item.sentiment}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed mb-2">
              {item.description}
            </p>
            <p className="text-[10px] text-gray-400">
              {item.source} · {item.date} · {item.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
