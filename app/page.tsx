'use client';

import { useState, useEffect } from 'react';
import { PortfolioProvider } from '@/lib/portfolio';
import LoginScreen from '@/components/LoginScreen';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import Dashboard from '@/components/Dashboard';
import MarketsPage from '@/components/MarketsPage';
import PortfolioPage from '@/components/PortfolioPage';
import ChatPanel from '@/components/ChatPanel';
import MarketNewsPage from '@/components/MarketNewsPage';
import UploadDocument from '@/components/UploadDocument';
import HistoryPage from '@/components/HistoryPage';
import SettingsPage from '@/components/SettingsPage';

type Page =
  | 'dashboard'
  | 'markets'
  | 'portfolio'
  | 'analyst'
  | 'news'
  | 'documents'
  | 'history'
  | 'settings';

const USER_KEY = 'jengavest.user';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const navigate = (page: string) => setActivePage(page as Page);

  useEffect(() => {
    setUser(localStorage.getItem(USER_KEY));
    setMounted(true);
  }, []);

  const login = () => {
    localStorage.setItem(USER_KEY, 'Jeffrey');
    setUser('Jeffrey');
    setActivePage('dashboard');
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  // Avoid a hydration mismatch: nothing is rendered until we've read storage.
  if (!mounted) return null;

  if (!user) return <LoginScreen onContinue={login} />;

  return (
    <PortfolioProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar activePage={activePage} onNavigate={navigate} onLogout={logout} />
        <main className="md:ml-[200px] flex-1 min-h-screen bg-gray-50 pb-16">
          {activePage === 'dashboard' && <Dashboard onNavigate={navigate} />}
          {activePage === 'markets' && <MarketsPage />}
          {activePage === 'portfolio' && <PortfolioPage onNavigate={navigate} />}
          {activePage === 'analyst' && <ChatPanel />}
          {activePage === 'news' && <MarketNewsPage />}
          {activePage === 'documents' && <UploadDocument />}
          {activePage === 'history' && <HistoryPage onNavigate={navigate} />}
          {activePage === 'settings' && <SettingsPage onLogout={logout} />}
        </main>
        <BottomNav activePage={activePage} onNavigate={navigate} />
      </div>
    </PortfolioProvider>
  );
}
