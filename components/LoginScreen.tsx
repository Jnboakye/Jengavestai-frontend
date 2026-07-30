'use client';

import { useState } from 'react';
import { IconTrendingUp, IconArrowRight } from '@tabler/icons-react';

export default function LoginScreen({ onContinue }: { onContinue: () => void }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // No backend wired up for auth in this demo — sign-up always fails.
    setError('Sign-up is not available in this demo. Use “Continue as Jeffrey” instead.');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-11 h-11 rounded-xl bg-[#111827] flex items-center justify-center mb-3">
            <IconTrendingUp size={22} className="text-[#34d399]" />
          </div>
          <h1 className="text-[20px] font-semibold text-gray-900 tracking-tight">JengaVest</h1>
          <p className="text-[12px] text-gray-500 mt-1">Build and track your investment portfolio</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <form onSubmit={handleSignUp} className="flex flex-col gap-3">
            <label className="text-[12px] font-medium text-gray-700">Sign up with email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="you@example.com"
              className="w-full text-[13px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-gray-400 text-gray-900 placeholder-gray-400"
            />
            <button
              type="submit"
              className="w-full bg-[#111827] text-white text-[13px] font-medium rounded-lg py-2.5 hover:bg-black transition-colors"
            >
              Create account
            </button>
            {error && (
              <p className="text-[11px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <span className="h-px bg-gray-200 flex-1" />
            <span className="text-[11px] text-gray-400">or</span>
            <span className="h-px bg-gray-200 flex-1" />
          </div>

          <button
            onClick={onContinue}
            className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-800 text-[13px] font-medium rounded-lg py-2.5 hover:bg-gray-50 transition-colors"
          >
            Continue as Jeffrey
            <IconArrowRight size={15} />
          </button>
        </div>

        <p className="text-[11px] text-gray-400 text-center mt-5">
          Demo project — no real accounts or money involved.
        </p>
      </div>
    </div>
  );
}
