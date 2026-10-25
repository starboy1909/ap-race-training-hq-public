export function Sparkline({ values, title }: { values: number[]; title: string }) {
  const W = 120, H = 32; const max = Math.max(...values, 1), min = Math.min(...values, 0);
  const n = Math.max(1, values.length - 1);
  const pts = values.map((v, i) => `${(i / n) * (W - 4) + 2},${H - 2 - ((v - min) / Math.max(1, max - min)) * (H - 4)}`).join(' ');
  return <svg className="spark" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}: ${values.join(', ')}`}><polyline points={pts} fill="none" className="line accent" />{values.length === 1 && <circle cx="2" cy={H / 2} r="2" className="dotfill" />}</svg>;
}
