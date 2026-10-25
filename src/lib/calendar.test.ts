import test from 'node:test';
import assert from 'node:assert/strict';
import { parseDuration, parsePace, indexLogsByDate, plannedKmRange, dayPlannedKm, weekActualKm, dayStatus, topSetLabel } from './calendar.ts';

test('parseDuration handles h:mm:ss, mm:ss and missing', () => {
  assert.equal(parseDuration('1:01:45'), 61.75);
  assert.equal(parseDuration('45:00'), 45);
  assert.equal(parseDuration(undefined), undefined);
  assert.equal(parseDuration('abc'), undefined);
});
test('parsePace reads the first m:ss/km', () => { assert.equal(parsePace('4:26/km avg of the 5 reps'), 4 + 26 / 60); assert.equal(parsePace('—'), undefined); });

const completions = [
  { date: '2026-10-20', type: 'strength', source: 'strava', planned: 'Upper', title: 'Early Morning Workout', time: '50:00' },
  { date: '2026-10-20', type: 'run', source: 'self-reported', planned: 'Bench', title: 'Treadmill 5 × 1 km', reps: '4:37 / 4:37', pace: '4:34/km avg' },
  { date: '2026-10-20', type: 'run', source: 'strava', planned: 'Easy run · 8 km', title: 'Morning Treadmill Run', distanceKm: 8.44, time: '55:01', avgHr: 123 },
  { date: '2026-10-24', type: 'hyrox', source: 'strava', planned: 'HYROX', title: 'Sim', distanceKm: 6.4, time: '1:08:24' },
  { date: '2026-10-23', type: 'ride', source: 'strava', planned: 'Easy', title: 'Ride', distanceKm: 30, time: '1:00:21' },
];
const strength = [{ date: '2026-10-20', session: 'Upper strength', exercises: [{ name: 'Seated cable row', sets: [{ kg: 61, reps: 8 }, { kg: 54, reps: 10 }] }] }, { date: '2026-10-14', session: 'Lower strength', exercises: [{ name: 'Back squat', sets: [{ kg: 65, reps: 3 }] }] }];

test('indexLogsByDate groups unsorted entries and merges Strong into the Strava strength entry', () => {
  const index = indexLogsByDate(completions, strength, [{ date: '2026-10-20', slot: 'Unplanned', minutes: 20, rpe: 3, details: 'walk' }]);
  const day = index.get('2026-10-20')!;
  assert.equal(day.length, 4);
  const str = day.find(e => e.kind === 'strength')!;
  assert.equal(str.sets, 2); assert.equal(str.source, 'Strava + Strong'); assert.match(str.detail!, /Seated cable row 61 kg × 8/);
  assert.equal(day.find(e => e.kind === 'manual')!.minutes, 20);
  assert.equal(index.get('2026-10-14')![0].source, 'Strong');
  assert.equal(day.find(e => e.source === 'Self-reported')!.kind, 'run');
});
test('plannedKmRange reads every volume format', () => {
  assert.deepEqual(plannedKmRange('Target 38–42 km'), { min: 38, max: 42, note: undefined });
  assert.deepEqual(plannedKmRange('27 km completed'), { min: 27, max: 27, note: undefined });
  assert.deepEqual(plannedKmRange('Target 18 km + race'), { min: 18, max: 18, note: '+ race' });
  assert.deepEqual(plannedKmRange('Target 22–25 km incl. races'), { min: 22, max: 25, note: '+ race' });
  assert.deepEqual(plannedKmRange('Target 35–40 km (treadmill)'), { min: 35, max: 40, note: 'treadmill' });
  assert.equal(plannedKmRange('Rest'), undefined);
});
test('dayPlannedKm and weekActualKm (rides excluded)', () => {
  assert.equal(dayPlannedKm({ title: 'Long run · 16 km' }), 16);
  assert.equal(dayPlannedKm({ title: 'Rest' }), undefined);
  const index = indexLogsByDate(completions, strength);
  assert.equal(weekActualKm(index, ['2026-10-19', '2026-10-25']), 14.84);
});
test('dayStatus matrix', () => {
  const index = indexLogsByDate(completions, strength);
  const day = (id: string, iso: string, type = 'EASY') => ({ id, iso, date: '', dow: '', title: '', type, duration: '', rpe: '' });
  assert.equal(dayStatus(day('a', '2026-10-20'), { a: true }, index), 'done+logged');
  assert.equal(dayStatus(day('a', '2026-10-20'), {}, index), 'logged');
  assert.equal(dayStatus(day('b', '2026-10-30'), { b: true }, index), 'done');
  assert.equal(dayStatus(day('b', '2026-10-30'), {}, index), 'planned');
  assert.equal(dayStatus(day('c', '2026-10-31', 'REST'), {}, index), 'rest');
});
test('topSetLabel prefers kg then reps', () => {
  assert.equal(topSetLabel([{ kg: 40, reps: 12 }, { kg: 60, reps: 5 }]), '60 kg × 5');
  assert.equal(topSetLabel([{ reps: 30 }, { reps: 30 }]), '30 reps');
});
