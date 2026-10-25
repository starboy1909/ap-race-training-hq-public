import test from 'node:test';
import assert from 'node:assert/strict';
import { normaliseLift, topSet, e1rm, liftSeries, progressionReady } from './strength.ts';

test('lift matching on the real names', () => {
  assert.equal(normaliseLift('Back squat')?.key, 'squat');
  assert.equal(normaliseLift('Squat (Smith machine)')?.key, 'squat');
  assert.equal(normaliseLift('Front squat (Smith machine)')?.key, 'frontSquat');
  assert.equal(normaliseLift('Romanian deadlift')?.key, 'rdl');
  assert.equal(normaliseLift('Deadlift (Smith machine)')?.key, 'rdl');
  assert.equal(normaliseLift('Seated leg curl (machine)')?.key, 'legCurl');
  assert.equal(normaliseLift('Wall balls (9 kg)')?.key, 'wallBall');
  assert.equal(normaliseLift('Farmers carry (32.5 kg per hand)')?.key, 'farmers');
  assert.equal(normaliseLift('Sandbag walking lunge (30 kg)')?.key, 'lunge');
  assert.equal(normaliseLift('Tibialis raise'), undefined);
});
test('topSet, e1rm and series', () => {
  assert.deepEqual(topSet([{ kg: 40, reps: 12 }, { kg: 60, reps: 5 }]), { kg: 60, reps: 5 });
  assert.equal(e1rm(70, 3), 77);
  const s = liftSeries([{ date: '2026-10-19', session: 'x', exercises: [{ name: 'Squat (Smith machine)', sets: [{ kg: 30, reps: 12 }, { kg: 60, reps: 5 }] }] }, { date: '2026-10-05', session: 'y', exercises: [{ name: 'Back squat', sets: [{ kg: 70, reps: 3 }] }] }], 'squat');
  assert.deepEqual(s.map(p => [p.date, p.kg]), [['2026-10-05', 70], ['2026-10-19', 60]]);
});
test('progressionReady needs three clean working sets', () => {
  assert.equal(progressionReady([{ kg: 60, reps: 5 }, { kg: 60, reps: 5 }, { kg: 60, reps: 5 }, { kg: 60, reps: 5 }], 60, 5), true);
  assert.equal(progressionReady([{ kg: 30, reps: 12 }, { kg: 40, reps: 12 }, { kg: 50, reps: 11 }, { kg: 60, reps: 5 }], 60, 5), false);
});
