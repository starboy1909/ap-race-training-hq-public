import { legacyWeeks, type Day, type Week } from './trainingHistory';
export type MarathonChoice = 'none' | 'osaka' | 'tokyo';
export const planReviewed = '2026-09-13';
export const paceGuide = [
 ['Recovery', '6:20–7:10/km', 'RPE 2–3 · full sentences; walk breaks welcome'],
 ['Easy / long', '6:00–6:45/km', 'RPE 3–4 · conversational; slower in heat or on hills'],
 ['Steady', '5:40–6:00/km', 'RPE 5 · controlled; not the default easy pace'],
 ['Threshold intervals', '5:15–5:30/km', 'RPE 7 · start at 5:30; equal splits, never sprint the last rep'],
 ['Short faster intervals', '4:55–5:10/km', 'RPE 7–8 · initially 2-min reps, full prescribed recovery'],
 ['Compromised HYROX km', '5:25–5:50/km', 'RPE 6–7 · start slower after sleds; partner stays together'],
];
export const stations = [
 ['SkiErg','1,000 m','Machine resistance chosen individually; no kg prescription'],
 ['Sled push','50 m = 4 × 12.5 m','202 kg TOTAL including sled'],
 ['Sled pull','50 m = 4 × 12.5 m','153 kg TOTAL including sled'],
 ['Burpee broad jump','80 m','Bodyweight; legal chest contact and two-foot jump'],
 ['Row','1,000 m','Machine resistance chosen individually; no kg prescription'],
 ['Farmers carry','200 m','2 × 32 kg = 64 kg total'],
 ['Sandbag lunge','100 m','30 kg total'],
 ['Wall balls','100 reps','9 kg ball · 3.0 m target'],
];
const block = (label: string, items: string[]) => ({ label, items });
const warm = 'Warm up 10 min: easy bike/jog, ankle rocks 1×8/side, bodyweight hinge and squat 1×8. Use a symptom-free range; complete 2–3 progressively heavier warm-up sets before the first lift.';
const lower = [warm, 'Leg press or box squat 3×6–8, 2–3 reps in reserve, rest 2–3 min. Select the load from clean warm-up reps; machine kilograms are not portable between gyms.', 'Romanian deadlift 3×6–8, 2–3 reps in reserve, rest 2 min. Controlled 2-sec lowering; neutral back.', 'Supported split squat or low step-up 2×8/side, rest 90 sec; bodyweight first, then dumbbells only if symptom-free. Hamstring curl 2×10–12, rest 75 sec.', 'Bent-knee calf raise 3×10–15 + straight-knee calf raise 2×10–15, rest 60 sec; tibialis raise 2×15–20.', 'Dead bug 2×8/side, slow exhale. Log load, reps, reps in reserve and next-morning symptoms. Add one rep per set first; add 2.5–5% load only after two clean exposures at the top of the range.'];
const upper = [warm, 'Chest press 3×6–10 + supported row 3×8–10, 2 reps in reserve, rest 90–120 sec between sets.', 'Lat pulldown 3×8–12 + seated dumbbell press 2×8–10, 2 reps in reserve, rest 90 sec.', 'Lateral raise 2×12–15, curl 2×10–12, triceps extension 2×10–12; rest 60 sec.', 'Pallof press 3×10/side (2-sec hold) + side plank 2×30 sec/side. Add reps before load; no failure sets.'];
function easy(km: number): Partial<Day> { return {title:`Easy aerobic · ${km} km`,type:'EASY',duration:`${Math.round(km*6)}–${Math.round(km*6.75)} min`,rpe:'3–4',blocks:[block('RUN', [`${km} km at 6:00–6:45/km. First 1 km at recovery effort. Conversational breathing overrides pace in humidity, hills or fatigue.`, 'If this is the weekly easy run and the previous two weeks were symptom-stable: 4×15 sec relaxed strides with 75 sec walk/jog, replacing extra conditioning. Finish 5 min walking. If impact is uncomfortable, replace with the same duration easy bike at RPE 3; do not count bike time as running kilometres.'])]}; }
function rest(): Partial<Day> {return {title:'Rest & absorb',type:'REST',duration:'Rest',rpe:'0–2',blocks:[block('RECOVERY',['No structured workout. Optional relaxed walk 15–20 min and ankle/hip mobility 5 min; skip if tired.','Eat normally, hydrate and protect 7–9 hours sleep opportunity. Do not make up missed sessions.'])]};}
function quality(n: number, deload: boolean): Partial<Day> {
 const fast=n%3===2 && !deload;
 const reps=deload?2:3; const mins=deload?6:Math.min(10,8+Math.floor(n/4));
 return {title:fast?'Controlled speed · 6 × 2 min':`Threshold · ${reps} × ${mins} min`,type:'QUALITY',duration:fast?'45–50 min':'50–60 min',rpe:'7–8',blocks:[block('WARM-UP',['12 min at 6:20–7:10/km; then 3×15 sec relaxed strides with 60 sec walk/jog, only if symptom-free.']),block('MAIN SET',[fast?'6×2 min at 4:55–5:10/km; 2 min very easy jog between repetitions.':`${reps}×${mins} min at 5:15–5:30/km; 3 min very easy jog between repetitions. Start at the slower end.`, 'Finish 10 min at recovery effort. If pace requires RPE >8 or mechanics deteriorate, end the quality and jog home; no extra reps.'])]};
}
function hyrox(n: number, deload: boolean): Partial<Day> {
 const rounds=deload?2:n<4?3:4; const a=n%2===0;
 return {title:`HYROX · ${rounds} rounds / ${a?'force & transitions':'ergs & late-race durability'}`,type:'HYROX',duration:deload?'40–45 min':'55–70 min',rpe:deload?'5–6':'6–7',blocks:[block('PREP',['10 min easy bike or jog + 2 short technique sets at light loads. Count warm-up separately from the main run repetitions.']),block('EACH ROUND',[
 `Run 1 km at 5:25–5:50/km (${rounds} × 1 km total). Rest 2–3 min after each station circuit; restart when breathing is controlled.`,
 ...(a?['Push 12.5 m at starting total 152 kg; pull 12.5 m at starting total 103 kg. These are mass prescriptions, not equivalent race resistance. Reduce load to stay at RPE 6–7; calibrate using the Coaching protocol before progressing.', 'Farmers carry 50 m with 2×24 kg (48 kg total), progressing to 2×32 kg only after repeatable unbroken lengths. Wall balls 15 legal reps at 9 kg, rest as needed; use 6 kg if depth/target cannot be maintained.']:['SkiErg 250 m at RPE 6, 24–30 strokes/min; row 250 m at RPE 6, 22–26 strokes/min. Record pace/500 m; hold within 5 sec across rounds instead of inventing a baseline.', 'Sandbag lunges 20 m at 20 kg total, progressing to 30 kg after two clean sessions. Burpee broad jumps 10 m, bodyweight, smooth rhythm; no maximal jumps.']),
 'Doubles practice: rehearse a verbal changeover every 250 m on ergs, 12.5 m on sleds, 25–50 m on carry, 10–20 m on lunges and 10–15 wall balls. Volumes above are your solo training dose; do not double them when a partner joins.',
 ]),block('FINISH',['5–10 min easy cooldown. Record round splits, total loads including sled mass, station breaks and legal repetitions. Progress one variable only: rounds, load or rest density.'])]};
}
const travelWindows=[['2026-09-25','2026-09-27'],['2026-10-09','2026-10-12'],['2026-10-31','2026-11-02'],['2026-11-28','2026-12-14'],['2026-12-24','2026-12-28']];
export const season = [
 ['Sep–Oct 2026','Foundation & rehearsal','Build repeatable threshold, two strength sessions, all eight stations and easy endurance. Deload around reduced-availability periods.'],
 ['1–8 Nov','Race cluster','Shanghai rehearsal → conditional JPM target → controlled registered 15K. Recovery can remove the later race; never race all three maximally.'],
 ['Nov–Dec','Maintain then rebuild','No Guangzhou taper without paid entry. Reduced-equipment blocks replace full gym sessions; return gradually. ASICS excluded from active training due to availability conflict.'],
 ['4–10 Jan 2027','Hong Kong peak','Paid Pro Doubles Men · 9 January. Reduce volume, retain brief familiar intensity.'],
 ['Jan–Mar','One marathon branch','Default remains hybrid. Activate exactly one selected-and-paid Japan marathon below; build endurance before January, not in a rushed final six weeks.'],
 ['Mar–May','Recover & qualify','Marathon recovery first if applicable, then hybrid build. Backup HYROX dates stay opportunities until paid.'],
 ['May–13 Jun','Worlds conditional','Qualification and accepted entry required. Without them, continue normal hybrid training; no automatic Worlds taper.'],
];
function second(day: Day): Day['secondary'] {
 if(['REST','RACE','RECOVERY'].includes(day.type)||day.travel) return {title:'No second workout today',items:['Rest, gentle mobility or an easy walk only. Travel, race and recovery days are not double-session days.']};
 if(day.type==='QUALITY'||day.type==='HYROX'||/Long|Marathon endurance|Marathon foundation/i.test(day.title))return {title:'Optional · mobility & trunk · 15–20 min',items:['At least 6 hours after primary; only if recovered, fed and no increase in pain.','5 min easy walk; dead bug 2×8/side, side plank 2×25 sec/side, ankle rocks 2×8/side and gentle hip mobility 5 min. RPE 2–3. No additional leg conditioning.']};
 if(day.type==='STRENGTH')return {title:'Optional · easy bike · 20–30 min',items:['Separate by ≥6 hours; RPE 2–3, full sentences, light resistance. Add 5 min easy mobility.','Begin with one optional aerobic session per week; cap at two after two well-recovered weeks. This is extra load: log duration × session RPE.']};
 return {title:'Optional · upper-body support · 25–30 min',items:['Only once weekly, ≥6 hours later and ≥48 hours from the primary upper session. If that spacing is unavailable, choose mobility instead.','Push-ups 2×8–15, supported row 2×10–12, lateral raises 2×12–15, curl 2×10–12. Leave 3 reps in reserve; rest 60–90 sec.','No optional run or extra sled work. Skip if it reduces sleep or worsens the next primary session.']};
}
const isoAt=(ms:number)=>new Date(ms).toISOString().slice(0,10);
export function buildPlan(choice: MarathonChoice='none'): Week[] {
 const history=legacyWeeks.filter(w=>Number(w.id.slice(1))<=18).map(w=>({...w,days:w.days.map(d=>d.date==='13 SEP'?{...d,secondary:second(d)}:d)}));
 const output:Week[]=[...history];
 const base=Date.parse('2026-09-14T12:00:00Z');
 const marathon=choice==='osaka'?'2027-02-28':choice==='tokyo'?'2027-03-07':null;
 for(let n=0;n<39;n++){
  const start=isoAt(base+n*7*86400000); const deload=n%4===3;
  const days:Day[]=[];
  for(let dow=0;dow<7;dow++){
   const ms=base+(n*7+dow)*86400000;const iso=isoAt(ms);const date=new Date(ms);
   let spec:Partial<Day>;
   if(dow===0)spec={title:'Lower-body strength & tendon capacity',type:'STRENGTH',duration:deload?'45–50 min':'60–70 min',rpe:'6–7',blocks:[block('LOWER STRENGTH',deload?lower.map(x=>x.replaceAll('3×','2×')):lower)]};
   else if(dow===1)spec=easy(deload?6:8);
   else if(dow===2)spec=quality(n,deload);
   else if(dow===3)spec={title:'Upper-body strength & trunk',type:'STRENGTH',duration:'50–60 min',rpe:'6–7',blocks:[block('UPPER STRENGTH',deload?upper.map(x=>x.replaceAll('3×','2×')):upper)]};
   else if(dow===4)spec=hyrox(n,deload);
   else if(dow===5)spec=rest();
   else {const km=deload?11:Math.min(17,14+n%4);spec={...easy(km),title:`Long easy · ${km} km`,note:'Fuel runs longer than 75–90 min with 30–60 g carbohydrate/hour; start at 30 g and practise tolerance. No fast finish. If legs remain tired Monday, use upper-body strength first and move lower strength to Wednesday, replacing that day’s run.'};}
   const travel=travelWindows.some(([a,b])=>iso>=a&&iso<=b);
   if(travel)spec=dow===5||travelWindows.some(([a,b])=>iso===a||iso===b)?rest():{title:'Reduced-equipment maintenance',type:'EASY',duration:'25–40 min',rpe:'3–4',blocks:[block('CHOOSE ONE',['25–35 min easy run at 6:10–6:50/km if conditions and symptoms allow; otherwise bike or brisk walk at conversational effort.','On alternate days replace aerobic work with 2 rounds: bodyweight split squat 8/side, single-leg hinge 8/side, push-ups 8–12, band row 12, calf raise 15, side plank 25 sec/side. Rest 60 sec; 3 reps in reserve.','Walking-heavy days count as load. No catch-up workouts or assumed access to sleds.'])]};
   if(iso>='2026-10-26'&&iso<'2026-10-31'){spec=dow===0?{...spec,blocks:[block('REDUCED STRENGTH',lower.map(x=>x.replaceAll('3×','2×')))],rpe:'6'}:dow===1?{...quality(n,true)}:dow===4?{...easy(3),title:'Short shakeout · 3 km'}:dow===3?rest():easy(5);}
   if(iso==='2026-10-25')spec={...easy(10),title:'Easy 10 km / optional Pici social run',note:'Pici is an opportunity, not a confirmed entry. If entered, it replaces this run and stays conversational at 6:00–6:45/km, slower for social stops. No Yuen Tin on the same morning and no benchmark effort seven days before Shanghai.'};
   if(iso==='2026-11-01')spec={title:'HYROX Shanghai · controlled Pro Doubles',type:'RACE',duration:'Race-day window; wave pending',rpe:'7–8',race:true,blocks:[block('REHEARSAL',['15 min warm-up, familiar movements only. Start running around 5:30–5:50/km and adjust to partner/conditions. Complete official race distances and Pro loads listed in Coaching.','Agree station shares beforehand. Avoid failure sets and a finishing sprint. Record official result and recovery response before deciding on Thursday’s running target.'])]};
   if(iso>='2026-11-02'&&iso<='2026-11-15')spec={...rest(),title:'Post-race recovery / easy return',type:'RECOVERY',duration:'0–30 min',blocks:[block('RETURN GATE',['First 48 hours: rest or easy walk. Then 20–30 min bike at RPE 2–3 if walking and stairs are normal.','Only resume 20–30 min easy running at 6:20–7:10/km once pain-free and energy is back. No hard work or doubles in this recovery block.'])]};
   if(iso==='2026-11-05')spec={title:'JPMorganChase · target, entry unconfirmed',type:'RECOVERY',duration:'Conditional 5.6 km',rpe:'3–7',blocks:[block('DECISION',['Run the event only with accepted/paid entry and full recovery from Shanghai. Otherwise rest or 25 min easy bike.','If fully recovered: 12 min easy warm-up; start 5.6 km around 5:10–5:25/km and reassess after 2 km, RPE ≤7 initially. No 3:56/km stretch-goal prescription. If soreness remains, skip the event.'])]};
   if(iso==='2026-11-08')spec={title:'RMAC Gold Coast · controlled registered 15K',type:'RACE',duration:'90–105 min if fit to start',rpe:'3–4',race:true,blocks:[block('CONTROLLED ENDURANCE',['Start at 6:10–6:45/km, conversational throughout. No finishing surge.','Start only if walking, stairs and an easy jog are comfortable after the week’s load; otherwise skip. Use 30–60 g carbohydrate/hour and a practised hydration plan.'])]};
   if(iso>='2026-12-15'&&iso<='2026-12-20')spec=dow===5?rest():dow===0||dow===3?{title:'Re-entry strength',type:'STRENGTH',duration:'35–45 min',rpe:'5–6',blocks:[block('REDUCED LOAD',(dow===0?lower:upper).map(x=>x.replaceAll('3×','2×')))]}:easy(dow===6?10:5);
   if(iso>='2026-12-29'&&iso<='2027-01-03')spec=dow===4?{...hyrox(n,true),note:'Last brief familiar station rehearsal. No full simulation or overload sleds.'}:dow===6?easy(10):spec;
   if(iso>='2027-01-04'&&iso<='2027-01-08')spec=dow===0?{title:'Taper strength touch',type:'STRENGTH',duration:'25–30 min',rpe:'5',blocks:[block('FAMILIAR ONLY',['Leg press, RDL, chest press and row: 2×5 each at an easy familiar load, ≥4 reps in reserve; 2 min rest. No new exercises.'])]}:dow===1?{...easy(4),note:'Add 3×1 min at 5:25–5:40/km, 2 min easy between; finish fresh.'}:dow===3?{...easy(3),note:'Optional 3×15 sec strides, full recovery; no gym conditioning.'}:rest();
   if(iso==='2027-01-09')spec={title:'AIA HYROX Hong Kong · Pro Doubles peak',type:'RACE',race:true,duration:'Afternoon · personal wave pending',rpe:'8–9',blocks:[block('RACE EXECUTION',['15–20 min familiar warm-up; start at the repeatable compromised pace established in December, not a sub-70 wish pace.','Use agreed station swaps and official Pro loads. Both athletes run all eight kilometres together. Prioritise legal reps and decisive Roxzone navigation.','Practised carbohydrate meal 2–3 hours before start; no new supplements. Record official result, splits and station share afterwards.'])]};
   if(iso>='2027-01-10'&&iso<='2027-01-17')spec={...rest(),title:'Post-Hong Kong recovery',type:'RECOVERY',note:iso==='2027-01-17'?'SCHK half remains ballot-submitted. No race is scheduled here without selection/payment and a recovery reassessment.':'After 48–72 hours, an optional 20–30 min easy bike is enough if comfortable. Resume impact gradually; no doubles.'};
   if(marathon){
    const until=Math.round((Date.parse(marathon+'T12:00:00Z')-ms)/86400000);
    if(iso>='2026-10-01'&&iso<'2026-12-24'&&!travel&&dow===6&&spec.type==='EASY')spec={...easy(deload?13:Math.min(21,17+Math.floor(n/4))),title:`Marathon foundation · ${deload?13:Math.min(21,17+Math.floor(n/4))} km easy`,note:'Conditional paid-entry branch. Add endurance before January; keep effort conversational. Never add distance to make up a missed travel week.'};
    if(iso>='2027-01-18'&&until>=0){
     if(dow===4)spec=easy(until<14?4:7);
     if(dow===2)spec={...quality(n,until<21),note:'Threshold is optional if long-run fatigue persists; easy run at 6:00–6:45/km replaces it. Marathon pace is provisional 6:00–6:15/km, not the aspirational sub-4 pace.'};
     if(dow===6){const km=until>=35?20:until>=28?22:until>=21?24:until>=14?18:until>=7?12:0;spec={...easy(km),title:`Marathon endurance · ${km} km`,note:'Cap at 2 h 30 min. Advance only if the previous long run and next 48 h were well tolerated; repeat the previous distance otherwise. Fuel 45–60 g carbohydrate/hour, practised progressively. Insufficient endurance means a run/walk completion goal or deferral—not crash training.'};}
     if(until<=6&&until>0)spec= dow===1?{...easy(4),note:'3×1 min at planned marathon effort with 2 min easy recovery.'}:until===1?rest():easy(3);
     if(until===0)spec={title:`${choice==='osaka'?'Osaka':'Tokyo'} Marathon · conditional paid entry`,type:'RACE',duration:'Race / run-walk strategy',rpe:'5–8',race:true,blocks:[block('MARATHON',['Activate only after selection and payment. Start conservatively around 6:10–6:30/km or a rehearsed run/walk strategy; review pace against January/February long-run evidence.','Use practised 45–60 g carbohydrate/hour, drink to conditions and thirst. A sub-4 target requires new evidence; do not chase it from the current baseline.'])]};
    }
    if(until<0&&until>=-21)spec={...rest(),title:'Marathon recovery & gradual return',type:'RECOVERY',duration:'Rest / 20–30 min easy movement',note:'First week: walking and rest. Week 2: easy bike if comfortable. Week 3: short easy run only when walking, stairs and energy are normal. No Taipei race or doubles.'};
   }
   const day:Day={id:`S${19+n}-${dow}`,iso,date:date.toLocaleDateString('en-GB',{day:'2-digit',month:'short',timeZone:'UTC'}).toUpperCase(),dow:['MON','TUE','WED','THU','FRI','SAT','SUN'][dow],title:'',type:'EASY',duration:'',rpe:'',...spec,travel};day.secondary=second(day);if((iso>='2027-01-04'&&iso<='2027-01-10')||(marathon&&Date.parse(marathon)-Date.parse(iso)>=0&&Date.parse(marathon)-Date.parse(iso)<=6*86400000))day.secondary={title:'No second workout today',items:['Taper week: keep the short primary session fresh. No added training volume.']};days.push(day);
  }
  output.push({id:`S${19+n}`,label:`W${19+n}`,dates:`${days[0].date} – ${days[6].date} ${start.slice(0,4) === days[6].iso?.slice(0,4) ? start.slice(0,4) : `${start.slice(0,4)}/${days[6].iso?.slice(2,4)}`}`,phase:days.some(d=>d.race)?'RACE':days.every(d=>['REST','RECOVERY'].includes(d.type))?'RECOVERY':days.some(d=>d.travel)?'ADAPT':deload?'DELOAD':'BUILD',volume:'Follow daily prescriptions · optional work adds load',focus:n<4?'Build repeatable sessions before raising volume. Two strength days, one running-quality day, one controlled HYROX day and one easy long run.':'Provisional continuation: review every week against actual completions and recovery. Future paces do not become faster automatically.',gate:'Proceed when walking/stairs are comfortable and energy is normal. If pain rises, alters gait, or is worse the next morning, stop impact and use easy non-impact work only if comfortable. Persistent focal shin pain, swelling or rest pain needs assessment.',days});
 }
 return output;
}
