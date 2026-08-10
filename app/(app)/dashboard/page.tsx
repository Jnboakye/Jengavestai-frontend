'use client';

import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import { routeFor } from '@/lib/nav';

export default function Page() {
  const router = useRouter();
  return <Dashboard onNavigate={(id) => router.push(routeFor(id))} />;
}
