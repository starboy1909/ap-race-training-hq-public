# AP Training HQ

Live: https://starboy1909.github.io/ap-race-training-hq-public/

The application has one canonical daily plan, one records centre, coaching guidance,
a race campaign and a season roadmap. Legacy results/master-plan URLs redirect here.

## Data ownership

- `src/trainingHistory.ts`: retained historical workout detail and stable completion IDs.
- `src/trainingPlan.ts`: daily provisional prescriptions through 13 June 2027; one optional
  selected-and-paid Japan marathon branch at a time. Availability constraints are neutral.
- `src/performanceData.ts`, `src/hyroxHistory.ts`, `src/resultDetails.ts`: historical results.
- `src/raceData.ts`: personal status separate from race opportunity status.
- `src/data/garmin-weekly.json`: explicitly historical aggregate, not current readiness.

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

## Validation and publication

`npm ci` then `npm run build`; `npm test` covers existing Garmin analysis safeguards.
GitHub Pages publishes `dist` via the existing workflow when `main` changes.
Preserve IDs, source labels, corrected repetition counts, and paid-versus-ballot states.
