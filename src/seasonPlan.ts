import type { Day } from './trainingHistory';

// Performance season from 6 October 2026. Every future day is generated here from one
// ranked race calendar and one week table, so season-level rules (tapers, long-run spacing,
// travel minimums) live in one place instead of date patches.
export const CUTOVER = '2026-10-06';

export const RACE_DATES = {
  shanghai: '2026-11-01',
  jpm: '2026-11-05',
  rmac: '2026-11-08',
  hongKong: '2027-01-09',
  bangkok: '2027-02-13',
  osaka: '2027-02-28',
} as const;

// A races get a taper and long-run spacing check in scripts/verify-training-plan.mjs.
export const A_RACES: string[] = [RACE_DATES.shanghai, RACE_DATES.hongKong, RACE_DATES.bangkok, RACE_DATES.osaka];

export const travelWindows: [string, string][] = [
  ['2026-09-25', '2026-09-27'], ['2026-10-09', '2026-10-12'], ['2026-10-31', '2026-11-02'],
  ['2026-11-28', '2026-12-14'], ['2026-12-24', '2026-12-28'],
];
export const isTravel = (iso: string) => travelWindows.some(([a, b]) => iso >= a && iso <= b);

export const seasonGoals = [
  ['1', '1 Nov · HYROX Shanghai Pro Doubles', 'Race it flat out. Beat the Delhi Pro Doubles time of 1:27:54; stretch target sub-1:22. Use it to set the Hong Kong target.'],
  ['2', '9 Jan · AIA HYROX Hong Kong Pro Doubles', 'Worlds qualification attempt. You race at 36, so check the 2026/27 Doubles age-group rule and the slot count after Shanghai. Provisional bar: sub-1:20.'],
  ['3', '13 Feb · BYD HYROX Bangkok Pro Doubles', 'Second qualification attempt with its own taper. If Hong Kong qualifies, race it for a Pro Doubles PB.'],
  ['4', '28 Feb · Osaka Marathon', 'Finish strong. Target 4:15–4:25 from 6:00–6:15/km; stretch is beating the 4:23:56 PB. Long runs build from October so January is not a rush.'],
  ['5', '5 Nov · JPMorganChase 5.6K', 'Beat last year’s 25:27 (about 4:33/km). October has dedicated 5K-pace sessions for this.'],
];

export const performanceMarkers = [
  ['Back squat', '70 kg × 3 top set (5 Oct)', '80 kg × 5 by Hong Kong', 'Working sets 4 × 5 from 60 kg; +2.5 kg a week when every set is clean with 2 reps in reserve'],
  ['Romanian deadlift', '40 kg × 5 (5 Oct)', '60 kg × 8 by Hong Kong', 'Build 40 kg to 3 × 8, then +2.5 kg a week'],
  ['Sandbag lunge, 30 kg', 'Slowest station (10:55 at HK Singles)', '50 m unbroken by December', 'Monday lower day + Friday HYROX'],
  ['Wall balls, 9 kg', 'Slowest station (10:45 at HK Singles)', '50 reps in 2 sets by December', '4×20 → 3×25 → 2×25 → 35 + 15'],
  ['Roxzone', '10:10–12:09 in singles', 'Under 7 min total in Doubles', 'Timed transitions in every HYROX session'],
  ['Threshold pace', '4:54–5:07/km reps (Sep 2026)', '4:45–4:50/km by March', '5 sec/km faster every two weeks when all reps land at RPE 7 or less'],
  ['5K', '25:27 for 5.6K (2025 JPM)', 'Sub-21 by spring 2027, back toward the 20:55 PB', 'October 5K block, then a time trial after Osaka'],
];

export const paceGuide = [
  ['Recovery', '6:30–7:10/km', 'RPE 2–3 · full sentences'],
  ['Easy / long', 'No faster than 5:50/km (9.0–10.0 kph)', 'RPE 3–4 · a limit, not a target. Slower in heat or on hills is fine'],
  ['Marathon (Osaka)', '6:00–6:10/km (9.8–10.0 kph)', 'RPE 5 · set from your real marathons (6:15–6:28/km), not Runna’s 5:30'],
  ['Threshold / tempo', '4:55–5:05/km (11.8–12.2 kph)', 'RPE 7 · from your Sep 2026 reps (4:54–5:07). 5 sec/km faster every two weeks when all reps land at RPE 7 or less'],
  ['Intervals / 5K pace', '4:35–4:45/km (12.6–13.1 kph)', 'RPE 8 · 400 m–1.6 km reps, walking recoveries as in Runna'],
  ['Compromised HYROX km', '5:05–5:25/km', 'RPE 7 · first 200 m controlled after sleds, then settle'],
];

export const runnaLessons = [
  ['Kept', 'Runna session library', 'Tempo 3-2-1, Broken Miles, Drop Set, Over/Unders, On/Off Ks and Mile Repeats rotate on Wednesdays.'],
  ['Kept', 'Pace ranges with a ceiling', 'Every rep has a target and a ±10 sec range; easy runs say “no faster than 5:50/km”.'],
  ['Kept', 'Walking recoveries', '60–180 sec walking rest between reps, as Runna prescribed.'],
  ['Kept', 'Taper 400s', 'Short 400 m reps just faster than goal pace before JPM, Shanghai, Hong Kong and Bangkok.'],
  ['Kept', 'Race-practice long runs', 'Marathon-pace blocks inside Osaka long runs (22 Nov, 24 Jan).'],
  ['Changed', 'Long-run peak', 'Runna planned 28–34 km runs that stopped at 9–22 km. The Osaka peak is 24 km, which you can complete.'],
  ['Changed', 'Marathon pace', 'Runna set 5:05–5:30/km; Kerry was 6:28/km. Osaka pace is 6:00–6:10/km.'],
  ['Changed', 'Rep pacing', 'You ran Runna reps 20–30 sec/km faster than prescribed and faded late. Rep 1 now starts at the slow end of the range.'],
];

