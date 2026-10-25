import { dateOf } from '../lib/dates.ts';
import { dayStatus, dayPlannedKm } from '../lib/calendar.ts';
import { TypePill } from './TypePill.tsx';
import type { Day, LoggedEntry } from '../lib/types.ts';

export function DayRow({ day, completed, index, selected, onSelect }: { day: Day; completed: Record<string, boolean>; index: Map<string, LoggedEntry[]>; selected: boolean; onSelect: (iso: string) => void }) {
  const status = dayStatus(day, completed, index); const km = dayPlannedKm(day);
  return <button className={`day-row${selected ? ' selected' : ''}`} onClick={() => onSelect(dateOf(day))} aria-pressed={selected}>
    <span className="date">{day.dow}<b>{day.date}</b></span>
    <span className="day-name"><b>{day.title}</b><small>{day.duration} · RPE {day.rpe}{km ? ` · ${km} km` : ''}{status.includes('done') ? ' · done' : ''}{status.includes('logged') ? ' · logged' : ''}</small></span>
    <TypePill type={day.type} />
  </button>;
}
