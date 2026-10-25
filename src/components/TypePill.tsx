const COLOURS: Record<string, string> = { QUALITY: 'var(--type-quality)', HYROX: 'var(--type-hyrox)', STRENGTH: 'var(--type-strength)', EASY: 'var(--type-easy)', RUN: 'var(--type-run)', LONG: 'var(--type-long)', RACE: 'var(--type-race)', RECOVERY: 'var(--type-recovery)', REST: 'var(--type-rest)', OPTIONAL: 'var(--type-optional)' };
export const typeColour = (type: string) => COLOURS[type] ?? 'var(--text-muted)';
export function TypePill({ type }: { type: string }) {
  return <span className={`pill${type === 'OPTIONAL' ? ' optional' : ''}`} style={{ '--type': typeColour(type) } as React.CSSProperties}>{type}</span>;
}
