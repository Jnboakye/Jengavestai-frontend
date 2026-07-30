'use client';

import { useState } from 'react';
import {
  IconLayoutDashboard,
  IconSearch,
  IconBriefcase,
  IconRobot,
  IconDots,
  IconNews,
  IconFileText,
  IconHistory,
  IconSettings,
  IconLogout,
} from '@tabler/icons-react';

interface BottomNavProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const tabs = [
  { id: 'dashboard', label: 'Home', icon: IconLayoutDashboard },
  { id: 'markets', label: 'Markets', icon: IconSearch },
  { id: 'portfolio', label: 'Portfolio', icon: IconBriefcase },
  { id: 'analyst', label: 'AI Analyst', icon: IconRobot },
];

const moreItems = [
  { id: 'news', label: 'Market news', icon: IconNews },
  { id: 'documents', label: 'Documents', icon: IconFileText },
  { id: 'history', label: 'History', icon: IconHistory },
  { id: 'settings', label: 'Settings', icon: IconSettings },
];

const MORE_IDS = new Set(moreItems.map((m) => m.id));

export default function BottomNav({ activePage, onNavigate, onLogout }: BottomNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (id: string) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  const moreActive = MORE_IDS.has(activePage);

  return (
    <>
      {/* Bottom sheet */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl pb-6 pt-2">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-2" />
            <div className="px-2">
              {moreItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => go(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-[13px] ${
                    activePage === id ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} className="text-gray-500" />
                  {label}
                </button>
              ))}
              <div className="h-px bg-gray-100 my-1" />
              <button
                onClick={() => { onLogout(); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-[13px] text-red-600 hover:bg-red-50"
              >
                <IconLogout size={18} />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center z-50">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => go(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2 transition-colors ${
              activePage === id ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <Icon size={22} />
            <span className={`text-[9px] ${activePage === id ? 'font-medium' : ''}`}>{label}</span>
          </button>
        ))}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className={`flex-1 flex flex-col items-center gap-1 py-2 transition-colors ${
            menuOpen || moreActive ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          <IconDots size={22} />
          <span className={`text-[9px] ${menuOpen || moreActive ? 'font-medium' : ''}`}>More</span>
        </button>
      </div>
    </>
  );
}
