import { FormEvent, useEffect, useMemo, useState } from "react";

type Day = {
  id: string;
  date: string;
  dow: string;
  title: string;
  type: string;
  duration: string;
  rpe: string;
  note?: string;
  blocks?: { label: string; items: string[] }[];
  travel?: boolean;
  race?: boolean;
};

type Week = {
  id: string;
  label: string;
  dates: string;
  phase: string;
  volume: string;
  focus: string;
  gate?: string;
  days: Day[];
};

type Race = {
  startIso: string;
  date: string;
  name: string;
  type: string;
  status: string;
  priority: string;
  location: string;
  note: string;
  category: "campaign" | "hyrox";
  sourceLabel: string;
  sourceUrl?: string;
  checked: string;
};

const weeks: Week[] = [
  {
    id: "S12",
    label: "W12",
    dates: "27 Jul – 2 Aug",
    phase: "RECOVER",
    volume: "27 km completed",
    focus: "Post-Delhi recovery week completed with 27 km of easy jogging. This actual load now anchors the rebuild.",
    gate:
      "Pain above 2/10 during the first run means stop and swap the next run for easy cycling. No quality running this week.",
    days: [
      {
        id: "S12-0",
        date: "27 JUL",
        dow: "MON",
        title: "Sleep + Full Rest",
        type: "REST",
        duration: "All day",
        rpe: "0",
        note: "Post-travel recovery. Walking only. Hydrate and sleep.",
        blocks: [
          { label: "RECOVERY", items: ["20–30 min gentle walk if useful", "Protein across 3–4 meals", "No gym work"] },
        ],
      },
      {
        id: "S12-1",
        date: "28 JUL",
        dow: "TUE",
        title: "Mobility + Tissue Check",
        type: "MOBILITY",
        duration: "35–40 min",
        rpe: "2–3",
        blocks: [
          { label: "RESET", items: ["10 min easy bike", "Calf and ankle range work", "Hip mobility, no spinal flexion"] },
          { label: "PERMANENT PREHAB", items: ["Eccentric calf raise 3×12", "Tibialis raise 3×15", "Pallof press 3×10/side"] },
        ],
      },
      {
        id: "S12-2",
        date: "29 JUL",
        dow: "WED",
        title: "Full Rest",
        type: "REST",
        duration: "All day",
        rpe: "0",
        note: "Log pain, sleep and Body Battery. Do not train out of impatience.",
      },
      {
        id: "S12-3",
        date: "30 JUL",
        dow: "THU",
        title: "First Post-Race Leg Check",
        type: "RUN",
        duration: "25 min",
        rpe: "3–4",
        blocks: [
          { label: "WARM-UP", items: ["5 min brisk walk", "Ankle circles + 10 calf raises", "5 min very easy jog"] },
          { label: "MAIN", items: ["15 min ultra-easy, conversational", "Flat route or treadmill", "Stop if pain rises above 2/10"] },
          { label: "COOLDOWN", items: ["5 min walk", "Record pain during and two hours later"] },
        ],
      },
      {
        id: "S12-4",
        date: "31 JUL",
        dow: "FRI",
        title: "Mobility + Upper Body",
        type: "STRENGTH",
        duration: "40 min",
        rpe: "4",
        blocks: [
          { label: "MAIN", items: ["Panatta chest-supported row 3×10 easy", "Machine chest press 3×10 easy", "Lat pulldown 3×10", "Side plank 3×25 sec/side"] },
        ],
      },
      {
        id: "S12-5",
        date: "1 AUG",
        dow: "SAT",
        title: "Easy Z2 Run",
        type: "RUN",
        duration: "30 min",
        rpe: "4",
        note: "Only if Thursday was clean during the run and the following morning.",
        blocks: [{ label: "MAIN", items: ["30 min flat Z2", "No strides", "Comfortable breathing throughout"] }],
      },
      {
        id: "S12-6",
        date: "2 AUG",
        dow: "SUN",
        title: "Rest + Delhi Debrief",
        type: "REST",
        duration: "20 min review",
        rpe: "0",
        blocks: [{ label: "REVIEW", items: ["Confirm station split ownership", "Record what caused Run 3–7 fade", "Agree two partner sessions for August"] }],
      },
    ],
  },
  {
    id: "S13",
    label: "W13",
    dates: "3–9 Aug",
    phase: "REBUILD + STRENGTH",
    volume: "29–31 km",
    focus: "Build from the completed 27 km recovery week. Running is already a relative strength; this block restores full-body strength and begins targeted Pro-station work without rushing the return from pain.",
    gate: "Proceed because walking, stairs and easy running are now pain-free. Regress only if pain exceeds 2/10, changes stride, produces swelling or remains elevated the next morning. The physio's exact right-hip drill overrides the generic mobility drill below.",
    days: [
      {
        id: "S13-0", date: "3 AUG", dow: "MON", title: "Full-Body Strength A · Rebuild", type: "STRENGTH", duration: "75 min", rpe: "6–7",
        note: "This is a full session, not four token exercises. Finish every working set with 2–3 good reps still available. Record the load used on each machine.",
        blocks: [
          { label: "WARM-UP · 10 MIN", items: ["Bike 5 min easy at RPE 2–3", "90/90 controlled hip switches 2×6/side; pause 3 sec at each end, never force a pinch", "Bodyweight hip hinge 2×10 + glute bridge 2×10; 30 sec rest", "Two progressive warm-up sets before leg press and Romanian deadlift"] },
          { label: "PRIMARY STRENGTH", items: ["Panatta leg press 4×8 @ RPE 7; 2 min rest; controlled 3-sec lowering, right knee tracks over second toe", "Romanian deadlift 4×8 @ RPE 7; 2 min rest; hips travel back, ribs stacked, stop before the lower back rounds", "Panatta chest-supported row 4×8–10 @ RPE 7; 90 sec rest; pause 1 sec with shoulder blades back", "Machine chest press 3×8–10 @ RPE 7; 90 sec rest; shoulders stay down, no grinding"] },
          { label: "RIGHT HIP + HAMSTRING CAPACITY", items: ["Physio-prescribed right-hip rotation drill 3 sets exactly as prescribed; this takes priority over any generic drill", "Single-leg Romanian deadlift 3×8/side with light dumbbells; 75 sec rest; pelvis remains square", "Long-lever hamstring bridge isometric 3×25–30 sec; 45 sec rest; feel hamstring, not lower back"] },
          { label: "PERMANENT PREHAB + TRUNK", items: ["Supported eccentric calf lower 3×12/side; 45 sec rest; 3-sec lowering", "Tibialis raise 3×15–20; 45 sec rest", "Pallof press 3×10/side with 2-sec hold; 45 sec rest"] },
          { label: "COOLDOWN · 5 MIN", items: ["Easy walk 3 min", "Active hamstring floss 2×8/side, no aggressive static stretch", "Log right hip, hamstring and knee response immediately and next morning"] },
        ],
      },
      {
        id: "S13-1", date: "4 AUG", dow: "TUE", title: "Easy Z2 + Neuromuscular Strides", type: "RUN", duration: "7–8 km · 48–55 min", rpe: "3–5",
        blocks: [
          { label: "WARM-UP · 10 MIN", items: ["5 min brisk walk into easy jog", "Leg swings front/back 10/side + lateral 10/side", "Hip airplane supported 2×5/side; small range, pelvis controlled", "2×20 sec relaxed pickups with 60 sec walk"] },
          { label: "MAIN RUN", items: ["6–7 km easy at roughly 6:05–6:35/km or HR ≤142; use whichever keeps breathing conversational", "Then 4×15 sec relaxed strides at about 85% speed", "Walk 60–75 sec after each stride; smooth acceleration, no sprinting"] },
          { label: "COOLDOWN", items: ["5 min easy jog/walk", "Right-hip physio drill 2 prescribed sets", "Record pace, average HR, pain and next-morning stiffness"] },
        ],
      },
      {
        id: "S13-2", date: "5 AUG", dow: "WED", title: "HYROX Pull Strength + Erg Technique", type: "HYROX", duration: "70 min", rpe: "6–7",
        blocks: [
          { label: "WARM-UP · 10 MIN", items: ["SkiErg or row 5 min easy", "Band straight-arm pulldown 2×12", "Scapular pull 2×8 + light cable row 2×10", "One light practice round of every erg cue before work begins"] },
          { label: "PULL STRENGTH", items: ["Panatta chest-supported row 4×8 @ RPE 7; 90 sec rest", "Neutral-grip lat pulldown 4×8–10 @ RPE 7; 90 sec rest", "Single-arm cable row 3×10/side; 60 sec between sides; no torso rotation", "Heavy rope or sled pull 6×12.5 m at 60–70% race load; 75 sec rest; short hand-over-hand cycles, hips low"] },
          { label: "ERG TECHNIQUE", items: ["Row 6×250 m @ RPE 6; 60 sec easy rest", "Hold stroke rate 24–26 spm; push with legs, then swing, then pull", "Target repeatability within 2 sec, not maximum speed"] },
          { label: "ACCESSORY + TRUNK", items: ["Reverse pec deck 3×12–15; 60 sec rest", "Farmer carry 4×30 m heavy but unbroken; 60 sec rest", "Side plank 3×30 sec/side; 30 sec rest"] },
          { label: "COOLDOWN", items: ["5 min easy bike or walk", "90/90 controlled switches 1×6/side", "No additional pulling volume after the session"] },
        ],
      },
      {
        id: "S13-3", date: "6 AUG", dow: "THU", title: "Controlled Aerobic Intervals", type: "RUN", duration: "8–9 km · 55–60 min", rpe: "6",
        blocks: [
          { label: "WARM-UP · 15 MIN", items: ["12 min easy jog", "Ankle rocks 10/side + marching A-drill 2×20 m", "3×20 sec progressive pickups; 60 sec easy jog"] },
          { label: "MAIN", items: ["4×5 min at controlled steady effort, approximately 5:15–5:30/km or RPE 6; use whichever is slower", "Jog 2 min very easy between repetitions", "Rep 4 should look like rep 1. Do not turn this into a time trial"] },
          { label: "COOLDOWN", items: ["10 min easy jog", "Active hamstring floss 2×8/side", "Stop and downgrade the next run if hip, hamstring or knee response persists the next morning"] },
        ],
      },
      {
        id: "S13-4", date: "7 AUG", dow: "FRI", title: "Full-Body Strength B · Posterior Chain", type: "STRENGTH", duration: "75 min", rpe: "6–7",
        blocks: [
          { label: "WARM-UP · 10 MIN", items: ["Bike 5 min easy", "Quadruped hip CAR 2×4/side; pelvis stays still", "Mini-band lateral walk 2×10 steps each way; feet forward", "Two progressive warm-up sets for hip thrust"] },
          { label: "PRIMARY STRENGTH", items: ["Hip thrust 4×8 @ RPE 7; 2 min rest; 2-sec squeeze at the top", "Rear-foot-supported split squat 3×8/side @ RPE 6; 90 sec rest; short range first, right knee tracks cleanly", "Seated or lying hamstring curl 4×10 @ RPE 7; 75 sec rest; 2-sec eccentric", "Incline machine chest press 4×8 @ RPE 7; 90 sec rest", "Neutral-grip pulldown 3×10 @ RPE 7; 75 sec rest"] },
          { label: "RIGHT-SIDE CONTROL", items: ["Physio-prescribed right-hip drill 3 sets", "Low step-down 3×8/side; 60 sec rest; pelvis level and knee over mid-foot", "Single-leg balance with cable or band row 2×10/side; slow and controlled"] },
          { label: "FINISHER + TRUNK", items: ["Farmer carry 4×30 m @ RPE 7; 60 sec rest", "Front plank 3×35–45 sec; 45 sec rest", "Tibialis raise 3×15 + eccentric calf lower 3×12/side"] },
          { label: "COOLDOWN", items: ["5 min easy walk", "Gentle hamstring stretch 2×20 sec only after training; hinge from hip, neutral spine", "Log right-left strength difference"] },
        ],
      },
      {
        id: "S13-5", date: "8 AUG", dow: "SAT", title: "Long Easy Aerobic Run", type: "RUN", duration: "12–13 km · 75–85 min", rpe: "4–5",
        blocks: [
          { label: "PRE-RUN", items: ["5 min brisk walk + 5 min easy jog", "Right-hip physio drill 1–2 activation sets only", "Take water if conditions are hot or humid"] },
          { label: "MAIN", items: ["First 3 km deliberately easy around 6:20–6:40/km", "Middle 7–8 km settle into Z2, HR cap 142", "Final 2 km remain easy; no progression finish this week", "Flat or gently rolling route, no sustained hills"] },
          { label: "FUEL + FORM", items: ["For sessions over 75 min, take 25–35 g carbohydrate around 40–45 min", "Check posture every 2 km: tall hips, quiet feet, right knee tracks forward", "Stop if gait changes even without sharp pain"] },
          { label: "COOLDOWN", items: ["5–8 min walk", "Rehydrate and eat 25–35 g protein within the next meal", "Record next-morning hamstring stiffness"] },
        ],
      },
      {
        id: "S13-6", date: "9 AUG", dow: "SUN", title: "Full Rest + Hip Reset", type: "REST", duration: "15–20 min optional", rpe: "0–2",
        blocks: [
          { label: "OPTIONAL MOBILITY", items: ["Easy walk 10–20 min only if it improves recovery", "Physio-prescribed hip drill 2 sets", "90/90 switches 1×6/side + active hamstring floss 2×8/side", "No strength training and no make-up kilometres"] },
          { label: "WEEK REVIEW", items: ["Green: no pain, normal gait and normal next-morning stiffness", "Amber: pain 1–2/10 or stiffness greater than 24 h; hold next week's volume", "Red: pain above 2/10, swelling or altered gait; remove quality running and contact physio"] },
        ],
      },
    ],
  },
  {
    id: "S14",
    label: "W14",
    dates: "10–16 Aug",
    phase: "BUILD 1",
    volume: "34–36 km",
    focus: "Maintain the proven run engine while building Pro-load sled strength, burpee economy, right-side control and the first wall-ball capacity exposures. One true run-quality session plus controlled hills.",
    gate: "Unlock only after Week 13 is completed without altered gait or next-day symptom escalation. If a Shenzhen entry becomes confirmed, replace this build with a race-week taper rather than adding the race on top.",
    days: [
      { id: "S14-0", date: "10 AUG", dow: "MON", title: "Lower Strength · Squat + Hinge", type: "STRENGTH", duration: "75 min", rpe: "7", blocks: [
        { label: "WARM-UP", items: ["Bike 6 min easy", "90/90 switches 2×6/side + physio hip drill 2 sets", "Goblet squat 2×8 light + RDL 2×8 light"] },
        { label: "PRIMARY", items: ["Panatta hack squat or leg press 4×6 @ RPE 7–8; 2:30 rest", "Romanian deadlift 4×6 @ RPE 7–8; 2 min rest", "Rear-foot-supported split squat 3×8/side @ RPE 7; 90 sec rest", "Seated hamstring curl 4×8–10 @ RPE 8; 75 sec rest"] },
        { label: "CONTROL + PREHAB", items: ["Low step-down 3×8/side", "Long-lever hamstring bridge 3×30 sec", "Eccentric calf 3×12/side + tibialis raise 3×18", "Pallof press 3×10/side"] },
        { label: "COOLDOWN", items: ["Walk 5 min", "Active hamstring floss 2×8/side", "Record working loads; next week increases require all reps with clean form"] },
      ] },
      { id: "S14-1", date: "11 AUG", dow: "TUE", title: "Easy Z2 + Strides", type: "RUN", duration: "8 km · 50–55 min", rpe: "4–5", blocks: [
        { label: "WARM-UP", items: ["10 min easy", "Leg swings 10/side + supported hip airplane 2×5/side", "2×20 sec progressive pickups"] },
        { label: "MAIN", items: ["7 km easy at 6:00–6:30/km or HR ≤142", "5×20 sec strides at 85–90%; 70 sec walk/jog recovery", "Fast and relaxed, never straining"] },
        { label: "COOLDOWN", items: ["Easy jog/walk to 8 km total", "Physio hip drill 2 sets"] },
      ] },
      { id: "S14-2", date: "12 AUG", dow: "WED", title: "Partner Sled Technique + Upper Strength", type: "HYROX", duration: "75 min", rpe: "6–7", blocks: [
        { label: "WARM-UP", items: ["SkiErg 5 min easy", "Sled march 2×12.5 m unloaded", "Band row 2×12 + push-up to bench 2×8"] },
        { label: "SLED SKILL", items: ["Sled push 4×12.5 m at 75–85% Pro load; 90 sec rest; long arms, short steps", "Sled pull 8×12.5 m at 70–80% Pro load; 90 sec rest; short hand-over-hand cycles, hips low", "Film one push and one pull from the side; repeat only if posture and rope recovery remain clean", "Partner handover rehearsal 6 times; call the switch before fatigue forces it"] },
        { label: "BURPEE ECONOMY", items: ["5×4 burpee broad jumps; 45 sec walk-back recovery", "Land with feet outside the hands, use one smooth low step into the next rep", "Stop each set before breathing or jump length deteriorates"] },
        { label: "UPPER STRENGTH", items: ["Chest-supported row 4×8; 90 sec rest", "Machine chest press 4×8; 90 sec rest", "Lat pulldown 3×10; 75 sec rest"] },
        { label: "TRUNK", items: ["Farmer carry 4×40 m; 75 sec rest", "Side plank 3×35 sec/side"] },
        { label: "WALL-BALL DENSITY · WEEK 1", items: ["Position prep: kettlebell hip shift 2×30 sec/side, bench upper-back stretch 2×5 breaths, dowel overhead squat 2×4 slow reps", "Use the official Pro ball: 9 kg", "5-minute EMOM: complete 12 wall balls at the start of every minute = 60 total", "Finish each set within 25–35 sec; rest for the remainder of the minute", "Cues: full depth, ball close under chin, legs drive first, exhale on the throw", "Stop after two consecutive depth, target or balance misses; do not make up missed reps"] },
        { label: "COOLDOWN", items: ["Walk 5 min", "Physio hip drill 2 prescribed sets", "Log legal reps, no-reps, leg RPE, shoulder RPE and next-morning response"] },
      ] },
      { id: "S14-3", date: "13 AUG", dow: "THU", title: "Threshold 3×8 Minutes", type: "RUN", duration: "9–10 km · 60 min", rpe: "7", blocks: [
        { label: "WARM-UP", items: ["15 min easy jog", "A-march 2×20 m + 3×20 sec strides", "Start first repetition only when breathing is settled"] },
        { label: "MAIN", items: ["3×8 min at approximately 5:00–5:15/km or RPE 7; use whichever is slower", "Jog 2:30 between repetitions", "Hold even effort; pace may slow on inclines", "Final rep may be 5–10 sec/km faster only if form remains quiet"] },
        { label: "COOLDOWN", items: ["12 min easy jog", "Active hamstring floss 2×8/side", "Record average pace and HR for each repetition"] },
      ] },
      { id: "S14-4", date: "14 AUG", dow: "FRI", title: "Upper Strength + Hip Control", type: "STRENGTH", duration: "65 min", rpe: "7", blocks: [
        { label: "WARM-UP", items: ["Easy bike 5 min", "Shoulder circles + band pull-apart 2×12", "90/90 switches 2×6/side"] },
        { label: "MAIN", items: ["Neutral-grip lat pulldown 4×8 @ RPE 8; 90 sec rest", "Incline machine press 4×8 @ RPE 7–8; 90 sec rest", "Seated cable row 3×10; 75 sec rest", "Machine shoulder press 3×8; 75 sec rest", "Reverse pec deck 3×15; 60 sec rest", "Cable curl + rope pressdown 3×10 each; 60 sec after the pair"] },
        { label: "HIP + TRUNK", items: ["Physio right-hip drill 3 sets", "Single-leg RDL 3×8/side light and controlled", "Pallof press 3×12/side + front plank 3×40 sec"] },
        { label: "COOLDOWN", items: ["Walk 5 min", "No lower-body finisher before the weekend runs"] },
      ] },
      { id: "S14-5", date: "15 AUG", dow: "SAT", title: "Long Aerobic Run + Hill Surges", type: "RUN", duration: "13 km · 80–90 min", rpe: "4–7", blocks: [
        { label: "WARM-UP", items: ["2 km very easy", "Hip activation: supported airplane 1×5/side + marching 2×20 m"] },
        { label: "MAIN", items: ["Run 9 km steady Z2 after warm-up", "During km 5–10, complete 6×30 sec uphill at RPE 7", "Jog at least 2:30 easy between surges", "Finish remaining distance easy; no hard downhill running"] },
        { label: "FUEL + FORM", items: ["Take 25–35 g carbohydrate around 40 min", "Hill cue: quick feet, slight ankle lean, right knee tracks straight", "Descend easily to protect eccentric load"] },
        { label: "COOLDOWN", items: ["Walk 5–8 min", "Protein plus carbohydrate meal", "Log right hamstring response before Sunday's run"] },
      ] },
      { id: "S14-6", date: "16 AUG", dow: "SUN", title: "Recovery Run + Wall-Ball Skill", type: "RUN", duration: "45–50 min", rpe: "3–4", blocks: [
        { label: "RUN", items: ["4–5 km at recovery effort, approximately 6:25–6:55/km", "Flat route only", "If legs are heavy or the right hamstring is restricted, replace the run with 30 min easy bike"] },
        { label: "WALL-BALL SKILL · WEEK 1", items: ["After breathing settles for 3–5 min: 6-minute EMOM × 8 wall balls at 9 kg = 48 total", "Aim to finish each set in 15–20 sec; take the remaining 40–45 sec as complete rest", "Every repetition should look identical; this is speed and accuracy practice, not conditioning", "If the run was replaced because of symptoms, omit wall balls as well"] },
        { label: "MOBILITY", items: ["Physio hip drill 2 sets", "Kettlebell hip shift 1×30 sec/side", "Bench upper-back stretch 1×5 breaths", "Eccentric calf 2×12 + tibialis raise 2×15"] },
      ] },
    ],
  },
  {
    id: "S15",
    label: "W15",
    dates: "17–23 Aug",
    phase: "10K BUILD",
    volume: "38–40 km",
    focus: "Peak useful workload before PEGASUS while progressing Pro-load pull strength, late-race lunges and controlled 9 kg wall-ball density. Running quality stays precise, not excessive.",
    gate: "Increase only if Week 14 is green. If AVOHK 5K is raced, it replaces the 1 km interval session. Never perform both as hard efforts in the same week.",
    days: [
      { id: "S15-0", date: "17 AUG", dow: "MON", title: "Heavy Leg Strength", type: "STRENGTH", duration: "75 min", rpe: "7–8", blocks: [
        { label: "WARM-UP", items: ["Bike 6 min", "Physio hip drill 2 sets + kettlebell hip shift 2×30 sec/side", "Bench upper-back stretch 2×5 breaths + dowel overhead squat 2×4 slow reps", "Two ramp sets for leg press and RDL"] },
        { label: "PRIMARY", items: ["Leg press or hack squat 5×5 @ RPE 8; 2:30 rest", "Romanian deadlift 4×6 @ RPE 8; 2 min rest", "Walking lunge 3×10/side with controlled load; 90 sec rest", "Hamstring curl 4×8 @ RPE 8; 75 sec rest"] },
        { label: "HYROX SUPPORT", items: ["Farmer carry 5×40 m heavy; 75 sec rest", "Wall-ball squat pattern 3×10 with light ball, no throw; 60 sec rest", "Eccentric calf 3×12 + tibialis 3×18"] },
        { label: "TRUNK + COOLDOWN", items: ["Pallof press 3×10/side + side plank 3×35 sec/side", "Walk 5 min", "No extra leg work after completing the programmed sets"] },
      ] },
      { id: "S15-1", date: "18 AUG", dow: "TUE", title: "5×1 km · 10K Specific", type: "RUN", duration: "10 km total · 60–65 min", rpe: "8", blocks: [
        { label: "WARM-UP", items: ["2.5 km easy", "A-march 2×20 m + 4×20 sec strides", "Easy jog 2 min before rep 1"] },
        { label: "MAIN", items: ["5×1 km at 4:45–5:00/km or current 10K effort", "Jog 2 min between repetitions", "Reps 1–3 must match within 5 sec", "Rep 5 may be fastest, but never by more than 10 sec"] },
        { label: "COOLDOWN", items: ["Jog easy until 10 km total", "Record pace, HR and RPE for every rep", "If form breaks before rep 4, stop at four quality repetitions"] },
      ] },
      { id: "S15-2", date: "19 AUG", dow: "WED", title: "Pull Strength + Erg Power", type: "HYROX", duration: "70 min", rpe: "7", blocks: [
        { label: "WARM-UP", items: ["SkiErg 6 min easy", "Band pulldown 2×12 + cable row 2×10"] },
        { label: "STRENGTH", items: ["Chest-supported row 5×6 @ RPE 8; 2 min rest", "Lat pulldown 4×8 @ RPE 8; 90 sec rest", "Single-arm cable row 3×10/side; 60 sec between sides", "Heavy sled pull 8×12.5 m at 80–90% Pro load; 90 sec rest", "If all eight lengths stay clean, complete one final 12.5 m at Pro load; otherwise stop at eight"] },
        { label: "ERG POWER", items: ["SkiErg 6×250 m @ RPE 7–8; 75 sec rest", "Keep each split within 2 sec", "Long pull, strong finish, relaxed recovery"] },
        { label: "WALL-BALL SKILL · WEEK 2", items: ["Let breathing settle 3 min, then use a 9 kg ball", "7-minute EMOM: 8 wall balls at the start of every minute = 56 total", "Complete the 8 reps in 15–20 sec and rest fully for the balance of the minute", "Film minute 1 or 7 from the side: check full depth, stable heels and no right-hip shift", "Stop if accuracy or squat position deteriorates"] },
        { label: "ACCESSORY", items: ["Reverse pec deck 3×15", "Cable curl 3×10 + rope pressdown 3×10", "Front plank 3×45 sec"] },
        { label: "COOLDOWN", items: ["Easy walk 5 min", "Physio right-hip drill 2 sets"] },
      ] },
      { id: "S15-3", date: "20 AUG", dow: "THU", title: "Easy Aerobic Run", type: "RUN", duration: "8 km · 48–55 min", rpe: "4", blocks: [
        { label: "MAIN", items: ["8 km flat Z2 at 6:00–6:30/km or HR ≤142", "No strides and no fast finish", "Use this run to absorb Tuesday, not prove fitness"] },
        { label: "POST-RUN", items: ["Walk 5 min", "Active hamstring floss 2×8/side", "Physio hip drill 2 sets"] },
      ] },
      { id: "S15-4", date: "21 AUG", dow: "FRI", title: "Wall Balls + Sandbag Lunges", type: "HYROX", duration: "70 min", rpe: "6–7", blocks: [
        { label: "WARM-UP", items: ["Bike or jog 8 min easy", "Kettlebell hip shift 2×30 sec/side + bench upper-back stretch 2×5 breaths", "Dowel overhead squat 2×4 slow reps with a 2-sec bottom pause", "2×8 light wall balls; 45 sec rest"] },
        { label: "WALL-BALL DENSITY · WEEK 2", items: ["Use the official Pro ball: 9 kg", "5-minute EMOM: complete 14 wall balls at the start of every minute = 70 total", "Finish each set within 25–35 sec; rest for the remainder of the minute", "Cues: heels stable, knees over middle toes, ball close, legs drive, soft catch", "Stop after two consecutive no-reps or if the right hip shifts; do not chase the total"] },
        { label: "LUNGE CAPACITY", items: ["4×25 m sandbag lunges at controlled race load; 90 sec rest", "Alternate lead leg naturally", "Front knee tracks over mid-foot; torso tall", "Stop the set if right hip rotates or stride shortens"] },
        { label: "TRANSITION PRACTICE · 3 ROUNDS", items: ["400 m easy-moderate run", "20 m farmer carry", "Walk 60 sec, then rest until 2 min has elapsed", "Keep total effort at RPE 7; no extra wall balls"] },
        { label: "COOLDOWN", items: ["Walk 5–8 min", "Physio hip drill 2 sets", "Log legal reps, no-reps, leg RPE, shoulder RPE and next-morning response"] },
      ] },
      { id: "S15-5", date: "22 AUG", dow: "SAT", title: "Recovery Run or AVOHK Replacement", type: "RUN", duration: "5 km easy · 32–38 min", rpe: "3–4", note: "If racing AVOHK 5K, Tuesday's 5×1 km must be replaced by 6 km easy. Do not keep both quality sessions.", blocks: [
        { label: "RECOVERY OPTION", items: ["5 km very easy at 6:20–6:50/km", "Flat route, relaxed cadence", "Finish feeling better than you started"] },
        { label: "RACE OPTION", items: ["Warm up 2 km + drills + 4 strides", "Run 5K progressively: controlled first 2 km, commit through km 3–4, race final km", "Cool down 1–2 km", "Only use this option if Tuesday was changed to easy running"] },
      ] },
      { id: "S15-6", date: "23 AUG", dow: "SUN", title: "Long Aerobic Run", type: "RUN", duration: "15 km · 90–100 min", rpe: "4–5", blocks: [
        { label: "PRE-RUN", items: ["5 min walk + 8 min easy jog", "Right-hip activation 1–2 sets", "Carry water and 35–45 g carbohydrate"] },
        { label: "MAIN", items: ["First 4 km easy around 6:20–6:40/km", "Middle 8 km stable Z2, HR ≤142", "Final 3 km steady only if legs remain symmetrical; maximum RPE 5", "No hard hill surges"] },
        { label: "FUEL", items: ["Take 25–30 g carbohydrate around 35–40 min", "Optional second 20–25 g around 70 min", "Drink to thirst, more in Hong Kong heat"] },
        { label: "COOLDOWN", items: ["Walk 8 min", "Protein-rich meal plus carbohydrate", "Record fatigue and morning Body Battery before race week"] },
      ] },
    ],
  },
  {
    id: "S16",
    label: "W16",
    dates: "24–30 Aug",
    phase: "RACE WEEK",
    volume: "25–27 km including race",
    focus: "Reduce fatigue while retaining speed and strength. PEGASUS is the benchmark that resets the autumn pace model.",
    gate: "Do not add kilometres during the taper. If hip, hamstring or knee symptoms return, remove the primer before removing easy running.",
    days: [
      { id: "S16-0", date: "24 AUG", dow: "MON", title: "Strength Primer · Full Body", type: "STRENGTH", duration: "50 min", rpe: "5–6", blocks: [
        { label: "WARM-UP", items: ["Bike 5 min", "90/90 switches 1×6/side + physio hip drill 2 sets", "One light ramp set per main exercise"] },
        { label: "MAIN", items: ["Leg press 3×5 @ RPE 6; 2 min rest", "Romanian deadlift 3×6 @ RPE 6; 2 min rest", "Chest-supported row 3×8 @ RPE 6; 75 sec rest", "Machine chest press 3×8 @ RPE 6; 75 sec rest", "Hamstring curl 2×8 @ RPE 6; 60 sec rest"] },
        { label: "PREHAB", items: ["Eccentric calf 2×10/side + tibialis 2×15", "Pallof press 2×10/side", "Finish every set fresh; no finisher"] },
      ] },
      { id: "S16-1", date: "25 AUG", dow: "TUE", title: "4×600 m Race Primer", type: "RUN", duration: "7 km total · 42–48 min", rpe: "7", blocks: [
        { label: "WARM-UP", items: ["2 km easy", "Dynamic drills + 4×15 sec strides", "Jog 2 min"] },
        { label: "MAIN", items: ["4×600 m at approximately 4:40–4:55/km or 10K effort", "Jog 2 min between repetitions", "Finish controlled with fast, relaxed mechanics"] },
        { label: "COOLDOWN", items: ["Jog easy to 7 km total", "No extra repetitions even if feeling strong"] },
      ] },
      { id: "S16-2", date: "26 AUG", dow: "WED", title: "Easy Run + Mobility", type: "RUN", duration: "5 km · 30–35 min", rpe: "3–4", blocks: [
        { label: "MAIN", items: ["5 km easy at 6:15–6:45/km", "Flat route, conversational breathing", "No strides"] },
        { label: "MOBILITY", items: ["Physio hip drill 2 sets", "Active hamstring floss 2×8/side", "90/90 switches 1×6/side"] },
      ] },
      { id: "S16-3", date: "27 AUG", dow: "THU", title: "Full Rest", type: "REST", duration: "All day", rpe: "0", blocks: [
        { label: "RECOVERY", items: ["Normal walking only", "Prioritise sleep and hydration", "No make-up strength or cardio", "Check shoes, race kit and transport"] },
      ] },
      { id: "S16-4", date: "28 AUG", dow: "FRI", title: "Shakeout + Strides", type: "RUN", duration: "4 km · 25–30 min", rpe: "3–5", blocks: [
        { label: "MAIN", items: ["3 km very easy", "4×15 sec relaxed strides; 60–75 sec walk recovery", "Jog/walk to 4 km total"] },
        { label: "POST", items: ["Physio hip drill 1–2 activation sets", "Stop while feeling fresh"] },
      ] },
      { id: "S16-5", date: "29 AUG", dow: "SAT", title: "Rest + Race Preparation", type: "REST", duration: "All day", rpe: "0", blocks: [
        { label: "PREP", items: ["Normal carbohydrate-rich meals; do not overeat", "Hydrate steadily and include normal electrolytes", "Lay out shoes, bib, watch and clothing", "Target full night's sleep; no gym session"] },
      ] },
      { id: "S16-6", date: "30 AUG", dow: "SUN", title: "PEGASUS Tsuen Wan 10K", type: "RACE", duration: "10 km + warm-up", rpe: "8–9", race: true, blocks: [
        { label: "WARM-UP · 20–25 MIN", items: ["10–12 min easy jog", "Dynamic drills: leg swings, marching and ankle hops", "4×20 sec strides with 60 sec easy", "Finish warm-up 5–8 min before start"] },
        { label: "RACE EXECUTION", items: ["Km 1–2: RPE 7, deliberately controlled", "Km 3–6: settle at sustainable 10K effort; run hills by effort, not pace", "Km 7–8: hold form and cadence before increasing effort", "Km 9–10: progress to RPE 9 if hip, hamstring and knee remain normal"] },
        { label: "COURSE RULES", items: ["Shorten stride uphill and keep cadence", "Do not attack early downhill sections", "Take water only as needed; no new nutrition strategy"] },
        { label: "POST-RACE", items: ["Walk 10 min", "Record finish time, splits, HR, RPE and symptoms", "The result recalibrates September threshold pace and JPMCC target"] },
      ] },
    ],
  },
];

