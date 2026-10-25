import test from 'node:test';
import assert from 'node:assert/strict';
import { sessionLoad, sessionLoads, fitnessSeries, weeklyKmSeries, basisCounts } from './load.ts';
import { indexLogsByDate } from './calendar.ts';

const entry = (o: Record<string, unknown>) => ({ date: '2026-10-20', kind: 'run', source: 'Strava', title: 'Run', ...o }) as never;

test('TRIMP sanity values', () => {
  const easy = sessionLoad(entry({ minutes: 60, avgHr: 145 }));
  assert.equal(easy.basis, 'hr'); assert.ok(easy.load > 85 && easy.load < 100, String(easy.load));
  const thr = sessionLoad(entry({ minutes: 60, avgHr: 165 }));
  assert.ok(thr.load > 140 && thr.load < 160, String(thr.load));
  const str = sessionLoad(entry({ kind: 'strength', minutes: 65 }));
  assert.equal(str.basis, 'type'); assert.ok(str.load > 55 && str.load < 70, String(str.load));
});
test('basis order hr → rpe → type, and duration fallbacks', () => {
  assert.equal(sessionLoad(entry({ minutes: 30, avgHr: 120, rpe: 9 })).basis, 'hr');
  assert.equal(sessionLoad(entry({ kind: 'manual', minutes: 30, rpe: 7 })).basis, 'rpe');
  const fromPace = sessionLoad(entry({ km: 10, pace: '6:00/km' })); assert.equal(fromPace.minutes, 60); assert.equal(fromPace.durationEstimated, false);
  const def = sessionLoad(entry({ kind: 'hyrox' })); assert.equal(def.minutes, 60); assert.equal(def.durationEstimated, true);
});
test('manual and self-reported duplicates are not double counted', () => {
  const index = indexLogsByDate([
    { date: '2026-10-20', type: 'run', source: 'strava', planned: 'Easy run · 8 km', title: 'Run', distanceKm: 8, time: '55:00', avgHr: 123 },
    { date: '2026-10-20', type: 'run', source: 'self-reported', planned: '5 × 1 km', title: 'Bench', pace: '4:34/km' },
  ], [], [{ date: '2026-10-20', slot: 'Primary', minutes: 50, rpe: 6 }, { date: '2026-10-20', slot: 'Unplanned', minutes: 20, rpe: 3 }]);
  const loads = sessionLoads(index);
  assert.equal(loads.length, 2);
  assert.deepEqual(loads.map(l => l.kind).sort(), ['manual', 'run']);
});
test('EWMA step and seeded start; TSB uses yesterday', () => {
  const s = fitnessSeries([{ date: '2026-10-01', load: 100, minutes: 60, basis: 'hr', durationEstimated: false, kind: 'run', title: '' }], '2026-10-03');
  assert.equal(s.length, 3);
  const seed = 100 / 3; // mean over the first 14 days clipped to 3 available
  assert.equal(s[0].tsb, 0);
  assert.equal(s[0].ctl, Math.round((seed + (100 - seed) * (1 - Math.exp(-1 / 42))) * 10) / 10);
  assert.equal(s[1].tsb, Math.round((s[0].ctl - s[0].atl) * 10) / 10);
});
test('weeklyKmSeries aligns to Monday and returns n entries', () => {
  const index = indexLogsByDate([{ date: '2026-10-21', type: 'run', source: 'strava', planned: 'x', title: 'r', distanceKm: 10.2 }], []);
  const weeks = [{ id: 'S25', label: 'W25', dates: '', phase: '', volume: 'Target 38–42 km', focus: '', days: [{ iso: '2026-10-19', date: '19 OCT' }, {}, {}, {}, {}, {}, { iso: '2026-10-25', date: '25 OCT' }] }] as never;
  const s = weeklyKmSeries(index, weeks, '2026-10-25', 4);
  assert.equal(s.length, 4); assert.equal(s[3].mondayIso, '2026-10-19'); assert.equal(s[3].actualKm, 10.2); assert.deepEqual(s[3].planned, { min: 38, max: 42 });
  assert.equal(s[0].mondayIso, '2026-09-28');
  assert.equal(basisCounts(sessionLoads(index)).type, 1);
});
