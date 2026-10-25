import type { Day } from '../lib/types.ts';

export function DayDetail({ day, completed, onToggle, showDone = true }: { day: Day; completed: Record<string, boolean>; onToggle: (id: string) => void; showDone?: boolean }) {
  return <div className="day-content">
    {showDone && <label className="inline completion"><input type="checkbox" checked={!!completed[day.id]} onChange={() => onToggle(day.id)} />Primary completed</label>}
    {day.blocks?.map((b, i) => <div className="workout-block" key={i}><h4>{b.label}</h4><ul>{b.items.map((item, j) => <li key={j}>{item}</li>)}</ul></div>)}
    {day.note && <p className="coach-note">{day.note}</p>}
    {day.secondary && <div className="secondary"><p className="eyebrow">SECOND SESSION / OPTIONAL</p><h4>{day.secondary.title}</h4><ul>{day.secondary.items.map(x => <li key={x}>{x}</li>)}</ul>
      {!day.secondary.title.startsWith('No second') && <label className="inline"><input type="checkbox" checked={!!completed[day.id + '-secondary']} onChange={() => onToggle(day.id + '-secondary')} />Optional session completed</label>}</div>}
  </div>;
}

export function DayCard({ day, completed, onToggle, open }: { day: Day; completed: Record<string, boolean>; onToggle: (id: string) => void; open?: boolean }) {
  return <details className="day-card" open={open ? true : undefined}>
    <summary><span className="date">{day.dow}<b>{day.date}</b></span><span className="day-name"><b>{day.title}</b><small>{day.duration} · RPE {day.rpe}{completed[day.id] ? ' · done' : ''}</small></span><span className="expand" aria-hidden="true" /></summary>
    <DayDetail day={day} completed={completed} onToggle={onToggle} />
  </details>;
}
