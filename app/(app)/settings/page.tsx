'use client';

import { useRouter } from 'next/navigation';
import SettingsPage from '@/components/SettingsPage';
import { clearUser } from '@/lib/auth';

export default function Page() {
  const router = useRouter();
  const logout = () => {
    clearUser();
    router.push('/login');
  };
  return <SettingsPage onLogout={logout} />;
}
