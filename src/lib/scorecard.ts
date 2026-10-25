import type { Day, LoggedEntry } from './types.ts';
import { dateOf } from './dates.ts';
import { isKey } from './targets.ts';
import { parsePace } from './calendar.ts';

export type Verdict = 'hit' | 'hold' | 'repeat' | 'logged';
export type Score = { date: string; title: string; target: string; actual: string; verdict: Verdict; reason: string };

const paceSec = (s: string) => { const m = s.match(/(\d):(\d\d)/); return m ? Number(m[1]) * 60 + Number(m[2]) : undefined; };
// "0.8@4:52 0.8@4:51" | "1.0@4:29 0.76@4:39 | 1.0@4:59" | "4:37 / 4:37 / 4:33"
export function repPaces(reps?: string): number[] {
  if (!reps) return [];
  return [...reps.matchAll(/(?:@|^|[\s/|])(\d:\d\d)(?=\s|$|\/|\|)/g)].map(m => paceSec(m[1])!).filter(Boolean);
}
export function targetRange(day: Day): [number, number] | undefined {
  const main = day.blocks?.find(b => /MAIN SET/.test(b.label))?.items.join(' ') ?? '';
  const m = main.match(/(\d:\d\d)[–-](\d:\d\d)\/km/); if (m) return [paceSec(m[1])!, paceSec(m[2])!];
  const one = main.match(/at (\d:\d\d)\/km/); if (one) { const p = paceSec(one[1])!; return [p - 5, p + 5]; }
  return undefined;
}
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

export function scoreSession(day: Day, entry: LoggedEntry): Score {
  const paces = repPaces(entry.reps); const range = targetRange(day);
  const avg = paces.length ? paces.reduce((a, b) => a + b, 0) / paces.length : parsePace(entry.pace) ? parsePace(entry.pace)! * 60 : undefined;
  const actual = paces.length ? `${paces.map(fmt).join(' / ')} · avg ${fmt(avg!)}` : entry.pace ?? (entry.stations ? `stations ${entry.stations}` : entry.minutes ? `${Math.round(entry.minutes)} min` : 'logged');
  if (!range || avg === undefined) return { date: entry.date, title: day.title, target: range ? `${fmt(range[0])}–${fmt(range[1])}/km` : day.title, actual, verdict: 'logged', reason: 'No rep paces or no pace target to compare.' };
  const target = `${fmt(range[0])}–${fmt(range[1])}/km`;
  const fade = paces.length > 1 ? paces[paces.length - 1] - paces[0] : 0;
  const rpeOk = entry.rpe === undefined || entry.rpe <= 7;
  const allIn = paces.length ? paces.every(p => p >= range[0] - 3 && p <= range[1] + 3) : avg >= range[0] && avg <= range[1];
  if (fade > 10) return { date: entry.date, title: day.title, target, actual, verdict: 'repeat', reason: avg < range[0] - 3 ? `Rep 1 was faster than the band and the last rep was ${Math.round(fade)} sec/km slower: repeat the band with rep 1 at the slow end.` : `Last rep ${Math.round(fade)} sec/km slower than the first; repeat this pace.` };
  if (avg < range[0] - 3) return { date: entry.date, title: day.title, target, actual, verdict: 'hold', reason: `Faster than the target band${rpeOk ? '' : ' at RPE above 7'}; hold the band, race day confirms the next step.` };
  if (allIn && rpeOk) return { date: entry.date, title: day.title, target, actual, verdict: 'hit', reason: 'Every rep on target; next session of this type can be 5 sec/km faster after two weeks.' };
  return { date: entry.date, title: day.title, target, actual, verdict: 'hold', reason: allIn ? 'On target but RPE above 7; hold.' : 'Some reps outside the band; hold the pace.' };
}

export function scorecard(days: Day[], index: Map<string, LoggedEntry[]>, limit = 8): Score[] {
  const out: Score[] = [];
  for (const d of [...days].reverse()) {
    if (!isKey(d)) continue; const iso = dateOf(d);
    const e = index.get(iso)?.find(x => x.kind === 'run' || x.kind === 'hyrox'); if (!e) continue;
    out.push(scoreSession(d, e)); if (out.length >= limit) break;
  }
  return out;
}
