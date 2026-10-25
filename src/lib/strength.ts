import type { StrengthEntry, StrengthSet } from './types.ts';

export type Lift = { key: string; label: string; match: RegExp; unit?: 'reps' | 'm' };
export const LIFTS: Lift[] = [
  { key: 'squat', label: 'Back squat', match: /^(back )?squat/i },
  { key: 'frontSquat', label: 'Front squat', match: /^front squat/i },
  { key: 'rdl', label: 'Romanian deadlift', match: /^romanian deadlift|^rdl|^deadlift/i },
  { key: 'legCurl', label: 'Leg curl', match: /leg curl/i },
  { key: 'lunge', label: 'Sandbag lunge', match: /lunge/i, unit: 'm' },
  { key: 'wallBall', label: 'Wall balls', match: /^wall ball/i, unit: 'reps' },
  { key: 'farmers', label: 'Farmers carry', match: /^farmers carry/i, unit: 'm' },
  { key: 'calf', label: 'Standing calf raise', match: /^standing calf/i },
  { key: 'chestPress', label: 'Chest press', match: /chest press|multi press incline|bench press/i },
  { key: 'row', label: 'Row', match: /row/i },
  { key: 'pulldown', label: 'Lat pulldown', match: /^(panatta )?lat pulldown/i },
  { key: 'shoulderPress', label: 'Shoulder press', match: /shoulder press|press shoulders/i },
];

export function normaliseLift(name: string): Lift | undefined { return LIFTS.find(l => l.match.test(name.trim())); }

export function topSet(sets: StrengthSet[]): StrengthSet | undefined {
  return [...sets].sort((a, b) => (b.kg ?? 0) - (a.kg ?? 0) || b.reps - a.reps)[0];
}

// Epley estimate, labelled "est." on the page.
export const e1rm = (kg: number, reps: number) => Math.round(kg * (1 + reps / 30));

export type LiftPoint = { date: string; kg?: number; reps: number; sets: StrengthSet[]; name: string };
export function liftSeries(entries: StrengthEntry[], key: string): LiftPoint[] {
  const lift = LIFTS.find(l => l.key === key); if (!lift) return [];
  const out: LiftPoint[] = [];
  for (const e of entries) for (const x of e.exercises) {
    if (normaliseLift(x.name)?.key !== key) continue;
    const t = topSet(x.sets); if (!t) continue;
    out.push({ date: e.date, kg: t.kg, reps: t.reps, sets: x.sets, name: x.name });
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

// The plan's progression rule: add 2.5 kg when every working set is clean with 2 reps in reserve.
// From the log we can only check that every set reached the target reps at the working load.
export function progressionReady(sets: StrengthSet[], workingKg: number, targetReps: number): boolean {
  const working = sets.filter(s => (s.kg ?? 0) >= workingKg);
  return working.length >= 3 && working.every(s => s.reps >= targetReps);
}
