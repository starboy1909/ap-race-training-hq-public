import type { Day, Week } from '../trainingHistory';
export type { Day, Week };

export type Completion = { date: string; type?: string; source?: string; planned: string; title: string; distanceKm?: number; time?: string; pace?: string; avgHr?: number; maxHr?: number; reps?: string; stations?: string; note?: string };
export type StrengthSet = { kg?: number; reps: number };
export type StrengthEntry = { date: string; session: string; exercises: { name: string; sets: StrengthSet[] }[]; note?: string };
export type ManualLog = Record<string, string | number>;
export type LogKind = 'run' | 'hyrox' | 'ride' | 'strength' | 'manual';
export type LoggedEntry = {
  date: string; kind: LogKind; source: string; title: string; planned?: string;
  km?: number; minutes?: number; pace?: string; avgHr?: number; maxHr?: number;
  reps?: string; stations?: string; note?: string; sets?: number; rpe?: number; detail?: string;
};
export type Snapshot = { lastSuccessfulSnapshotAt?: string; healthByDate?: Record<string, Record<string, number>>; activities?: Record<string, unknown>[]; supplementPurchases?: { product: string; purchased: string; use: string }[] };
