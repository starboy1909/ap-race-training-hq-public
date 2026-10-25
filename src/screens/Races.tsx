import { Table } from '../components/Table.tsx';
import { chronologicalRaces as races, procamEvents } from '../raceData';

export function Races({ today }: { today: string }) {
  const groups: [string, typeof races][] = [
    ['Confirmed & training toward', races.filter(r => r.category === 'campaign' && r.status !== 'DONE' && r.priority !== 'INACTIVE' && r.startIso >= today)],
    ['Registration opportunities · date order', races.filter(r => r.category !== 'campaign' && r.startIso >= today)],
    ['Inactive / retained entry record', races.filter(r => r.priority === 'INACTIVE')],
  ];
  return <section><p className="eyebrow">RACE HQ</p><h2>One race campaign · earliest first</h2>
    <h3>Upcoming timeline · all active statuses</h3><Table heads={['Date', 'Event', 'Status']} rows={races.filter(r => r.startIso >= today && r.status !== 'DONE' && r.priority !== 'INACTIVE').map(r => [r.date, r.name, r.status])} />
    <p>Road-race scan: <a href="https://fitz.hk/hksports-timetable/" target="_blank" rel="noreferrer">Fitz calendar</a> · <a href="https://joymiles.hk/product/rac10k/" target="_blank" rel="noreferrer">RAC organizer</a>. Dates alone do not establish open registration; nothing joins the plan until entry is paid and confirmed.</p>
    {groups.map(([title, list]) => <div key={title}><h3>{title}</h3><div className="race-grid">{list.map(r => <article key={r.name}><span className="tag">{r.status}</span><h4>{r.name}</h4><b>{r.date} · {r.type}</b><p>{r.note}</p>{r.sourceUrl && <a href={r.sourceUrl} target="_blank" rel="noreferrer">{r.sourceLabel}</a>}<small>Reviewed {r.checked}</small></article>)}</div></div>)}
    <details><summary>Optional Procam sequence</summary><div className="race-grid">{procamEvents.map(r => <article key={r.name}><h4>{r.name} · {r.date}</h4><p>{r.registration} · {r.fit}</p><a href={r.sourceUrl} target="_blank" rel="noreferrer">Official information</a></article>)}</div></details>
    <p>Completed events are in Profile. A target is a committed planning goal, not proof of personal registration. Ballots remain unconfirmed until selected and paid.</p>
  </section>;
}
