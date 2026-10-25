import type { LoggedEntry, Week } from './types.ts';
import { shiftIso, mondayOf } from './dates.ts';
import { parsePace, plannedKmRange, weekActualKm, weekRange } from './calendar.ts';

// Estimated training load. Stated on the Profile page: these are estimates from the public log,
// not device values. HR_REST and HR_MAX are assumptions (highest logged maxHr is 190).
export const HR_REST = 55;
export const HR_MAX = 190;
export const DEFAULT_MINUTES: Record<string, number> = { run: 50, hyrox: 60, strength: 60, ride: 45, manual: 45 };
export const TYPE_FRACTION: Record<string, number> = { strength: 0.55, ride: 0.55, easy: 0.65, run: 0.65, long: 0.68, hyrox: 0.82, quality: 0.80, race: 0.90, recovery: 0.50, manual: 0.65 };
export type Basis = 'hr' | 'rpe' | 'type';
export type SessionLoad = { date: string; load: number; minutes: number; basis: Basis; durationEstimated: boolean; kind: string; title: string };

const subtype = (e: LoggedEntry): string => {
  if (e.kind !== 'run') return e.kind;
  const p = (e.planned ?? '').toLowerCase();
  if (/race/.test(p) && !/race pace|race-practice|race loads/.test(p)) return 'race';
  if (/long/.test(p)) return 'long';
  if (/threshold|tempo|5k pace|interval|benchmark|×|x \d|repeats|miles|drop set|over and unders|on\/off|400s|speed/.test(p)) return 'quality';
  return 'easy';
};

export function sessionLoad(e: LoggedEntry): SessionLoad {
  let minutes = e.minutes, durationEstimated = false;
  if (minutes === undefined && e.km !== undefined) { const pace = parsePace(e.pace); if (pace) minutes = e.km * pace; }
  if (minutes === undefined) { minutes = DEFAULT_MINUTES[e.kind] ?? 45; durationEstimated = true; }
  let f: number, basis: Basis;
  if (e.avgHr) { f = (e.avgHr - HR_REST) / (HR_MAX - HR_REST); basis = 'hr'; }
  else if (e.rpe !== undefined) { f = 0.45 + 0.05 * e.rpe; basis = 'rpe'; }
  else { f = TYPE_FRACTION[subtype(e)] ?? 0.65; basis = 'type'; }
  f = Math.min(1, Math.max(0.3, f));
  const load = minutes * f * 0.64 * Math.exp(1.92 * f);
  return { date: e.date, load: Math.round(load * 10) / 10, minutes, basis, durationEstimated, kind: e.kind, title: e.title };
}

// One load per logged session. A manual entry is skipped when a synced entry exists that day,
// unless it was logged as Unplanned. A self-reported run on a day with a synced run of the same
// session (same date, both runs, one self-reported) counts once.
export function sessionLoads(index: Map<string, LoggedEntry[]>): SessionLoad[] {
  const out: SessionLoad[] = [];
  for (const [, list] of index) {
    const synced = list.filter(e => e.kind !== 'manual');
    const hasSyncedRun = synced.some(e => e.kind === 'run' && e.source !== 'Self-reported');
    for (const e of list) {
      if (e.kind === 'manual' && synced.length && e.title !== 'Unplanned') continue;
      if (e.kind === 'run' && e.source === 'Self-reported' && hasSyncedRun) continue;
      out.push(sessionLoad(e));
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

export type LoadPoint = { date: string; load: number; ctl: number; atl: number; tsb: number };
const K_CTL = 1 - Math.exp(-1 / 42), K_ATL = 1 - Math.exp(-1 / 7);

export function fitnessSeries(loads: SessionLoad[], to: string): LoadPoint[] {
  if (!loads.length) return [];
  const from = loads[0].date;
  const daily = new Map<string, number>();
  for (const l of loads) daily.set(l.date, (daily.get(l.date) ?? 0) + l.load);
  const days: string[] = []; for (let d = from; d <= to; d = shiftIso(d, 1)) days.push(d);
  const seedDays = days.slice(0, 14); const seed = seedDays.reduce((s, d) => s + (daily.get(d) ?? 0), 0) / Math.max(1, seedDays.length);
  let ctl = seed, atl = seed; const out: LoadPoint[] = [];
  for (const d of days) {
    const tsb = ctl - atl; const load = daily.get(d) ?? 0;
    ctl += (load - ctl) * K_CTL; atl += (load - atl) * K_ATL;
    out.push({ date: d, load: Math.round(load), ctl: Math.round(ctl * 10) / 10, atl: Math.round(atl * 10) / 10, tsb: Math.round(tsb * 10) / 10 });
  }
  return out;
}

export function basisCounts(loads: SessionLoad[]): Record<Basis, number> & { estimatedDurations: number } {
  const c = { hr: 0, rpe: 0, type: 0, estimatedDurations: 0 };
  for (const l of loads) { c[l.basis]++; if (l.durationEstimated) c.estimatedDurations++; }
  return c;
}

export type WeekKm = { weekId: string; label: string; mondayIso: string; actualKm: number; planned?: { min: number; max: number } };
export function weeklyKmSeries(index: Map<string, LoggedEntry[]>, weeks: Week[], today: string, n = 12): WeekKm[] {
  const monday = mondayOf(today);
  const out: WeekKm[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const m = shiftIso(monday, -7 * i); const week = weeks.find(w => weekRange(w)[0] === m);
    const range: [string, string] = [m, shiftIso(m, 6)];
    const planned = plannedKmRange(week?.volume);
    out.push({ weekId: week?.id ?? m, label: week?.label ?? m.slice(5), mondayIso: m, actualKm: weekActualKm(index, range), planned: planned ? { min: planned.min, max: planned.max } : undefined });
  }
  return out;
}