const races: Race[] = [
  { startIso: "2026-07-25", date: "25 Jul 2026", name: "HYROX Delhi", type: "Pro Doubles Men", status: "DONE", priority: "Context", location: "Delhi", note: "1:27:54 · AG 14 · Overall 91. Partner-paced running and a larger station share make this a team result, not Amar's individual fitness baseline.", category: "campaign", sourceLabel: "RESULT", checked: "25 Jul 2026" },
  { startIso: "2026-08-30", date: "30 Aug 2026", name: "PEGASUS Tsuen Wan 10K", type: "Road 10K", status: "REGISTERED", priority: "B", location: "Hong Kong", note: "Post-Delhi run benchmark; result resets September training paces.", category: "campaign", sourceLabel: "USER CONFIRMED", checked: "5 Aug 2026" },
  { startIso: "2026-11-04", date: "4 Nov 2026", name: "JPM Corporate Challenge", type: "5.6K road", status: "DATE TBC", priority: "B", location: "Hong Kong", note: "Working date from the season plan; confirm when the JPM team publishes the final date.", category: "campaign", sourceLabel: "PLAN OF RECORD", checked: "5 Aug 2026" },
  { startIso: "2026-12-20", date: "20 Dec 2026", name: "Shenzhen Marathon", type: "Road marathon option", status: "DECIDE", priority: "C", location: "Shenzhen", note: "Lottery-gated. Honest default is skip unless recovery and HYROX priorities stay green.", category: "campaign", sourceLabel: "PLAN OF RECORD", checked: "5 Aug 2026" },
  { startIso: "2027-01-03", date: "3 Jan 2027", name: "Xiamen Marathon", type: "January road option", status: "DECIDE", priority: "C", location: "Xiamen", note: "One of three January options; do not stack it with another marathon or a January HYROX.", category: "campaign", sourceLabel: "PLAN OF RECORD", checked: "5 Aug 2026" },
  { startIso: "2027-01-17", date: "17 Jan 2027", name: "Hong Kong / Mumbai Marathon option", type: "January road option", status: "DECIDE", priority: "C", location: "Hong Kong or Mumbai", note: "Choose no more than one January road race. Decision remains subordinate to qualification strategy.", category: "campaign", sourceLabel: "PLAN OF RECORD", checked: "5 Aug 2026" },

  { startIso: "2026-10-31", date: "31 Oct–1 Nov 2026", name: "HYROX Shanghai", type: "Pro Doubles Men watch", status: "SALES SOON", priority: "A option", location: "Shanghai", note: "Close-to-home qualification attempt if Pro Doubles inventory and Andy are confirmed.", category: "hyrox", sourceLabel: "OFFICIAL HYROX", sourceUrl: "https://hyrox.com/event/hyrox-shanghai-1031/", checked: "5 Aug 2026" },
  { startIso: "2026-11-21", date: "21–22 Nov 2026", name: "HYROX Guangzhou", type: "Pro Doubles Men watch", status: "SALES SOON", priority: "A", location: "Guangzhou", note: "Primary close-to-home qualifier. Register immediately when Pro Doubles sales open.", category: "hyrox", sourceLabel: "OFFICIAL HYROX", sourceUrl: "https://hyrox.com/event/hyrox-guangzhou/", checked: "5 Aug 2026" },
  { startIso: "2026-11-26", date: "26–28 Nov 2026", name: "HYROX Gujarat · Gandhinagar", type: "Pro Doubles Men watch", status: "TRAVEL CONFLICT", priority: "Low", location: "Gandhinagar", note: "Official event window; overlaps the extended travel block and exceeds the preferred flight filter.", category: "hyrox", sourceLabel: "OFFICIAL HYROX INDIA", sourceUrl: "https://hyrox.co.in/event/hyrox-gujarat/", checked: "5 Aug 2026" },
  { startIso: "2027-01-07", date: "7–10 Jan 2027", name: "AIA HYROX Hong Kong", type: "Pro Doubles Men watch", status: "SALES SOON", priority: "A", location: "Hong Kong", note: "Home qualifier window. This takes priority over forcing a January marathon.", category: "hyrox", sourceLabel: "OFFICIAL HYROX", sourceUrl: "https://hyrox.com/event/hyrox-hong-kong/", checked: "5 Aug 2026" },
  { startIso: "2027-01-15", date: "15–17 Jan 2027", name: "HYROX Greater Noida", type: "Pro Doubles Men watch", status: "SALES SOON", priority: "B option", location: "Greater Noida", note: "Official dates; travel-heavy alternative one week after HYROX Hong Kong.", category: "hyrox", sourceLabel: "OFFICIAL HYROX INDIA", sourceUrl: "https://hyrox.co.in/event/hyrox-noida/", checked: "5 Aug 2026" },
  { startIso: "2027-01-21", date: "21–24 Jan 2027", name: "BYD HYROX Osaka", type: "Pro Doubles Men watch", status: "SALES SOON", priority: "A option", location: "Osaka", note: "Practical APAC qualifier, but never stack with Hong Kong or Noida without a recovery decision.", category: "hyrox", sourceLabel: "OFFICIAL HYROX", sourceUrl: "https://hyrox.com/event/byd-hyrox-osaka/", checked: "5 Aug 2026" },
  { startIso: "2027-02-11", date: "11–14 Feb 2027", name: "BYD HYROX Bangkok", type: "Pro Doubles Men watch", status: "SALES SOON", priority: "A", location: "Bangkok", note: "Primary second qualification window if no January slot is secured.", category: "hyrox", sourceLabel: "OFFICIAL HYROX", sourceUrl: "https://hyrox.com/event/hyrox-bangkok/", checked: "5 Aug 2026" },
  { startIso: "2027-03-12", date: "12–14 Mar 2027", name: "HYROX Taipei", type: "Pro Doubles Men watch", status: "SALES SOON", priority: "A option", location: "Taipei", note: "Short-haul qualifier option with enough time to recover and build again before May.", category: "hyrox", sourceLabel: "OFFICIAL HYROX", sourceUrl: "https://hyrox.com/event/hyrox-taipei/", checked: "5 Aug 2026" },
  { startIso: "2027-04-16", date: "16–18 Apr 2027", name: "HYROX Nagoya", type: "Pro Doubles Men watch", status: "SALES SOON", priority: "A option", location: "Nagoya", note: "Late but workable qualifier window; five to eight weeks remain before Worlds.", category: "hyrox", sourceLabel: "OFFICIAL HYROX", sourceUrl: "https://hyrox.com/event/hyrox-nagoya/", checked: "5 Aug 2026" },
  { startIso: "2027-05-12", date: "12–16 May 2027", name: "HYROX Bengaluru", type: "Pro Doubles Men watch", status: "LAST CHANCE", priority: "Risk", location: "Bengaluru", note: "Event ends on the stated qualification cutoff. Treat as contingency only; result timing is dangerously tight.", category: "hyrox", sourceLabel: "OFFICIAL HYROX INDIA", sourceUrl: "https://hyrox.co.in/event/hyrox-bengaluru/", checked: "5 Aug 2026" },
  { startIso: "2027-05-13", date: "13–16 May 2027", name: "BYD HYROX Incheon", type: "Pro Doubles Men watch", status: "LAST CHANCE", priority: "Risk", location: "Incheon", note: "Also ends at the cutoff. Do not leave qualification to this race unless HYROX confirms result eligibility timing.", category: "hyrox", sourceLabel: "OFFICIAL HYROX", sourceUrl: "https://hyrox.com/event/hyrox-incheon/", checked: "5 Aug 2026" },
  { startIso: "2027-06-10", date: "10–13 Jun 2027", name: "PUMA HYROX World Championships", type: "Pro Doubles Men", status: "TARGET", priority: "A+", location: "Hong Kong", note: "Target event. Qualification results must be posted by 16 May 2027.", category: "hyrox", sourceLabel: "OFFICIAL HYROX", sourceUrl: "https://hyrox.com/event/puma-hyrox-world-championships-hong-kong/", checked: "5 Aug 2026" },
];

