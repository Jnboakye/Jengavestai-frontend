'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  IconLayoutDashboard,
  IconSearch,
  IconBriefcase,
  IconRobot,
  IconDots,
  IconNews,
  IconFileText,
  IconHistory,
  IconSettings,
  IconLogout,
} from '@tabler/icons-react';
import { useAuth } from '@/lib/auth-provider';

const tabs = [
  { href: '/dashboard', label: 'Home', icon: IconLayoutDashboard },
  { href: '/markets', label: 'Markets', icon: IconSearch },
  { href: '/portfolio', label: 'Portfolio', icon: IconBriefcase },
  { href: '/ai-agent', label: 'AI Analyst', icon: IconRobot },
];

const moreItems = [
  { href: '/news', label: 'Market news', icon: IconNews },
  { href: '/documents', label: 'Documents', icon: IconFileText },
  { href: '/history', label: 'History', icon: IconHistory },
  { href: '/settings', label: 'Settings', icon: IconSettings },
];

const MORE_HREFS = new Set(moreItems.map((m) => m.href));

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const moreActive = MORE_HREFS.has(pathname);

  const logout = async () => {
    setMenuOpen(false);
    await signOut();
    router.push('/login');
  };

  return (
    <>
      {/* Bottom sheet */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl pb-6 pt-2">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-2" />
            <div className="px-2">
              {moreItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-[13px] ${
                    pathname === href ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} className="text-gray-500" />
                  {label}
                </Link>
              ))}
              <div className="h-px bg-gray-100 my-1" />
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-[13px] text-red-600 hover:bg-red-50"
              >
                <IconLogout size={18} />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center z-50">
        {tabs.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center gap-1 py-2 transition-colors ${
              pathname === href ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <Icon size={22} />
            <span className={`text-[9px] ${pathname === href ? 'font-medium' : ''}`}>{label}</span>
          </Link>
        ))}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className={`flex-1 flex flex-col items-center gap-1 py-2 transition-colors ${
            menuOpen || moreActive ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          <IconDots size={22} />
          <span className={`text-[9px] ${menuOpen || moreActive ? 'font-medium' : ''}`}>More</span>
        </button>
      </div>
    </>
  );
}
