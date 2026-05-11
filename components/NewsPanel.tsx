'use client';

import React from 'react';
import { IconLayoutDashboard, IconRobot, IconNews, IconBriefcase } from '@tabler/icons-react';

interface BottomNavProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function BottomNav({ activePage, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: IconLayoutDashboard },
    { id: 'analyst', label: 'AI Analyst', icon: IconRobot },
    { id: 'news', label: 'News', icon: IconNews },
    { id: 'portfolio', label: 'Portfolio', icon: IconBriefcase },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 flex items-center justify-around h-16">
      {navItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={`flex flex-col items-center gap-1 py-2 px-4 transition-colors ${
            activePage === id
              ? 'text-gray-900'
              : 'text-gray-400'
          }`}
        >
          <Icon size={24} />
          <span className="text-xs">{label}</span>
        </button>
      ))}
    </div>
  );
}