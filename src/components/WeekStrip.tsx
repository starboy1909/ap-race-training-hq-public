import { useRef } from 'react';
import { dateOf } from '../lib/dates.ts';
import { dayStatus } from '../lib/calendar.ts';
import { typeColour } from './TypePill.tsx';
import type { Day, Week, LoggedEntry } from '../lib/types.ts';

type Props = { week: Week; today: string; selected: string; completed: Record<string, boolean>; index: Map<string, LoggedEntry[]>; onSelect: (iso: string) => void; onPrev: () => void; onNext: () => void };

export function WeekStrip({ week, today, selected, completed, index, onSelect, onPrev, onNext }: Props) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => { start.current = { x: e.clientX, y: e.clientY }; };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!start.current) return; const dx = e.clientX - start.current.x, dy = e.clientY - start.current.y; start.current = null;
    if (Math.abs(dx) > 48 && Math.abs(dy) < 40) (dx < 0 ? onNext : onPrev)();
  };
  const onKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'ArrowLeft') onPrev(); if (e.key === 'ArrowRight') onNext(); };
  return <div className="week-strip" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onKeyDown={onKeyDown} role="group" aria-label={`Week ${week.label}, ${week.dates}`}>
    <button className="ghost strip-arrow" onClick={onPrev} aria-label="Previous week">‹</button>
    <div className="strip-days">{week.days.map((d: Day) => {
      const iso = dateOf(d); const status = dayStatus(d, completed, index); const travel = !!d.travel;
      return <button key={d.id} className={`strip-day${iso === selected ? ' selected' : ''}${iso === today ? ' today' : ''}${travel ? ' travel' : ''}`} onClick={() => onSelect(iso)} aria-pressed={iso === selected} aria-label={`${d.dow} ${d.date}: ${d.title}${status.includes('done') ? ', done' : ''}${status.includes('logged') ? ', logged' : ''}`}>
        <span className="dow">{d.dow.slice(0, 1)}</span><span className="num">{d.date.split(' ')[0]}</span>
        <span className="bar" style={{ background: typeColour(d.type) }} />
        <span className="marks">{status.includes('done') && <span className="tick">✓</span>}{status.includes('logged') && <span className="dot" />}{d.race && <span className="flag">⚑</span>}</span>
      </button>;
    })}</div>
    <button className="ghost strip-arrow" onClick={onNext} aria-label="Next week">›</button>
  </div>;
}
