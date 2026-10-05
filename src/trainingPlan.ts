import { reviseFuture } from './buildRevision';
import { legacyWeeks, type Day, type Week } from './trainingHistory';
import { CUTOVER, isTravel, seasonDay, seasonSecondary, seasonWeek, travelWindows } from './seasonPlan';
export { paceGuide, scheduleChangePolicy } from './seasonPlan';
export const planReviewed = '2026-10-05';
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
export const season = [
 ['Oct 2026','Build for Shanghai + JPM','Race loads on the sleds, weekly lunges and wall balls, 5K-pace work for JPM, long runs building for Osaka.'],
 ['1–8 Nov','Race block','Shanghai all out (priority) → JPM: beat 25:27 → RMAC 15K as an easy long run.'],
 ['9 Nov–8 Jan','Hong Kong build','Three gym weeks, two hotel weeks at a required minimum, two Doubles simulations, then a 10-day taper.'],
 ['9 Jan','AIA HYROX Hong Kong','Pro Doubles · Worlds qualification attempt.'],
 ['11 Jan–13 Feb','Osaka + Bangkok build','Long runs to 24 km four weeks before Osaka; HYROX held at race loads; Bangkok taper.'],
 ['13 Feb · 28 Feb','Bangkok → Osaka','Second qualification attempt, then finish Osaka strong.'],
 ['Mar–Jun','Recover, then hybrid build','Three weeks of marathon recovery, then HYROX and speed. Worlds training only with a confirmed slot.'],
];
function second(day: Day): Day['secondary'] {
 if(['REST','RACE','RECOVERY'].includes(day.type)||day.travel) return {title:'No second workout today',items:['Rest, gentle mobility or an easy walk only. Travel, race and recovery days are not double-session days.']};
 if(day.type==='QUALITY'||day.type==='HYROX'||/Long|Marathon endurance|Marathon foundation/i.test(day.title))return {title:'Optional · mobility & trunk · 15–20 min',items:['At least 6 hours after primary; only if recovered, fed and no increase in pain.','5 min easy walk; dead bug 2×8/side, side plank 2×25 sec/side, ankle rocks 2×8/side and gentle hip mobility 5 min. RPE 2–3. No additional leg conditioning.']};
 if(day.type==='STRENGTH')return {title:'Optional · easy bike · 20–30 min',items:['Separate by ≥6 hours; RPE 2–3, full sentences, light resistance. Add 5 min easy mobility.','Begin with one optional aerobic session per week; cap at two after two well-recovered weeks. This is extra load: log duration × session RPE.']};
 return {title:'Optional · upper-body support · 25–30 min',items:['Only once weekly, ≥6 hours later and ≥48 hours from the primary upper session. If that spacing is unavailable, choose mobility instead.','Push-ups 2×8–15, supported row 2×10–12, lateral raises 2×12–15, curl 2×10–12. Leave 3 reps in reserve; rest 60–90 sec.','No optional run or extra sled work. Skip if it reduces sleep or worsens the next primary session.']};
}
const isoAt=(ms:number)=>new Date(ms).toISOString().slice(0,10);
export function buildPlan(): Week[] {
 const history=legacyWeeks.filter(w=>Number(w.id.slice(1))<=18).map(w=>({...w,days:w.days.map(d=>d.date==='13 SEP'?{...d,secondary:second(d)}:d)}));
 const output:Week[]=[...history];
 const base=Date.parse('2026-09-14T12:00:00Z');
 for(let n=0;n<39;n++){
  const start=isoAt(base+n*7*86400000); const deload=n%4===3;
  const days:Day[]=[];
  for(let dow=0;dow<7;dow++){
   const ms=base+(n*7+dow)*86400000;const iso=isoAt(ms);const date=new Date(ms);
   const travel=isTravel(iso);
   const head={id:`S${19+n}-${dow}`,iso,date:date.toLocaleDateString('en-GB',{day:'2-digit',month:'short',timeZone:'UTC'}).toUpperCase(),dow:['MON','TUE','WED','THU','FRI','SAT','SUN'][dow]};
   if(iso>=CUTOVER){
    const day:Day={...head,title:'',type:'EASY',duration:'',rpe:'',...seasonDay(iso,dow,start,n),travel};
    day.secondary=seasonSecondary(day);days.push(day);continue;
   }
   // Published prescriptions up to CUTOVER, preserved unchanged.
   let spec:Partial<Day>;
   if(dow===0)spec={title:'Lower-body strength & tendon capacity',type:'STRENGTH',duration:deload?'45–50 min':'60–70 min',rpe:'6–7',blocks:[block('LOWER STRENGTH',deload?lower.map(x=>x.replaceAll('3×','2×')):lower)]};
   else if(dow===1)spec=easy(deload?6:8);
   else if(dow===2)spec=quality(n,deload);
   else if(dow===3)spec={title:'Upper-body strength & trunk',type:'STRENGTH',duration:'50–60 min',rpe:'6–7',blocks:[block('UPPER STRENGTH',deload?upper.map(x=>x.replaceAll('3×','2×')):upper)]};
   else if(dow===4)spec=hyrox(n,deload);
   else if(dow===5)spec=rest();
   else {const km=deload?11:Math.min(17,14+n%4);spec={...easy(km),title:`Long easy · ${km} km`,note:'Fuel runs longer than 75–90 min with 30–60 g carbohydrate/hour; start at 30 g and practise tolerance. No fast finish. If legs remain tired Monday, use upper-body strength first and move lower strength to Wednesday, replacing that day’s run.'};}
   if(travel)spec=dow===5||travelWindows.some(([a,b])=>iso===a||iso===b)?rest():{title:'Reduced-equipment maintenance',type:'EASY',duration:'25–40 min',rpe:'3–4',blocks:[block('CHOOSE ONE',['25–35 min easy run at 6:10–6:50/km if conditions and symptoms allow; otherwise bike or brisk walk at conversational effort.','On alternate days replace aerobic work with 2 rounds: bodyweight split squat 8/side, single-leg hinge 8/side, push-ups 8–12, band row 12, calf raise 15, side plank 25 sec/side. Rest 60 sec; 3 reps in reserve.','Walking-heavy days count as load. No catch-up workouts or assumed access to sleds.'])]};
   if(iso==='2026-09-15')spec={title:'Completed 10.05 km · verified',type:'QUALITY',duration:'58:51',rpe:'Recorded load',note:'Verified 15 September: 10.05 km in 58:51 (approximately 5:51/km). This exceeded the planned 8 km easy dose and landed in the steady range; no added conditioning today.',blocks:[block('COMPLETED SESSION',['10.05 km recorded. Treat this as the week’s sustained running load, not an easy-day completion.','Recover with normal meals, fluids and sleep. No make-up kilometres or second leg session.'])]};
   if(iso==='2026-10-05')spec={title:'Completed lower strength · verified',type:'STRENGTH',duration:'1:07 · completed',rpe:'Completed',note:'Heavier than the deload prescription. Squat top set 70 kg × 3 resets the working loads in the plan from 6 October.',blocks:[block('LOGGED · STRONG',['Back squat 40 × 6, 50 × 5, 60 × 5, 70 × 3 · front squat 40 kg 5/5/4 · Romanian deadlift 40 kg 3 × 5.','Rear-foot-supported split squat 2 × 15 kg (30 kg total) 5/7/5 · lying leg curl 53 × 7, 53 × 5, 39 × 8.','Bent-knee calf raise 20 kg 3 × 20 · standing calf raise 40 kg 3 × 20 · tibialis raise 3 × 30 · loaded back extension 9 × 10, 14 × 5, 14 × 5.'])]};
   if(iso==='2026-09-20')spec={title:'Completed long run · 15.16 km',type:'RUN',duration:'1:30:01 · completed',rpe:'Completed',blocks:[block('VERIFIED COMPLETION',['15.16 km in 1:30:01 (approximately 5:56/km).','This completes the planned Sunday long run. No additional running or conditioning today.'])],note:'The run exceeded the 14 km prescription by 1.16 km. Keep Monday lower-body strength only if walking, stairs, warm-up mechanics and symptoms are normal; otherwise use the existing upper-body-first option.'};
   const day:Day={...head,title:'',type:'EASY',duration:'',rpe:'',...spec,travel};day.secondary=second(day);days.push(reviseFuture(day,deload));
  }
  const meta=seasonWeek(start,n);
  output.push({id:`S${19+n}`,label:`W${19+n}`,dates:`${days[0].date} – ${days[6].date} ${start.slice(0,4) === days[6].iso?.slice(0,4) ? start.slice(0,4) : `${start.slice(0,4)}/${days[6].iso?.slice(2,4)}`}`,
   phase:meta?.phase??(days.some(d=>d.race)?'RACE':days.every(d=>['REST','RECOVERY'].includes(d.type))?'RECOVERY':days.some(d=>d.travel)?'ADAPT':deload?'DELOAD':'BUILD'),
   volume:meta?.volume??'Follow daily prescriptions · optional work adds load',
   focus:meta?.focus??(n<4?'Build repeatable sessions before raising volume. Two strength days, one running-quality day, one controlled HYROX day and one easy long run.':'Provisional continuation: review every week against actual completions and recovery. Future paces do not become faster automatically.'),
   gate:meta?.gate??'Proceed when walking/stairs are comfortable and energy is normal. If pain rises, alters gait, or is worse the next morning, stop impact and use easy non-impact work only if comfortable. Persistent focal shin pain, swelling or rest pain needs assessment.',days});
 }
 return output;
}
