export type Series = { name: string; values: number[]; className: string };
export function LineChart({ labels, series, bars, title, zero }: { labels: string[]; series: Series[]; bars?: number[]; title: string; zero?: boolean }) {
  const W = 600, H = 220, pad = { l: 34, r: 8, t: 10, b: 28 };
  const all = series.flatMap(s => s.values).concat(bars ?? []);
  const max = Math.max(1, ...all) * 1.05, min = zero ? Math.min(0, ...all) * 1.05 : 0;
  const n = Math.max(1, labels.length - 1);
  const x = (i: number) => pad.l + (i / n) * (W - pad.l - pad.r);
  const y = (v: number) => H - pad.b - ((v - min) / (max - min)) * (H - pad.t - pad.b);
  const path = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const every = Math.max(1, Math.round(labels.length / 6));
  return <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}. ${series.map(s => `${s.name} latest ${s.values[s.values.length - 1]}`).join(', ')}`}>
    <desc>{title}</desc>
    <line x1={pad.l} x2={W - pad.r} y1={y(0)} y2={y(0)} className="grid" />
    {bars?.map((v, i) => <rect key={i} x={x(i) - 1} width="2" y={Math.min(y(v), y(0))} height={Math.abs(y(0) - y(v))} className="bar faint" />)}
    {series.map(s => <path key={s.name} d={path(s.values)} className={`line ${s.className}`} fill="none" />)}
    {labels.map((l, i) => i % every === 0 ? <text key={i} x={x(i)} y={H - pad.b + 16} className="tick" textAnchor="middle">{l}</text> : null)}
    <text x={pad.l - 6} y={y(max / 1.05) + 4} className="tick" textAnchor="end">{Math.round(max / 1.05)}</text>
    {zero && <text x={pad.l - 6} y={y(min / 1.05) + 4} className="tick" textAnchor="end">{Math.round(min / 1.05)}</text>}
  </svg>;
}
