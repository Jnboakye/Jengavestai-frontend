'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import Dashboard from '@/components/Dashboard';
import ChatPanel from '@/components/ChatPanel';
import UploadDocument from '@/components/UploadDocument';

type Page = 'dashboard' | 'analyst' | 'news' |
            'portfolio' | 'documents' | 'history';

export default function Home() {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const navigate = (page: string) => setActivePage(page as Page);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activePage={activePage} onNavigate={navigate} />
      <main className="md:ml-[200px] flex-1 min-h-screen bg-gray-50 pb-16">
        {activePage === 'dashboard' && <Dashboard onNavigate={navigate} />}
        {activePage === 'analyst' && <ChatPanel />}
        {activePage === 'news' && <NewsPage />}
        {activePage === 'portfolio' && <PortfolioPage />}
        {activePage === 'documents' && <UploadDocument />}
        {activePage === 'history' && <HistoryPage onNavigate={navigate} />}
      </main>
      <BottomNav activePage={activePage} onNavigate={navigate} />
    </div>
  );
}

function NewsPage() {
  const news = [
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

  const badge = (s: string) => {
    if (s === 'Positive') return 'bg-green-50 text-green-600';
    if (s === 'Negative') return 'bg-red-50 text-red-600';
    return 'bg-yellow-50 text-yellow-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <div className="px-6 py-3.5 bg-white border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-[13px] font-medium text-gray-900">Market news</h1>
          <p className="text-[11px] text-gray-500 mt-0.5">Latest financial news and market updates</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-green-600">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
          Live
        </div>
      </div>

      {/* News grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
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

function PortfolioPage() {
  const holdings = [
    { name: 'Apple Inc.', ticker: 'AAPL', quantity: 20, price: '$189.42', value: '$3,788', change: '+1.8%', up: true },
    { name: 'Microsoft', ticker: 'MSFT', quantity: 8, price: '$412.10', value: '$3,297', change: '+2.1%', up: true },
    { name: 'S&P 500 ETF', ticker: 'SPY', quantity: 10, price: '$521.30', value: '$5,213', change: '+1.2%', up: true },
    { name: 'Bitcoin', ticker: 'BTC', quantity: 0.05, price: '$67,204', value: '$3,360', change: '-0.8%', up: false },
    { name: 'US Treasury Bond', ticker: 'BOND', quantity: 90, price: '$98.20', value: '$8,838', change: '-0.3%', up: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <div className="px-6 py-3.5 bg-white border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-[13px] font-medium text-gray-900">Portfolio</h1>
          <p className="text-[11px] text-gray-500 mt-0.5">Your holdings and performance</p>
        </div>
        <button className="bg-[#111827] text-white text-[11px] px-3 py-1.5 rounded-md">
          Add holding
        </button>
      </div>

      {/* Holdings table */}
      <div className="p-4">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                {['Name', 'Ticker', 'Quantity', 'Price', 'Value', 'Change'].map(col => (
                  <th key={col} className="px-4 py-2.5 text-left text-[10px] text-gray-500 font-normal">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {holdings.map((h, i) => (
                <tr key={h.ticker} className={i < holdings.length - 1 ? 'border-b border-gray-200' : ''}>
                  <td className="px-4 py-3 text-[12px] text-gray-900">{h.name}</td>
                  <td className="px-4 py-3 text-[12px] text-gray-500">{h.ticker}</td>
                  <td className="px-4 py-3 text-[12px] text-gray-500">{h.quantity}</td>
                  <td className="px-4 py-3 text-[12px] text-gray-900">{h.price}</td>
                  <td className="px-4 py-3 text-[12px] text-gray-900">{h.value}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      h.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {h.change}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function HistoryPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const history = [
    {
      title: 'Portfolio analysis',
      preview: 'How is my portfolio performing today?',
      date: 'May 8 2026',
    },
    {
      title: 'Tesla stock analysis',
      preview: 'What is the latest news about Tesla?',
      date: 'May 7 2026',
    },
    {
      title: 'Rebalancing recommendation',
      preview: 'Should I rebalance my bond allocation?',
      date: 'May 6 2026',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <div className="px-6 py-3.5 bg-white border-b border-gray-200">
        <h1 className="text-[13px] font-medium text-gray-900">Chat history</h1>
        <p className="text-[11px] text-gray-500 mt-0.5">Previous AI analyst conversations</p>
      </div>

      {/* History list */}
      <div className="p-4">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {history.map((item, i) => (
            <div
              key={i}
              onClick={() => onNavigate('analyst')}
              className={`flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors ${
                i < history.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div>
                <p className="text-[12px] font-medium text-gray-900 mb-0.5">{item.title}</p>
                <p className="text-[11px] text-gray-500">{item.preview}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400">{item.date}</span>
                <span className="text-gray-400">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}