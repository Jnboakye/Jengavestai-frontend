'use client';

import { useState, useRef, useEffect } from 'react';
import {
  IconRobot,
  IconSend,
  IconChartLine,
  IconSearch,
  IconFileText,
  IconBrandGoogleDrive,
} from '@tabler/icons-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  tools_used?: string[];
}

const suggestions = [
  'How is my portfolio performing today?',
  'What is the current price of Apple stock?',
  'Should I rebalance my portfolio?',
  'What is the latest news about Tesla?',
  'What are the biggest risks in my portfolio?',
];

const tools = [
  { label: 'Live stock data', icon: IconChartLine },
  { label: 'Web search', icon: IconSearch },
  { label: 'Document RAG search', icon: IconFileText },
  { label: 'Google Drive MCP', icon: IconBrandGoogleDrive },
];

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello Jeffrey! I am your JengaVest AI analyst. I can help you analyze your portfolio, fetch live market data, search your uploaded financial documents and provide cited investment insights. What would you like to know?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationHistory = useRef<{ role: string; content: string }[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    conversationHistory.current.push({ role: 'user', content: text });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            conversation_history: conversationHistory.current.slice(0, -1),
          }),
        }
      );

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        citations: data.citations || [],
        tools_used: data.tools_used || [],
      };

      setMessages(prev => [...prev, assistantMessage]);
      conversationHistory.current.push({
        role: 'assistant',
        content: data.response,
      });

    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry — I could not connect to the backend. Make sure the FastAPI server is running at localhost:8000.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <div className="px-6 py-3.5 bg-white border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-[13px] font-medium text-gray-900">AI Analyst</h1>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Ask anything about your portfolio or the market
          </p>
        </div>
        <button className="bg-[#111827] text-white text-[11px] px-3 py-1.5 rounded-md">
          Clear chat
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex gap-4" style={{ height: 'calc(100vh - 57px)' }}>

        {/* Chat main */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden">

          {/* Chat header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-[#111827] rounded-lg flex items-center justify-center shrink-0">
              <IconRobot size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[12px] font-medium text-gray-900">JengaVest AI</p>
              <p className="text-[10px] text-gray-500">Powered by Claude — Extended thinking enabled</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-green-600">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
              Online
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-medium ${
                  msg.role === 'assistant'
                    ? 'bg-[#111827] text-white'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {msg.role === 'assistant'
                    ? <IconRobot size={12} />
                    : 'JA'
                  }
                </div>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className={`px-3 py-2 rounded-xl text-[12px] leading-relaxed ${
                    msg.role === 'assistant'
                      ? 'bg-gray-50 text-gray-900 border border-gray-200 rounded-tl-sm'
                      : 'bg-[#111827] text-white rounded-tr-sm'
                  }`}>
                    {msg.content}
                  </div>

                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {[...new Set(msg.citations)].map((citation, j) => (
                        <span
                          key={j}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-green-50 text-green-600"
                        >
                          {citation}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Tools used */}
                  {msg.tools_used && msg.tools_used.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {msg.tools_used.map((tool, j) => (
                        <span
                          key={j}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
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
          <div className="p-3 border-t border-gray-200">
            <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
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
              JengaVest AI uses live market data, RAG search and web search
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-[180px] shrink-0 flex flex-col gap-4">

          {/* Suggested questions */}
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

          {/* Tools available */}
          <div>
            <p className="text-[10px] text-gray-500 mb-2 px-1">Tools available</p>
            <div className="flex flex-col gap-2">
              {tools.map(({ label, icon: Icon }, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] text-gray-500">
                  <Icon size={13} className="text-gray-400 shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}