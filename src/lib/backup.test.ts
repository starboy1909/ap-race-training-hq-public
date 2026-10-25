import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeBackup, mergeSnapshot, isSnapshotFile } from './backup.ts';

const keys = ['rmr_completed_v4', 'ap_training_checkins_v1', 'ap_training_sessions_v1', 'ap_private_garmin_v1', 'ap_marathon_branch_v1'];
const current = { completed: { 'S20-MON': true }, checkins: [], logs: [{ id: '1', date: '2026-10-01' }], snapshot: {} };

test('mergeBackup keeps current completions and dedups logs by id', () => {
  const v = mergeBackup(keys, current, { version: 1, storage: { rmr_completed_v4: { 'S20-TUE': true }, ap_training_sessions_v1: [{ id: '1', date: 'x' }, { id: '2', date: 'y' }], ap_marathon_branch_v1: 'tokyo' } });
  assert.deepEqual(v.rmr_completed_v4, { 'S20-MON': true, 'S20-TUE': true });
  assert.equal((v.ap_training_sessions_v1 as unknown[]).length, 2);
  assert.equal(v.ap_marathon_branch_v1, 'none');
  assert.equal(v.ap_training_checkins_v1, undefined);
});
test('mergeBackup rejects malformed files', () => {
  assert.throws(() => mergeBackup(keys, current, { version: 2 }), /Backup/);
  assert.throws(() => mergeBackup(keys, current, { version: 1, storage: { rmr_completed_v4: [1] } }), /Completions/);
  assert.throws(() => mergeBackup(keys, current, { version: 1, storage: { ap_training_sessions_v1: {} } }), /Records/);
  assert.throws(() => mergeBackup(keys, current, { version: 1, storage: { ap_marathon_branch_v1: 'mars' } }), /Branch/);
});
test('snapshot merge validates dates and merges activities by id', () => {
  const file = { lastSuccessfulSnapshotAt: '2026-10-01', healthByDate: { '2026-10-01': { sleepHours: 7 } }, activities: [{ id: 1 }] };
  assert.ok(isSnapshotFile(file));
  const merged = mergeSnapshot({ healthByDate: { '2026-09-30': { sleepHours: 6 } }, activities: [{ id: 1 }, { id: 2 }] }, file);
  assert.equal(Object.keys(merged.healthByDate!).length, 2);
  assert.equal(merged.activities!.length, 2);
  assert.throws(() => mergeSnapshot({}, { lastSuccessfulSnapshotAt: 'x', healthByDate: { bad: { a: 1 } } }), /Health/);
});
