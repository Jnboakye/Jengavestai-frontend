'use client';

import { useState } from 'react';
import {
  IconTrendingUp,
  IconArrowRight,
  IconSparkles,
  IconChartLine,
  IconChartPie,
  IconBuildingBank,
  IconCurrencyBitcoin,
} from '@tabler/icons-react';

const tickers = [
  { sym: 'AAPL', chg: '+1.8%', up: true, icon: IconChartLine },
  { sym: 'NVDA', chg: '+3.4%', up: true, icon: IconChartLine },
  { sym: 'TSLA', chg: '-2.3%', up: false, icon: IconChartLine },
  { sym: 'SPY', chg: '+1.2%', up: true, icon: IconChartPie },
  { sym: 'BND', chg: '-0.3%', up: false, icon: IconBuildingBank },
  { sym: 'BTC', chg: '+2.6%', up: true, icon: IconCurrencyBitcoin },
];

export default function LoginScreen({ onContinue }: { onContinue: () => void }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // No backend wired up for auth in this demo — sign-up always fails.
    setError('Sign-up isn’t available in this demo. Use “Continue as Jeffrey”.');
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left / brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0B1120] text-white">
        {/* soft green glow */}
        <div
          className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, #1D9E75 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-[360px] h-[360px] rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #378ADD 0%, transparent 70%)' }}
        />

        {/* faint grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* area chart along the bottom */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 600 200" preserveAspectRatio="none" style={{ height: 220 }}>
          <defs>
            <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,150 L60,140 L120,150 L180,120 L240,130 L300,90 L360,100 L420,60 L480,70 L540,35 L600,20 L600,200 L0,200 Z"
            fill="url(#fill)"
          />
          <path
            d="M0,150 L60,140 L120,150 L180,120 L240,130 L300,90 L360,100 L420,60 L480,70 L540,35 L600,20"
            fill="none"
            stroke="#34d399"
            strokeWidth="2.5"
          />
        </svg>

        {/* brand mark, top-left */}
        <div className="absolute top-10 left-10 z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <IconTrendingUp size={19} className="text-[#34d399]" />
          </div>
          <span className="text-[16px] font-semibold tracking-tight">JengaVest</span>
        </div>

        {/* centered marketing content */}
        <div className="relative z-10 flex flex-col justify-center w-full p-10">
          <div className="max-w-sm">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-white/70 bg-white/5 border border-white/10 rounded-full px-2.5 py-1 mb-5">
              <IconSparkles size={12} className="text-[#34d399]" />
              AI-powered financial analyst
            </div>
            <h2 className="text-[26px] font-semibold leading-tight tracking-tight">
              Track your investments in one clean dashboard.
            </h2>
            <p className="text-[13px] text-white/55 mt-3 leading-relaxed">
              Search stocks, build a portfolio, and see your value, allocation and daily
              performance update in real time.
            </p>

            {/* ticker chips */}
            <div className="grid grid-cols-3 gap-2 mt-6">
              {tickers.map((t) => {
                const Icon = t.icon;
                return (
                  <div key={t.sym} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[12px] font-medium">{t.sym}</span>
                      <Icon size={13} className="text-white/40" />
                    </div>
                    <p className={`text-[11px] ${t.up ? 'text-[#34d399]' : 'text-red-400'}`}>{t.chg}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right / form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-[300px] flex flex-col items-center text-center">
          {/* Mobile brand */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <div className="w-11 h-11 rounded-xl bg-[#111827] flex items-center justify-center mb-3">
              <IconTrendingUp size={22} className="text-[#34d399]" />
            </div>
            <h1 className="text-[19px] font-semibold text-gray-900 tracking-tight">JengaVest</h1>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block mb-6">
            <h1 className="text-[20px] font-semibold text-gray-900 tracking-tight">Welcome To JengaVest</h1>
            <p className="text-[13px] text-gray-500 mt-1">Sign in to your portfolio</p>
          </div>

          <form onSubmit={handleSignUp} className="w-full flex flex-col gap-2.5">
            <label className="text-[12px] font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="you@example.com"
              className="w-full text-[13px] text-center bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5 text-gray-900 placeholder-gray-400 transition"
            />
            <button
              type="submit"
              className="w-full bg-[#111827] text-white text-[12.5px] font-medium rounded-lg py-2 hover:bg-black transition-colors"
            >
              Create account
            </button>
            {error && (
              <p className="text-[11px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
          </form>

          <div className="w-full flex items-center gap-3 my-4">
            <span className="h-px bg-gray-200 flex-1" />
            <span className="text-[11px] text-gray-400">or</span>
            <span className="h-px bg-gray-200 flex-1" />
          </div>

          <button
            onClick={onContinue}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-800 text-[12.5px] font-medium rounded-lg py-2 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            Continue as Jeffrey
            <IconArrowRight size={15} />
          </button>

          <p className="text-[11px] text-gray-400 mt-6">
            Demo project — no real accounts or money involved.
          </p>
        </div>
      </div>
    </div>
  );
}
