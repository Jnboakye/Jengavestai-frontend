'use client';

import {
  IconLayoutDashboard,
  IconRobot,
  IconNews,
  IconBriefcase,
} from '@tabler/icons-react';

interface BottomNavProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const items = [
  { id: 'dashboard', label: 'Home', icon: IconLayoutDashboard },
  { id: 'analyst', label: 'AI Analyst', icon: IconRobot },
  { id: 'news', label: 'News', icon: IconNews },
  { id: 'portfolio', label: 'Portfolio', icon: IconBriefcase },
];

export default function BottomNav({ activePage, onNavigate }: BottomNavProps) {
  return (
    <div className="hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center z-50">
      {items.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={`flex-1 flex flex-col items-center gap-1 py-2 transition-colors ${
            activePage === id
              ? 'text-gray-900'
              : 'text-gray-400'
          }`}
        >
          <Icon size={20} />
          <span className={`text-[9px] ${activePage === id ? 'font-medium' : ''}`}>
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}