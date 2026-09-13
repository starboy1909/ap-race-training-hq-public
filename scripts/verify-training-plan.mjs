import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { readFile, unlink } from 'node:fs/promises';
const target=new URL('../.plan-verification.mjs',import.meta.url).pathname;
await build({entryPoints:['src/trainingPlan.ts'],bundle:true,platform:'node',format:'esm',outfile:target});
try {
 const {buildPlan}=await import(target);
 for(const branch of ['none','osaka','tokyo']){
  const weeks=buildPlan(branch);const future=weeks.flatMap(w=>w.days).filter(d=>d.iso);
  assert.equal(future.length,273);assert.equal(future.at(-1).iso,'2027-06-13');
  assert.equal(new Set(future.map(d=>d.id)).size,future.length);
  for(let i=1;i<future.length;i++)assert.equal(Date.parse(future[i].iso)-Date.parse(future[i-1].iso),86400000);
  for(const d of future){assert.ok(d.blocks?.length);assert.ok(d.secondary);if(d.type==='RACE'||d.travel)assert.match(d.secondary.title,/No second/);}
  const japan=future.filter(d=>/Marathon · conditional/.test(d.title));assert.equal(japan.length,branch==='none'?0:1);
  assert.equal(future.find(d=>d.iso==='2026-12-13').race,undefined);
  assert.equal(future.find(d=>d.iso==='2027-01-09').race,true);
  const sep=weeks.find(w=>w.id==='S19');assert.equal(sep.days[0].id,'S19-0');assert.equal(sep.days[2].type,'QUALITY');
 }
 const app=await readFile('src/App.tsx','utf8');for(const key of ['rmr_completed_v4','ap_training_checkins_v1'])assert.ok(app.includes(key));
 const hist=await readFile('src/trainingHistory.ts','utf8');assert.ok(hist.includes('3×1 km')||hist.includes('3 × 1 km'));
 console.log('PASS: 273 continuous future days, stable IDs, detailed optional sessions, single marathon branches, race/recovery gates.');
}finally{await unlink(target);}
