export type Bar = { label: string; value: number; band?: [number, number]; highlight?: boolean };
export function BarChart({ bars, unit = '', title }: { bars: Bar[]; unit?: string; title: string }) {
  const W = 600, H = 200, pad = { l: 34, r: 8, t: 10, b: 28 };
  const max = Math.max(1, ...bars.map(b => Math.max(b.value, b.band?.[1] ?? 0))) * 1.1;
  const x = (i: number) => pad.l + (i / bars.length) * (W - pad.l - pad.r);
  const bw = (W - pad.l - pad.r) / bars.length;
  const y = (v: number) => H - pad.b - (v / max) * (H - pad.t - pad.b);
  const ticks = [0, 0.5, 1].map(f => Math.round(max * f / 1.1));
  return <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}: ${bars.map(b => `${b.label} ${b.value}${unit}`).join(', ')}`}>
    <desc>{title}</desc>
    {ticks.map(t => <g key={t}><line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className="grid" /><text x={pad.l - 6} y={y(t) + 4} className="tick" textAnchor="end">{t}</text></g>)}
    {bars.map((b, i) => <g key={i}>
      {b.band && <rect x={x(i) + bw * 0.12} width={bw * 0.76} y={y(b.band[1])} height={Math.max(1, y(b.band[0]) - y(b.band[1]))} className="band" />}
      <rect x={x(i) + bw * 0.22} width={bw * 0.56} y={y(b.value)} height={Math.max(0, H - pad.b - y(b.value))} className={`bar${b.highlight ? ' highlight' : ''}`} rx="3" />
      <text x={x(i) + bw / 2} y={H - pad.b + 16} className="tick" textAnchor="middle">{b.label}</text>
    </g>)}
  </svg>;
}
