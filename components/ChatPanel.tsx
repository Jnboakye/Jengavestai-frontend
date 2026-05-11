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
    <div className="flex-1 flex">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded bg-gray-900"></div>
            <div>
              <h2 className="text-base font-medium">JengaVest AI</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-500 text-sm">Start a conversation with your AI analyst</p>
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.citations && message.citations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {message.citations.map((citation, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
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
                        className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
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
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your portfolio..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--color-sidebar-bg)' }}
            >
              <IconSend size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Press Enter to send</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-40 border-l border-gray-200 p-4 bg-gray-50 overflow-y-auto hidden lg:block">
        <p className="text-xs font-medium text-gray-600 mb-3">Suggested questions</p>
        <div className="space-y-2 mb-6">
          {quickQuestions.map((question, idx) => (
            <button
              key={idx}
              onClick={() => setInput(question)}
              className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded hover:bg-gray-100 text-left transition-colors"
            >
              {question}
            </button>
          ))}
        </div>

        <p className="text-xs font-medium text-gray-600 mb-3">Tools available</p>
        <div className="space-y-2 text-xs text-gray-600">
          <div>Live stock data</div>
          <div>Web search</div>
          <div>Document RAG</div>
          <div>Google Drive MCP</div>
        </div>
      </div>
    </div>
  );
}