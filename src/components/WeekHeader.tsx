import { plannedKmRange, weekActualKm, weekRange } from '../lib/calendar.ts';
import type { Week, LoggedEntry } from '../lib/types.ts';

export function WeekHeader({ week, completed, index }: { week: Week; completed: Record<string, boolean>; index: Map<string, LoggedEntry[]> }) {
  const range = plannedKmRange(week.volume); const actual = weekActualKm(index, weekRange(week));
  const pct = range ? Math.min(100, Math.round((actual / range.max) * 100)) : 0;
  const marked = week.days.filter(d => completed[d.id]).length;
  return <div className="week-heading"><div style={{ minWidth: 0, flex: 1 }}><span className="tag">{week.phase}</span><p>{week.focus}</p>
    {range && <div className="km-bar" aria-label={`${actual} km logged of ${range.min}–${range.max} km planned`}><div className="km-fill" style={{ width: `${pct}%` }} /><span>{actual} of {range.min === range.max ? range.min : `${range.min}–${range.max}`} km{range.note ? ` ${range.note}` : ''}</span></div>}
  </div><strong>{marked}<small> / 7 marked</small></strong></div>;
}
