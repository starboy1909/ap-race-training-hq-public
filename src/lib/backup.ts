import type { ManualLog, Snapshot } from './types.ts';

export const BRANCHES = ['none', 'osaka', 'tokyo'];
type Entry = Record<string, unknown>;

export function isSnapshotFile(data: unknown): data is Snapshot {
  const d = data as Snapshot;
  return !!d && typeof d === 'object' && typeof d.lastSuccessfulSnapshotAt === 'string' && !!d.healthByDate && typeof d.healthByDate === 'object' && !Array.isArray(d.healthByDate);
}

export function mergeSnapshot(current: Snapshot, data: Snapshot): Snapshot {
  if (data.activities && !Array.isArray(data.activities)) throw new Error('Activities');
  for (const [date, h] of Object.entries(data.healthByDate ?? {})) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !h || typeof h !== 'object') throw new Error('Health');
  }
  const byId = new Map([...(current.activities || []), ...(data.activities || [])].map(x => [x.id, x]));
  return { ...current, ...data, healthByDate: { ...current.healthByDate, ...data.healthByDate }, activities: [...byId.values()] };
}

export type StoredState = { completed: Record<string, boolean>; checkins: ManualLog[]; logs: ManualLog[]; snapshot: Snapshot };

// Validates a Race HQ backup ({version:1, storage:{...}}) against the current device state and
// returns the merged values per storage key. Throws on a malformed file. Pure: no localStorage.
export function mergeBackup(keys: string[], current: StoredState, data: unknown): Record<string, unknown> {
  const d = data as { version?: number; storage?: Record<string, unknown> };
  if (!d || d.version !== 1 || !d.storage || typeof d.storage !== 'object') throw new Error('Backup');
  const [completedKey, checkinsKey, logsKey, snapshotKey, branchKey] = keys;
  const values: Record<string, unknown> = {};
  for (const key of keys) if (d.storage[key] !== undefined) values[key] = d.storage[key];
  if (values[completedKey] && (typeof values[completedKey] !== 'object' || Array.isArray(values[completedKey]))) throw new Error('Completions');
  for (const k of [checkinsKey, logsKey]) if (values[k] !== undefined && !Array.isArray(values[k])) throw new Error('Records');
  if (values[branchKey] !== undefined && !BRANCHES.includes(String(values[branchKey]))) throw new Error('Branch');
  if (values[branchKey] === 'tokyo') values[branchKey] = 'none';
  if (values[completedKey]) values[completedKey] = { ...current.completed, ...(values[completedKey] as object) };
  for (const key of [checkinsKey, logsKey]) if (Array.isArray(values[key])) {
    const old = key === checkinsKey ? current.checkins : current.logs;
    const map = new Map([...old, ...(values[key] as Entry[])].map(x => [String(x.id || x.checkin_date || JSON.stringify(x)), x]));
    values[key] = [...map.values()];
  }
  if (values[snapshotKey]) {
    const imported = values[snapshotKey] as Snapshot;
    if (typeof imported !== 'object' || (imported.activities && !Array.isArray(imported.activities))) throw new Error('Snapshot');
    values[snapshotKey] = mergeSnapshot(current.snapshot, imported);
  }
  return values;
}