export const scheduleChangePolicy = [
  ['Train as written', 'Do the published session and aim for its target numbers. Log loads, splits and RPE. Optional extras stay optional; the primary session does not.'],
  ['One gate', 'Pain that changes how you move, illness or fever: stop, swap to easy bike if comfortable, and reassess the next day. Anything else: train.'],
  ['Garmin', 'Sleep, HRV and Body Battery feed the weekly review. They do not change today’s session on their own.'],
  ['Weekly review', 'Every Sunday: compare targets with actuals and make one decision for next week (progress, hold or repeat). No mid-week patching.'],
];

const block = (label: string, items: string[]) => ({ label, items });
type Spec = Partial<Day>;

const gate = 'Train as written. Only pain that changes how you move, illness or fever changes the session.';

// ---------- session builders ----------
type Level = 'full' | 'reduced' | 'taper';
function lower(level: Level, note?: string): Spec {
  if (level === 'taper') return { title: 'Taper strength touch', type: 'STRENGTH', duration: '30 min', rpe: '5', blocks: [block('FAMILIAR LOADS ONLY', ['Warm-up 8 min bike + 2 ramp sets.', 'Back squat 3 × 3 at your current working load, fast and crisp.', 'RDL 2 × 5 · bent-knee calf raise 2 × 12 · tibialis raise 2 × 20.', 'Leave 3–4 reps in reserve. No lunges, no new exercises.'])] };
  const s = level === 'full' ? 4 : 3, a = level === 'full' ? 3 : 2;
  return { title: 'Lower strength · squat, lunge, hinge', type: 'STRENGTH', duration: level === 'full' ? '65–75 min' : '50–55 min', rpe: '7–8', note, blocks: [
    block('WARM-UP · 8 MIN', ['Easy bike 5 min, then ankle rocks, bodyweight squats and hinges × 8.', '2–3 ramp sets before the first squat set; they do not count as work sets.']),
    block('A · BACK SQUAT', [`${s} × 5 at your working load, rest 2½–3 min, 2 reps in reserve.`, 'Working sets at 60 kg (your 5 Oct top set was 70 kg × 3). Ramp 40 × 5, 50 × 3 first. Every week all sets are clean with 2 in reserve, add 2.5 kg. Target: 80 kg × 5 by Hong Kong.', 'Straight sets at one load, not a ramp to a top set. No extra front-squat sets: the lunges cover that work.']),
    block('B · SANDBAG WALKING LUNGE · RACE IMPLEMENT', [`${a} × 25 m with the 30 kg sandbag (or 2 × 15 kg dumbbells), rest 90 sec.`, 'Legal reps: back knee touches, full lockout. Progress to 2 × 50 m unbroken by December.', 'Your 5 Oct split squat used 2 × 15 kg = 30 kg total, the same as the race sandbag, so the load is right.']),
    block('C · HINGE', [`Romanian deadlift ${a} × 8, rest 2 min. Start at 40 kg; once all sets reach 8 clean reps, +2.5 kg a week. Target 60 kg × 8.`, `Lying leg curl ${a} × 10–12 at about 46 kg. Same load every set; 53 kg dropped off by set 3 on 5 Oct.`]),
    block('D · CALF & SHIN', [`Bent-knee calf raise ${a} × 15 at 25 kg · standing calf raise ${a} × 15 at 50 kg (20 reps at 20 kg and 40 kg was too light) · tibialis raise 2 × 25–30.`, 'Dead bug 2 × 8/side.']),
  ] };
}

function upper(level: Level): Spec {
  const s = level === 'full' ? 4 : 2;
  return { title: 'Upper strength + wall balls', type: 'STRENGTH', duration: level === 'full' ? '60–70 min' : '40 min', rpe: level === 'full' ? '7–8' : '5–6', blocks: [
    block('A · PUSH / PULL', [`A1 chest press ${s} × 6–8 · A2 chest-supported row ${s} × 8–10. Rest 90 sec after each exercise; 2 reps in reserve.`, `B1 lat pulldown ${level === 'full' ? 3 : 2} × 10 · B2 seated shoulder press ${level === 'full' ? 3 : 2} × 8.`]),
    block('B · WALL BALLS · 9 KG TO 3 M', [level === 'full' ? 'Race-format sets at the end of the session: Oct 4 × 20 · Nov 3 × 25 · Dec 25 + 25 + 15 · then 35 + 15. Rest 60 sec.' : 'Wall balls 2 × 15, smooth and legal.', 'Every rep must hit the target with full squat depth. Breathe on the throw, never hold a rep at the bottom.']),
    block('C · GRIP & TRUNK', [level === 'full' ? 'Farmers carry 3 × 50 m with 2 × 32 kg, rest 60 sec.' : 'Farmers carry 2 × 50 m with 2 × 32 kg.', 'Pallof press 2 × 10/side · side plank 2 × 30 sec/side.']),
  ] };
}

