'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IconSend } from '@tabler/icons-react';
import { Message } from '../types';
import { sendMessage } from '../lib/api';

interface AIAnalystProps {}

export default function AIAnalyst({}: AIAnalystProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage(input, messages);
      const aiMessage: Message = {
        role: 'assistant',
        content: response.response,
        citations: response.citations,
        tools_used: response.tools_used,
      };
      setMessages([...newMessages, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'Analyze my portfolio risk',
    'Show top movers today',
    'Best performing stock?',
    'Crypto outlook today?',
    'Rebalance suggestions?',
  ];

  return (
    <div className="flex-1 flex" style={{ backgroundColor: 'var(--color-main-bg)' }}>
      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b px-6 py-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded" style={{ backgroundColor: '#111827' }}></div>
            <div>
              <h2 className="text-base font-medium">JengaVest AI</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-live)' }}></div>
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: 'var(--color-main-bg)' }}>
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p style={{ color: 'var(--color-text-muted)' }} className="text-sm">Start a conversation with your AI analyst</p>
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-xs rounded-lg px-4 py-2"
                style={{
                  backgroundColor: message.role === 'user' ? '#111827' : 'var(--color-card-bg)',
                  color: 'var(--color-text-primary)',
                  borderColor: message.role === 'user' ? 'transparent' : 'var(--color-border)',
                  borderWidth: message.role === 'user' ? '0px' : '1px',
                }}
              >
                <p className="text-sm">{message.content}</p>
                {message.citations && message.citations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {message.citations.map((citation, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 rounded text-xs"
                        style={{ backgroundColor: '#10b98133', color: '#10b981' }}
                      >
                        {citation}
                      </span>
                    ))}
                  </div>
                )}
                {message.tools_used && message.tools_used.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {message.tools_used.map((tool, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 rounded text-xs"
                        style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-lg px-4 py-2" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)', borderWidth: '1px' }}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--color-text-muted)' }}></div>
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: 'var(--color-text-muted)', animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: 'var(--color-text-muted)', animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your portfolio..."
              className="flex-1 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--color-main-bg)',
                color: 'var(--color-text-primary)',
                borderColor: 'var(--color-border)',
                borderWidth: '1px',
                '--tw-ring-color': '#10b981',
              } as React.CSSProperties}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#111827' }}
            >
              <IconSend size={18} />
            </button>
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>Press Enter to send</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-40 border-l p-4 overflow-y-auto hidden lg:block" style={{ backgroundColor: 'var(--color-main-bg)', borderColor: 'var(--color-border)' }}>
        <p className="text-xs font-medium mb-3" style={{ color: 'var(--color-text-secondary)' }}>Suggested questions</p>
        <div className="space-y-2 mb-6">
          {quickQuestions.map((question, idx) => (
            <button
              key={idx}
              onClick={() => setInput(question)}
              className="w-full px-3 py-2 text-xs rounded hover:opacity-80 transition-opacity text-left"
              style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)', borderWidth: '1px', color: 'var(--color-text-secondary)' }}
            >
              {question}
            </button>
          ))}
        </div>

        <p className="text-xs font-medium mb-3" style={{ color: 'var(--color-text-secondary)' }}>Tools available</p>
        <div className="space-y-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          <div>Live stock data</div>
          <div>Web search</div>
          <div>Document RAG</div>
          <div>Google Drive MCP</div>
        </div>
      </div>
    </div>
  );
}