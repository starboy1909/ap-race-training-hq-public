export type Tab = 'today' | 'calendar' | 'profile' | 'races' | 'more';
export type Route = { tab: Tab; sub?: string; date?: string };

const ALIASES: Record<string, string> = { plan: 'calendar', training: 'calendar', results: 'profile/results', records: 'more/records', coach: 'more/coach', coaching: 'more/coach', season: 'more/season' };
const TABS: Tab[] = ['today', 'calendar', 'profile', 'races', 'more'];
const ISO = /^\d{4}-\d{2}-\d{2}$/;

export function parseHash(hash: string): Route {
  let path = hash.replace(/^#\/?/, '').replace(/\/+$/, '');
  if (!path) return { tab: 'today' };
  const [head, ...rest] = path.split('/');
  if (ALIASES[head]) path = [ALIASES[head], ...rest].join('/');
  const [tab, sub] = path.split('/');
  if (!TABS.includes(tab as Tab)) return { tab: 'today' };
  if (tab === 'calendar') return sub && ISO.test(sub) ? { tab, date: sub } : { tab };
  if (tab === 'more') return ['records', 'coach', 'season'].includes(sub) ? { tab, sub } : { tab };
  if (tab === 'profile') return sub === 'results' ? { tab, sub } : { tab };
  return { tab: tab as Tab };
}

export function toHash(route: Route): string {
  if (route.tab === 'calendar' && route.date) return `#calendar/${route.date}`;
  if (route.sub) return `#${route.tab}/${route.sub}`;
  return `#${route.tab}`;
}
