import type { FormEvent } from 'react';
import { Table } from '../components/Table.tsx';
import { topSetLabel } from '../lib/calendar.ts';
import { fmtDay } from '../lib/dates.ts';
import type { Completion, StrengthEntry, ManualLog, Snapshot, Day } from '../lib/types.ts';
import oldGarmin from '../data/garmin-weekly.json';

type Props = {
  today: string; completions: Completion[]; strength: StrengthEntry[]; logs: ManualLog[]; snapshot: Snapshot; archiveRows: Day[];
  view: string; setView: (v: string) => void; onSession: (e: FormEvent<HTMLFormElement>) => void; onImport: (f?: File) => void; onExport: () => void;
};

export function Records({ today, completions, strength, logs, snapshot, archiveRows, view, setView, onSession, onImport, onExport }: Props) {
  const runs = completions.filter(c => (c.type ?? 'run') === 'run' && c.distanceKm).sort((a, b) => b.date.localeCompare(a.date));
  const latestRun = runs[0];
  const latestSync = [...completions].sort((a, b) => b.date.localeCompare(a.date))[0]?.date;
  const latestStrength = [...strength].sort((a, b) => b.date.localeCompare(a.date))[0]?.date;
  const byDate = [...completions].sort((a, b) => b.date.localeCompare(a.date));
  return <section>
    <div className="section-head"><div><p className="eyebrow">RECORDS</p><h2>One record centre</h2><p>Synced activities, self-reports and private device data keep their source labels.</p></div><button onClick={onExport}>Export private backup</button></div>
    <div className="metric-grid">
      <article><small>LATEST SYNC</small><b>{latestSync ? fmtDay(latestSync) : '—'}</b><p>Strava weekly sync. {completions.length} activities logged since 29 Sep 2026.</p></article>
      <article><small>LATEST RUN</small><b>{latestRun ? `${latestRun.distanceKm} km` : '—'}</b><p>{latestRun ? `${fmtDay(latestRun.date)} · ${latestRun.time ?? ''}${latestRun.pace ? ` · ${latestRun.pace}` : ''}` : 'No runs synced yet.'}</p></article>
      <article><small>LATEST STRENGTH</small><b>{latestStrength ? fmtDay(latestStrength) : '—'}</b><p>{strength.length} sessions logged from Strong screenshots.</p></article>
      <article><small>PRIVATE DATA</small><b>{Object.keys(snapshot.healthByDate || {}).length} days</b><p>Imported health history on this device. Not sent to the public website.</p></article>
    </div>
    <div className="callout"><b>Sources</b><p>Runs, rides and HYROX sessions come from Strava each Sunday. Strength detail comes from Strong screenshots. Garmin sleep, HRV and Body Battery exist only on this device, through the private import below.</p>
      <label className="file-button">Import private snapshot / backup<input type="file" accept="application/json,.json" onChange={e => onImport(e.target.files?.[0])} /></label>
      <p>Private entries stay in this browser, are not encrypted and do not sync automatically. Export a backup before changing device or clearing browser data. Never use a shared device for sensitive notes.</p></div>
    <div className="subnav">{[['sessions', 'Training log'], ['daily', 'Imported health'], ['history', 'History']].map(([id, label]) => <button key={id} className={view === id ? 'active' : ''} aria-pressed={view === id} onClick={() => setView(id)}>{label}</button>)}</div>
    {view === 'sessions' && <>
      <h3>Weekly sync · Strava</h3>{byDate.length ? <Table heads={['Date', 'Type', 'Source', 'Planned', 'Recorded', 'Distance', 'Time', 'Pace', 'HR avg / max', 'Reps / stations', 'Note']} rows={byDate.map(c => [c.date, c.type || 'run', c.source === 'self-reported' ? 'Self-reported' : 'Strava', c.planned, c.title, c.distanceKm !== undefined ? `${c.distanceKm} km` : '—', c.time || '—', c.pace || '—', c.avgHr ? `${c.avgHr} / ${c.maxHr ?? '—'}` : '—', c.reps || c.stations || '—', c.note || '—'])} /> : <p className="empty">The Sunday sync adds your Strava activities here each week.</p>}
      <h3>Strength log · from Strong screenshots</h3>{strength.length ? <Table heads={['Date', 'Session', 'Top sets', 'Working sets', 'Note']} rows={[...strength].reverse().map(e => [e.date, e.session, e.exercises.map(x => `${x.name} ${topSetLabel(x.sets)}`).join(' · '), e.exercises.reduce((n, x) => n + x.sets.length, 0), e.note || '—'])} /> : <p className="empty">Strength sessions appear here after you share your Strong screenshots.</p>}
      <h3>Log actual work</h3>
      <form className="grid" onSubmit={onSession}><label>Date<input name="date" type="date" defaultValue={today} required /></label><label>Session<select name="slot"><option>Primary</option><option>Optional second</option><option>Unplanned</option></select></label><label>Duration, min<input name="minutes" type="number" min="1" max="600" required /></label><label>Session RPE 0–10<input name="rpe" type="number" min="0" max="10" required /></label><label className="wide">Exercise details / load / sets / pace / rest<textarea name="details" placeholder="Example: sled mass 42 kg + plates 110 kg = 152 kg total; 3 × 12.5 m; 24/25/25 sec; RPE 6" required /></label><button>Save session</button></form>
      <p>Load = minutes × session RPE. It is a personal trend measure, not an injury prediction. Do not add a synced activity and a manual entry for the same session.</p>
      {logs.length > 0 && <Table heads={['Date', 'Session', 'Minutes', 'RPE', 'Load', 'Details']} rows={[...logs].reverse().map(x => [x.date, x.slot, x.minutes, x.rpe, x.load, x.details])} />}
    </>}
    {view === 'daily' && <><h3>Imported Garmin health history</h3>{snapshot.lastSuccessfulSnapshotAt && <p>Snapshot: {snapshot.lastSuccessfulSnapshotAt} · latest calendar day may be partial.</p>}
      {Object.keys(snapshot.healthByDate || {}).length > 0 ? <Table heads={['Date', 'Sleep h', 'Sleep score', 'RHR', 'HRV ms', 'Stress', 'BB high / low']} rows={Object.entries(snapshot.healthByDate || {}).sort(([a], [b]) => b.localeCompare(a)).map(([date, h]) => [date, h.sleepHours ?? '—', h.sleepScore ?? '—', h.restingHeartRate ?? '—', h.hrvAverageMs ?? '—', h.stressAverage ?? '—', `${h.bodyBatteryHigh ?? '—'} / ${h.bodyBatteryLow ?? '—'}`])} /> : <p className="empty">Import your private compact snapshot to view sleep, HRV, stress and Body Battery here.</p>}
      {snapshot.supplementPurchases?.length ? <><h3>Private purchase inventory</h3><Table heads={['Product', 'Evidence date', 'Use status']} rows={snapshot.supplementPurchases.map(x => [x.product, x.purchased, x.use])} /></> : null}
      <details><summary>Imported device activities ({snapshot.activities?.length || 0})</summary><Table heads={['Date', 'Type', 'Distance km', 'Duration min']} rows={(snapshot.activities || []).map(a => [String(a.date || ''), String(a.type || ''), String(a.distanceKm ?? '—'), Math.round(Number(a.durationSeconds || 0) / 60)])} /></details></>}
    {view === 'history' && <><h3>Verified training archive · to 20 Sep 2026</h3><p>Prescriptions and corrections before the season plan stay in the Calendar. Completion checkboxes are preserved separately.</p><Table heads={['Date', 'Session', 'Evidence']} rows={archiveRows.map(d => [d.date, d.title, d.note || d.duration])} />
      <details className="archive"><summary>Historical Garmin aggregate · August 2026</summary><p>This dated review is preserved, not used as today’s readiness instruction.</p><p>{oldGarmin.summary}</p><Table heads={['Historical metric', 'Value', 'Context']} rows={oldGarmin.metrics.map(m => [m.label, m.value, m.trend])} /></details></>}
  </section>;
}