function easy(km: number, extra?: string): Spec {
  return { title: `Easy run · ${km} km`, type: 'EASY', duration: `${Math.round(km * 6)}–${Math.round(km * 6.7)} min`, rpe: '3–4', blocks: [block('RUN', [`${km} km at a conversational pace, no faster than 5:50/km. This is a limit, not a target.`, extra ?? 'Finish with 4 × 20 sec relaxed strides, 60 sec walk between.'])] };
}

// Runna-style finishes for the Tuesday easy run in build weeks.
const easyRolling = (km: number) => easy(km, 'Finish with Rolling 400s: 4 × (400 m at 5:00/km + 400 m at 5:50/km), continuous.');
const easyProgressive = (km: number) => ({ ...easy(km, 'Progressive finish: the last 3 km at 5:40, 5:25 and 5:10/km. Stop the build if breathing gets ragged.'), title: `Progressive run · ${km} km` });

function racePractice(km: number, blocks: string): Spec {
  return { ...long(km, 'Race-practice long run, Runna-style. Fuel 30–60 g carbohydrate an hour from 45 min, exactly as in Osaka.'), title: `Race-practice long run · ${km} km`, blocks: [block('LONG RUN', [blocks, 'Marathon pace 6:00–6:10/km (9.8–10.0 kph). Everything else at a conversational pace, no faster than 5:50/km.', 'Counts as done at 80% of the distance. If you stop short, repeat this run next week rather than moving up.'])] };
}

function long(km: number, note?: string): Spec {
  return { title: `Long run · ${km} km`, type: 'LONG', duration: `${Math.round(km * 6)}–${Math.round(km * 6.6)} min`, rpe: '3–4', note: note ?? 'Osaka build. Fuel 30–60 g carbohydrate an hour from 60 min onwards, the same products you will use in Osaka.', blocks: [block('LONG RUN', [`${km} km at 6:00–6:40/km. Keep the first 3 km at the slow end.`, km >= 20 ? 'Cap at 2 h 40 min. If you get there before the distance, stop: time on feet is the point.' : 'Even effort throughout; no fast finish.'])] };
}

const keyRuns = {
  jpm800: { title: '5K pace · 6 × 800 m', duration: '50 min', main: ['6 × 800 m at 4:40–4:50/km, 2 min easy jog between.', 'Aim for even reps. If the last two are faster than the first two, next week starts 5 sec/km faster.'] },
  jpm1k: { title: '5K pace · 5 × 1 km', duration: '55 min', main: ['5 × 1 km at 4:40–4:45/km, 2 min easy jog between.', 'Benchmark for JPM: if all five land at 4:45 or faster at RPE 8 or less, race at 4:35/km. If not, race at 4:40–4:45.'] },
  thr3x10: { title: 'Threshold · 3 × 10 min', duration: '60 min', main: ['3 × 10 min at 4:55–5:05/km (11.8–12.2 kph), 2 min walking rest between.', 'Even splits. Progress 5 sec/km every two weeks when all reps land at RPE 7 or less.'] },
  thr2x15: { title: 'Threshold · 2 × 15 min', duration: '60 min', main: ['2 × 15 min at threshold, 3 min easy jog between.', 'Same pace rule as 3 × 10. Second rep no slower than the first.'] },
  thr4x8: { title: 'Threshold · 4 × 8 min', duration: '60 min', main: ['4 × 8 min at threshold, 90 sec easy jog between.', 'Short recoveries are the progression; keep the pace from the last 3 × 10.'] },
  thr3x8: { title: 'Threshold · 3 × 8 min', duration: '50 min', main: ['3 × 8 min at threshold, 2 min easy jog between. Sharp, not heavy.'] },
  thrDeload: { title: 'Threshold · 2 × 8 min', duration: '45 min', main: ['2 × 8 min at threshold, 3 min easy jog between. Deload: hold pace, cut volume.'] },
  mp: { title: 'Marathon pace · 3 × 3 km', duration: '75 min', main: ['3 × 3 km at 6:00–6:10/km, 1 km easy between.', 'Practise race fuelling: one gel before the first block.'] },
  thrMp: { title: 'Threshold + marathon pace', duration: '70 min', main: ['2 × 10 min at threshold, then 4 km at 6:00–6:10/km.', 'Run the marathon-pace block on tired legs; that is the point.'] },
  tempo321: { title: 'Tempo 3-2-1', duration: '55 min', main: ['3 km at 5:05/km (4:55–5:15), 3 min walking rest.', '2 km at 4:55/km (4:45–5:05), 2 min walking rest.', '1 km at 4:50/km (4:40–5:00).', 'Each block a little faster than the last; never faster than the bottom of its range.'] },
  brokenMiles: { title: 'Broken Miles', duration: '55 min', main: ['3 × (1.2 km at 4:45/km (4:35–4:55), 2 min walking rest + 400 m at 4:30/km (4:20–4:40), 60 sec walking rest).', 'Rep 1 at the slow end of the range.'] },
  dropSet: { title: 'Drop Set', duration: '55 min', main: ['2 × 1 km at 4:50/km · 2 × 800 m at 4:45 · 2 × 600 m at 4:35 · 2 × 400 m at 4:30. 90 sec walking rest after each.', 'Each step gets shorter and slightly faster. Do not run the 1 km reps faster than 4:45.'] },
  overUnders: { title: 'Over and Unders · 1 km', duration: '50 min', main: ['3 × (1 km at 5:30/km + 1 km at 4:55/km), continuous, then 90 sec walking rest between sets.', 'The 5:30 km is still work. Do not jog it.'] },
  onOffKs: { title: 'On/Off Ks', duration: '50 min', main: ['3 × (1 km at 5:25/km + 1 km at 4:50/km), continuous, 90 sec walking rest between sets.', 'Smooth and controlled; a gentle return to faster running.'] },
  mileRepeats: { title: 'Mile Repeats · 3 × 1.6 km', duration: '55 min', main: ['3 × 1.6 km at 4:45/km (4:35–4:55), 2 min walking rest.', 'Your 2025 mile reps started at 4:14 against a 4:50 target and faded. Rep 1 at 4:50 this time.'] },
  taper400s: { title: 'Taper 400s', duration: '35 min', main: ['6 × 400 m at 4:30/km, just faster than goal pace, 90 sec walking rest.', 'Snappy, relaxed, finish fresh. Nothing extra.'] },
  vo2: { title: 'Speed · 6 × 3 min', duration: '55 min', main: ['6 × 3 min at 5K pace (4:40–4:50/km to start), 2 min easy jog between.', 'Keeps 5K speed alive between HYROX blocks.'] },
} as const;
type KeyRun = keyof typeof keyRuns;
function key(kind: KeyRun): Spec {
  const k = keyRuns[kind];
  return { title: k.title, type: 'QUALITY', duration: k.duration, rpe: kind === 'thrDeload' || kind === 'taper400s' ? '6–7' : '7–8', blocks: [block('WARM-UP', ['2 km at a conversational pace (no faster than 5:50/km), then 4 × 20 sec strides and 90 sec walking rest.']), block('MAIN SET', [...k.main, 'Rep 1 starts at the slow end of its range. If your last rep is more than 10 sec/km slower than your first, repeat this pace next time.']), block('COOL-DOWN', ['1.5 km at a conversational pace (or slower). Log each rep split and RPE.'])] };
}

