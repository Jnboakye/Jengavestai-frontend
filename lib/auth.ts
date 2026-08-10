// Minimal demo auth backed by localStorage (no real accounts / sessions yet).

const USER_KEY = 'jengavest.user';

export function getUser(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(USER_KEY);
  } catch {
    return null;
  }
}

export function setUser(name: string): void {
  try {
    localStorage.setItem(USER_KEY, name);
  } catch {
    /* ignore */
  }
}

export function clearUser(): void {
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
}
