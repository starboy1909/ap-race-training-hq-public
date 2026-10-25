export function More() {
  const items: [string, string, string][] = [
    ['#more/records', 'Records', 'Strava sync, strength log, manual log, private Garmin import, backups'],
    ['#more/coach', 'Coaching', 'Pace guide, HYROX standards, sleds, markers, fuel'],
    ['#more/season', 'Season', 'Ranked goals, season shape, next six weeks, local track hours'],
  ];
  return <section><p className="eyebrow">MORE</p><h2>Everything else</h2><div className="more-index">{items.map(([href, title, desc]) => <a key={href} href={href}><b>{title}</b><span>{desc}</span></a>)}</div></section>;
}