// HYROX Pro Doubles stations at your share (half the team volume) and full race loads.
// Logged best sets of 253 kg push and 215 kg pull already exceed race loads (202 / 153 kg).
const STATION_PAIRS = [
  'SkiErg 500 m + sled push 2 × 12.5 m at 202 kg total',
  'Sled pull 2 × 12.5 m at 153 kg total + burpee broad jump 40 m',
  'Row 500 m + farmers carry 100 m with 2 × 32 kg',
  'Sandbag lunge 50 m at 30 kg + wall balls 50 at 9 kg (split as needed: 25 + 25)',
  'Sandbag lunge 25 m + wall balls 25 (late-race durability round)',
  'Burpee broad jump 20 m + wall balls 25',
];
type HyroxMode = 'build' | 'sim' | 'rehearsal' | 'touch';
function hyrox(mode: HyroxMode, rounds = 4, rest = '2 min'): Spec {
  if (mode === 'touch') return { title: 'HYROX touch · race pace, short', type: 'HYROX', duration: '35 min', rpe: '6', blocks: [block('SHARPEN', ['10 min easy jog + drills.', '2 × (500 m at race pace + sled push 12.5 m at 202 kg + 10 wall balls). Rest 3 min.', 'Finish fresh. This is a reminder for the legs, not training.'])] };
  if (mode === 'rehearsal') return { title: 'HYROX race-pace rehearsal · 4 rounds', type: 'HYROX', duration: '50 min', rpe: '7', blocks: [block('PREP', ['10 min easy + 2 light sled lengths.']), block('4 ROUNDS · FULL RECOVERY', ['Each round: 1 km at planned race pace + one station at race load and your race share: push 25 m, pull 25 m, lunges 50 m, wall balls 50.', 'Rest 3 min between rounds. Practise the exact changeovers and Roxzone lines you will use.']), block('FINISH', ['Cool-down 8 min. Confirm the race station split with your partner.'])] };
  if (mode === 'sim') return { title: 'HYROX Doubles simulation · 8 × 1 km', type: 'HYROX', duration: '85–95 min', rpe: '8', note: 'Partner session if possible; solo works too (do your race share of each station).', blocks: [block('PREP', ['15 min easy + one light length of each sled.']), block('FULL SIMULATION · CONTINUOUS', ['8 × (1 km at 5:10–5:30/km + the next station in race order at your Doubles share and race load): ski 500 m, push 25 m, pull 25 m, BBJ 40 m, row 500 m, farmers 100 m, lunges 50 m, wall balls 50.', 'No rest except Roxzone. Time every run, station and transition.']), block('AFTER', ['Cool-down 10 min. Compare with Delhi (1:27:54): where did the minutes go? That sets next week’s focus.'])] };
  const pairs = STATION_PAIRS.slice(0, rounds);
  return { title: `HYROX · ${rounds} rounds, race loads`, type: 'HYROX', duration: `${45 + rounds * 7}–${55 + rounds * 7} min`, rpe: '7–8', blocks: [
    block('PREP', ['10 min easy jog + one light length of each sled.']),
    block(`${rounds} ROUNDS · REST ${rest.toUpperCase()}`, [
      `Each round: 1 km run at 5:10–5:30/km, then the station pair. ${rounds} km of running in total.`,
      ...pairs.map((p, i) => `Round ${i + 1}: ${p}.`),
      'Roxzone drill every round: from the end of the run to the first station rep in 20 sec or less. Time it.',
    ]),
    block('PROGRESSION', ['Next week cuts the rest by 30 sec or adds a round, never both. Unbroken sled lengths and legal reps come first.', 'Log run splits, station times and transition times.']),
  ] };
}

