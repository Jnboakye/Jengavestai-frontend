'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  IconLayoutDashboard,
  IconSearch,
  IconBriefcase,
  IconRobot,
  IconNews,
  IconFileText,
  IconHistory,
  IconSettings,
  IconLogout,
} from '@tabler/icons-react';
import { usePortfolio, fmtUsd } from '@/lib/portfolio';
import { clearUser } from '@/lib/auth';

const mainNav = [
  { href: '/dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
  { href: '/markets', label: 'Markets', icon: IconSearch },
  { href: '/portfolio', label: 'Portfolio', icon: IconBriefcase },
  { href: '/ai-agent', label: 'AI Analyst', icon: IconRobot },
  { href: '/news', label: 'Market news', icon: IconNews },
  { href: '/documents', label: 'Documents', icon: IconFileText },
];

const accountNav = [
  { href: '/history', label: 'History', icon: IconHistory },
  { href: '/settings', label: 'Settings', icon: IconSettings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totals } = usePortfolio();

  const logout = () => {
    clearUser();
    router.push('/login');
  };

  const rowClass = (href: string) =>
    `w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[12.5px] text-left transition-colors ${
      pathname === href
        ? 'bg-white/[0.08] text-white'
        : 'text-white/50 hover:text-white/80 hover:bg-white/[0.05]'
    }`;

  return (
    <div className="hidden md:flex fixed left-0 top-0 bottom-0 w-[200px] bg-[#111827] flex-col z-40">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/[0.08]">
        <h1 className="text-[15px] font-medium text-white tracking-tight">JengaVest</h1>
        <p className="text-[11px] text-white/35 mt-0.5">Portfolio tracker</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 flex flex-col gap-4 overflow-y-auto">
        <div>
          <p className="text-[10px] text-white/30 uppercase tracking-wider px-2 mb-1.5">Main</p>
          <div className="flex flex-col gap-px">
            {mainNav.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={rowClass(href)}>
                <Icon size={15} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] text-white/30 uppercase tracking-wider px-2 mb-1.5">Account</p>
          <div className="flex flex-col gap-px">
            {accountNav.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={rowClass(href)}>
                <Icon size={15} />
                <span>{label}</span>
              </Link>
            ))}
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[12.5px] text-left text-white/50 hover:text-white/80 hover:bg-white/[0.05] transition-colors"
            >
              <IconLogout size={15} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Portfolio footer */}
      <div className="px-4 py-4 border-t border-white/[0.08]">
        <p className="text-[10px] text-white/35 mb-1">Total portfolio</p>
        <p className="text-lg font-medium text-white mb-0.5">{fmtUsd(totals.value)}</p>
        <p className={`text-[11px] ${totals.dayGainUsd >= 0 ? 'text-[#34d399]' : 'text-red-400'}`}>
          {totals.dayGainUsd >= 0 ? '+' : ''}{totals.dayGainPct.toFixed(2)}% today
        </p>
      </div>
    </div>
  );
}
