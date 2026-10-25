import { DayDetail } from '../components/DayDetail.tsx';
import { TypePill } from '../components/TypePill.tsx';
import type { Day, Week } from '../lib/types.ts';

export function Today({ today, day, week, completed, onToggle }: { today: string; day?: Day; week?: Week; completed: Record<string, boolean>; onToggle: (id: string) => void }) {
  if (!day || !week) return <section><p className="eyebrow">TODAY</p><h2>Season complete</h2><p>No session is planned for {today}. Open the <a href="#calendar">calendar</a> to browse the plan.</p></section>;
  return <section className="today">
    <div className="today-head"><div className="dateline"><span>{day.dow} {day.date}</span><span>·</span><span>{week.label}</span><TypePill type={day.type} /></div>
      <h2>{day.title}</h2><p className="target">{day.duration} · RPE {day.rpe}</p></div>
    <button className={`done-button${completed[day.id] ? ' primary' : ''}`} onClick={() => onToggle(day.id)} aria-pressed={!!completed[day.id]}>{completed[day.id] ? 'Done ✓' : 'Mark as done'}</button>
    <div className="day-card" style={{ borderColor: 'var(--border)' }}><DayDetail day={day} completed={completed} onToggle={onToggle} showDone={false} /></div>
    <div className="callout"><b>{week.phase} · {week.dates}</b><p>{week.focus}</p></div>
    <p className="muted">{week.gate || 'Train as written. Only pain that changes how you move, illness or fever changes the session.'}</p>
  </section>;
}
