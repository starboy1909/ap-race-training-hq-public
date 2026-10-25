import test from 'node:test';
import assert from 'node:assert/strict';
import { parseHash, toHash } from './route.ts';

test('aliases keep old links alive', () => {
  assert.deepEqual(parseHash('#results'), { tab: 'profile', sub: 'results' });
  assert.deepEqual(parseHash('#season'), { tab: 'more', sub: 'season' });
  assert.deepEqual(parseHash('#plan'), { tab: 'calendar' });
  assert.deepEqual(parseHash('#records'), { tab: 'more', sub: 'records' });
  assert.deepEqual(parseHash('#coach'), { tab: 'more', sub: 'coach' });
});
test('empty, junk and dates', () => {
  assert.deepEqual(parseHash(''), { tab: 'today' });
  assert.deepEqual(parseHash('#nonsense/x'), { tab: 'today' });
  assert.deepEqual(parseHash('#calendar/2026-10-28'), { tab: 'calendar', date: '2026-10-28' });
  assert.deepEqual(parseHash('#calendar/garbage'), { tab: 'calendar' });
  assert.deepEqual(parseHash('#more/season'), { tab: 'more', sub: 'season' });
});
test('toHash round-trips canonical hashes', () => {
  for (const h of ['#today', '#calendar', '#calendar/2026-11-05', '#profile', '#profile/results', '#races', '#more', '#more/records']) assert.equal(toHash(parseHash(h)), h);
});
