# AP Training HQ

Live: https://starboy1909.github.io/ap-race-training-hq-public/

**Agents and contributors: read [AGENTS.md](AGENTS.md) first.** No direct pushes to `main`;
every change goes through a pull request that passes `npm run check`.

The application has one canonical daily plan, one records centre, coaching guidance,
a race campaign and a season roadmap. Legacy results/master-plan URLs redirect here.

## Data ownership

- `src/trainingHistory.ts`: retained historical workout detail and stable completion IDs.
- `src/seasonPlan.ts`: the performance season from 6 October 2026. Ranked goals, race dates,
  one week table, session builders and the hotel template. Every future day comes from here.
- `src/trainingPlan.ts`: assembles the calendar through 13 June 2027. Days before 6 October keep
  their published prescriptions; later days are delegated to `seasonPlan.ts`. Osaka is part of the plan.
- `src/performanceData.ts`, `src/hyroxHistory.ts`, `src/resultDetails.ts`: historical results.
- `src/raceData.ts`: personal status separate from race opportunity status.
- `src/data/garmin-weekly.json`: explicitly historical aggregate, not current readiness.
- `src/data/completions.json`: activities recorded by the Sunday sync from Strava.
  Append only, through a pull request.
- `src/data/strength.json`: strength sessions from Strong screenshots. Append only.
- `src/data/track.json`: monthly local track jogging hours (open and limited-lane slots only). Key runs on
  dates after the timetable's checked date get an optional evening track line when the track is open from
  19:00 for at least 90 minutes. The morning session stays the default.

`rmr_completed_v4` and `ap_training_checkins_v1` are frozen browser keys. Optional
sessions use `<existing-day-id>-secondary`. Session logs and private Garmin imports use
new keys; old records are never reset. Export/import provides manual device transfer.
Browser records are not encrypted or automatically synchronised.

Never commit email contents, booking details, exact routes, account identifiers,
private health records or personal travel descriptions. Only neutral availability
adjustments and public-safe training summaries enter the website. Raw device history
and compact snapshots remain private. Purchased products are not assumed to be taken.

## Garmin

The page never connects to Garmin. Sleep, HRV, stress and Body Battery exist only on the device
through the private snapshot import in More › Records (`lastSuccessfulSnapshotAt`, `healthByDate`,
optional `activities`; merged by local date and activity ID). The Garmin publisher and connector
scripts were retired on 5 Oct 2026 and are kept only as history. Runs come from the Sunday Strava sync.

## Phone app, routes and the Profile model

The site is a phone-first app with a bottom tab bar: Today · Calendar · Profile · Races · More.
It is installable from the browser (manifest and icons in `public/`); in production a small service
worker (`public/sw.js`) keeps the last-seen plan available offline (navigations are network-first
with a 3 s timeout, hashed assets cache-first).

Routes are hashes: `#today`, `#calendar`, `#calendar/<YYYY-MM-DD>`, `#profile`, `#profile/results`,
`#races`, `#more`, `#more/records`, `#more/coach`, `#more/season`. Old links still work
(`#results`, `#season`, `#plan`, `#records`, `#coach`).

Code layout: `src/App.tsx` is the shell and holds the storage keys (the verify script reads them
there); `src/lib` is pure, Node-testable TypeScript (`npm test` runs `src/lib/*.test.ts`);
`src/components` and `src/screens` are the UI; `src/styles` holds the tokens (dark by default,
light via `prefers-color-scheme`). No plan logic lives in the UI.

The Profile page estimates fitness, fatigue and form from the public log: each session's load is
minutes × f × 0.64 × e^(1.92 f) (Banister TRIMP), where f is the fraction of heart-rate reserve from
the synced average heart rate (rest 55, max 190, assumptions), else from RPE for manual entries,
else a per-type default. Fitness is a 42-day exponential average, fatigue 7-day, form the difference.
The key-session scorecard applies the plan's own rule (every rep on target at RPE 7 or less is a hit;
a last rep more than 10 sec/km slower than the first means repeat). Everything is labelled as an
estimate and nothing on the page issues a train-or-rest instruction.

## Validation and publication

`npm ci` then `npm run check` (unit tests, season verify, build). The deploy workflow runs the same
check before publishing `dist` to GitHub Pages when `main` changes.
Preserve IDs, source labels, corrected repetition counts, and paid-versus-ballot states.

## 21 September build revision

`src/buildRevision.ts` applies structured strength progression and optional hotel-gym
work only from 21 September 2026. Earlier generated days and training history remain
unchanged. The old check-in storage key is retained solely for backup compatibility;
there is no daily check-in interface or requirement. Race views use chronological
ISO-date ordering. Tokyo and Pici are excluded from the active campaign.

## 6 October performance season

Goals are ranked (JPM → Hong Kong → Bangkok → Osaka → Taipei; Shanghai is withdrawn, entry refunded) and every paid race is in the
daily plan with its own taper. `npm run verify` checks season logic: every paid race present,
no run over 14 km in the 6 days before an A race, no hard HYROX session in the 5 days before,
an easy day before and rest after each A race, no optional-only travel days, and a weekly km target.
