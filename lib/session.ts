// Bearer-token session store. The backend owns auth; the frontend just holds
// the opaque tokens it was handed and sends them on API calls. On a 401 it
// transparently refreshes once.

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const AT_KEY = 'jengavest.at';
const RT_KEY = 'jengavest.rt';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem(AT_KEY); } catch { return null; }
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem(RT_KEY); } catch { return null; }
}

export function setTokens(accessToken: string, refreshToken: string): void {
  try {
    localStorage.setItem(AT_KEY, accessToken);
    localStorage.setItem(RT_KEY, refreshToken);
  } catch { /* ignore */ }
}

export function clearTokens(): void {
  try {
    localStorage.removeItem(AT_KEY);
    localStorage.removeItem(RT_KEY);
  } catch { /* ignore */ }
}

/** fetch to the backend with the bearer token; refreshes once on 401. */
export async function authedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const at = getAccessToken();
  const headers = new Headers(init.headers);
  if (at) headers.set('Authorization', `Bearer ${at}`);

  let res = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (res.status === 401 && getRefreshToken()) {
    const r = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: getRefreshToken() }),
    });
    if (r.ok) {
      const t = await r.json();
      setTokens(t.access_token, t.refresh_token);
      const retryHeaders = new Headers(init.headers);
      retryHeaders.set('Authorization', `Bearer ${t.access_token}`);
      res = await fetch(`${API_URL}${path}`, { ...init, headers: retryHeaders });
    } else {
      clearTokens();
    }
  }
  return res;
}
