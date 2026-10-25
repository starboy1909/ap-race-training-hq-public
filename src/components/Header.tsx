import { daysBetween, fmtDay } from '../lib/dates.ts';
import type { Day } from '../lib/types.ts';

export function Header({ today, nextRace, reviewed }: { today: string; nextRace?: Day; reviewed: string }) {
  const days = nextRace?.iso ? daysBetween(today, nextRace.iso) : undefined;
  return <header className="header">
    <div><p className="eyebrow">AMAR / ENDURANCE LAB</p><h1>Race &amp; Training HQ</h1><small>Plan reviewed {fmtDay(reviewed)}</small></div>
    {nextRace && <div className="next-race"><small>Next race{days !== undefined && ` · ${days === 0 ? 'today' : `${days} days`}`}</small><b>{nextRace.title.split(' · RACE')[0].replace('JPMorganChase Corporate Challenge','JPM Corporate Challenge')}</b><small>{nextRace.date}</small></div>}
  </header>;
}
