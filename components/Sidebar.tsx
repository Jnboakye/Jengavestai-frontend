'use client';

import { useState } from 'react';

const navigationItems = [
  'Dashboard',
  'Market News',
  'Portfolio',
  'Documents',
  'History',
  'Settings',
];

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

export default function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">JengaVest</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item}>
              <button
                onClick={() => onItemClick(item)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeItem === item
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Portfolio Summary */}
      <div className="p-4 border-t border-gray-800">
        <div className="text-sm text-gray-400">Portfolio Value</div>
        <div className="text-xl font-semibold">$1,234,567</div>
        <div className="text-sm text-green-400">+2.34% today</div>
      </div>
    </div>
  );
}