import test from 'node:test';
import assert from 'node:assert/strict';
import { repPaces, targetRange, scoreSession } from './scorecard.ts';

const day = (main: string) => ({ id: 'x', iso: '2026-10-21', date: '21 OCT', dow: 'WED', title: '5K pace · 5 × 1 km', type: 'QUALITY', duration: '', rpe: '7–8', blocks: [{ label: 'MAIN SET', items: [main] }] }) as never;
const entry = (o: Record<string, unknown>) => ({ date: '2026-10-21', kind: 'run', source: 'Strava', title: 'r', ...o }) as never;

test('repPaces reads the three rep formats', () => {
  assert.deepEqual(repPaces('0.8@4:52 0.8@4:51 0.8@5:16'), [292, 291, 316]);
  assert.deepEqual(repPaces('1.0@4:29 0.76@4:39 | 1.0@4:59'), [269, 279, 299]);
  assert.deepEqual(repPaces('4:37 / 4:37 / 4:33'), [277, 277, 273]);
});
test('targetRange from the main set', () => {
  assert.deepEqual(targetRange(day('5 × 1 km at 4:35–4:45/km, 2 min easy')), [275, 285]);
  assert.deepEqual(targetRange(day('4 × 1.2 km at 4:30/km, your JPM race pace')), [265, 275]);
});
test('verdicts', () => {
  const d = day('5 × 1 km at 4:35–4:45/km');
  assert.equal(scoreSession(d, entry({ reps: '1.0@4:17 1.0@4:38 1.0@4:15 1.0@4:26 1.0@4:36', rpe: 8 })).verdict, 'repeat');
  assert.equal(scoreSession(d, entry({ reps: '4:25 / 4:28 / 4:26 / 4:27 / 4:26', rpe: 8 })).verdict, 'hold');
  assert.equal(scoreSession(d, entry({ reps: '4:40 / 4:40 / 4:38 / 4:41 / 4:39' })).verdict, 'hit');
  assert.equal(scoreSession(d, entry({ reps: '4:35 / 4:40 / 4:45 / 4:50 / 4:55' })).verdict, 'repeat');
  assert.equal(scoreSession(d, entry({ stations: '4:03 · 1:57' })).verdict, 'logged');
});
