import { Table } from '../components/Table.tsx';
import { season } from '../trainingPlan';
import { seasonGoals, trackWindow, trackWindows, TRACK_EARLIEST } from '../seasonPlan';
import { fmtShort } from '../lib/dates.ts';
import track from '../data/track.json';
import type { Week } from '../lib/types.ts';

export function Season({ today, upcoming }: { today: string; upcoming: Week[] }) {
  const trackDates = Object.values(track.months).flatMap(m => Object.keys(m.days)).filter(d => d >= today).sort().slice(0, 21);
  const trackRows = trackDates.map(d => [fmtShort(d), (trackWindows(d) ?? []).join(', ') || 'Closed or booked', trackWindow(d) ?? 'No']);
  return <section><p className="eyebrow">SEASON</p><h2>Ranked goals. One season.</h2><p>Born April 1990: you race Hong Kong and Bangkok at 36. When two goals compete, the higher one wins.</p>
    <Table heads={['Rank', 'Race', 'Target']} rows={seasonGoals} />
    <h3>Season shape</h3><Table heads={['Window', 'Focus', 'Detail']} rows={season} />
    <h3>Next six weeks</h3><Table heads={['Week', 'Phase', 'Volume', 'Focus']} rows={upcoming.map(w => [`${w.label} · ${w.dates}`, w.phase, w.volume, w.focus])} />
    <h3>Local track · open hours</h3><p>From the monthly jogging timetable. Key runs show a track option when the track is open from {TRACK_EARLIEST} for at least 90 minutes. The morning session stays the default. Bookings can change; check with the venue before you go.</p>
    {trackRows.length ? <Table heads={['Date', 'Open for jogging', 'Usable from ' + TRACK_EARLIEST]} rows={trackRows} /> : <p className="empty">No timetable loaded for the coming weeks yet. Send the next month’s timetable and it appears here.</p>}
    <h3>Weekly review · Sunday</h3><ol><li>Compare each key session’s target with what you did: splits, loads, station and transition times.</li><li>Make one decision for next week: progress (all targets hit at RPE 7 or less), hold, or repeat.</li><li>Sleep, HRV and Body Battery are context for that decision, not a reason to change a single day.</li><li>Recheck race entries and partner plans before each taper.</li></ol>
  </section>;
}
