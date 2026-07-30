'use client';

import { Conversation } from '@/types';

const history: Conversation[] = [
  { title: 'Portfolio analysis', preview: 'How is my portfolio performing today?', date: 'May 8 2026' },
  { title: 'Tesla stock analysis', preview: 'What is the latest news about Tesla?', date: 'May 7 2026' },
  { title: 'Rebalancing recommendation', preview: 'Should I rebalance my bond allocation?', date: 'May 6 2026' },
];

export default function HistoryPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <div className="px-6 py-3.5 bg-white border-b border-gray-200">
        <h1 className="text-[13px] font-medium text-gray-900">Chat history</h1>
        <p className="text-[11px] text-gray-500 mt-0.5">Previous AI analyst conversations (demo data)</p>
      </div>

      {/* History list */}
      <div className="p-4">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {history.map((item, i) => (
            <button
              key={i}
              onClick={() => onNavigate('analyst')}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-left cursor-pointer hover:bg-gray-50 transition-colors ${
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
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
