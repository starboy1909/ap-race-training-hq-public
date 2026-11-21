import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { readFile, unlink } from 'node:fs/promises';
const target=new URL('../.plan-verification.mjs',import.meta.url).pathname;
await build({entryPoints:['src/trainingPlan.ts'],bundle:true,platform:'node',format:'esm',outfile:target,logLevel:'error'});
const sm=new URL('../.season-verification.mjs',import.meta.url).pathname;
await build({entryPoints:['src/seasonPlan.ts'],bundle:true,platform:'node',format:'esm',outfile:sm,logLevel:'error'});
const rd=new URL('../.race-verification.mjs',import.meta.url).pathname;
await build({entryPoints:['src/raceData.ts'],bundle:true,platform:'node',format:'esm',outfile:rd,logLevel:'error'});
try {
 const {buildPlan}=await import(target);
 const {A_RACES,RACE_DATES,CUTOVER,trackWindows,runnaPlan,PM}=await import(sm);
 const weeks=buildPlan();const future=weeks.flatMap(w=>w.days).filter(d=>d.iso);
 const byIso=Object.fromEntries(future.map(d=>[d.iso,d]));
 const shift=(iso,n)=>new Date(Date.parse(iso+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);

 // Races Amar has ruled out never come back, not even as opportunities
 const {races,RULED_OUT}=await import(rd);
 for(const r of races)for(const k of RULED_OUT)assert.ok(!r.name.toLowerCase().includes(k.toLowerCase()),`ruled out by Amar: ${r.name}`);

 // Structure
 assert.equal(future.length,273);assert.equal(future.at(-1).iso,'2027-06-13');
 assert.equal(new Set(future.map(d=>d.id)).size,future.length);
 for(let i=1;i<future.length;i++)assert.equal(Date.parse(future[i].iso)-Date.parse(future[i-1].iso),86400000);
 for(const d of future){assert.ok(d.blocks?.length,d.iso);assert.ok(d.secondary,d.iso);if(d.type==='RACE'||d.travel)assert.match(d.secondary.title,/No second/,d.iso);}
 const sep=weeks.find(w=>w.id==='S19');assert.equal(sep.days[0].id,'S19-0');assert.equal(sep.days[2].type,'QUALITY');

 // History before the cutover is unchanged
 assert.ok(byIso['2026-09-21'].blocks.some(b=>b.label.includes('STRAIGHT SETS')));
 assert.ok(byIso['2026-09-25'].title.includes('Optional hotel'));
 assert.equal(byIso['2026-10-05'].title,'Completed lower strength · verified');
 assert.equal(byIso['2026-09-28'].title,'Lower strength · squat, hinge & single-leg');

 // Season logic
 for(const iso of Object.values(RACE_DATES))assert.equal(byIso[iso].race,true,`race missing on ${iso}`);
 assert.equal(byIso['2026-12-13'].race,undefined,'ASICS half stays inactive');
 const km=d=>Number((d.title.match(/(\d+(?:\.\d+)?) km/)||[])[1]||0);
 const longMin=d=>d.type==='LONG'?Number((d.title.match(/(\d+) min/)||[])[1]||0):0;
 for(const race of A_RACES){
  for(let i=1;i<=6;i++){const d=byIso[shift(race,-i)];assert.ok(km(d)<=14&&longMin(d)<=90,`run over 14 km ${i} days before ${race}: ${d.title}`);}
  for(let i=1;i<=5;i++){const d=byIso[shift(race,-i)];assert.ok(!/simulation|rounds/.test(d.title),`hard HYROX ${i} days before ${race}: ${d.title}`);}
  const eve=byIso[shift(race,-1)];assert.ok(eve.type==='REST'||/Shakeout|shakeout/.test(eve.title),`no easy day before ${race}`);
  const after=byIso[shift(race,1)];assert.ok(['REST','RECOVERY'].includes(after.type),`no rest after ${race}`);
 }
 for(const d of future.filter(d=>d.iso>=CUTOVER&&d.travel&&!d.race))assert.notEqual(d.type,'OPTIONAL',`travel day still optional: ${d.iso}`);
 for(const w of weeks.filter(w=>w.days[6].iso>=CUTOVER))assert.match(w.volume,/km/,`week ${w.label} has no km target`);
 const longest=Math.max(...future.filter(d=>d.iso>='2027-01-01'&&d.iso<RACE_DATES.osaka).map(km));assert.ok(longest>=24,'Osaka build reaches 24 km');

 // Runna mirror: runs from Runna, changed only with a stated reason; afternoon sessions never on race, travel or rest days
 const raceDays=new Set(Object.values(RACE_DATES));
 for(const [iso,r] of Object.entries(runnaPlan.runs)){
  assert.match(iso,/^\d{4}-\d\d-\d\d$/,`runna date ${iso}`);assert.ok(iso>=runnaPlan.from&&iso<=runnaPlan.to,`runna date out of range: ${iso}`);
  assert.ok(['EASY','QUALITY','LONG'].includes(r.kind)&&r.km>0&&r.steps.length,`runna entry incomplete: ${iso}`);
  if(r.changed)assert.ok(r.changed.was&&r.changed.why,`changed runna run without was/why: ${iso}`);
  if(raceDays.has(iso)||raceDays.has(shift(iso,-1)))assert.ok(r.changed?.drop,`runna run on a race day or the day after: ${iso}`);
  const d=byIso[iso];
  if(r.changed)assert.ok(d.note?.includes('Runna had:'),`changed runna run not marked on the site: ${iso}`);
  if(!r.changed)assert.ok(d.title.endsWith(`${r.km} km`)&&d.blocks[0].label.startsWith('RUNNA'),`site does not show the Runna run: ${iso}`);
 }
 assert.ok(!JSON.stringify(runnaPlan).includes('runna.com'),'no Runna links in the mirror');
 for(const iso of Object.keys(PM)){const d=byIso[iso];
  assert.ok(!d.race&&!d.travel&&!['REST','RECOVERY'].includes(d.type),`afternoon session on a race, travel or rest day: ${iso}`);
  assert.match(d.secondary.title,/^Afternoon/,`afternoon session missing: ${iso}`);
  for(const race of [RACE_DATES.hongKong,RACE_DATES.bangkok,RACE_DATES.taipei,RACE_DATES.nagoya])for(let i=1;i<=5;i++)if(shift(race,-i)===iso)assert.ok(!/simulation|rounds/.test(PM[iso].title),`hard HYROX afternoon ${i} days before ${race}`);}
 for(const w of weeks){const doubles=w.days.filter(d=>d.secondary?.title.startsWith('Afternoon')).length;assert.ok(doubles<=(w.days[0].iso<'2027-01-04'?2:3),`too many double days in week of ${w.days[0].iso}`);}

 // Track option: only on key runs, never on travel days, always inside a listed open window from 19:00
 const toMin=t=>Number(t.slice(0,2))*60+Number(t.slice(3,5));
 for(const d of future){const b=d.blocks.find(b=>b.label==='TRACK OPTION');if(!b)continue;
  assert.equal(d.type,'QUALITY',`track option on a non-key day: ${d.iso}`);assert.ok(!d.travel,`track option on a travel day: ${d.iso}`);
  const [from,to]=b.items[0].match(/(\d\d:\d\d)–(\d\d:\d\d)/).slice(1).map(toMin);assert.ok(from>=toMin('19:00')&&to-from>=90,`track window too short: ${d.iso}`);
  assert.ok((trackWindows(d.iso)??[]).some(w=>{const [a,z]=w.split('–').map(toMin);return a<=from&&z>=to;}),`track option outside the timetable: ${d.iso}`);}
 assert.ok(byIso['2026-10-21'].blocks.some(b=>b.label==='TRACK OPTION'),'21 Oct key run gets the track option');
 for(const iso of ['2026-10-07','2026-10-13'])assert.ok(!byIso[iso].blocks.some(b=>b.label==='TRACK OPTION'),`published day ${iso} unchanged`);

 // Storage keys and archive
 const app=await readFile('src/App.tsx','utf8');for(const key of ['rmr_completed_v4','ap_training_checkins_v1'])assert.ok(app.includes(key));
 assert.ok(!app.includes('Daily check-in'));assert.ok(!app.includes('Check-in needed'));
 const {readdir}=await import('node:fs/promises');for(const dir of ['src/components','src/screens','src/lib']){for(const f of await readdir(dir,{recursive:true,withFileTypes:true})){if(!f.isFile())continue;const path=`${f.parentPath??f.path}/${f.name}`;const src=await readFile(path,'utf8');assert.ok(!src.includes('Daily check-in')&&!src.includes('Check-in needed'),`${path} reintroduces check-in UI`);}}
 const hist=await readFile('src/trainingHistory.ts','utf8');assert.ok(hist.includes('3×1 km')||hist.includes('3 × 1 km'));
 console.log('PASS: 273 continuous days, history unchanged, every paid race present with taper, long-run spacing, travel minimums and weekly km targets.');
}finally{await unlink(target);await unlink(sm);await unlink(rd);}
