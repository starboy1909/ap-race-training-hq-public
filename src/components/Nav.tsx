import type { Tab } from '../lib/route.ts';

const ICONS: Record<Tab, string> = {
  today: 'M4 5h16v15H4z M4 10h16 M8 3v4 M16 3v4 M9 15l2 2 4-4',
  calendar: 'M4 5h16v15H4z M4 10h16 M8 3v4 M16 3v4 M8 14h2 M12 14h2 M16 14h2',
  profile: 'M4 19l5-7 4 4 7-10 M4 19h16',
  races: 'M5 21V4 M5 4h12l-2 4 2 4H5',
  more: 'M5 12h.01 M12 12h.01 M19 12h.01',
};
const LABELS: Record<Tab, string> = { today: 'Today', calendar: 'Calendar', profile: 'Profile', races: 'Races', more: 'More' };

export function Nav({ current }: { current: Tab }) {
  return <nav className="nav" aria-label="Main navigation">{(Object.keys(LABELS) as Tab[]).map(tab =>
    <a key={tab} href={`#${tab}`} aria-current={current === tab ? 'page' : undefined}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d={ICONS[tab]} /></svg>{LABELS[tab]}
    </a>)}</nav>;
}
