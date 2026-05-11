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

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <div className="w-50 text-white h-screen flex-col fixed left-0 top-0 max-md:hidden md:flex" style={{ backgroundColor: 'var(--color-sidebar-bg)' }}>
      {/* Logo */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <h1 className="text-base font-medium">JengaVest</h1>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>AI Financial Analyst</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {/* Main section */}
        <div>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
            { id: 'analyst', label: 'AI Analyst', icon: IconRobot },
            { id: 'news', label: 'Market news', icon: IconNews },
            { id: 'portfolio', label: 'Portfolio', icon: IconBriefcase },
            { id: 'documents', label: 'Documents', icon: IconFileText },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                activePage === id
                  ? 'text-white'
                  : ''
              }`}
              style={{
                backgroundColor: activePage === id ? 'var(--color-sidebar-nav-active)' : 'transparent',
                color: activePage === id ? 'var(--color-sidebar-text-active)' : 'var(--color-sidebar-text-inactive)',
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Account section */}
        <div className="mt-auto pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          {[
            { id: 'history', label: 'History', icon: IconHistory },
            { id: 'settings', label: 'Settings', icon: IconSettings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                activePage === id
                  ? 'text-white'
                  : ''
              }`}
              style={{
                backgroundColor: activePage === id ? 'var(--color-sidebar-nav-active)' : 'transparent',
                color: activePage === id ? 'var(--color-sidebar-text-active)' : 'var(--color-sidebar-text-inactive)',
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom Footer */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Total portfolio</p>
        <p className="text-lg font-medium mt-1">$24,381</p>
        <p className="text-xs font-medium mt-1" style={{ color: 'var(--color-live)' }}>
          +2.4% today
        </p>
      </div>
    </div>
  );
}