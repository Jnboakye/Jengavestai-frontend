'use client';

import { useRouter } from 'next/navigation';
import PortfolioPage from '@/components/PortfolioPage';
import { routeFor } from '@/lib/nav';

export default function Page() {
  const router = useRouter();
  return <PortfolioPage onNavigate={(id) => router.push(routeFor(id))} />;
}
