import test from 'node:test';
import assert from 'node:assert/strict';
import { targetLine, nextKeySession, trackOptionLine } from './targets.ts';

const day = (over: Record<string, unknown>) => ({ id: 'x', iso: '2026-11-10', date: '10 NOV', dow: 'TUE', title: 'Easy run · 8 km', type: 'EASY', duration: '48–54 min', rpe: '3–4', ...over }) as never;

test('targetLine per day type', () => {
  assert.equal(targetLine(day({ blocks: [{ label: 'RUN', items: ['8 km at a conversational pace, no faster than 5:40/km (heart rate under 150). This is a limit, not a target.'] }] })), '8 km · no faster than 5:40/km');
  assert.equal(targetLine(day({ type: 'LONG', title: 'Long run · 18 km', blocks: [{ label: 'LONG RUN', items: ['18 km at 5:40–6:20/km, heart rate under 150.'] }] })), '18 km · 5:40–6:20/km');
  assert.equal(targetLine(day({ type: 'QUALITY', title: 'Tempo', blocks: [{ label: 'WARM-UP', items: ['2 km easy'] }, { label: 'MAIN SET', items: ['3 × 10 min at 4:55–5:05/km', 'Even splits'] }] })), '3 × 10 min at 4:55–5:05/km');
  assert.equal(targetLine(day({ type: 'HYROX', title: 'HYROX · 4 rounds', blocks: [{ label: 'PREP', items: ['10 min easy'] }, { label: '4 ROUNDS · REST 2 MIN', items: ['Each round: 1 km run at 5:10–5:30/km, then the station pair.'] }] })), 'Each round: 1 km run at 5:10–5:30/km, then the station pair.');
  assert.equal(targetLine(day({ type: 'STRENGTH', title: 'Lower strength', blocks: [{ label: 'WARM-UP · 8 MIN', items: ['bike'] }, { label: 'A · BACK SQUAT', items: ['4 × 5 at your working load, rest 2½–3 min, 2 reps in reserve.'] }] })), '4 × 5 at your working load, rest 2½–3 min, 2 reps in reserve.');
  assert.equal(targetLine(day({ type: 'REST', title: 'Rest', blocks: [{ label: 'RECOVERY', items: ['No training.'] }] })), 'Rest');
  assert.equal(targetLine(day({ type: 'RACE', title: 'Race', blocks: [{ label: 'RACE PLAN · BEAT 25:27', items: ['Race pace 4:30/km = 25:12'] }] })), 'Race pace 4:30/km = 25:12');
  assert.equal(targetLine(day({ type: 'RECOVERY', title: 'Easy bike', blocks: [] })), '48–54 min · RPE 3–4');
});
test('nextKeySession skips today and non-key days', () => {
  const days = [day({ iso: '2026-11-09', type: 'QUALITY' }), day({ iso: '2026-11-10', type: 'EASY' }), day({ iso: '2026-11-11', type: 'QUALITY', title: 'Tempo 3-2-1' })];
  assert.equal(nextKeySession(days, '2026-11-09')?.title, 'Tempo 3-2-1');
  assert.equal(nextKeySession(days, '2026-11-11'), undefined);
});
test('trackOptionLine is the block sentence and names no venue', () => {
  const d = day({ type: 'QUALITY', blocks: [{ label: 'TRACK OPTION', items: ['Local track open 19:00–22:30 tonight. Optional: run this session on the track this evening instead of this morning. One run today, not both.'] }] });
  assert.equal(trackOptionLine(d), 'Local track open 19:00–22:30 tonight');
  assert.equal(trackOptionLine(day({ blocks: [] })), undefined);
});
