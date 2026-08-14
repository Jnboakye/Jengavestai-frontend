'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-provider';

// Root — send the visitor to the app if signed in, otherwise to login.
export default function Home() {
  const router = useRouter();
  const { ready, userId } = useAuth();

  useEffect(() => {
    if (!ready) return;
    router.replace(userId ? '/dashboard' : '/login');
  }, [ready, userId, router]);

  return null;
}
