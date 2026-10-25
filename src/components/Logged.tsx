import type { LoggedEntry } from '../lib/types.ts';
import { fmtShort } from '../lib/dates.ts';

export function Logged({ entries, title = 'Logged', empty }: { entries: LoggedEntry[]; title?: string; empty?: string }) {
  return <div className="card logged"><p className="eyebrow">{title.toUpperCase()}</p>
    {entries.length === 0 && <p className="muted">{empty ?? 'Nothing synced yet. The Sunday sync adds runs; strength comes from your Strong screenshots.'}</p>}
    {entries.map((e, i) => <article key={i}><b>{fmtShort(e.date)} · {e.title}</b>
      <span className="meta">{[e.source, e.km !== undefined ? `${e.km} km` : null, e.minutes !== undefined ? `${Math.round(e.minutes)} min` : null, e.pace, e.avgHr ? `HR ${e.avgHr}${e.maxHr ? ` / ${e.maxHr}` : ''}` : null, e.sets ? `${e.sets} sets` : null, e.rpe ? `RPE ${e.rpe}` : null].filter(Boolean).join(' · ')}</span>
      {(e.reps || e.stations) && <span className="meta">{e.reps}{e.reps && e.stations ? ' · ' : ''}{e.stations}</span>}
      {e.detail && <span className="meta">{e.detail}</span>}
      {e.note && <small>{e.note}</small>}
    </article>)}
  </div>;
}
