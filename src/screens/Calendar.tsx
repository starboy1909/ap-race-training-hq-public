import { useState } from 'react';
import { DayCard } from '../components/DayDetail.tsx';
import { dateOf } from '../lib/dates.ts';
import type { Week } from '../lib/types.ts';

export function Calendar({ weeks, today, current, completed, onToggle }: { weeks: Week[]; today: string; current: Week; completed: Record<string, boolean>; onToggle: (id: string) => void }) {
  const [weekId, setWeekId] = useState(current.id);
  const week = weeks.find(w => w.id === weekId) || current;
  const i = weeks.indexOf(week);
  return <section>
    <div className="section-head"><div><p className="eyebrow">CALENDAR</p><h2>Your daily prescription</h2><p>Primary training first. Open a day for exercises, pace, load, rest and an optional second session.</p></div><button onClick={() => setWeekId(current.id)}>Today’s week</button></div>
    <div className="controls"><label>Training week<select value={week.id} onChange={e => setWeekId(e.target.value)}>{weeks.map(w => <option key={w.id} value={w.id}>{w.label} · {w.dates} · {w.phase}</option>)}</select></label>
      <div className="inline"><button className="ghost" disabled={i <= 0} onClick={() => setWeekId(weeks[i - 1].id)} aria-label="Previous week">‹ Prev</button><button className="ghost" disabled={i >= weeks.length - 1} onClick={() => setWeekId(weeks[i + 1].id)} aria-label="Next week">Next ›</button></div></div>
    <div className="week-heading"><div><span className="tag">{week.phase}</span><h3>{week.dates}</h3><p>{week.focus}</p></div><strong>{week.days.filter(d => completed[d.id]).length}<small> / 7 marked</small></strong></div>
    <div className="callout"><b>The one gate</b><p>{week.gate || 'Historical prescriptions and verified workout details are preserved. A checkbox is your own log; it does not prove a synced completion.'}</p></div>
    <div className="day-list">{week.days.map(d => <DayCard key={d.id} day={d} completed={completed} onToggle={onToggle} open={dateOf(d) === today} />)}</div>
    <p className="muted">Every key session has a target: pace, load or time. Log what you did; the Sunday review uses it to progress, hold or repeat the next week. Pace and load progressions live in Coaching.</p>
  </section>;
}
