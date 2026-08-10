'use client';

import { useRouter } from 'next/navigation';
import HistoryPage from '@/components/HistoryPage';
import { routeFor } from '@/lib/nav';

export default function Page() {
  const router = useRouter();
  return <HistoryPage onNavigate={(id) => router.push(routeFor(id))} />;
}
