import type { Completion, StrengthEntry, ManualLog, LoggedEntry, Week, Day } from './types.ts';
import { dateOf } from './dates.ts';

// "1:01:45" -> 61.75, "45:00" -> 45, "17:45" -> 17.75 (m:ss when under three parts and the first part is small)
export function parseDuration(time?: string): number | undefined {
  if (!time) return undefined;
  const parts = time.split(':').map(Number);
  if (parts.some(n => Number.isNaN(n))) return undefined;
  if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60;
  if (parts.length === 2) return parts[0] + parts[1] / 60;
  return undefined;
}

export function parsePace(pace?: string): number | undefined {
  const m = pace?.match(/(\d{1,2}):(\d{2})\s*\/km/);
  return m ? Number(m[1]) + Number(m[2]) / 60 : undefined;
}

const kindOf = (c: Completion): LoggedEntry['kind'] => (c.type === 'hyrox' || c.type === 'ride' || c.type === 'strength') ? c.type : 'run';
const sourceLabel = (s?: string) => s === 'self-reported' ? 'Self-reported' : s === 'strava' ? 'Strava' : s ? s : 'Sync';

export function indexLogsByDate(completions: Completion[], strength: StrengthEntry[], manual: ManualLog[] = []): Map<string, LoggedEntry[]> {
  const index = new Map<string, LoggedEntry[]>();
  const push = (e: LoggedEntry) => { const list = index.get(e.date) ?? []; list.push(e); index.set(e.date, list); };
  for (const c of completions) {
    push({ date: c.date, kind: kindOf(c), source: sourceLabel(c.source), title: c.title, planned: c.planned, km: c.distanceKm, minutes: parseDuration(c.time), pace: c.pace, avgHr: c.avgHr, maxHr: c.maxHr, reps: c.reps, stations: c.stations, note: c.note });
  }
  for (const s of strength) {
    const sets = s.exercises.reduce((n, x) => n + x.sets.length, 0);
    const detail = s.exercises.map(x => `${x.name} ${topSetLabel(x.sets)}`).join(' · ');
    const existing = index.get(s.date)?.find(e => e.kind === 'strength' && e.source !== 'Strong');
    if (existing) { existing.sets = sets; existing.detail = detail; existing.source = `${existing.source} + Strong`; }
    else push({ date: s.date, kind: 'strength', source: 'Strong', title: s.session, sets, detail, note: s.note });
  }
  for (const m of manual) {
    const date = String(m.date ?? ''); if (!date) continue;
    push({ date, kind: 'manual', source: 'Manual', title: String(m.slot ?? 'Session'), minutes: Number(m.minutes) || undefined, rpe: Number(m.rpe) || undefined, detail: m.details ? String(m.details) : undefined });
  }
  for (const list of index.values()) list.sort((a, b) => a.kind.localeCompare(b.kind));
  return index;
}

export function topSetLabel(sets: { kg?: number; reps: number }[]): string {
  const best = [...sets].sort((a, b) => (b.kg ?? 0) - (a.kg ?? 0) || b.reps - a.reps)[0];
  if (!best) return '';
  return best.kg !== undefined && best.kg > 0 ? `${best.kg} kg × ${best.reps}` : `${best.reps} reps`;
}

// "Target 38–42 km" | "25–30 km" | "27 km completed" | "18 km + race" | "22–25 km incl. races" | "35–40 km (treadmill)"
export function plannedKmRange(volume?: string): { min: number; max: number; note?: string } | undefined {
  if (!volume) return undefined;
  const m = volume.match(/(\d+(?:\.\d+)?)\s*(?:[–-]\s*(\d+(?:\.\d+)?))?\s*km/);
  if (!m) return undefined;
  const min = Number(m[1]), max = m[2] ? Number(m[2]) : min;
  const note = /\+ ?race|incl\. races/.test(volume) ? '+ race' : /treadmill/.test(volume) ? 'treadmill' : undefined;
  return { min, max, note };
}

export const dayPlannedKm = (day: Pick<Day, 'title'>): number | undefined => {
  const m = day.title.match(/(\d+(?:\.\d+)?) km/); return m ? Number(m[1]) : undefined;
};

export const weekRange = (week: Week): [string, string] => [dateOf(week.days[0]), dateOf(week.days[6])];

export function weekActualKm(index: Map<string, LoggedEntry[]>, [from, to]: [string, string]): number {
  let km = 0;
  for (const [date, list] of index) if (date >= from && date <= to) for (const e of list) if ((e.kind === 'run' || e.kind === 'hyrox') && e.km) km += e.km;
  return Math.round(km * 100) / 100;
}

export function findWeekForDate(weeks: Week[], iso: string): Week | undefined {
  return weeks.find(w => w.days.some(d => dateOf(d) === iso));
}

export type DayStatus = 'done+logged' | 'done' | 'logged' | 'planned' | 'rest';
export function dayStatus(day: Day, completed: Record<string, boolean>, index: Map<string, LoggedEntry[]>): DayStatus {
  const done = !!completed[day.id];
  const logged = (index.get(dateOf(day))?.length ?? 0) > 0;
  if (done && logged) return 'done+logged';
  if (done) return 'done';
  if (logged) return 'logged';
  return day.type === 'REST' || day.type === 'RECOVERY' ? 'rest' : 'planned';
}