const rest = (note?: string): Spec => ({ title: 'Rest', type: 'REST', duration: 'Rest', rpe: '0–1', note, blocks: [block('RECOVERY', ['No training. Optional 20 min walk and 5 min ankle and hip mobility.', 'Eat well and protect 7–9 hours of sleep.'])] });
const travelRest = (): Spec => ({ ...rest(), title: 'Travel day · rest', blocks: [block('TRAVEL', ['No training. Walk, hydrate, and keep meals regular.', 'Pack shoes and kit for the hotel sessions.'])] });

// Hotel template: basic dumbbells, bench and treadmill. Outdoor running is not assumed.
const hotel = {
  strengthA: (): Spec => ({ title: 'Hotel strength A · legs + push', type: 'STRENGTH', duration: '45 min', rpe: '7', blocks: [block('DUMBBELLS + BENCH', ['Warm-up 5 min treadmill walk/jog.', 'Goblet squat 4 × 10 (heaviest dumbbell, 3-sec lowering) · rest 90 sec.', 'Dumbbell walking lunge 3 × 20 steps · rest 90 sec.', 'Dumbbell RDL 3 × 10 · dumbbell bench press 3 × 10.', 'Calf raise 3 × 15 on a step + heel walks 2 × 30 sec.']), block('WALL-BALL SUBSTITUTE', ['Dumbbell thrusters 4 × 15, rest 60 sec.'])] }),
  strengthB: (): Spec => ({ title: 'Hotel strength B · single leg + pull', type: 'STRENGTH', duration: '45 min', rpe: '7', blocks: [block('DUMBBELLS + BENCH', ['Warm-up 5 min treadmill walk/jog.', 'Rear-foot-elevated split squat 3 × 10/side · step-up 3 × 10/side.', 'One-arm dumbbell row 4 × 10/side · push-ups 3 × 12–20 · dumbbell shoulder press 3 × 10.']), block('GRIP + ENGINE', ['Farmers hold with the heaviest dumbbells 3 × 45 sec.', 'Burpees 3 × 10, rest 60 sec. Dead bug 2 × 8/side.'])] }),
  easy: (min: number): Spec => ({ title: `Treadmill easy · ${min} min`, type: 'EASY', duration: `${min} min`, rpe: '3–4', blocks: [block('TREADMILL', [`${min} min at 9.0–10.0 kph (6:00–6:40/km), 1% incline.`, 'Finish with 4 × 20 sec strides, 60 sec walk between.'])] }),
  threshold: (): Spec => ({ title: 'Treadmill threshold · 3 × 10 min', type: 'QUALITY', duration: '60 min', rpe: '7–8', blocks: [block('TREADMILL · 1% INCLINE', ['12 min easy warm-up.', '3 × 10 min at 11.8–12.2 kph (4:55–5:05/km), 2 min walking rest between.', '10 min easy cool-down. Log speed settings.'])] }),
  hyrox: (): Spec => ({ title: 'Treadmill HYROX · 5 rounds', type: 'HYROX', duration: '55 min', rpe: '7–8', blocks: [block('5 ROUNDS', ['1 km treadmill at 11.1–11.8 kph (5:05–5:25/km), then straight into:', 'Dumbbell thrusters 15 · dumbbell walking lunge 20 steps · burpees 10 · farmers hold 40 sec.', 'Rest 60 sec, then repeat. Time each round; keep the last within 10% of the first.'])] }),
  long: (min: number): Spec => ({ title: `Treadmill long run · ${min} min`, type: 'LONG', duration: `${min} min`, rpe: '3–4', note: 'Osaka build continues on the treadmill. Fuel from 60 min.', blocks: [block('TREADMILL', [`${min} min at 9.0–10.0 kph, 1% incline. Change the speed by 0.2 km/h every 15 min to keep your stride relaxed.`, 'Practise 30–60 g carbohydrate an hour.'])] }),
};

function hotelDay(iso: string, dow: number): Spec {
  const window = travelWindows.find(([a, b]) => iso >= a && iso <= b)!;
  if (iso === window[0] || iso === window[1]) return travelRest();
  return [hotel.strengthA(), hotel.easy(45), hotel.threshold(), hotel.strengthB(), hotel.hyrox(), rest(), hotel.long(90)][dow];
}

