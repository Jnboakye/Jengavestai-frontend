'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IconSend, IconRobot } from '@tabler/icons-react';
import { Message } from '../types';
import { sendMessage } from '../lib/api';

const quickQuestions = [
  'Analyze my portfolio risk',
  'Show top movers today',
  'Best performing stock?',
  'Crypto outlook today?',
  'Rebalance suggestions?',
];

const toolsList = [
  'Live stock data',
  'Web search',
  'Document RAG search',
  'Google Drive MCP',
];

export default function AIAnalyst() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setIsLoading(true);

    try {
      const res = await sendMessage(input, messages);
      setMessages([...history, {
        role: 'assistant',
        content: res.response,
        citations: res.citations,
        tools_used: res.tools_used,
      }]);
    } catch {
      setMessages([...history, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--color-main-bg)' }}>
      {/* Chat column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div
          className="shrink-0 px-6 py-4 border-b"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#111827' }}>
              <IconRobot size={18} color="white" />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>JengaVest AI</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: '#34d399' }} />
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ backgroundColor: 'var(--color-main-bg)' }}
        >
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Start a conversation with your AI analyst
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className="max-w-sm rounded-lg px-4 py-2.5"
                style={{
                  backgroundColor: msg.role === 'user' ? '#111827' : 'var(--color-card-bg)',
                  border: msg.role === 'user' ? 'none' : '1px solid var(--color-border)',
                }}
              >
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                  {msg.content}
                </p>
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {msg.citations.map((c, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{ backgroundColor: '#F0FDF4', color: '#059669' }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
                {msg.tools_used && msg.tools_used.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {msg.tools_used.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-xs"
                        style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div
                className="rounded-lg px-4 py-3 border"
                style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}
              >
                <div className="flex gap-1">
                  {[0, 0.15, 0.3].map((delay, i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full animate-bounce inline-block"
                      style={{ backgroundColor: 'var(--color-text-muted)', animationDelay: `${delay}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          className="shrink-0 border-t p-4"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about your portfolio..."
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg text-sm focus:outline-none border"
              style={{
                backgroundColor: 'var(--color-main-bg)',
                color: 'var(--color-text-primary)',
                borderColor: 'var(--color-border)',
              }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-lg text-white disabled:opacity-40"
              style={{ backgroundColor: '#111827' }}
            >
              <IconSend size={18} />
            </button>
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>Press Enter to send</p>
        </div>
      </div>

      {/* Right panel */}
      <div
        className="w-40 shrink-0 border-l p-4 overflow-y-auto hidden lg:flex flex-col gap-5"
        style={{ backgroundColor: 'var(--color-main-bg)', borderColor: 'var(--color-border)' }}
      >
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            Suggested questions
          </p>
          <div className="flex flex-col gap-1.5">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setInput(q)}
                className="w-full px-2.5 py-2 text-xs rounded border text-left hover:opacity-80 transition-opacity"
                style={{
                  backgroundColor: 'var(--color-card-bg)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            Tools available
          </p>
          <div className="flex flex-col gap-1.5">
            {toolsList.map((t) => (
              <p key={t} className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{t}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
