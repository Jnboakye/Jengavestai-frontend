'use client';

import { useEffect } from 'react';
import { setTokens } from '@/lib/session';

// The backend redirects here after Google / magic-link with the tokens in the
// URL fragment (#at=…&rt=…). We stash them and do a full navigation into the
// app so the auth provider re-initialises with the new session.
export default function AuthCallback() {
  useEffect(() => {
    const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : '';
    const params = new URLSearchParams(hash);
    const at = params.get('at');
    const rt = params.get('rt');
    if (at && rt) {
      setTokens(at, rt);
      window.location.replace('/dashboard');
    } else {
      window.location.replace('/login?error=auth_failed');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-[13px] text-gray-500">Signing you in…</p>
    </div>
  );
}