// ---------- week table ----------
type WeekPlan = { phase: string; km: string; focus: string; days: (Spec | null)[] };
// null = use the hotel template on travel days, otherwise rest.
const W: Record<string, WeekPlan> = {
  '2026-10-05': { phase: 'DELOAD · TRAVEL', km: '25–30 km', focus: 'Absorb September. Short treadmill and dumbbell work while away.', days: [null, easy(6), key('thrDeload'), upper('reduced'), null, hotel.strengthA(), hotel.long(70)] },
  '2026-10-12': { phase: 'BUILD · SHANGHAI', km: '38–42 km', focus: 'First 5K-pace session for JPM, race loads on the sleds. Monday is a travel day, so the key run moves to Tuesday and legs to Wednesday.', days: [null, key('jpm800'), lower('full'), upper('full'), hyrox('build', 4, '2 min'), easy(8), long(16)] },
  '2026-10-19': { phase: 'BUILD · SHANGHAI PEAK', km: '42–45 km', focus: 'Hardest week before Shanghai. The Friday simulation is the dress rehearsal; the JPM benchmark is Wednesday.', days: [lower('full'), easy(8), key('jpm1k'), upper('full'), hyrox('sim'), rest(), long(14, 'Easy. Shanghai is a week away; no fast finish.')] },
  '2026-10-26': { phase: 'TAPER · SHANGHAI', km: '18–22 km', focus: 'Freshen up for an all-out Shanghai. Short and sharp only.', days: [lower('taper'), key('taper400s'), hyrox('touch'), easy(5), rest(), null, null] },
  '2026-11-02': { phase: 'RACE WEEK · JPM + RMAC', km: '25 km incl. races', focus: 'Recover from Shanghai fast, race JPM, then turn RMAC into an easy long run.', days: [null, null, null, null, rest(), null, null] },
  '2026-11-09': { phase: 'BUILD · HONG KONG 1', km: '40–44 km', focus: 'Back to full training. Loads 10% under your pre-Shanghai numbers for Monday, then normal.', days: [lower('reduced', 'First lifting after the race block: 10% under your last working loads.'), easyRolling(8), key('tempo321'), upper('full'), hyrox('build', 4, '2 min'), rest(), long(18)] },
  '2026-11-16': { phase: 'BUILD · HONG KONG 2', km: '44–48 km', focus: 'Volume up. One more HYROX round and shorter rests.', days: [lower('full'), easyProgressive(10), key('brokenMiles'), upper('full'), hyrox('build', 5, '90 sec'), rest(), racePractice(20, '6 km easy · 8 km at marathon pace · 6 km easy.')] },
  '2026-11-23': { phase: 'BUILD · HONG KONG 3', km: '40–45 km', focus: 'Full Doubles simulation before travel. Ideal partner session.', days: [lower('full'), easyRolling(10), key('dropSet'), upper('full'), hyrox('sim'), null, hotel.long(80)] },
  '2026-11-30': { phase: 'HOTEL BLOCK 1', km: '35–40 km (treadmill)', focus: 'Required minimum while away: 2 dumbbell sessions, 3 treadmill runs and a treadmill HYROX circuit.', days: [null, null, null, null, null, null, null] },
  '2026-12-07': { phase: 'HOTEL BLOCK 2', km: '35–40 km (treadmill)', focus: 'Same template, longer Sunday run. Monday 14 Dec is the travel home.', days: [null, null, null, null, null, null, hotel.long(100)] },
  '2026-12-14': { phase: 'RE-ENTRY · HONG KONG 4', km: '38–42 km', focus: 'Back on the sleds at race load. Monday is the travel day, so legs move to Tuesday.', days: [null, lower('reduced', 'Back from travel: 10% under your last gym loads.'), key('onOffKs'), upper('full'), hyrox('build', 5, '90 sec'), rest(), long(18)] },
  '2026-12-21': { phase: 'BUILD · HONG KONG 5', km: '25–30 km', focus: 'The last big HYROX day before Hong Kong, 18 days out. Then the holiday trip.', days: [lower('full'), hyrox('sim'), easy(8), null, null, hotel.strengthA(), hotel.long(75)] },
  '2026-12-28': { phase: 'PRE-TAPER · HONG KONG', km: '30–34 km', focus: 'Sharp, moderate volume. Friday is the last race-pace rehearsal, 8 days out.', days: [null, lower('reduced'), key('thr3x8'), upper('reduced'), hyrox('rehearsal'), rest(), easy(12, 'Easy long-ish run. No strides.')] },
  '2027-01-04': { phase: 'TAPER · HONG KONG', km: '15–18 km', focus: 'Fresh legs for the qualification attempt.', days: [lower('taper'), key('taper400s'), hyrox('touch'), easy(4), rest(), null, null] },
  '2027-01-11': { phase: 'RECOVER → OSAKA', km: '25–30 km', focus: 'Two easy days, then straight into the Osaka and Bangkok build.', days: [rest(), { title: 'Easy bike · 30 min', type: 'RECOVERY', duration: '30 min', rpe: '2–3', blocks: [block('FLUSH', ['30 min easy bike + 10 min mobility.'])] }, easy(6, 'Easy. No strides.'), upper('reduced'), easy(8), rest(), long(16, 'If you were picked for the SCHK Half Marathon this day, run it at this easy long-run pace instead.')] },
  '2027-01-18': { phase: 'BUILD · OSAKA + BANGKOK 1', km: '45–48 km', focus: 'Marathon volume up, HYROX held at race loads for Bangkok.', days: [lower('reduced'), easy(12, 'Medium-long run. No strides.'), key('thrMp'), upper('full'), hyrox('build', 4, '90 sec'), rest(), racePractice(22, '6 km easy · 5 km at marathon pace · 2 km easy · 5 km at marathon pace · 4 km easy.')] },
  '2027-01-25': { phase: 'BUILD · OSAKA PEAK', km: '48–52 km', focus: 'Longest run of the season on Sunday, 4 weeks before Osaka and 13 days before Bangkok.', days: [lower('reduced'), easy(12, 'Medium-long run. No strides.'), key('mp'), upper('full'), hyrox('build', 5, '90 sec'), rest(), long(24)] },
  '2027-02-01': { phase: 'BUILD · BANGKOK', km: '38–42 km', focus: 'Race-pace HYROX rehearsal 8 days before Bangkok; long run trimmed to keep the legs fresh.', days: [lower('reduced'), easy(10), key('overUnders'), upper('reduced'), hyrox('rehearsal'), rest(), long(14, 'Easy. Bangkok is 6 days away.')] },
  '2027-02-08': { phase: 'TAPER · BANGKOK', km: '15–18 km', focus: 'Second qualification attempt. Short taper; Osaka training resumes after.', days: [lower('taper'), key('taper400s'), hyrox('touch'), easy(4), rest(), null, rest('Day after Bangkok. Walk only.')] },
  '2027-02-15': { phase: 'BRIDGE · OSAKA', km: '30–35 km', focus: 'Recover from Bangkok, rehearse marathon pace, one last moderate long run.', days: [rest(), easy(6, 'Easy. No strides.'), easy(10, 'Include 2 × 2 km at 6:00–6:10/km.'), upper('reduced'), easy(6), rest(), long(14, 'Final long run. Practise race-morning breakfast and fuelling.')] },
  '2027-02-22': { phase: 'TAPER · OSAKA', km: '18 km + race', focus: 'Arrive fresh. Finish strong.', days: [rest(), easy(6, 'Include 3 × 1 km at 6:00–6:10/km.'), easy(5), easy(4), rest(), rest('Travel or rest. 10 min shakeout jog if you feel flat.'), null] },
};

