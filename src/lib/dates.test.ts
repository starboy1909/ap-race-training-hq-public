import test from 'node:test';
import assert from 'node:assert/strict';
import { dateOf, shiftIso, daysBetween, mondayOf, fmtShort, todayIso } from './dates.ts';

test('dateOf keeps iso and derives legacy "05 OCT" in 2026', () => {
  assert.equal(dateOf({ iso: '2026-10-21', date: '21 OCT' }), '2026-10-21');
  assert.equal(dateOf({ date: '05 OCT' }), '2026-10-05');
});
test('shiftIso crosses month and year ends', () => {
  assert.equal(shiftIso('2026-10-31', 1), '2026-11-01');
  assert.equal(shiftIso('2027-01-01', -1), '2026-12-31');
});
test('daysBetween and mondayOf', () => {
  assert.equal(daysBetween('2026-10-25', '2026-11-05'), 11);
  assert.equal(mondayOf('2026-10-25'), '2026-10-19');
  assert.equal(mondayOf('2026-10-19'), '2026-10-19');
});
test('fmtShort is a short weekday date', () => { assert.equal(fmtShort('2026-10-25'), 'Sun 25 Oct'); });
test('todayIso respects the time zone', () => {
  assert.equal(todayIso('Asia/Hong_Kong', new Date('2026-10-22T20:00:00Z')), '2026-10-23');
  assert.equal(todayIso('UTC', new Date('2026-10-22T20:00:00Z')), '2026-10-22');
});
