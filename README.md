# AP Race & Training HQ

Public-safe HYROX and road-racing season planner.

Live site: https://starboy1909.github.io/ap-race-training-hq-public/

## Privacy

This public version excludes exact personal travel dates, arrival times, trip
locations, booking information, private contact details, and the training
partner's identity.

Race results, training prescriptions, and readiness logic are intentionally
public. Daily completion and readiness entries stay only in the visitor's local
browser storage and are not uploaded.

Garmin processing is local and read-only. The private `.garmin-private/` archive
contains the raw activity and health responses and is excluded from Git. The
website receives only weekly aggregates, the `PROCEED / MODIFY / RECOVER`
decision, training implications, and a proposed-change summary. Activity names,
GPS/location details, credentials, OAuth tokens, and raw daily health records are
never published.

## Garmin weekly review

The baseline review collects all available activity summaries, 56 days of daily
health history, 30-day HRV, 56-day training load, 90-day VO2 max, endurance and
hill trends, current training status/readiness, load focus, race predictions,
personal records, Body Battery, and body composition when Garmin provides them.

One-time authentication, in a local PowerShell window:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/setup-garmin.ps1
```

Run a private review and regenerate the public-safe summary:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/run-weekly-garmin-review.ps1
```

The scheduled Codex review uses `scripts/publish-weekly-garmin-review.ps1`.
That wrapper requires a clean worktree, fast-forwards `main`, runs the private
review and all checks, stages only `src/data/garmin-weekly.json`, then commits
and pushes the derived summary. It stops rather than touching unrelated changes.

Safeguards:

- Garmin is read-only and listens only on `127.0.0.1` while a review is running.
- Pain at or above 4/10 overrides Garmin and stops quality training.
- Garmin may reduce load automatically; increases and race-plan changes require review.
- The public output is `src/data/garmin-weekly.json`; raw data stays in `.garmin-private/`.

## Development

```bash
npm install
npm run dev
npm run check
```
