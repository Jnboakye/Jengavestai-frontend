'use client';

import { useEffect, useState } from 'react';
import { NewsArticle } from '@/types';
import { fetchNews } from '@/lib/stocks';
import { usePortfolio } from '@/lib/portfolio';

function timeAgo(unix: number): string {
  if (!unix) return '';
  const secs = Math.max(0, Math.floor(Date.now() / 1000 - unix));
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

// Shown only if the backend can't be reached.
const FALLBACK: NewsArticle[] = [
  { headline: 'Connect the backend to see live market news', summary: 'This page pulls real headlines for your holdings from the backend. Start the API and refresh to see live news here.', source: 'JengaVest', url: '', image: '', datetime: 0, related: 'Market' },
];

export default function MarketNewsPage() {
  const { holdings } = usePortfolio();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const tickerKey = holdings.map((h) => h.ticker).join(',');
  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      const tickers = tickerKey ? tickerKey.split(',') : [];
      // Retry: the backend may be cold-starting (Render free tier sleeps).
      for (let i = 0; i < 6 && active; i++) {
        const data = await fetchNews(tickers);
        if (!active) return;
        if (data.length) { setArticles(data); setLoading(false); return; }
        await new Promise((r) => setTimeout(r, 4000));
      }
      if (active) { setArticles(FALLBACK); setLoading(false); }
    })();
    return () => { active = false; };
  }, [tickerKey]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <div className="px-6 py-3.5 bg-white border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-[13px] font-medium text-gray-900">Market news</h1>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {holdings.length > 0 ? 'Latest headlines for your holdings and the market' : 'Latest market headlines'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-green-600">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
          Live
        </div>
      </div>

      {loading ? (
        <p className="text-[12px] text-gray-400 text-center py-16">Loading news…</p>
      ) : (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {articles.map((item, i) => {
            const Card = item.url ? 'a' : 'div';
            return (
              <Card
                key={i}
                {...(item.url ? { href: item.url, target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3 hover:border-gray-300 transition-colors"
              >
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt=""
                    className="w-20 h-20 rounded-lg object-cover shrink-0 hidden sm:block"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <h3 className="text-[13px] font-medium text-gray-900 leading-snug flex-1">
                      {item.headline}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded font-medium shrink-0 bg-gray-100 text-gray-600">
                      {item.related}
                    </span>
                  </div>
                  {item.summary && (
                    <p className="text-[11px] text-gray-500 leading-relaxed mb-2 line-clamp-2">
                      {item.summary}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-400">
                    {[item.source, timeAgo(item.datetime)].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
