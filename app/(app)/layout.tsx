'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortfolioProvider } from '@/lib/portfolio';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/lib/auth-provider';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { ready, userId } = useAuth();

  useEffect(() => {
    if (ready && !userId) router.replace('/login');
  }, [ready, userId, router]);

  if (!ready || !userId) return null;

  return (
    <PortfolioProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="md:ml-[200px] flex-1 min-h-screen bg-gray-50 pb-16">{children}</main>
        <BottomNav />
      </div>
    </PortfolioProvider>
  );
}
