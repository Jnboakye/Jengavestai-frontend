'use client';

import React from 'react';
import { IconHistory } from '@tabler/icons-react';

interface ConversationItem {
  id: string;
  title: string;
  firstMessage: string;
  date: string;
}

const dummyConversations: ConversationItem[] = [
  {
    id: '1',
    title: 'Portfolio risk analysis',
    firstMessage: 'Analyze my portfolio risk exposure...',
    date: '2024-01-15',
  },
  {
    id: '2',
    title: 'Stock recommendations for tech',
    firstMessage: 'What are your recommendations for tech stocks?',
    date: '2024-01-14',
  },
  {
    id: '3',
    title: 'Market outlook discussion',
    firstMessage: 'What is your outlook on the market?',
    date: '2024-01-13',
  },
  {
    id: '4',
    title: 'Crypto investment strategy',
    firstMessage: 'Should I invest more in cryptocurrency?',
    date: '2024-01-12',
  },
  {
    id: '5',
    title: 'Portfolio rebalancing',
    firstMessage: 'Time to rebalance my portfolio?',
    date: '2024-01-11',
  },
];

export default function History({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-xl font-medium">Conversation history</h1>
        <p className="text-sm text-gray-500 mt-1">Review past conversations with the AI analyst</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4 space-y-2">
          {dummyConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onNavigate('analyst')}
              className="w-full bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-start gap-3">
                <IconHistory size={18} className="text-gray-400 shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{conv.title}</h3>
                  <p className="text-sm text-gray-600 truncate mt-1">{conv.firstMessage}</p>
                  <p className="text-xs text-gray-500 mt-2">{new Date(conv.date).toLocaleDateString()}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}