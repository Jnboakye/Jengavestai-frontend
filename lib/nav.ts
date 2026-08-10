// Maps the internal page ids used by components to real routes.

const ROUTES: Record<string, string> = {
  dashboard: '/dashboard',
  markets: '/markets',
  portfolio: '/portfolio',
  analyst: '/ai-agent',
  news: '/news',
  documents: '/documents',
  history: '/history',
  settings: '/settings',
};

export function routeFor(id: string): string {
  return ROUTES[id] ?? '/dashboard';
}
