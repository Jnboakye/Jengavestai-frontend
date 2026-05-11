'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardPage from '../components/Dashboard';
import AIAnalyst from '../components/ChatPanel';
import MarketNews from '../components/MetricsBar';
import PortfolioPage from '../components/PortfolioChart';
import Documents from '../components/AllocationChart';
import History from '../components/HoldingsTable';
import Settings from '../components/UploadDocument';
import BottomNav from '../components/NewsPanel';

type Page = 'dashboard' | 'analyst' | 'news' | 'portfolio' | 'documents' | 'history' | 'settings';

export default function Home() {
  const [activePage, setActivePage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage onNavigate={(page) => setActivePage(page as Page)} />;
      case 'analyst':
        return <AIAnalyst />;
      case 'news':
        return <MarketNews />;
      case 'portfolio':
        return <PortfolioPage />;
      case 'documents':
        return <Documents />;
      case 'history':
        return <History onNavigate={(page) => setActivePage(page as Page)} />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardPage onNavigate={(page) => setActivePage(page as Page)} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - visible on md and above */}
      <Sidebar activePage={activePage} onNavigate={(page) => setActivePage(page as Page)} />

      {/* Main content */}
      <main className="flex-1 md:ml-50 mb-16 md:mb-0">{renderPage()}</main>

      {/* Bottom navigation - visible only on mobile */}
      <BottomNav activePage={activePage} onNavigate={(page) => setActivePage(page as Page)} />
    </div>
  );
}