const raceHistory = [
  ["Taipei · 1 Mar", "Open Singles", "1:37:22", "Run 5:31 · Functional 43:08 · Roxzone 10:10"],
  ["Wuhan · 11 Apr", "Open Doubles · Andy", "1:16:35", "Run 5:12 · Functional 28:31 · Roxzone 6:32"],
  ["Hong Kong · 9 May", "Pro Singles", "1:45:24", "Run 4:46 · Functional 55:13 · Roxzone 12:09"],
  ["Delhi · 25 Jul", "Pro Doubles · constrained", "1:27:54", "Partner-paced; Amar carried more station work"],
];

const singlesStationTrend = [
  ["Sled pull", "5:41", "8:19", "Pro-load strength + rope efficiency"],
  ["Burpee broad jump", "7:55", "8:01", "Movement economy, not more random volume"],
  ["Sandbag lunges", "6:40", "10:55", "Largest late-race strength-endurance gap"],
  ["Wall balls", "7:41", "10:45", "Depth, breathing and fatigue-resistant sets"],
  ["Roxzone", "10:10", "12:09", "Execution cost persists across both singles"],
];

const wallBallBuild = [
  ["10–16 Aug", "5-min EMOM × 12", "6-min EMOM × 8", "60 + 48 legal reps at 9 kg"],
  ["17–23 Aug", "5-min EMOM × 14", "7-min EMOM × 8", "70 + 56 legal reps at 9 kg"],
  ["24–30 Aug", "Race-week deload", "Optional 2×8 technique", "No density work before PEGASUS"],
  ["31 Aug–6 Sep", "5-min EMOM × 16", "8-min EMOM × 9", "80 + 72 legal reps at 9 kg"],
  ["7–13 Sep", "5-min EMOM × 18", "8-min EMOM × 10", "90 + 80 legal reps at 9 kg"],
  ["14–20 Sep", "4-min EMOM × 15", "35 + 20 after 20 sec", "First controlled fatigue week"],
  ["21–27 Sep", "4-min EMOM × 18", "45 + 25 after 20 sec", "Progress only after a green morning"],
  ["28 Sep–4 Oct", "4-min EMOM × 20", "55 + 30 or green test", "Test 70–100 only with legal form"],
];

