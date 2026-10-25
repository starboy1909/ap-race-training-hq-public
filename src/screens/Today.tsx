import { DayDetail } from '../components/DayDetail.tsx';
import { TypePill } from '../components/TypePill.tsx';
import { Logged } from '../components/Logged.tsx';
import { targetLine, nextKeySession, trackOptionLine, daysToRace } from '../lib/targets.ts';
import { plannedKmRange, weekActualKm, weekRange } from '../lib/calendar.ts';
import { shiftIso, fmtShort } from '../lib/dates.ts';
import type { Day, Week, LoggedEntry } from '../lib/types.ts';

type Props = { today: string; day?: Day; week?: Week; days: Day[]; nextRace?: Day; completed: Record<string, boolean>; index: Map<string, LoggedEntry[]>; onToggle: (id: string) => void };

export function Today({ today, day, week, days, nextRace, completed, index, onToggle }: Props) {
  if (!day || !week) return <section><p className="eyebrow">TODAY</p><h2>Season complete</h2><p>No session is planned for {today}. Open the <a href="#calendar">calendar</a> to browse the plan.</p></section>;
  const next = nextKeySession(days, today); const toRace = daysToRace(today, nextRace); const track = trackOptionLine(day);
  const range = plannedKmRange(week.volume); const actual = weekActualKm(index, weekRange(week));
  const logged = [...(index.get(today) ?? []), ...(index.get(shiftIso(today, -1)) ?? [])];
  const done = !!completed[day.id];
  return <section className="today">
    <div className="today-head"><div className="dateline"><span>{day.dow} {day.date}</span><span>·</span><span>{week.phase}</span><TypePill type={day.type} /></div>
      <h2>{day.title}</h2><p className="target">{targetLine(day)}</p><p className="muted">{day.duration} · RPE {day.rpe}</p></div>
    <div className="chips">
      {nextRace && toRace !== undefined && <a className="chip accent" href="#races">{nextRace.title.split(' · ')[0].replace('JPMorganChase Corporate Challenge', 'JPM 5.6K')} in {toRace} day{toRace === 1 ? '' : 's'}</a>}
      {next && <a className="chip" href={`#calendar/${next.iso}`}>Next key: {fmtShort(next.iso!)} · {next.title}</a>}
      {track && <span className="chip">{track}</span>}
    </div>
    <button className={`done-button${done ? ' primary' : ''}`} onClick={() => onToggle(day.id)} aria-pressed={done}>{done ? 'Done ✓' : 'Mark as done'}</button>
    <div className="day-card"><DayDetail day={day} completed={completed} onToggle={onToggle} showDone={false} /></div>
    <Logged entries={logged} title="Logged · today and yesterday" />
    <div className="callout"><b>{week.label} · {week.dates}</b><p>{week.focus}</p><p className="muted">{week.days.filter(d => completed[d.id]).length} / 7 marked{range ? ` · ${actual} km logged of ${range.min}–${range.max} km` : ''} · <a href="#calendar">open the week</a></p></div>
    <p className="muted">{week.gate || 'Train as written. Only pain that changes how you move, illness or fever changes the session.'}</p>
  </section>;
}
