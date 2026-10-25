import { useMemo } from 'react';
import { Table } from '../components/Table.tsx';
import { BarChart } from '../components/charts/BarChart.tsx';
import { LineChart } from '../components/charts/LineChart.tsx';
import { Sparkline } from '../components/charts/Sparkline.tsx';
import { seasonGoals, performanceMarkers, paceGuide, hkRaceModel, A_RACES } from '../seasonPlan';
import { roadResults } from '../performanceData';
import { resultDetails } from '../resultDetails';
import { raceHistory, singlesStationTrend } from '../hyroxHistory';
import { sessionLoads, fitnessSeries, weeklyKmSeries, basisCounts, HR_REST, HR_MAX } from '../lib/load.ts';
import { LIFTS, liftSeries, e1rm, progressionReady } from '../lib/strength.ts';
import { scorecard } from '../lib/scorecard.ts';
import { fmtDay, fmtShort, daysBetween } from '../lib/dates.ts';
import type { Day, Week, LoggedEntry, StrengthEntry } from '../lib/types.ts';

type Props = { sub?: string; today: string; weeks: Week[]; days: Day[]; index: Map<string, LoggedEntry[]>; strength: StrengthEntry[] };

export function Profile({ sub, today, weeks, days, index, strength }: Props) {
  const loads = useMemo(() => sessionLoads(index), [index]);
  const series = useMemo(() => fitnessSeries(loads, today), [loads, today]);
  const km = useMemo(() => weeklyKmSeries(index, weeks, today, 12), [index, weeks, today]);
  const scores = useMemo(() => scorecard(days, index), [days, index]);
  const counts = basisCounts(loads);
  const last = series[series.length - 1], week = series[Math.max(0, series.length - 8)];
  const delta = (k: 'ctl' | 'atl' | 'tsb') => last && week ? Math.round((last[k] - week[k]) * 10) / 10 : 0;
  const sign = (n: number) => `${n > 0 ? '+' : ''}${n}`;
  const races = days.filter(d => d.race && d.iso! >= today && A_RACES.includes(d.iso!));
  const lifts = LIFTS.map(l => ({ lift: l, points: liftSeries(strength, l.key) })).filter(x => x.points.length);
  return <section>
    <p className="eyebrow">ATHLETE PROFILE</p><h2>Fitness, load and targets</h2>
    <p className="muted">Estimated from the public log (Strava sync, Strong screenshots, manual entries). Not device values; no train-or-rest verdict.</p>
    {last && <div className="stat-grid">
      <div className="stat"><small>Estimated fitness</small><b>{Math.round(last.ctl)}</b><p>{sign(delta('ctl'))} in 7 days · 42-day load average</p></div>
      <div className="stat"><small>Estimated fatigue</small><b>{Math.round(last.atl)}</b><p>{sign(delta('atl'))} in 7 days · 7-day load average</p></div>
      <div className="stat"><small>Form</small><b>{sign(Math.round(last.tsb))}</b><p>fitness minus fatigue, yesterday’s values</p></div>
      <div className="stat"><small>Sessions scored</small><b>{loads.length}</b><p>{counts.hr} from heart rate · {counts.rpe} from RPE · {counts.type} from session type</p></div>
    </div>}
    <h3>Weekly km · last 12 weeks</h3>
    <BarChart title="Weekly km logged against the plan target" unit=" km" bars={km.map(w => ({ label: w.label.replace('W', ''), value: w.actualKm, band: w.planned ? [w.planned.min, w.planned.max] : undefined, highlight: w.mondayIso <= today && today <= w.mondayIso.replace(/\d\d$/, m => String(Number(m) + 6).padStart(2, '0')) }))} />
    <p className="muted">Bars are run and HYROX km from the log; the shaded band is the week’s target. Rides are not counted.</p>
    <h3>Estimated training load</h3>
    {series.length > 0 && <LineChart title="Daily load with fitness and fatigue" labels={series.map(p => fmtDay(p.date))} bars={series.map(p => p.load)} series={[{ name: 'Fitness', values: series.map(p => p.ctl), className: 'accent' }, { name: 'Fatigue', values: series.map(p => p.atl), className: 'warn' }]} />}
    {series.length > 0 && <LineChart title="Form (fitness minus fatigue)" labels={series.map(p => fmtDay(p.date))} series={[{ name: 'Form', values: series.map(p => p.tsb), className: 'ok' }]} zero />}
    <details><summary>How this is estimated</summary>
      <p>Each session gets a load of minutes × f × 0.64 × e<sup>1.92 f</sup> (Banister TRIMP), where f is the fraction of heart-rate reserve. f comes from the average heart rate when the sync has it (rest {HR_REST}, max {HR_MAX}, both assumptions), else from the RPE of a manual entry (0.45 + 0.05 × RPE), else from the session type (strength 0.55, easy 0.65, long 0.68, quality 0.80, HYROX 0.82, race 0.90). Minutes come from the logged time, else distance × pace, else a default per type ({counts.estimatedDurations} sessions used a default).</p>
      <p>Fitness is a 42-day exponential average of daily load, fatigue a 7-day one, form the difference using yesterday’s values. Both start from the first two weeks’ mean, so the first six weeks of logging (from 29 Sep 2026) are still settling. A manual entry is ignored when a synced session exists that day unless it was logged as Unplanned.</p>
    </details>
    <h3>Key session scorecard</h3>
    {scores.length ? <div className="score-list">{scores.map(s => <article key={s.date} className={`score ${s.verdict}`}><span className="pill" style={{ '--type': `var(--v-${s.verdict})` } as React.CSSProperties}>{s.verdict.toUpperCase()}</span><b>{fmtShort(s.date)} · {s.title}</b><span className="meta">Target {s.target} · Actual {s.actual}</span><small>{s.reason}</small></article>)}</div> : <p className="empty">Key sessions appear here once their reps are logged.</p>}
    <p className="muted">The plan’s rule: every rep on target at RPE 7 or less with even splits is a hit; the next session of that type can be 5 sec/km faster after two weeks. A last rep more than 10 sec/km slower than the first means repeat.</p>
    <h3>Race targets</h3>
    <div className="race-grid">{races.map(r => <article key={r.iso}><span className="tag">{daysBetween(today, r.iso!)} days</span><h4>{r.title.split(' · RACE')[0]}</h4><b>{r.date}</b><p>{r.blocks?.[0]?.items[0]}</p></article>)}</div>
    <Table heads={['Rank', 'Race', 'Target']} rows={seasonGoals} />
    <h4>Hong Kong Pro Doubles · race model</h4><Table heads={['Part', 'Sub-1:20 model', '24 Oct simulation', 'Focus']} rows={hkRaceModel} />
    <h4>Pace guide</h4><Table heads={['Purpose', 'Pace', 'Execution']} rows={paceGuide} />
    <h4>Performance markers</h4><Table heads={['Marker', 'Now', 'Target', 'How the plan gets there']} rows={performanceMarkers} />
    <h3>Strength · top set per lift</h3>
    {lifts.length ? <div className="lift-grid">{lifts.map(({ lift, points }) => { const p = points[points.length - 1]; const ready = p.kg && lift.key === 'squat' ? progressionReady(p.sets, p.kg, 5) : p.kg && lift.key === 'rdl' ? progressionReady(p.sets, p.kg, 8) : undefined;
      return <article key={lift.key} className="lift"><b>{lift.label}</b><span className="meta">{fmtShort(p.date)} · {p.kg ? `${p.kg} kg × ${p.reps}${lift.unit ? ` ${lift.unit}` : ''}` : `${p.reps} ${lift.unit ?? 'reps'}`}{p.kg && !lift.unit ? ` · est. 1RM ${e1rm(p.kg, p.reps)} kg` : ''}</span><Sparkline title={`${lift.label} top set`} values={points.map(x => x.kg ?? x.reps)} />{ready !== undefined && <small>{ready ? 'All working sets clean: add 2.5 kg next time.' : 'Working sets not all at target reps yet: hold the load.'}</small>}</article>; })}</div> : <p className="empty">Strength trends appear after Strong screenshots are logged.</p>}
    <h3 id="results" className="results-anchor" tabIndex={-1}>Verified results</h3>
    {sub === 'results' && <p className="muted">Official or device-verified results only.</p>}
    <h4>Road</h4><Table heads={['Date', 'Event', 'Distance', 'Net', 'Official', 'Pace', 'Context']} rows={roadResults.map(r => [r.date, r.event, r.distance, r.net, r.official, r.pace, r.result])} />
    <h4>HYROX</h4><Table heads={['Event', 'Division', 'Time', 'Context']} rows={raceHistory} />
    {resultDetails.map((rows, i) => <details key={i}><summary>{['Kerry marathon checkpoints · chip cumulative', 'SCHK marathon checkpoints · official cumulative', 'Taipei Open Singles · complete station record'][i]}</summary><Table heads={rows[0]} rows={rows.slice(1)} />{i === 2 && <p>Station total 43:08; run 44:08; arithmetic leaves 10:06 for Roxzone/non-station time. The original HQ summary reports 10:10; the four-second discrepancy is retained.</p>}</details>)}
    <h4>Station priorities from historical singles</h4><Table heads={['Station', 'Earlier', 'Later Pro', 'Development need']} rows={singlesStationTrend} />
    <p>Different venues, loads and partners limit comparisons. Team times and device predictions are not individual race benchmarks.</p>
  </section>;
}