const phaseRoadmap = [
  ["27 Jul–9 Aug 2026", "Recover + rebuild", "27 km baseline into structured strength"],
  ["10–16 Aug 2026", "Build 1", "Threshold, hills and HYROX technique"],
  ["17–30 Aug 2026", "10K sharpening", "PEGASUS Tsuen Wan 10K · 30 Aug"],
  ["31 Aug–4 Oct 2026", "Threshold + aerobic durability", "Raise sustainable run pace"],
  ["5–18 Oct 2026", "Travel-adjusted endurance", "Front-load quality around the 9–12 Oct neutral travel window"],
  ["19 Oct–1 Nov 2026", "Shanghai option", "HYROX-specific build into 31 Oct–1 Nov"],
  ["2–15 Nov 2026", "Speed + HYROX bridge", "JPMCC working date 4 Nov; maintain aerobic durability for Guangzhou"],
  ["16–22 Nov 2026", "Guangzhou race week", "Taper into HYROX Guangzhou · 21–22 Nov"],
  ["23 Nov–13 Dec 2026", "Recover + travel maintenance", "Extended neutral travel window · 28 Nov–13 Dec"],
  ["14–20 Dec 2026", "Marathon decision week", "Shenzhen option · 20 Dec; default skip unless green"],
  ["21 Dec 2026–10 Jan 2027", "Home qualifier build", "AIA HYROX Hong Kong · 7–10 Jan"],
  ["11–24 Jan 2027", "January APAC options", "Greater Noida · 15–17 Jan; Osaka · 21–24 Jan"],
  ["25 Jan–14 Feb 2027", "Bangkok qualifier build", "BYD HYROX Bangkok · 11–14 Feb"],
  ["15 Feb–14 Mar 2027", "Taipei qualifier build", "HYROX Taipei · 12–14 Mar"],
  ["15 Mar–18 Apr 2027", "Nagoya qualifier build", "HYROX Nagoya · 16–18 Apr"],
  ["19 Apr–16 May 2027", "Final qualifier window", "Bengaluru · 12–16 May; Incheon · 13–16 May"],
  ["17 May–9 Jun 2027", "Worlds taper or next-cycle bridge", "Qualification-dependent transition"],
  ["10–13 Jun 2027", "World Championships", "Hong Kong target event"],
];

