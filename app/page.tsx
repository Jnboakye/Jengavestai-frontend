'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';

// Root — send the visitor to the app if signed in, otherwise to login.
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getUser() ? '/dashboard' : '/login');
  }, [router]);

  return null;
}
