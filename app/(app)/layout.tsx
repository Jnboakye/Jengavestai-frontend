'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PortfolioProvider } from '@/lib/portfolio';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import { getUser } from '@/lib/auth';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  // Client-side auth guard (demo: localStorage). Redirect out if not signed in.
  useEffect(() => {
    if (!getUser()) {
      router.replace('/login');
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return null;

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
