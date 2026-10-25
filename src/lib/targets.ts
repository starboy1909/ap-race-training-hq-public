import type { Day, Week } from './types.ts';
import { dateOf, daysBetween } from './dates.ts';

const PACE = /(\d:\d\d(?:[–-]\d:\d\d)?\/km)/;
const firstItem = (day: Day, test: (label: string) => boolean) => day.blocks?.find(b => test(b.label))?.items[0];

// The one line that says what today has to hit. Extraction only; nothing is invented.
export function targetLine(day: Day): string {
  const t = day.type;
  if (t === 'QUALITY' || t === 'RACE' || t === 'HYROX') {
    const main = firstItem(day, l => /MAIN SET|ROUNDS|RACE PLAN|SHARPEN|FULL SIMULATION|RUN IT AS TRAINING|TREADMILL/.test(l));
    if (main) return main;
  }
  if (t === 'EASY' || t === 'LONG' || t === 'RUN') {
    const run = firstItem(day, l => /RUN|TREADMILL/.test(l));
    const pace = run?.match(PACE)?.[1];
    const km = day.title.match(/(\d+(?:\.\d+)?) km/)?.[1];
    if (km && pace) return `${km} km · ${run!.includes('no faster') ? 'no faster than ' : ''}${pace}`;
    if (run) return run;
  }
  if (t === 'STRENGTH') {
    const a = firstItem(day, l => /^A ·|DUMBBELLS|FAMILIAR LOADS/.test(l));
    if (a) return a;
  }
  if (t === 'REST') return 'Rest';
  const any = day.blocks?.[0]?.items[0];
  return any ?? `${day.duration} · RPE ${day.rpe}`;
}

export const isKey = (day: Day) => day.type === 'QUALITY' || day.type === 'HYROX' || day.type === 'RACE';

export function nextKeySession(days: Day[], today: string): Day | undefined {
  return days.find(d => dateOf(d) > today && isKey(d));
}

export function trackOptionLine(day: Day): string | undefined {
  return day.blocks?.find(b => b.label === 'TRACK OPTION')?.items[0].split('. ')[0];
}

export function daysToRace(today: string, race?: Day): number | undefined {
  return race?.iso ? daysBetween(today, race.iso) : undefined;
}

export function weekProgress(week: Week, completed: Record<string, boolean>): number {
  return week.days.filter(d => completed[d.id]).length;
}
