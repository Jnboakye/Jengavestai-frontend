'use client';

import { AuthProvider } from '@/lib/auth-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