const races: Record<string, Spec> = {
  '2026-10-31': { title: 'Shakeout · 20 min', type: 'EASY', duration: '20 min', rpe: '2–3', blocks: [block('PRE-RACE', ['20 min easy jog + 3 strides. Collect race kit, agree the station split and changeover cues with your partner.', 'Normal carbohydrate-rich dinner. No new foods.'])] },
  [RACE_DATES.shanghai]: { title: 'HYROX Shanghai · Pro Doubles · RACE', type: 'RACE', race: true, duration: 'Race day', rpe: '9–10', blocks: [block('RACE PLAN · ALL OUT', ['Target: beat 1:27:54 (Delhi). Stretch: sub-1:22.', 'Runs: first 2 km no faster than 5:15/km, then settle at 5:10–5:20. Keep every km within 15 sec of the first. In Delhi the runs went 5:14 → 6:40; even pacing is free time.', 'Run together; the slower runner sets the pace.', 'Stations: use the agreed split. You take the larger share of sleds and farmers carry if that is where you are stronger; split wall balls and lunges into short sets of 10–15.', 'Roxzone: walk in, move out. Every transition under 20 sec.']), block('FUEL', ['Carbohydrate meal 2–3 h before. 20–30 g carbohydrate 15 min before start.']), block('AFTER', ['Record official splits. They set the Hong Kong target.'])] },
  '2026-11-02': travelRest(),
  '2026-11-03': { title: 'Flush · easy bike or walk', type: 'RECOVERY', duration: '30 min', rpe: '2', blocks: [block('RECOVER', ['30 min easy bike or brisk walk + 10 min mobility.', 'Eat plenty of carbohydrate and protein; sleep 8+ hours.'])] },
  '2026-11-04': { title: 'Pre-race shakeout · 4 km', type: 'EASY', duration: '25 min', rpe: '3', blocks: [block('OPENERS', ['Taper 400s, short: 3 km easy, then 3 × 400 m at 4:30/km with 90 sec walking rest. Finish fresh.'])] },
  [RACE_DATES.jpm]: { title: 'JPMorganChase Corporate Challenge · 5.6K · RACE', type: 'RACE', race: true, duration: '~25 min', rpe: '9', note: 'Confirm your entry with the company team before race day.', blocks: [block('RACE PLAN · BEAT 25:27', ['Target pace 4:33/km or faster. Use the 21 Oct 5 × 1 km benchmark: all reps at 4:45 or faster means start at 4:35; otherwise start at 4:40–4:45 and close hard.', 'Km 1: 4:35–4:40, no faster. Last year km 1 was 4:19 and km 5 was 4:52, which cost the time. Km 2–4: hold. Last 1.6 km: everything you have.', '15 min warm-up with 4 strides. The legs may feel Shanghai for the first km; it passes.'])] },
  '2026-11-06': rest(),
  '2026-11-07': { title: 'Easy bike or rest', type: 'RECOVERY', duration: '0–30 min', rpe: '2', blocks: [block('OPTIONAL', ['20–30 min easy bike, or full rest.'])] },
  [RACE_DATES.rmac]: { title: 'RMAC Gold Coast 15K · easy long run', type: 'RACE', race: true, duration: '90–100 min', rpe: '4', blocks: [block('RUN IT AS TRAINING', ['6:00–6:30/km, conversational. This is your Osaka long run this week, not a race.', 'Practise race fuelling: one gel at 45 min.'])] },
  '2027-01-08': { title: 'Shakeout · 15 min', type: 'EASY', duration: '15 min', rpe: '2–3', blocks: [block('PRE-RACE', ['15 min easy jog + 3 strides. Final station split and changeover cues with your partner.'])] },
  [RACE_DATES.hongKong]: { title: 'AIA HYROX Hong Kong · Pro Doubles · RACE', type: 'RACE', race: true, duration: 'Afternoon wave', rpe: '9–10', blocks: [block('RACE PLAN · QUALIFICATION ATTEMPT', ['Target: set from Shanghai splits; provisional sub-1:20.', 'Runs: start at the compromised pace you held in the December simulations, then settle. Run together.', 'Stations: agreed split, short wall-ball and lunge sets, Roxzone under 20 sec per transition.', 'Carbohydrate meal 2–3 h before; 20–30 g carbohydrate 15 min before start.']), block('AFTER', ['Record official splits and age-group place. Check the Worlds slot allocation the same evening; you have 48 hours to accept.'])] },
  '2027-01-10': rest('Day after Hong Kong. Walk only.'),
  '2027-02-11': { ...easy(4), note: 'Travel to Bangkok if needed; run on arrival or skip.' },
  '2027-02-12': { title: 'Shakeout · 15 min', type: 'EASY', duration: '15 min', rpe: '2–3', blocks: [block('PRE-RACE', ['15 min easy jog + 3 strides. Station split and changeover cues confirmed.'])] },
  [RACE_DATES.bangkok]: { title: 'BYD HYROX Bangkok · Pro Doubles · RACE', type: 'RACE', race: true, duration: 'Afternoon wave', rpe: '9–10', blocks: [block('RACE PLAN', ['Second qualification attempt, or a Pro Doubles PB if Hong Kong already qualified.', 'Same execution as Hong Kong. Adjust run pace for heat: start 5–10 sec/km slower and keep drinking.', 'Osaka is 15 days later. No extra training on race weekend.'])] },
  [RACE_DATES.osaka]: { title: 'Osaka Marathon · RACE', type: 'RACE', race: true, duration: '4:15–4:25 target', rpe: '7–9', blocks: [block('RACE PLAN · FINISH STRONG', ['Km 0–10: 6:15–6:20/km. Km 10–30: 6:05–6:15/km. Km 30 onwards: hold, or push if you feel good.', '45–60 g carbohydrate an hour, starting at 30 min. Drink to thirst plus heat.', 'Stretch goal: beat 4:23:56. Main goal: a strong, even finish.'])] },
};

