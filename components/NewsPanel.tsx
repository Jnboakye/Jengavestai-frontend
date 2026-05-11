'use client';

import React from 'react';
import { IconLayoutDashboard, IconRobot, IconNews, IconBriefcase } from '@tabler/icons-react';

interface BottomNavProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Home', icon: IconLayoutDashboard },
  { id: 'analyst', label: 'AI Analyst', icon: IconRobot },
  { id: 'news', label: 'News', icon: IconNews },
  { id: 'portfolio', label: 'Portfolio', icon: IconBriefcase },
];

export default function BottomNav({ activePage, onNavigate }: BottomNavProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 md:hidden flex items-center justify-around h-16 border-t"
      style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
    >
      {navItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className="flex flex-col items-center gap-1 py-2 px-4 min-w-[44px] min-h-[44px] justify-center transition-colors"
          style={{ color: activePage === id ? '#111827' : '#9ca3af' }}
        >
          <Icon size={22} />
          <span className="text-xs">{label}</span>
        </button>
      ))}
    </div>
  );
}
