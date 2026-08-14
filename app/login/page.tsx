'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginScreen from '@/components/LoginScreen';
import { useAuth } from '@/lib/auth-provider';

export default function Page() {
  const router = useRouter();
  const { ready, userId } = useAuth();

  useEffect(() => {
    if (ready && userId) router.replace('/dashboard');
  }, [ready, userId, router]);

  return <LoginScreen />;
}
