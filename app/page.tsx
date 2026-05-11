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
  const navigate = (page: string) => setActivePage(page as Page);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':  return <DashboardPage onNavigate={navigate} />;
      case 'analyst':    return <AIAnalyst />;
      case 'news':       return <MarketNews />;
      case 'portfolio':  return <PortfolioPage />;
      case 'documents':  return <Documents />;
      case 'history':    return <History onNavigate={navigate} />;
      case 'settings':   return <Settings />;
      default:           return <DashboardPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="h-screen" style={{ backgroundColor: 'var(--color-main-bg)' }}>
      <Sidebar activePage={activePage} onNavigate={navigate} />
      {/* Block-level main — left margin = sidebar width. Fixed sidebars are out of flex flow,
          so flex-1 would make main 100vw wide and the margin would overflow the viewport. */}
      <main className="md:ml-[200px] mb-16 md:mb-0">{renderPage()}</main>
      <BottomNav activePage={activePage} onNavigate={navigate} />
    </div>
  );
}
