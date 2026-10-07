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
- `src/data/completions.json`: activities recorded by the Sunday sync from Strava (Runna calendar as fallback).
  Append only, through a pull request.
- `src/data/strength.json`: strength sessions from Strong screenshots. Append only.

`rmr_completed_v4` and `ap_training_checkins_v1` are frozen browser keys. Optional
sessions use `<existing-day-id>-secondary`. Session logs and private Garmin imports use
new keys; old records are never reset. Export/import provides manual device transfer.
Browser records are not encrypted or automatically synchronised.

Never commit email contents, booking details, exact routes, account identifiers,
private health records or personal travel descriptions. Only neutral availability
adjustments and public-safe training summaries enter the website. Raw device history
and compact snapshots remain private. Purchased products are not assumed to be taken.

## Garmin

The page does not connect directly to Garmin. Import a private compact snapshot
with `lastSuccessfulSnapshotAt`, `healthByDate`, and optional `activities` into Records.
The importer merges by local date and activity ID. Missing measurements remain blank.
Daily retrieval must first inspect the last successful timestamp, skip if under 24 h,
and retrieve at most the latest three Hong Kong calendar days. Archive silently unless
new evidence materially changes coaching. Historical full-review scripts are manual
legacy utilities; they are not the hourly/free-tier snapshot path and must not be
used by the recurring watch.

`scripts/publish-weekly-garmin-review.ps1` is retired (5 Oct 2026). It pushed straight to
`main`; it now exits without doing anything. Weekly run data comes from the Sunday sync,
which opens a pull request.

## Validation and publication

`npm ci` then `npm run build`; `npm test` covers existing Garmin analysis safeguards.
GitHub Pages publishes `dist` via the existing workflow when `main` changes.
Preserve IDs, source labels, corrected repetition counts, and paid-versus-ballot states.

## 21 September build revision

`src/buildRevision.ts` applies structured strength progression and optional hotel-gym
work only from 21 September 2026. Earlier generated days and training history remain
unchanged. The old check-in storage key is retained solely for backup compatibility;
there is no daily check-in interface or requirement. Race views use chronological
ISO-date ordering. Tokyo and Pici are excluded from the active campaign.

## 6 October performance season

Goals are ranked (Shanghai → Hong Kong → Bangkok → Osaka → JPM) and every paid race is in the
daily plan with its own taper. `npm run verify` checks season logic: every paid race present,
no run over 14 km in the 6 days before an A race, no hard HYROX session in the 5 days before,
an easy day before and rest after each A race, no optional-only travel days, and a weekly km target.
