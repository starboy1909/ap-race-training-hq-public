# Rules for AI agents working on this repo

This repo publishes Amar's training plan to https://starboy1909.github.io/ap-race-training-hq-public/.
Every push to `main` goes live. These rules apply to every agent (Codex, ChatGPT, Claude or any other).

## 1. How changes reach `main`
- Never push to `main`. Work on a branch and open a pull request.
- **Do not merge your own pull request.** Leave it open. Claude reviews every pull request from Codex or any other agent against these rules, runs `npm run check` on it, and merges it only if it holds up. Otherwise Claude comments with the reason. Amar merges Claude's own pull requests.
- Run `npm ci` and `npm run check` before every push. Do not push if it fails.
  `npm run check` runs the unit tests (`scripts/garmin-analysis-core.test.mjs`, `src/lib/*.test.ts`), `scripts/verify-training-plan.mjs` (season rules) and the build.
- One pull request per change. Explain what changed and why in the PR description, with the evidence.
- No scheduled jobs, automations or scripts that commit or push on their own. The one exception is Claude's Sunday sync, which only opens a pull request. It also refreshes the Runna mirror (`src/data/runna.json`) from Amar's Runna calendar.

## 2. Where things live
| What | File | Rule |
|---|---|---|
| Future training (from 6 Oct 2026) | `src/seasonPlan.ts` | Change the week table `W`, the `races` map or the session builders. This is the only place future workouts change. |
| Plan assembly and history | `src/trainingPlan.ts`, `src/trainingHistory.ts`, `src/buildRevision.ts` | Do not add date patches such as `if(iso==='2027-01-05')`. Past days stay exactly as published. |
| Ranked goals, pace guide, markers | `src/seasonPlan.ts` (`seasonGoals`, `paceGuide`, `performanceMarkers`) | Change only with new race or test evidence. |
| Race calendar and entry status | `src/raceData.ts` | Paid, registered, waitlisted and watch stay separate. Add a source and a checked date. |
| Runs, 23 Nov 2026 to Osaka | `src/data/runna.json` | Mirror of Amar's Runna plan. Refreshed only by Claude's Sunday sync; other agents do not edit it. No Runna links or IDs. A changed run carries `changed.was` and `changed.why`. |
| Afternoon sessions on run days | `src/seasonPlan.ts` (`PM`) | Strength and HYROX next to the Runna run. Two double days a week until 3 Jan 2027, then three at most. None on race, travel or rest days. |
| Completed activities | `src/data/completions.json` | Append only. Written by the Sunday sync from Strava. |
| Strength sessions | `src/data/strength.json` | Append only. Added from Amar's Strong screenshots. |
| Local track timetable | `src/data/track.json` | One entry per month from the venue timetable Amar sends: open (A) and limited-lane (L) slots only, with source, issued and checked dates. Call it "local track" on the site; no venue name. Key runs show an optional evening track line; the morning session stays the default. |
| Results | `src/performanceData.ts`, `src/hyroxHistory.ts`, `src/resultDetails.ts` | Official or device-verified results only. |
| Site code | `src/App.tsx`, `src/components`, `src/screens`, `src/lib`, `src/styles` | Presentation only: no plan logic, no date patches. Keep the storage keys in `src/App.tsx` (the verify script reads them there). Pure helpers go in `src/lib` with a `node:test` file. Never add a "Daily check-in" UI. |

## 3. Training rules
- **Goal ranking:** JPM (5 Nov, the focus until race day; Shanghai is withdrawn, entry refunded) → Hong Kong (9 Jan) → Bangkok (13 Feb) → Hong Kong Marathon (17 Jan, raced; Amar 21 Nov) → Osaka (28 Feb, finish strong) → Taipei (13 Mar, finish strong) → Nagoya (17 Apr). When two goals compete, the higher one wins.
- **Runs come from Runna (Amar, 21 Nov).** From 23 Nov 2026 to Osaka the site shows Runna's runs as Runna wrote them, at Runna's paces. The only changes allowed:
  - rest the day after a race, and no Runna run on a race day;
  - no run over 14 km in the 6 days before an A race;
  - long run capped at 20 km 7–8 days before HYROX Hong Kong and Bangkok;
  - marathon-pace blocks carry "back off to 5:45–6:00/km if effort goes above RPE 7";
  - race plans in `src/seasonPlan.ts` stay as approved.

  The site plans the afternoon strength and HYROX sessions. Travel days have one session.
- **Changing a future workout** needs Amar's explicit approval in the conversation. One run, one Garmin metric, sleep, HRV or Body Battery is never enough on its own to change the plan.
- **Season rules enforced by `verify-training-plan.mjs`:**
  - every paid race is in the plan;
  - no run over 14 km in the 6 days before an A race;
  - no hard HYROX session in the 5 days before one;
  - an easy day before and rest after each A race;
  - no optional-only travel days;
  - every week has a km target.

  Do not weaken these checks to make a change pass.
- **Paces come from evidence** (for sessions the site plans; Runna runs use Runna's paces):
  - threshold 4:55–5:05/km;
  - intervals 4:35–4:45/km; JPM race pace 4:30/km (21 Oct benchmark, 4:26 average at RPE 8);
  - easy runs no faster than 5:50/km to 8 Nov 2026, then no faster than 5:40/km with heart rate under 150 (`EASY_CEILING_FROM` in `src/seasonPlan.ts`);
  - marathon pace 6:00–6:10/km.

  Adjust by at most 5 sec/km every two weeks, and only when all reps of a key session land on target at RPE 7 or less.
- **Rep pacing:** rep 1 starts at the slow end of its range. Race plans cap the first km.
- **Strength loads:**
  - back squat working sets from 60 kg;
  - RDL from 40 kg;
  - add 2.5 kg a week when every set is clean with 2 reps in reserve.
- **Do not add new races** to the plan until entry is paid and confirmed. Watch-list races stay out of the daily plan.
- **Ruled out by Amar: never add, not even as an opportunity or watch item.** HYROX Sanya, 6 Dec 2026 (travelling). Listed in `RULED_OUT` in `src/raceData.ts` and enforced by `npm run check`. Only Amar can remove an entry.

## 4. Privacy
Never commit email contents, booking or order details, ticket QR codes, exact routes, account identifiers, private health records, emergency contacts or personal travel descriptions. Only neutral availability changes (for example "travel, hotel gym") and public-safe training summaries go on the site. Raw Garmin data stays private.

## 5. Writing style on the site
Plain, direct language. Every key session states its target (pace, load or time). One gate for changing a session: pain that changes how you move, illness or fever.
