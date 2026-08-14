'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconTrash, IconMessage } from '@tabler/icons-react';
import { useAuth } from '@/lib/auth-provider';
import { listConversations, deleteConversation, Conversation } from '@/lib/api';

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function HistoryPage() {
  const router = useRouter();
  const { mode, userId } = useAuth();
  const accountMode = mode === 'account' && !!userId && userId !== 'guest';

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accountMode) { setLoading(false); return; }
    let active = true;
    listConversations().then((c) => { if (active) { setConversations(c); setLoading(false); } });
    return () => { active = false; };
  }, [accountMode]);

  const remove = async (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    await deleteConversation(id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-3.5 bg-white border-b border-gray-200">
        <h1 className="text-[13px] font-medium text-gray-900">Chat history</h1>
        <p className="text-[11px] text-gray-500 mt-0.5">Your saved conversations with the AI analyst</p>
      </div>

      <div className="p-4">
        {!accountMode ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
            <h2 className="text-[14px] font-semibold text-gray-900 mb-1">Sign in to save your history</h2>
            <p className="text-[12px] text-gray-500">
              Conversations are saved to your account. In guest mode, chats aren’t stored.
            </p>
          </div>
        ) : loading ? (
          <p className="text-[12px] text-gray-400 text-center py-16">Loading…</p>
        ) : conversations.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
            <h2 className="text-[14px] font-semibold text-gray-900 mb-1">No conversations yet</h2>
            <p className="text-[12px] text-gray-500 mb-5">Ask the AI Analyst something and it’ll show up here.</p>
            <button
              onClick={() => router.push('/ai-agent')}
              className="bg-[#111827] text-white text-[12px] rounded-lg px-4 py-2.5 hover:bg-black"
            >
              Open AI Analyst
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {conversations.map((c, i) => (
              <div
                key={c.id}
                className={`flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors ${
                  i < conversations.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <button
                  onClick={() => router.push(`/ai-agent?c=${c.id}`)}
                  className="flex items-center gap-3 text-left flex-1 min-w-0"
                >
                  <IconMessage size={16} className="text-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-gray-900 truncate">{c.title}</p>
                    <p className="text-[10px] text-gray-400">{fmtDate(c.created_at)}</p>
                  </div>
                </button>
                <button
                  onClick={() => remove(c.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors shrink-0 ml-3"
                  aria-label="Delete conversation"
                >
                  <IconTrash size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
