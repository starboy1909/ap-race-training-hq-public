import type { ReactNode } from 'react';
export function Table({ heads, rows, caption }: { heads: string[]; rows: (string | number | ReactNode)[][]; caption?: string }) {
  return <div className="table-wrap"><table>{caption && <caption className="visually-hidden">{caption}</caption>}<thead><tr>{heads.map(x => <th scope="col" key={x}>{x}</th>)}</tr></thead>
    <tbody>{rows.map((r, i) => <tr key={i}>{r.map((x, j) => <td key={j} data-label={heads[j]}>{x}</td>)}</tr>)}</tbody></table></div>;
}
