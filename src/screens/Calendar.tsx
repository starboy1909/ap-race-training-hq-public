import { useEffect, useState } from 'react';
import { DayDetail } from '../components/DayDetail.tsx';
import { DayRow } from '../components/DayRow.tsx';
import { WeekStrip } from '../components/WeekStrip.tsx';
import { WeekHeader } from '../components/WeekHeader.tsx';
import { Logged } from '../components/Logged.tsx';
import { TypePill } from '../components/TypePill.tsx';
import { targetLine } from '../lib/targets.ts';
import { dateOf } from '../lib/dates.ts';
import { findWeekForDate } from '../lib/calendar.ts';
import type { Week, LoggedEntry, Route } from '../lib/types.ts';

type Props = { weeks: Week[]; today: string; routeDate?: string; completed: Record<string, boolean>; index: Map<string, LoggedEntry[]>; onToggle: (id: string) => void; navigate: (r: Route, opts?: { replace?: boolean }) => void };

export function Calendar({ weeks, today, routeDate, completed, index, onToggle, navigate }: Props) {
  const first = dateOf(weeks[0].days[0]), last = dateOf(weeks[weeks.length - 1].days[6]);
  const initial = routeDate ?? (today >= first && today <= last ? today : last);
  const [selected, setSelected] = useState(initial);
  useEffect(() => { if (routeDate && routeDate !== selected) setSelected(routeDate); }, [routeDate]); // eslint-disable-line react-hooks/exhaustive-deps
  const week = findWeekForDate(weeks, selected) ?? weeks[weeks.length - 1];
  const i = weeks.indexOf(week);
  const day = week.days.find(d => dateOf(d) === selected) ?? week.days[0];
  const select = (iso: string) => { setSelected(iso); navigate({ tab: 'calendar', date: iso }, { replace: true }); };
  const goWeek = (n: number) => { const w = weeks[i + n]; if (w) select(dateOf(w.days[0])); };
  return <section>
    <div className="section-head"><div><p className="eyebrow">CALENDAR</p><h2>{week.label} · {week.dates}</h2></div><button onClick={() => select(today)}>Today</button></div>
    <WeekStrip week={week} today={today} selected={selected} completed={completed} index={index} onSelect={select} onPrev={() => goWeek(-1)} onNext={() => goWeek(1)} />
    <WeekHeader week={week} completed={completed} index={index} />
    <div className="day-card selected-day"><div className="selected-head"><div className="dateline"><span>{day.dow} {day.date}</span><TypePill type={day.type} /></div><h3>{day.title}</h3><p className="target">{targetLine(day)}</p><p className="muted">{day.duration} · RPE {day.rpe}</p></div>
      <DayDetail day={day} completed={completed} onToggle={onToggle} />
      {(index.get(selected)?.length ?? 0) > 0 && <Logged entries={index.get(selected)!} title="Logged this day" />}
    </div>
    <div className="day-list">{week.days.map(d => <DayRow key={d.id} day={d} completed={completed} index={index} selected={dateOf(d) === selected} onSelect={select} />)}</div>
    <div className="controls"><label>Jump to week<select value={week.id} onChange={e => { const w = weeks.find(x => x.id === e.target.value); if (w) select(dateOf(w.days[0])); }}>{weeks.map(w => <option key={w.id} value={w.id}>{w.label} · {w.dates} · {w.phase}</option>)}</select></label></div>
    <div className="callout"><b>The one gate</b><p>{week.gate || 'Historical prescriptions and verified workout details are preserved. A checkbox is your own log; it does not prove a synced completion.'}</p></div>
  </section>;
}
