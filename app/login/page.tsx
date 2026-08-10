'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginScreen from '@/components/LoginScreen';
import { getUser, setUser } from '@/lib/auth';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    if (getUser()) router.replace('/dashboard');
  }, [router]);

  const login = () => {
    setUser('Jeffrey');
    router.push('/dashboard');
  };

  return <LoginScreen onContinue={login} />;
}