const augustCells = [
  ["27", "Rest · recovery", "rest"],
  ["28", "Mobility", "mobility"],
  ["29", "Rest", "rest"],
  ["30", "25m leg check", "run"],
  ["31", "Upper + mobility", "strength"],
  ["1", "30m easy", "run"],
  ["2", "Rest + debrief", "rest"],
  ["3", "Full-body strength A", "strength"],
  ["4", "7–8K easy + strides", "run"],
  ["5", "Pull + erg technique", "hyrox"],
  ["6", "4×5m steady", "run"],
  ["7", "Full-body strength B", "strength"],
  ["8", "12–13K long easy", "run"],
  ["9", "Rest + hip reset", "rest"],
  ["10", "Lower strength", "strength"],
  ["11", "8K easy + strides", "run"],
  ["12", "Sled + wall-ball density", "hyrox"],
  ["13", "3×8m threshold", "run"],
  ["14", "Upper + hip control", "strength"],
  ["15", "13K + hill surges", "run"],
  ["16", "Recovery + wall-ball skill", "run"],
  ["17", "Heavy lower strength", "strength"],
  ["18", "5×1K specific", "run"],
  ["19", "Pull + wall-ball skill", "hyrox"],
  ["20", "8K easy", "run"],
  ["21", "Wall balls + lunges", "hyrox"],
  ["22", "5K recovery / race", "run"],
  ["23", "15K long aerobic", "run"],
  ["24", "Full-body primer", "strength"],
  ["25", "4×600m primer", "run"],
  ["26", "5K easy", "run"],
  ["27", "Rest", "rest"],
  ["28", "Shakeout", "run"],
  ["29", "Race prep", "rest"],
  ["30", "PEGASUS 10K", "race"],
];

