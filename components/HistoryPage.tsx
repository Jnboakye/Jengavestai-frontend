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
  { id: '1', title: 'Portfolio risk analysis', firstMessage: 'Analyze my portfolio risk exposure...', date: '2026-05-10' },
  { id: '2', title: 'Stock recommendations for tech', firstMessage: 'What are your recommendations for tech stocks?', date: '2026-05-09' },
  { id: '3', title: 'Market outlook discussion', firstMessage: 'What is your outlook on the market for Q2?', date: '2026-05-08' },
  { id: '4', title: 'Crypto investment strategy', firstMessage: 'Should I invest more in cryptocurrency?', date: '2026-05-07' },
  { id: '5', title: 'Portfolio rebalancing', firstMessage: 'Time to rebalance my portfolio?', date: '2026-05-06' },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function History({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: 'var(--color-main-bg)' }}>
      {/* Header */}
      <div
        className="shrink-0 px-6 py-4 border-b"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}
      >
        <h1 className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Conversation history</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          Review past conversations with the AI analyst
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4 space-y-2">
          {dummyConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onNavigate('analyst')}
              className="w-full rounded-lg border p-4 text-left hover:opacity-80 transition-opacity"
              style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}
            >
              <div className="flex items-start gap-3">
                <IconHistory size={16} style={{ color: 'var(--color-text-muted)', marginTop: '2px', flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                    {conv.title}
                  </h3>
                  <p className="text-xs truncate mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    {conv.firstMessage}
                  </p>
                  <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                    {formatDate(conv.date)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