function postOsaka(iso: string, dow: number): Spec | null {
  const days = Math.round((Date.parse(iso) - Date.parse(RACE_DATES.osaka)) / 86400000);
  if (days < 1 || days > 21) return null;
  if (days <= 7) return rest(days === 1 ? 'Day after Osaka. Walk only.' : 'Marathon recovery week 1: walking and sleep. Optional 20 min easy bike from day 4.');
  if (days <= 14) return [{ title: 'Easy bike · 30 min', type: 'RECOVERY', duration: '30 min', rpe: '2–3', blocks: [block('RECOVER', ['30 min easy bike + mobility.'])] }, easy(5, 'Run/walk if needed. No strides.'), rest(), upper('reduced'), easy(5, 'Easy. No strides.'), rest(), easy(8, 'Easy. No strides.')][dow];
  return [lower('reduced'), easy(6), easy(8), upper('full'), hyrox('build', 3, '2 min'), rest(), long(12, 'Easy. Back to normal training next week.')][dow];
}

// Generic hybrid template after Osaka recovery (from 22 March 2027). Deload every 4th week.
function generic(dow: number, n: number): Spec {
  const deload = n % 4 === 3;
  const keyCycle: KeyRun[] = ['tempo321', 'brokenMiles', 'dropSet'];
  return [lower(deload ? 'reduced' : 'full'), easy(deload ? 6 : 10), key(deload ? 'thrDeload' : keyCycle[n % 3]), upper(deload ? 'reduced' : 'full'), deload ? hyrox('build', 3, '2 min') : hyrox(n % 2 ? 'build' : 'sim', 5, '90 sec'), rest(), long(deload ? 12 : 16, 'Aerobic support for HYROX; no marathon fuelling needed.')][dow];
}

export function seasonDay(iso: string, dow: number, monday: string, n: number): Spec {
  if (races[iso]) return races[iso];
  const p = postOsaka(iso, dow); if (p) return p;
  const week = W[monday];
  if (week) {
    const d = week.days[dow];
    if (d) return d;
    return isTravel(iso) ? hotelDay(iso, dow) : rest();
  }
  if (isTravel(iso)) return hotelDay(iso, dow);
  return generic(dow, n);
}

export function seasonWeek(monday: string, n: number): { phase: string; volume: string; focus: string; gate: string } | null {
  const w = W[monday];
  if (w) return { phase: w.phase, volume: `Target ${w.km}`, focus: w.focus, gate };
  if (monday >= '2027-03-01' && monday < '2027-03-22') return { phase: 'RECOVERY · OSAKA', volume: 'Target 0–30 km', focus: 'Marathon recovery first, then a gradual return.', gate };
  if (monday < CUTOVER) return null;
  const deload = n % 4 === 3;
  return { phase: deload ? 'DELOAD' : 'BUILD · HYBRID', volume: deload ? 'Target 30 km' : 'Target 40–45 km', focus: 'Hybrid build after Osaka. Taipei, Nagoya and Worlds stay conditional until entry or qualification is confirmed.', gate };
}

export function seasonSecondary(day: Day): Day['secondary'] {
  if (day.race || day.travel || ['REST', 'RECOVERY'].includes(day.type) || /TAPER|RECOVER/.test(day.title)) return { title: 'No second workout today', items: ['One session today. Rest, food and sleep are the work.'] };
  if (day.type === 'EASY' && day.dow === 'TUE') return { title: 'Optional · upper muscle · 30 min', items: ['At least 6 hours after the run. Incline dumbbell press 3 × 10 · cable row 3 × 12 · lateral raise 2 × 15 · curl 2 × 12.', 'Leave 2 reps in reserve. Skip it when sleep was short.'] };
  return { title: 'Optional · mobility · 15 min', items: ['Hips, ankles and thoracic spine. Dead bug and side plank 2 sets each.'] };
}

// Next-weeks outlook for the Season tab is derived from the week table itself.
export const weekTable = W;
