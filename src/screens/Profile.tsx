import { Table } from '../components/Table.tsx';
import { seasonGoals, performanceMarkers, paceGuide } from '../seasonPlan';
import { roadResults } from '../performanceData';
import { resultDetails } from '../resultDetails';
import { raceHistory, singlesStationTrend } from '../hyroxHistory';

export function Profile({ sub }: { sub?: string }) {
  return <section>
    <p className="eyebrow">ATHLETE PROFILE</p><h2>Targets and results</h2>
    <p>Fitness, load and strength trends arrive in the next update. Targets and verified results are here now.</p>
    <h3>Ranked goals</h3><Table heads={['Rank', 'Race', 'Target']} rows={seasonGoals} />
    <h3>Pace guide</h3><Table heads={['Purpose', 'Pace', 'Execution']} rows={paceGuide} />
    <h3>Performance markers</h3><Table heads={['Marker', 'Now', 'Target', 'How the plan gets there']} rows={performanceMarkers} />
    <h3 id="results" className="results-anchor" tabIndex={-1}>Verified results</h3>
    {sub === 'results' && <p className="muted">Official or device-verified results only.</p>}
    <h4>Road</h4><Table heads={['Date', 'Event', 'Distance', 'Net', 'Official', 'Pace', 'Context']} rows={roadResults.map(r => [r.date, r.event, r.distance, r.net, r.official, r.pace, r.result])} />
    <h4>HYROX</h4><Table heads={['Event', 'Division', 'Time', 'Context']} rows={raceHistory} />
    {resultDetails.map((rows, i) => <details key={i}><summary>{['Kerry marathon checkpoints · chip cumulative', 'SCHK marathon checkpoints · official cumulative', 'Taipei Open Singles · complete station record'][i]}</summary><Table heads={rows[0]} rows={rows.slice(1)} />{i === 2 && <p>Station total 43:08; run 44:08; arithmetic leaves 10:06 for Roxzone/non-station time. The original HQ summary reports 10:10; the four-second discrepancy is retained.</p>}</details>)}
    <h4>Station priorities from historical singles</h4><Table heads={['Station', 'Earlier', 'Later Pro', 'Development need']} rows={singlesStationTrend} />
    <p>Different venues, loads and partners limit comparisons. Team times and device predictions are not individual race benchmarks.</p>
  </section>;
}
