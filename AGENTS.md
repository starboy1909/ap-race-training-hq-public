# Rules for AI agents working on this repo

This repo publishes Amar's training plan to https://starboy1909.github.io/ap-race-training-hq-public/.
Every push to `main` goes live. These rules apply to every agent (Codex, ChatGPT, Claude or any other).

## 1. How changes reach `main`
- Never push to `main`. Work on a branch and open a pull request. Amar merges.
- Run `npm ci` and `npm run check` before every push. Do not push if it fails.
  `npm run check` runs the Garmin tests, `scripts/verify-training-plan.mjs` (season rules) and the build.
- One pull request per change. Explain what changed and why in the PR description, with the evidence.
- No scheduled jobs, automations or scripts that commit or push on their own.

## 2. Where things live
| What | File | Rule |
|---|---|---|
| Future training (from 6 Oct 2026) | `src/seasonPlan.ts` | Change the week table `W`, the `races` map or the session builders. This is the only place future workouts change. |
| Plan assembly and history | `src/trainingPlan.ts`, `src/trainingHistory.ts`, `src/buildRevision.ts` | Do not add date patches such as `if(iso==='2027-01-05')`. Past days stay exactly as published. |
| Ranked goals, pace guide, markers | `src/seasonPlan.ts` (`seasonGoals`, `paceGuide`, `performanceMarkers`) | Change only with new race or test evidence. |
| Race calendar and entry status | `src/raceData.ts` | Paid, registered, waitlisted and watch stay separate. Add a source and a checked date. |
| Completed runs | `src/data/completions.json` | Append only. Written by the Sunday sync from the Runna calendar. |
| Results | `src/performanceData.ts`, `src/hyroxHistory.ts`, `src/resultDetails.ts` | Official or device-verified results only. |

## 3. Training rules
- **Goal ranking:** Shanghai (1 Nov) → Hong Kong (9 Jan) → Bangkok (13 Feb) → Osaka (28 Feb) → JPM (5 Nov). When two goals compete, the higher one wins.
- **Changing a future workout** needs Amar's explicit approval in the conversation. One run, one Garmin metric, sleep, HRV or Body Battery is never enough on its own to change the plan.
- **Season rules enforced by `verify-training-plan.mjs`:**
  - every paid race is in the plan;
  - no run over 14 km in the 6 days before an A race;
  - no hard HYROX session in the 5 days before one;
  - an easy day before and rest after each A race;
  - no optional-only travel days;
  - every week has a km target.

  Do not weaken these checks to make a change pass.
- **Paces come from evidence:**
  - threshold 4:55–5:05/km;
  - intervals 4:35–4:45/km;
  - easy runs no faster than 5:50/km;
  - marathon pace 6:00–6:10/km.

  Adjust by at most 5 sec/km every two weeks, and only when all reps of a key session land on target at RPE 7 or less.
- **Rep pacing:** rep 1 starts at the slow end of its range. Race plans cap the first km.
- **Strength loads:**
  - back squat working sets from 60 kg;
  - RDL from 40 kg;
  - add 2.5 kg a week when every set is clean with 2 reps in reserve.
- **Do not add new races** to the plan until entry is paid and confirmed. Watch-list races stay out of the daily plan.

## 4. Privacy
Never commit email contents, booking or order details, ticket QR codes, exact routes, account identifiers, private health records, emergency contacts or personal travel descriptions. Only neutral availability changes (for example "travel, hotel gym") and public-safe training summaries go on the site. Raw Garmin data stays private.

## 5. Writing style on the site
Plain, direct language. Every key session states its target (pace, load or time). One gate for changing a session: pain that changes how you move, illness or fever.
