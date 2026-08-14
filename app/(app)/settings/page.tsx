'use client';

import { useRouter } from 'next/navigation';
import SettingsPage from '@/components/SettingsPage';
import { useAuth } from '@/lib/auth-provider';

export default function Page() {
  const router = useRouter();
  const { signOut } = useAuth();
  const logout = async () => {
    await signOut();
    router.push('/login');
  };
  return <SettingsPage onLogout={logout} />;
}
