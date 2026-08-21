'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authedFetch, clearTokens } from '@/lib/session';
import { getUser as getGuest, setUser as setGuest, clearUser as clearGuest } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface AuthContextValue {
  ready: boolean;
  userId: string | null;
  email: string | null;
  displayName: string;
  mode: 'account' | 'guest';
  signInWithMagicLink: (email: string) => Promise<{ error?: string }>;
  continueAsGuest: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<'account' | 'guest'>('guest');
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>('there');

  useEffect(() => {
    let active = true;
    (async () => {
      // Ask the backend whether real auth is available.
      let enabled = false;
      try {
        const res = await fetch(`${API_URL}/auth/status`, { cache: 'no-store' });
        if (res.ok) enabled = (await res.json()).enabled === true;
      } catch {
        /* backend unreachable → guest mode */
      }
      if (!active) return;

      if (enabled) {
        setMode('account');
        try {
          const me = await authedFetch('/auth/me');
          if (me.ok) {
            const u = await me.json();
            setUserId(u.id);
            setEmail(u.email ?? null);
            setDisplayName(u.name || u.email?.split('@')[0] || 'there');
          } else {
            clearTokens();
            setUserId(null);
          }
        } catch {
          setUserId(null);
        }
      } else {
        setMode('guest');
        const g = getGuest();
        setUserId(g ? 'guest' : null);
        setDisplayName(g || 'Jeffrey');
      }
      if (active) setReady(true);
    })();
    return () => { active = false; };
  }, []);

  const signInWithMagicLink = useCallback(async (addr: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: addr }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return { error: body.detail || 'Could not send magic link.' };
      }
      return {};
    } catch {
      return { error: 'Could not reach the server.' };
    }
  }, []);

  const continueAsGuest = useCallback(() => {
    setGuest('Jeffrey');
    setUserId('guest');
    setDisplayName('Jeffrey');
  }, []);

  const signOut = useCallback(async () => {
    if (mode === 'account') {
      try { await authedFetch('/auth/logout', { method: 'POST' }); } catch { /* ignore */ }
      clearTokens();
    } else {
      clearGuest();
    }
    setUserId(null);
    setEmail(null);
  }, [mode]);

  const value: AuthContextValue = {
    ready,
    userId,
    email,
    displayName,
    mode,
    signInWithMagicLink,
    continueAsGuest,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
