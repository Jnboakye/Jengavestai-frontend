'use client';

import { useState, useRef, useEffect } from 'react';
import { IconRobot, IconSend } from '@tabler/icons-react';
import { sendChat } from '@/lib/api';
import { usePortfolio, fmtUsd } from '@/lib/portfolio';
import { EnrichedHolding, Message } from '@/types';

type ChatMsg = Message & { citations?: string[]; offline?: boolean };

const suggestions = [
  'How is my portfolio performing today?',
  'Which of my holdings is the biggest risk?',
  'Should I rebalance my portfolio?',
  'What is the latest news on my holdings?',
  'Which of my stocks moved the most today?',
];

const GREETING: ChatMsg = {
  role: 'assistant',
  content:
    'Hi! I am your JengaVest analyst. I focus on the stocks in your portfolio — ask me how your holdings are doing, what is driving them, or where your risks are.',
};

function portfolioPreamble(holdings: EnrichedHolding[]): string {
  if (holdings.length === 0) {
    return 'The user has no holdings yet. If they ask about their portfolio, tell them it is empty and suggest adding stocks from the Markets page. Only discuss stocks that are in their portfolio.';
  }
  const lines = holdings
    .map(
      (h) =>
        `${h.ticker} (${h.name}): invested ${fmtUsd(h.amountUsd)}, current value ${fmtUsd(h.currentValue)}, day change ${h.change >= 0 ? '+' : ''}${h.change.toFixed(1)}%`,
    )
    .join('; ');
  return `You are JengaVest AI. Analyze ONLY the user's current portfolio holdings and stay strictly within them. Their holdings are: ${lines}. If the user asks about any stock or asset that is not in this list, tell them it is not in their portfolio and offer to analyze only what they hold. Prefer live data for these tickers.`;
}

export default function ChatPanel() {
  const { holdings, totals } = usePortfolio();
  const [messages, setMessages] = useState<ChatMsg[]>([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const priorHistory = messages.slice(1); // drop the greeting
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);

    const ctx = {
      value: totals.value,
      invested: totals.invested,
      dayGainUsd: totals.dayGainUsd,
      dayGainPct: totals.dayGainPct,
      holdings: holdings.map((h) => ({ ticker: h.ticker, currentValue: h.currentValue, change: h.change })),
    };

    const { response, citations, offline } = await sendChat(text, priorHistory, {
      preamble: portfolioPreamble(holdings),
      ctx,
    });

    setMessages((prev) => [...prev, { role: 'assistant', content: response, citations, offline }]);
    setLoading(false);
  };

  const clearChat = () => setMessages([GREETING]);

  return (
    <div className="flex flex-col bg-gray-50 overflow-x-hidden" style={{ height: '100dvh' }}>
      {/* Desktop topbar */}
      <div className="hidden md:flex px-6 py-3.5 bg-white border-b border-gray-200 items-center justify-between shrink-0">
        <div>
          <h1 className="text-[13px] font-medium text-gray-900">AI Analyst</h1>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Ask anything about your portfolio or the market
          </p>
        </div>
        <button
          onClick={clearChat}
          className="bg-[#111827] text-white text-[11px] px-3 py-1.5 rounded-md"
        >
          Clear chat
        </button>
      </div>

      {/* Mobile topbar */}
      <div className="md:hidden px-4 py-3 bg-white border-b border-gray-200 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 bg-[#111827] rounded-lg flex items-center justify-center shrink-0">
          <IconRobot size={16} className="text-white" />
        </div>
        <div>
          <p className="text-[13px] font-medium text-gray-900">AI Analyst</p>
          <p className="text-[10px] text-gray-500">Analyzes your holdings</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-[10px] text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full inline-block bg-gray-300"></span>
          Claude
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden p-2 md:p-4 min-h-0" style={{ height: 'calc(100dvh - 57px - 64px)' }}>

        {/* Chat main */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden min-h-0 w-full">

          {/* Chat header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-[#111827] rounded-lg flex items-center justify-center shrink-0">
              <IconRobot size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[12px] font-medium text-gray-900">JengaVest AI</p>
              <p className="text-[10px] text-gray-500">Powered by Claude · analyzes your holdings</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full inline-block bg-gray-300"></span>
              Claude
            </div>
          </div>

          {/* Mobile suggestion chips */}
          <div className="md:hidden flex gap-2 overflow-x-auto px-3 py-2 border-b border-gray-200 shrink-0 w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
            {['My portfolio today', 'My biggest risk', 'Should I rebalance?', 'Top mover today', 'News on my holdings'].map((chip, i) => (
              <button
                key={i}
                onClick={() => sendMessage(chip)}
                className="whitespace-nowrap text-[11px] px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 flex flex-col gap-3 min-h-0">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-medium ${
                  msg.role === 'assistant' ? 'bg-[#111827] text-white' : 'bg-blue-100 text-blue-700'
                }`}>
                  {msg.role === 'assistant' ? <IconRobot size={12} /> : 'You'}
                </div>
                <div className={`max-w-[85%] md:max-w-[80%] overflow-hidden ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div
                    className={`px-3 py-2 rounded-xl text-[12px] leading-relaxed ${
                      msg.role === 'assistant'
                        ? 'bg-gray-50 text-gray-900 border border-gray-200 rounded-tl-sm'
                        : 'bg-[#111827] text-white rounded-tr-sm'
                    }`}
                    style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                  >
                    {msg.content}
                  </div>

                  {/* Sources */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {[...new Set(msg.citations)].map((c, j) => (
                        <span key={j} className="text-[9px] px-1.5 py-0.5 rounded bg-green-50 text-green-600">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Offline fallback note */}
                  {msg.offline && (
                    <span className="text-[9px] text-gray-400">
                      Offline — backend unreachable, showing a local estimate.
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {loading && (
              <div className="flex gap-2 items-start">
                <div className="w-6 h-6 rounded-full bg-[#111827] flex items-center justify-center shrink-0">
                  <IconRobot size={12} className="text-white" />
                </div>
                <div className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 rounded-tl-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="text-[10px] text-gray-400">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 shrink-0 bg-white w-full">
            <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="Ask about your portfolio, a stock, or the market..."
                className="flex-1 text-[12px] bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="w-7 h-7 bg-[#111827] rounded-md flex items-center justify-center shrink-0 disabled:opacity-40"
              >
                <IconSend size={13} className="text-white" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              The analyst discusses only the stocks in your portfolio.
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="hidden md:flex w-[180px] shrink-0 flex-col gap-4">
          <div>
            <p className="text-[10px] text-gray-500 mb-2 px-1">Suggested questions</p>
            <div className="flex flex-col gap-1.5">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="text-left text-[11px] text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 hover:border-gray-300 transition-colors leading-snug"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