export default function App() {
  const [tab, setTab] = useState("plan");
  const [weekId, setWeekId] = useState("S13");
  const [openDay, setOpenDay] = useState("S13-0");
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [saveState, setSaveState] = useState("");
  const [checkins, setCheckins] = useState<Array<Record<string, string | number>>>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedCompletions = window.localStorage.getItem("rmr_completed_v4");
        const savedCheckins = window.localStorage.getItem("ap_training_checkins_v1");
        if (savedCompletions) setCompleted(JSON.parse(savedCompletions));
        if (savedCheckins) setCheckins(JSON.parse(savedCheckins));
      } catch {
        setSaveState("Saved progress could not be read on this device.");
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const week = weeks.find((item) => item.id === weekId) ?? weeks[0];
  const doneCount = week.days.filter((day) => completed[day.id]).length;
  const nextRaceDays = Math.max(0, Math.ceil((new Date("2026-08-30T00:00:00+08:00").getTime() - Date.now()) / 86400000));
  const todayHk = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Hong_Kong" }).format(new Date());

  function raceCountdown(startIso: string, status: string) {
    if (status === "DONE") return "COMPLETED";
    const days = Math.ceil((new Date(startIso + "T00:00:00+08:00").getTime() - Date.now()) / 86400000);
    if (days < 0) return "DATE PASSED";
    if (days === 0) return "TODAY";
    return days + " DAYS";
  }

  function statusClass(status: string) {
    return status.toLowerCase().replace(/\s+/g, "-");
  }

  function toggleDay(id: string) {
    const value = !completed[id];
    try {
      setCompleted((current) => {
        const next = { ...current, [id]: value };
        window.localStorage.setItem("rmr_completed_v4", JSON.stringify(next));
        return next;
      });
      setSaveState("Saved");
    } catch {
      setSaveState("Could not save. Try again.");
    }
  }

  function saveCheckin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      checkinDate: String(form.get("checkinDate")),
      sleepHours: String(form.get("sleepHours")),
      bodyBattery: Number(form.get("bodyBattery")),
      painScore: Number(form.get("painScore")),
      sessionRpe: Number(form.get("sessionRpe")),
      note: String(form.get("note")),
    };
    try {
      const entry = {
        checkin_date: payload.checkinDate,
        sleep_hours: payload.sleepHours,
        body_battery: payload.bodyBattery,
        pain_score: payload.painScore,
        session_rpe: payload.sessionRpe,
        note: payload.note,
      };
      const next = [entry, ...checkins].slice(0, 12);
      window.localStorage.setItem("ap_training_checkins_v1", JSON.stringify(next));
      setCheckins(next);
      setSaveState("Check-in saved");
      event.currentTarget.reset();
    } catch {
      setSaveState("Check-in could not be saved.");
    }
  }

  const readiness = useMemo(() => {
    const latest = checkins[0];
    if (!latest) return { label: "NO CHECK-IN", tone: "neutral" };
    if (Number(latest.pain_score) >= 4 || Number(latest.body_battery) < 30)
      return { label: "RED · RECOVER", tone: "red" };
    if (Number(latest.pain_score) >= 2 || Number(latest.body_battery) < 55)
      return { label: "AMBER · MODIFY", tone: "amber" };
    return { label: "GREEN · PROCEED", tone: "green" };
  }, [checkins]);

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">AMAR PANDEY · TRAINING SYSTEM V7.4</p>
          <h1>SEASON <span>2026/27</span></h1>
          <div className="status-line">
            <span className="phase-pill">BUILD</span>
            <span>W13–16 granular prescription</span>
            <span className={`readiness ${readiness.tone}`}>{readiness.label}</span>
          </div>
        </div>
        <div className="countdown">
          <strong>{nextRaceDays}</strong>
          <span>DAYS · PEGASUS</span>
        </div>
      </header>

      <nav className="main-tabs" aria-label="Main views">
        {[
          ["plan", "PLAN"],
          ["calendar", "CALENDAR"],
          ["races", "RACE HQ"],
          ["analysis", "ANALYSIS"],
        ].map(([id, label]) => (
          <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </nav>

      {tab === "plan" && (
        <section className="view">
          <div className="strategy-callout">
            <b>WHAT'S NEW · VERSION 7.4</b>
            <p>An Amar-specific eight-week wall-ball build now converts mobility, strength reserve and density into two controlled 9 kg exposures per week. Week 16 deloads for PEGASUS rather than forcing linear volume. Every session lists exact repetitions, rest, legal-rep cues and stop rules. The full coaching source remains private. Storage keys and completion ids remain unchanged.</p>
          </div>
          <div className="week-strip">
            {weeks.map((item) => (
              <button key={item.id} className={weekId === item.id ? "selected" : ""} onClick={() => setWeekId(item.id)}>
                <b>{item.label}</b>
                <span>{item.phase}</span>
              </button>
            ))}
          </div>

          <div className="week-heading">
            <div>
              <p className="section-kicker">{week.dates}</p>
              <h2>{week.label} · <span>{week.phase}</span></h2>
              <p>{week.focus}</p>
            </div>
            <div className="done-score"><b>{doneCount}/7</b><span>DONE</span></div>
          </div>

          <div className="volume-card">
            <strong>{week.volume}</strong>
            <div><b>WEEKLY TARGET</b><span>Volume is subordinate to the injury gate and recovery signals.</span></div>
          </div>

          {week.gate && <div className="gate"><b>INJURY GATE</b>{week.gate}</div>}

          <div className="day-list">
            {week.days.map((day) => {
              const isOpen = openDay === day.id;
              return (
                <article className={`day-card ${isOpen ? "open" : ""}`} key={day.id}>
                  <button className="day-summary" onClick={() => setOpenDay(isOpen ? "" : day.id)}>
                    <span
                      className={`check ${completed[day.id] ? "checked" : ""}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleDay(day.id);
                      }}
                      role="checkbox"
                      aria-checked={Boolean(completed[day.id])}
                      aria-label={"Mark " + day.title + " complete"}
                    >
                      {completed[day.id] ? "✓" : ""}
                    </span>
                    <span className="day-title">
                      <small>{day.dow} {day.date} {day.travel ? " · TRAVEL" : ""}</small>
                      <b>{day.title}</b>
                    </span>
                    <span className={`type-pill ${day.type.toLowerCase()}`}>{day.type}</span>
                    <span className="chevron">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div className="day-detail">
                      <div className="prescription"><b>PRIMARY · {day.duration}</b><b>RPE {day.rpe}</b></div>
                      {day.blocks?.map((block) => (
                        <div className="workout-block" key={block.label}>
                          <h3>{block.label}</h3>
                          <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>
                        </div>
                      ))}
                      {day.note && <p className="coach-note">{day.note}</p>}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <section className="checkin-panel">
            <div>
              <p className="section-kicker">ADAPTATION INPUT</p>
              <h2>Daily check-in</h2>
              <p>The next week should change from actual recovery and pain, not motivation. Entries stay only on this device and are not uploaded.</p>
            </div>
            <form onSubmit={saveCheckin}>
              <label>Date<input name="checkinDate" type="date" defaultValue={todayHk} required /></label>
              <label>Sleep hours<input name="sleepHours" type="number" step="0.1" min="0" max="14" required /></label>
              <label>Body Battery<input name="bodyBattery" type="number" min="0" max="100" required /></label>
              <label>Pain 0–10<input name="painScore" type="number" min="0" max="10" required /></label>
              <label>Session RPE<input name="sessionRpe" type="number" min="0" max="10" required /></label>
              <label className="wide">Note<input name="note" placeholder="What changed today?" /></label>
              <button className="save-button" type="submit">SAVE CHECK-IN</button>
            </form>
            {saveState && <p className="save-state">{saveState}</p>}
          </section>
        </section>
      )}

      {tab === "calendar" && (
        <section className="view">
          <div className="view-heading">
            <p className="section-kicker">ONE CALENDAR · NO DRIFT</p>
            <h2>August 2026</h2>
            <p>Training, races and availability are planned as one workload.</p>
          </div>
          <div className="calendar-days">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => <b key={day}>{day}</b>)}
          </div>
          <div className="calendar-grid">
            {augustCells.map(([date, event, kind], index) => (
              <div className={`calendar-cell ${kind}`} key={date + event}>
                <span>{date}</span><b>{event}</b>
                {index === 0 && <small>JUL</small>}
              </div>
            ))}
          </div>
          <section className="roadmap">
            <div className="view-heading compact">
              <p className="section-kicker">SEASON FRAMEWORK</p>
              <h2>Rolling plan to Hong Kong 2027</h2>
            </div>
            {phaseRoadmap.map(([dates, phase, outcome]) => (
              <div className="roadmap-row" key={dates}><span>{dates}</span><b>{phase}</b><p>{outcome}</p></div>
            ))}
          </section>
          <section className="travel-panel">
            <div><span>22–27 JUL 2026</span><b>Race travel window · completed</b><p>Recovery and race execution took priority around Delhi. No itinerary or booking data is published.</p></div>
            <div><span>9–12 OCT 2026</span><b>Short neutral travel window</b><p>Front-load the key quality session. Travel running is optional and never used to make up volume.</p></div>
            <div><span>28 NOV–13 DEC 2026</span><b>Extended neutral travel window</b><p>Two runs and two short circuits weekly at most. Dates are public; destinations and booking details remain excluded.</p></div>
          </section>
        </section>
      )}

      {tab === "races" && (
        <section className="view">
          <div className="view-heading">
            <div>
              <p className="section-kicker">QUALIFYING STRATEGY · VERIFIED 5 AUG 2026</p>
              <h2>Race HQ</h2>
              <p>Exact dates, transparent sources and dynamic countdowns. Only A-races get a true taper; every other event supports the qualification campaign.</p>
            </div>
          </div>
          <div className="watch-summary">
            <div><b>{races.filter((race) => race.category === "hyrox" && race.status !== "DONE").length}</b><span>HYROX WINDOWS</span></div>
            <div><b>16 MAY 2027</b><span>RESULT CUTOFF</span></div>
            <div><b>10–13 JUN 2027</b><span>HONG KONG WORLDS</span></div>
          </div>
          <div className="race-section-heading">
            <p className="section-kicker">CAMPAIGN CALENDAR</p>
            <h3>Road races and decision points</h3>
          </div>
          <div className="race-list">
            {races.filter((race) => race.category === "campaign").map((race) => (
              <article className="race-card" key={race.name}>
                <div className="race-date"><b>{race.date}</b><span>{raceCountdown(race.startIso, race.status)}</span></div>
                <div><small>{race.location} · {race.type}</small><h3>{race.name}</h3><p>{race.note}</p><div className="race-source"><span>{race.sourceLabel}</span><span>Checked {race.checked}</span></div></div>
                <div className={`race-status ${statusClass(race.status)}`}>{race.status}</div>
                <div className="priority">{race.priority}</div>
              </article>
            ))}
          </div>
          <div className="race-section-heading watch-heading">
            <p className="section-kicker">APAC HYROX WATCHLIST</p>
            <h3>Official event windows and ticket actions</h3>
            <p>Countdowns update automatically. Ticket availability is a verified snapshot, not a live inventory claim; use the official event link before booking.</p>
          </div>
          <div className="race-list">
            {races.filter((race) => race.category === "hyrox").map((race) => (
              <article className="race-card" key={race.name}>
                <div className="race-date"><b>{race.date}</b><span>{raceCountdown(race.startIso, race.status)}</span></div>
                <div>
                  <small>{race.location} · {race.type}</small><h3>{race.name}</h3><p>{race.note}</p>
                  <div className="race-source">
                    {race.sourceUrl ? <a href={race.sourceUrl} target="_blank" rel="noreferrer">{race.sourceLabel} ↗</a> : <span>{race.sourceLabel}</span>}
                    <span>Checked {race.checked}</span>
                  </div>
                </div>
                <div className={`race-status ${statusClass(race.status)}`}>{race.status}</div>
                <div className="priority">{race.priority}</div>
              </article>
            ))}
          </div>
          <div className="freshness-note">
            <b>TRACKING MODEL</b>
            <p>Personal registration records are reconciled privately and are not exposed here. Official organiser and ticket-shop pages are the source of truth for public dates and inventory. HYRESULT is used only as a secondary discovery signal. When Men's Pro Doubles is confirmed sold out, the race is removed from this active watchlist and returns only if official inventory reopens.</p>
          </div>
          <div className="strategy-callout">
            <b>PARTNER ASSUMPTION · CONFIRMED TRAINING PARTNER</b>
            <p>Plan Pro Doubles station ownership and two shared technique sessions per month now. Increase to weekly shared race-specific work in the final six weeks before each A-race.</p>
          </div>
        </section>
      )}

      {tab === "analysis" && (
        <section className="view">
          <div className="view-heading">
            <p className="section-kicker">LONGITUDINAL HYROX PROFILE · MAR–JUL 2026</p>
            <h2>Running strength. Pro-station durability gap.</h2>
            <p>Four races, two formats and two divisions now inform the prescription.</p>
          </div>
          <div className="metric-grid">
            <div><span>PRO SINGLES RUN</span><b>4:46</b><small>Hong Kong average run · relative strength</small></div>
            <div><span>PRO FUNCTIONAL</span><b>55:13</b><small>Hong Kong · primary individual limiter</small></div>
            <div><span>ANDY PAIR BASELINE</span><b>1:16:35</b><small>Wuhan Open Doubles</small></div>
            <div><span>SINGLES ROXZONE</span><b>10–12m</b><small>Repeatable execution cost</small></div>
          </div>
          <div className="analysis-grid">
            <section className="split-table">
              <div className="table-head"><b>RACE</b><b>FORMAT</b><b>FINISH</b><b>READ</b></div>
              {raceHistory.map(([race, format, finish, read]) => (
                <div className="table-row" key={race}><span>{race}</span><b>{format}</b><span>{finish}</span><span>{read}</span></div>
              ))}
            </section>
            <aside className="diagnostic">
              <p className="section-kicker">WHAT THE SERIES SAYS</p>
              <h3>Four programming priorities</h3>
              <ol>
                <li><b>Maintain, do not chase, the run engine.</b><span>Hong Kong Pro Singles produced a 4:46 average run. Threshold precision and compromised consistency matter more than indiscriminate mileage.</span></li>
                <li><b>Build Pro-load station strength.</b><span>Hong Kong functional time was 55:13. Sled pull, burpees, lunges and wall balls account for the clearest individual gap.</span></li>
                <li><b>Convert strength into late-race durability.</b><span>Run 8 reached 6:57 after 10:55 lunges in Hong Kong. The goal is retaining mechanics after the final two stations.</span></li>
                <li><b>Train the Andy partnership.</b><span>Wuhan's 1:16:35 is the cleanest pair benchmark. Practise station ownership, handovers and a shared 4:55–5:10/km compromised rhythm.</span></li>
              </ol>
            </aside>
          </div>
          <div className="race-section-heading watch-heading">
            <p className="section-kicker">APPLE-TO-APPLE SINGLES READ</p>
            <h3>Taipei Open → Hong Kong Pro</h3>
            <p>The heavier Pro specification explains part of the station increase, but the same stations remain the durable opportunity.</p>
          </div>
          <section className="split-table">
            <div className="table-head"><b>STATION</b><b>TAIPEI OPEN</b><b>HK PRO</b><b>TRAINING READ</b></div>
            {singlesStationTrend.map(([station, taipei, hongKong, read]) => (
              <div className="table-row" key={station}><span>{station}</span><b>{taipei}</b><span>{hongKong}</span><span>{read}</span></div>
            ))}
          </section>
          <div className="race-section-heading watch-heading">
            <p className="section-kicker">8-WEEK WALL-BALL BUILD · STARTS 10 AUG</p>
            <h3>Legal 9 kg repetitions before an unbroken number.</h3>
            <p>Two exposures per week, with a PEGASUS race-week deload. Progress requires full depth, stable heels, target accuracy and no next-morning symptom increase.</p>
          </div>
          <section className="split-table">
            <div className="table-head"><b>WEEK</b><b>DENSITY DOSE</b><b>SKILL / LONG SET</b><b>DECISION RULE</b></div>
            {wallBallBuild.map(([dates, density, second, rule]) => (
              <div className="table-row" key={dates}><span>{dates}</span><b>{density}</b><span>{second}</span><span>{rule}</span></div>
            ))}
          </section>
          <div className="strategy-callout">
            <b>WALL-BALL STRATEGY</b>
            <p>100 unbroken is a capacity ceiling, not an automatic race command. Pro Singles begins with a rehearsed 40-30-30 or 50-25-25 unless a clean fatigued test supports unbroken. With Andy, practise 10-, 15- and 20-rep handovers and call the switch before form fails.</p>
          </div>
          <section className="target-ladder">
            <div><span>INDIVIDUAL EVIDENCE</span><b>1:45:24</b><p>Hong Kong Pro Singles</p></div>
            <div><span>PAIR EVIDENCE</span><b>1:16:35</b><p>Wuhan Open with Andy</p></div>
            <div><span>PRO DOUBLES GATE</span><b>Sub-1:15</b><p>First clean execution target</p></div>
            <div><span>QUALIFIER AIM</span><b>Sub-1:10</b><p>Then pursue the required placing</p></div>
          </section>
          <div className="elite-principles">
            <div><small>HUNTER PRINCIPLE</small><b>Build a larger aerobic engine without surrendering strength.</b></div>
            <div><small>RICH PRINCIPLE</small><b>Threshold first. Then precise station work under controlled fatigue.</b></div>
            <p>These are programming principles. Their elite weekly volume is not your prescription.</p>
          </div>
        </section>
      )}
    </main>
  );
}
