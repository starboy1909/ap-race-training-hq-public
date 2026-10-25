import type { Day } from './types.ts';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export function todayIso(timeZone = 'Asia/Hong_Kong', now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone }).format(now);
}

// Legacy days before the cutover have no iso; their "05 OCT" date is in 2026.
export function dateOf(d: Pick<Day, 'iso' | 'date'>): string {
  if (d.iso) return d.iso;
  const [day, mon] = d.date.split(' ');
  return `2026-${String(MONTHS.indexOf(mon) + 1).padStart(2, '0')}-${day.padStart(2, '0')}`;
}

const noon = (iso: string) => new Date(`${iso}T12:00:00Z`);
const toIso = (d: Date) => d.toISOString().slice(0, 10);

export function shiftIso(iso: string, days: number): string {
  const d = noon(iso); d.setUTCDate(d.getUTCDate() + days); return toIso(d);
}
export function daysBetween(fromIso: string, toIso2: string): number {
  return Math.round((noon(toIso2).getTime() - noon(fromIso).getTime()) / 86400000);
}
// Monday of the week containing iso.
export function mondayOf(iso: string): string {
  const dow = (noon(iso).getUTCDay() + 6) % 7; return shiftIso(iso, -dow);
}
export function fmtShort(iso: string): string {
  return noon(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
}
export function fmtDay(iso: string): string {
  return noon(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}
export function fmtLong(iso: string): string {
  return noon(iso).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
