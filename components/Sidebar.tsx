'use client';

import React from 'react';
import {
  IconLayoutDashboard,
  IconRobot,
  IconNews,
  IconBriefcase,
  IconFileText,
  IconHistory,
  IconSettings,
} from '@tabler/icons-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const mainNav = [
  { id: 'dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
  { id: 'analyst', label: 'AI Analyst', icon: IconRobot },
  { id: 'news', label: 'Market news', icon: IconNews },
  { id: 'portfolio', label: 'Portfolio', icon: IconBriefcase },
  { id: 'documents', label: 'Documents', icon: IconFileText },
];

const accountNav = [
  { id: 'history', label: 'History', icon: IconHistory },
  { id: 'settings', label: 'Settings', icon: IconSettings },
];

function NavItem({
  label,
  Icon,
  active,
  onClick,
}: {
  label: string;
  Icon: React.ComponentType<{ size: number }>;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm text-left transition-colors"
      style={{
        backgroundColor: active ? 'rgba(255,255,255,0.08)' : 'transparent',
        color: active ? '#ffffff' : 'rgba(255,255,255,0.5)',
      }}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <div
      className="w-[200px] h-screen flex flex-col fixed left-0 top-0 max-md:hidden"
      style={{ backgroundColor: '#111827' }}
    >
      {/* Logo */}
      <div className="px-4 py-5">
        <h1 className="text-sm font-medium text-white">JengaVest</h1>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
          AI Financial Analyst
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 flex flex-col gap-4 overflow-y-auto">
        {/* Main section */}
        <div>
          <p
            className="px-3 mb-1 uppercase tracking-wider"
            style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}
          >
            Main
          </p>
          <div className="flex flex-col gap-0.5">
            {mainNav.map(({ id, label, icon: Icon }) => (
              <NavItem
                key={id}
                label={label}
                Icon={Icon}
                active={activePage === id}
                onClick={() => onNavigate(id)}
              />
            ))}
          </div>
        </div>

        {/* Account section */}
        <div>
          <p
            className="px-3 mb-1 uppercase tracking-wider"
            style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}
          >
            Account
          </p>
          <div className="flex flex-col gap-0.5">
            {accountNav.map(({ id, label, icon: Icon }) => (
              <NavItem
                key={id}
                label={label}
                Icon={Icon}
                active={activePage === id}
                onClick={() => onNavigate(id)}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Portfolio footer */}
      <div
        className="px-4 py-4 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Total portfolio</p>
        <p className="text-lg font-medium text-white mt-1">$24,381</p>
        <p className="text-xs font-medium mt-0.5" style={{ color: '#34d399' }}>+2.4% today</p>
      </div>
    </div>
  );
}
