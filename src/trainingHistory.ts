export type Day = {
  id: string;
  iso?: string;
  secondary?: { title: string; items: string[] };
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

export type Week = {
  id: string;
  label: string;
  dates: string;
  phase: string;
  volume: string;
  focus: string;
  gate?: string;
  days: Day[];
};

export const legacyWeeks: Week[] = [
  {
    "id": "S12",
    "label": "W12",
    "dates": "27 Jul – 2 Aug",
    "phase": "RECOVER",
    "volume": "27 km completed",
    "focus": "Post-Delhi recovery week completed with 27 km of easy jogging. This actual load now anchors the rebuild.",
    "gate": "Pain above 2/10 during the first run means stop and swap the next run for easy cycling. No quality running this week.",
    "days": [
      {
        "id": "S12-0",
        "date": "27 JUL",
        "dow": "MON",
        "title": "Sleep + Full Rest",
        "type": "REST",
        "duration": "All day",
        "rpe": "0",
        "note": "Post-travel recovery. Walking only. Hydrate and sleep.",
        "blocks": [
          {
            "label": "RECOVERY",
            "items": [
              "20–30 min gentle walk if useful",
              "Protein across 3–4 meals",
              "No gym work"
            ]
          }
        ]
      },
      {
        "id": "S12-1",
        "date": "28 JUL",
        "dow": "TUE",
        "title": "Mobility + Tissue Check",
        "type": "MOBILITY",
        "duration": "35–40 min",
        "rpe": "2–3",
        "blocks": [
          {
            "label": "RESET",
            "items": [
              "10 min easy bike",
              "Calf and ankle range work",
              "Hip mobility, no spinal flexion"
            ]
          },
          {
            "label": "PERMANENT PREHAB",
            "items": [
              "Eccentric calf raise 3×12",
              "Tibialis raise 3×15",
              "Pallof press 3×10/side"
            ]
          }
        ]
      },
      {
        "id": "S12-2",
        "date": "29 JUL",
        "dow": "WED",
        "title": "Full Rest",
        "type": "REST",
        "duration": "All day",
        "rpe": "0",
        "note": "Log pain, sleep and Body Battery. Do not train out of impatience."
      },
      {
        "id": "S12-3",
        "date": "30 JUL",
        "dow": "THU",
        "title": "First Post-Race Leg Check",
        "type": "RUN",
        "duration": "25 min",
        "rpe": "3–4",
        "blocks": [
          {
            "label": "WARM-UP",
            "items": [
              "5 min brisk walk",
              "Ankle circles + 10 calf raises",
              "5 min very easy jog"
            ]
          },
          {
            "label": "MAIN",
            "items": [
              "15 min ultra-easy, conversational",
              "Flat route or treadmill",
              "Stop if pain rises above 2/10"
            ]
          },
          {
            "label": "COOLDOWN",
            "items": [
              "5 min walk",
              "Record pain during and two hours later"
            ]
          }
        ]
      },
      {
        "id": "S12-4",
        "date": "31 JUL",
        "dow": "FRI",
        "title": "Mobility + Upper Body",
        "type": "STRENGTH",
        "duration": "40 min",
        "rpe": "4",
        "blocks": [
          {
            "label": "MAIN",
            "items": [
              "Panatta chest-supported row 3×10 easy",
              "Machine chest press 3×10 easy",
              "Lat pulldown 3×10",
              "Side plank 3×25 sec/side"
            ]
          }
        ]
      },
      {
        "id": "S12-5",
        "date": "1 AUG",
        "dow": "SAT",
        "title": "Easy Z2 Run",
        "type": "RUN",
        "duration": "30 min",
        "rpe": "4",
        "note": "Only if Thursday was clean during the run and the following morning.",
        "blocks": [
          {
            "label": "MAIN",
            "items": [
              "30 min flat Z2",
              "No strides",
              "Comfortable breathing throughout"
            ]
          }
        ]
      },
      {
        "id": "S12-6",
        "date": "2 AUG",
        "dow": "SUN",
        "title": "Rest + Delhi Debrief",
        "type": "REST",
        "duration": "20 min review",
        "rpe": "0",
        "blocks": [
          {
            "label": "REVIEW",
            "items": [
              "Confirm station split ownership",
              "Record what caused Run 3–7 fade",
              "Agree two partner sessions for August"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "S13",
    "label": "W13",
    "dates": "3–9 Aug",
    "phase": "REBUILD + STRENGTH",
    "volume": "29–31 km",
    "focus": "Build from the completed 27 km recovery week. Running is already a relative strength; this block restores full-body strength and begins targeted Pro-station work without rushing the return from pain.",
    "gate": "Proceed because walking, stairs and easy running are now pain-free. Regress only if pain exceeds 2/10, changes stride, produces swelling or remains elevated the next morning. The physio's exact right-hip drill overrides the generic mobility drill below.",
    "days": [
      {
        "id": "S13-0",
        "date": "3 AUG",
        "dow": "MON",
        "title": "Full-Body Strength A · Rebuild",
        "type": "STRENGTH",
        "duration": "75 min",
        "rpe": "6–7",
        "note": "This is a full session, not four token exercises. Finish every working set with 2–3 good reps still available. Record the load used on each machine.",
        "blocks": [
          {
            "label": "WARM-UP · 10 MIN",
            "items": [
              "Bike 5 min easy at RPE 2–3",
              "90/90 controlled hip switches 2×6/side; pause 3 sec at each end, never force a pinch",
              "Bodyweight hip hinge 2×10 + glute bridge 2×10; 30 sec rest",
              "Two progressive warm-up sets before leg press and Romanian deadlift"
            ]
          },
          {
            "label": "PRIMARY STRENGTH",
            "items": [
              "Panatta leg press 4×8 @ RPE 7; 2 min rest; controlled 3-sec lowering, right knee tracks over second toe",
              "Romanian deadlift 4×8 @ RPE 7; 2 min rest; hips travel back, ribs stacked, stop before the lower back rounds",
              "Panatta chest-supported row 4×8–10 @ RPE 7; 90 sec rest; pause 1 sec with shoulder blades back",
              "Machine chest press 3×8–10 @ RPE 7; 90 sec rest; shoulders stay down, no grinding"
            ]
          },
          {
            "label": "RIGHT HIP + HAMSTRING CAPACITY",
            "items": [
              "Physio-prescribed right-hip rotation drill 3 sets exactly as prescribed; this takes priority over any generic drill",
              "Single-leg Romanian deadlift 3×8/side with light dumbbells; 75 sec rest; pelvis remains square",
              "Long-lever hamstring bridge isometric 3×25–30 sec; 45 sec rest; feel hamstring, not lower back"
            ]
          },
          {
            "label": "PERMANENT PREHAB + TRUNK",
            "items": [
              "Supported eccentric calf lower 3×12/side; 45 sec rest; 3-sec lowering",
              "Tibialis raise 3×15–20; 45 sec rest",
              "Pallof press 3×10/side with 2-sec hold; 45 sec rest"
            ]
          },
          {
            "label": "COOLDOWN · 5 MIN",
            "items": [
              "Easy walk 3 min",
              "Active hamstring floss 2×8/side, no aggressive static stretch",
              "Log right hip, hamstring and knee response immediately and next morning"
            ]
          }
        ]
      },
      {
        "id": "S13-1",
        "date": "4 AUG",
        "dow": "TUE",
        "title": "Easy Z2 + Neuromuscular Strides",
        "type": "RUN",
        "duration": "7–8 km · 48–55 min",
        "rpe": "3–5",
        "blocks": [
          {
            "label": "WARM-UP · 10 MIN",
            "items": [
              "5 min brisk walk into easy jog",
              "Leg swings front/back 10/side + lateral 10/side",
              "Hip airplane supported 2×5/side; small range, pelvis controlled",
              "2×20 sec relaxed pickups with 60 sec walk"
            ]
          },
          {
            "label": "MAIN RUN",
            "items": [
              "6–7 km easy at roughly 6:05–6:35/km or HR ≤142; use whichever keeps breathing conversational",
              "Then 4×15 sec relaxed strides at about 85% speed",
              "Walk 60–75 sec after each stride; smooth acceleration, no sprinting"
            ]
          },
          {
            "label": "COOLDOWN",
            "items": [
              "5 min easy jog/walk",
              "Right-hip physio drill 2 prescribed sets",
              "Record pace, average HR, pain and next-morning stiffness"
            ]
          }
        ]
      },
      {
        "id": "S13-2",
        "date": "5 AUG",
        "dow": "WED",
        "title": "HYROX Pull Strength + Erg Technique",
        "type": "HYROX",
        "duration": "70 min",
        "rpe": "6–7",
        "blocks": [
          {
            "label": "WARM-UP · 10 MIN",
            "items": [
              "SkiErg or row 5 min easy",
              "Band straight-arm pulldown 2×12",
              "Scapular pull 2×8 + light cable row 2×10",
              "One light practice round of every erg cue before work begins"
            ]
          },
          {
            "label": "PULL STRENGTH",
            "items": [
              "Panatta chest-supported row 4×8 @ RPE 7; 90 sec rest",
              "Neutral-grip lat pulldown 4×8–10 @ RPE 7; 90 sec rest",
              "Single-arm cable row 3×10/side; 60 sec between sides; no torso rotation",
              "Heavy rope or sled pull 6×12.5 m at 60–70% race load; 75 sec rest; short hand-over-hand cycles, hips low"
            ]
          },
          {
            "label": "ERG TECHNIQUE",
            "items": [
              "Row 6×250 m @ RPE 6; 60 sec easy rest",
              "Hold stroke rate 24–26 spm; push with legs, then swing, then pull",
              "Target repeatability within 2 sec, not maximum speed"
            ]
          },
          {
            "label": "ACCESSORY + TRUNK",
            "items": [
              "Reverse pec deck 3×12–15; 60 sec rest",
              "Farmer carry 4×30 m heavy but unbroken; 60 sec rest",
              "Side plank 3×30 sec/side; 30 sec rest"
            ]
          },
          {
            "label": "COOLDOWN",
            "items": [
              "5 min easy bike or walk",
              "90/90 controlled switches 1×6/side",
              "No additional pulling volume after the session"
            ]
          }
        ]
      },
      {
        "id": "S13-3",
        "date": "6 AUG",
        "dow": "THU",
        "title": "Controlled Aerobic Intervals",
        "type": "RUN",
        "duration": "8–9 km · 55–60 min",
        "rpe": "6",
        "blocks": [
          {
            "label": "WARM-UP · 15 MIN",
            "items": [
              "12 min easy jog",
              "Ankle rocks 10/side + marching A-drill 2×20 m",
              "3×20 sec progressive pickups; 60 sec easy jog"
            ]
          },
          {
            "label": "MAIN",
            "items": [
              "4×5 min at controlled steady effort, approximately 5:15–5:30/km or RPE 6; use whichever is slower",
              "Jog 2 min very easy between repetitions",
              "Rep 4 should look like rep 1. Do not turn this into a time trial"
            ]
          },
          {
            "label": "COOLDOWN",
            "items": [
              "10 min easy jog",
              "Active hamstring floss 2×8/side",
              "Stop and downgrade the next run if hip, hamstring or knee response persists the next morning"
            ]
          }
        ]
      },
      {
        "id": "S13-4",
        "date": "7 AUG",
        "dow": "FRI",
        "title": "Full-Body Strength B · Posterior Chain",
        "type": "STRENGTH",
        "duration": "75 min",
        "rpe": "6–7",
        "blocks": [
          {
            "label": "WARM-UP · 10 MIN",
            "items": [
              "Bike 5 min easy",
              "Quadruped hip CAR 2×4/side; pelvis stays still",
              "Mini-band lateral walk 2×10 steps each way; feet forward",
              "Two progressive warm-up sets for hip thrust"
            ]
          },
          {
            "label": "PRIMARY STRENGTH",
            "items": [
              "Hip thrust 4×8 @ RPE 7; 2 min rest; 2-sec squeeze at the top",
              "Rear-foot-supported split squat 3×8/side @ RPE 6; 90 sec rest; short range first, right knee tracks cleanly",
              "Seated or lying hamstring curl 4×10 @ RPE 7; 75 sec rest; 2-sec eccentric",
              "Incline machine chest press 4×8 @ RPE 7; 90 sec rest",
              "Neutral-grip pulldown 3×10 @ RPE 7; 75 sec rest"
            ]
          },
          {
            "label": "RIGHT-SIDE CONTROL",
            "items": [
              "Physio-prescribed right-hip drill 3 sets",
              "Low step-down 3×8/side; 60 sec rest; pelvis level and knee over mid-foot",
              "Single-leg balance with cable or band row 2×10/side; slow and controlled"
            ]
          },
          {
            "label": "FINISHER + TRUNK",
            "items": [
              "Farmer carry 4×30 m @ RPE 7; 60 sec rest",
              "Front plank 3×35–45 sec; 45 sec rest",
              "Tibialis raise 3×15 + eccentric calf lower 3×12/side"
            ]
          },
          {
            "label": "COOLDOWN",
            "items": [
              "5 min easy walk",
              "Gentle hamstring stretch 2×20 sec only after training; hinge from hip, neutral spine",
              "Log right-left strength difference"
            ]
          }
        ]
      },
      {
        "id": "S13-5",
        "date": "8 AUG",
        "dow": "SAT",
        "title": "Long Easy Aerobic Run",
        "type": "RUN",
        "duration": "12–13 km · 75–85 min",
        "rpe": "4–5",
        "blocks": [
          {
            "label": "PRE-RUN",
            "items": [
              "5 min brisk walk + 5 min easy jog",
              "Right-hip physio drill 1–2 activation sets only",
              "Take water if conditions are hot or humid"
            ]
          },
          {
            "label": "MAIN",
            "items": [
              "First 3 km deliberately easy around 6:20–6:40/km",
              "Middle 7–8 km settle into Z2, HR cap 142",
              "Final 2 km remain easy; no progression finish this week",
              "Flat or gently rolling route, no sustained hills"
            ]
          },
          {
            "label": "FUEL + FORM",
            "items": [
              "For sessions over 75 min, take 25–35 g carbohydrate around 40–45 min",
              "Check posture every 2 km: tall hips, quiet feet, right knee tracks forward",
              "Stop if gait changes even without sharp pain"
            ]
          },
          {
            "label": "COOLDOWN",
            "items": [
              "5–8 min walk",
              "Rehydrate and eat 25–35 g protein within the next meal",
              "Record next-morning hamstring stiffness"
            ]
          }
        ]
      },
      {
        "id": "S13-6",
        "date": "9 AUG",
        "dow": "SUN",
        "title": "Full Rest + Hip Reset",
        "type": "REST",
        "duration": "15–20 min optional",
        "rpe": "0–2",
        "blocks": [
          {
            "label": "OPTIONAL MOBILITY",
            "items": [
              "Easy walk 10–20 min only if it improves recovery",
              "Physio-prescribed hip drill 2 sets",
              "90/90 switches 1×6/side + active hamstring floss 2×8/side",
              "No strength training and no make-up kilometres"
            ]
          },
          {
            "label": "WEEK REVIEW",
            "items": [
              "Green: no pain, normal gait and normal next-morning stiffness",
              "Amber: pain 1–2/10 or stiffness greater than 24 h; hold next week's volume",
              "Red: pain above 2/10, swelling or altered gait; remove quality running and contact physio"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "S14",
    "label": "W14",
    "dates": "10–16 Aug",
    "phase": "BUILD 1",
    "volume": "32–34 km",
    "focus": "Keep one precise treadmill threshold session while rebuilding outdoor economy safely. The latest outdoor 10K carried a much higher cardiovascular cost than comparable treadmill work, so this week removes hill surges and adds one controlled, cool-hours road exposure.",
    "gate": "Unlock only after Week 13 is completed without altered gait or next-day symptom escalation. Outdoor running is capped by effort: use early morning or evening, slow down or use short walk breaks before HR drifts, and stop for dizziness, confusion, chest pain or unusual breathlessness.",
    "days": [
      {
        "id": "S14-0",
        "date": "10 AUG",
        "dow": "MON",
        "title": "Lower Strength · Squat + Hinge",
        "type": "STRENGTH",
        "duration": "75 min",
        "rpe": "7",
        "blocks": [
          {
            "label": "WARM-UP",
            "items": [
              "Bike 6 min easy",
              "90/90 switches 2×6/side + physio hip drill 2 sets",
              "Goblet squat 2×8 light + RDL 2×8 light"
            ]
          },
          {
            "label": "PRIMARY",
            "items": [
              "Panatta hack squat or leg press 4×6 @ RPE 7–8; 2:30 rest",
              "Romanian deadlift 4×6 @ RPE 7–8; 2 min rest",
              "Rear-foot-supported split squat 3×8/side @ RPE 7; 90 sec rest",
              "Seated hamstring curl 4×8–10 @ RPE 8; 75 sec rest"
            ]
          },
          {
            "label": "CONTROL + PREHAB",
            "items": [
              "Low step-down 3×8/side",
              "Long-lever hamstring bridge 3×30 sec",
              "Eccentric calf 3×12/side + tibialis raise 3×18",
              "Pallof press 3×10/side"
            ]
          },
          {
            "label": "COOLDOWN",
            "items": [
              "Walk 5 min",
              "Active hamstring floss 2×8/side",
              "Record working loads; next week increases require all reps with clean form"
            ]
          }
        ]
      },
      {
        "id": "S14-1",
        "date": "11 AUG",
        "dow": "TUE",
        "title": "Easy Z2 + Outdoor Strides",
        "type": "RUN",
        "duration": "8 km · 50–55 min",
        "rpe": "4–5",
        "blocks": [
          {
            "label": "WARM-UP",
            "items": [
              "10 min easy",
              "Leg swings 10/side + supported hip airplane 2×5/side",
              "2×20 sec progressive pickups"
            ]
          },
          {
            "label": "MAIN",
            "items": [
              "Run 6–7 km easy on the treadmill at 1% incline, using HR ≤142 and conversational breathing rather than chasing pace",
              "If conditions are tolerable, complete the final easy kilometre outdoors before 5×20 sec outdoor strides",
              "Walk/jog 70 sec after each stride; fast and relaxed, never straining"
            ]
          },
          {
            "label": "COOLDOWN",
            "items": [
              "Easy jog/walk to 8 km total",
              "Physio hip drill 2 sets"
            ]
          }
        ]
      },
      {
        "id": "S14-2",
        "date": "12 AUG",
        "dow": "WED",
        "title": "Partner Sled Technique + Upper Strength",
        "type": "HYROX",
        "duration": "75 min",
        "rpe": "6–7",
        "blocks": [
          {
            "label": "WARM-UP",
            "items": [
              "SkiErg 5 min easy",
              "Sled march 2×12.5 m unloaded",
              "Band row 2×12 + push-up to bench 2×8"
            ]
          },
          {
            "label": "SLED SKILL",
            "items": [
              "Sled push 4×12.5 m at 75–85% Pro load; 90 sec rest; long arms, short steps",
              "Sled pull 8×12.5 m at 70–80% Pro load; 90 sec rest; short hand-over-hand cycles, hips low",
              "Film one push and one pull from the side; repeat only if posture and rope recovery remain clean",
              "Partner handover rehearsal 6 times; call the switch before fatigue forces it"
            ]
          },
          {
            "label": "BURPEE ECONOMY",
            "items": [
              "5×4 burpee broad jumps; 45 sec walk-back recovery",
              "Land with feet outside the hands, use one smooth low step into the next rep",
              "Stop each set before breathing or jump length deteriorates"
            ]
          },
          {
            "label": "UPPER STRENGTH",
            "items": [
              "Chest-supported row 4×8; 90 sec rest",
              "Machine chest press 4×8; 90 sec rest",
              "Lat pulldown 3×10; 75 sec rest"
            ]
          },
          {
            "label": "TRUNK",
            "items": [
              "Farmer carry 4×40 m; 75 sec rest",
              "Side plank 3×35 sec/side"
            ]
          },
          {
            "label": "WALL-BALL DENSITY · WEEK 1",
            "items": [
              "Position prep: kettlebell hip shift 2×30 sec/side, bench upper-back stretch 2×5 breaths, dowel overhead squat 2×4 slow reps",
              "Use the official Pro ball: 9 kg",
              "5-minute EMOM: complete 12 wall balls at the start of every minute = 60 total",
              "Finish each set within 25–35 sec; rest for the remainder of the minute",
              "Cues: full depth, ball close under chin, legs drive first, exhale on the throw",
              "Stop after two consecutive depth, target or balance misses; do not make up missed reps"
            ]
          },
          {
            "label": "COOLDOWN",
            "items": [
              "Walk 5 min",
              "Physio hip drill 2 prescribed sets",
              "Log legal reps, no-reps, leg RPE, shoulder RPE and next-morning response"
            ]
          }
        ]
      },
      {
        "id": "S14-3",
        "date": "13 AUG",
        "dow": "THU",
        "title": "Treadmill Threshold 3×8 Minutes",
        "type": "RUN",
        "duration": "9–10 km · 60 min",
        "rpe": "7",
        "blocks": [
          {
            "label": "WARM-UP",
            "items": [
              "15 min easy jog",
              "A-march 2×20 m + 3×20 sec strides",
              "Start first repetition only when breathing is settled"
            ]
          },
          {
            "label": "MAIN",
            "items": [
              "Use the treadmill at 1% incline: 3×8 min at approximately 5:00–5:15/km or RPE 7; use whichever is slower",
              "Jog 2:30 between repetitions",
              "Hold even effort and keep the first two repetitions matched",
              "Final rep may be 5–10 sec/km faster only if form remains quiet and HR response is controlled"
            ]
          },
          {
            "label": "COOLDOWN",
            "items": [
              "12 min easy jog",
              "Active hamstring floss 2×8/side",
              "Record average pace and HR for each repetition"
            ]
          }
        ]
      },
      {
        "id": "S14-4",
        "date": "14 AUG",
        "dow": "FRI",
        "title": "Upper Strength + Hip Control",
        "type": "STRENGTH",
        "duration": "65 min",
        "rpe": "7",
        "blocks": [
          {
            "label": "WARM-UP",
            "items": [
              "Easy bike 5 min",
              "Shoulder circles + band pull-apart 2×12",
              "90/90 switches 2×6/side"
            ]
          },
          {
            "label": "MAIN",
            "items": [
              "Neutral-grip lat pulldown 4×8 @ RPE 8; 90 sec rest",
              "Incline machine press 4×8 @ RPE 7–8; 90 sec rest",
              "Seated cable row 3×10; 75 sec rest",
              "Machine shoulder press 3×8; 75 sec rest",
              "Reverse pec deck 3×15; 60 sec rest",
              "Cable curl + rope pressdown 3×10 each; 60 sec after the pair"
            ]
          },
          {
            "label": "HIP + TRUNK",
            "items": [
              "Physio right-hip drill 3 sets",
              "Single-leg RDL 3×8/side light and controlled",
              "Pallof press 3×12/side + front plank 3×40 sec"
            ]
          },
          {
            "label": "COOLDOWN",
            "items": [
              "Walk 5 min",
              "No lower-body finisher before the weekend runs"
            ]
          }
        ]
      },
      {
        "id": "S14-5",
        "date": "15 AUG",
        "dow": "SAT",
        "title": "Outdoor Aerobic Re-entry",
        "type": "RUN",
        "duration": "11–12 km · 75–85 min",
        "rpe": "4–5",
        "blocks": [
          {
            "label": "WARM-UP",
            "items": [
              "2 km very easy",
              "Hip activation: supported airplane 1×5/side + marching 2×20 m"
            ]
          },
          {
            "label": "MAIN",
            "items": [
              "Run in the coolest practical conditions on a flat, shaded route",
              "Keep the entire run at RPE 4–5; use HR ≤150 as a ceiling rather than a target",
              "Insert 30–60 sec walk breaks when HR keeps rising at unchanged effort",
              "No hill surges this week; outdoor economy is the stimulus"
            ]
          },
          {
            "label": "FUEL + FORM",
            "items": [
              "Take 25–35 g carbohydrate around 40 min",
              "Carry fluid and use normal electrolytes",
              "Use short, quiet steps and relaxed shoulders; pace is expected to be slower outdoors in heat"
            ]
          },
          {
            "label": "COOLDOWN",
            "items": [
              "Walk 5–8 min",
              "Protein plus carbohydrate meal",
              "Log right hamstring response before Sunday's run"
            ]
          }
        ]
      },
      {
        "id": "S14-6",
        "date": "16 AUG",
        "dow": "SUN",
        "title": "Treadmill Recovery + Wall-Ball Skill",
        "type": "RUN",
        "duration": "40–45 min",
        "rpe": "3–4",
        "blocks": [
          {
            "label": "RUN",
            "items": [
              "4 km treadmill recovery at 0–1% incline and fully conversational effort",
              "Do not use pace to compensate for Saturday",
              "If legs are heavy, morning readiness is below 50 or the right hamstring is restricted, replace the run with 30 min easy bike or full rest"
            ]
          },
          {
            "label": "WALL-BALL SKILL · WEEK 1",
            "items": [
              "After breathing settles for 3–5 min: 6-minute EMOM × 8 wall balls at 9 kg = 48 total",
              "Aim to finish each set in 15–20 sec; take the remaining 40–45 sec as complete rest",
              "Every repetition should look identical; this is speed and accuracy practice, not conditioning",
              "If the run was replaced because of symptoms, omit wall balls as well"
            ]
          },
          {
            "label": "MOBILITY",
            "items": [
              "Physio hip drill 2 sets",
              "Kettlebell hip shift 1×30 sec/side",
              "Bench upper-back stretch 1×5 breaths",
              "Eccentric calf 2×12 + tibialis raise 2×15"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "S15",
    "label": "W15",
    "dates": "17–23 Aug",
    "phase": "10K BUILD",
    "volume": "34–36 km",
    "focus": "Absorb the 15 August long run first, then sharpen for PEGASUS. Keep one precise run-quality session, one long aerobic run and two strength exposures without sacrificing muscle.",
    "gate": "Injuries are currently resolved. Monday is upper-body dominant because the latest long run is not yet present in the Garmin aggregate. Reduce Sunday's long run to 11–12 km if fatigue from 15 August lasts more than 48 hours.",
    "days": [
      {
        "id": "S15-0",
        "date": "17 AUG",
        "dow": "MON",
        "title": "Upper Strength + Recovery Reset",
        "type": "STRENGTH",
        "duration": "65 min",
        "rpe": "6–7",
        "blocks": [
          {
            "label": "READINESS + WARM-UP",
            "items": [
              "Check movement with 10 bodyweight squats and 10 walking lunges; normal training requires no altered gait",
              "Bike or walk 6 min easy",
              "Band pull-apart 2×15 + scapular pulldown 2×10",
              "Use two progressive warm-up sets before the first press and row"
            ]
          },
          {
            "label": "UPPER STRENGTH",
            "items": [
              "Incline machine chest press 4×6–8 @ RPE 7–8; 2 min rest",
              "Chest-supported row 4×6–8 @ RPE 7–8; 2 min rest",
              "Neutral-grip lat pulldown 3×8–10 @ RPE 7; 90 sec rest",
              "Machine shoulder press 3×8 @ RPE 7; 90 sec rest"
            ]
          },
          {
            "label": "PHYSIQUE ACCESSORY",
            "items": [
              "Reverse pec deck 3×12–15; 60 sec rest",
              "Cable lateral raise 3×12/side; 45 sec between sides",
              "Cable curl 3×10–12 paired with rope pressdown 3×10–12; 60 sec after each pair"
            ]
          },
          {
            "label": "TRUNK + RECOVERY",
            "items": [
              "Pallof press 3×10/side with 2-sec hold",
              "Side plank 3×35 sec/side",
              "Finish with 8–10 min easy walking; no loaded lower-body work today"
            ]
          }
        ]
      },
      {
        "id": "S15-1",
        "date": "18 AUG",
        "dow": "TUE",
        "title": "5×1 km · 10K Specific",
        "type": "RUN",
        "duration": "10 km total · 60–65 min",
        "rpe": "8",
        "blocks": [
          {
            "label": "WARM-UP",
            "items": [
              "2.5 km easy",
              "A-march 2×20 m + 4×20 sec strides",
              "Easy jog 2 min before rep 1"
            ]
          },
          {
            "label": "MAIN",
            "items": [
              "5×1 km at 4:45–5:00/km or current 10K effort",
              "Jog 2 min between repetitions",
              "Reps 1–3 must match within 5 sec",
              "Rep 5 may be fastest, but never by more than 10 sec"
            ]
          },
          {
            "label": "COOLDOWN",
            "items": [
              "Jog easy until 10 km total",
              "Record pace, HR and RPE for every rep",
              "If form breaks before rep 4, stop at four quality repetitions"
            ]
          }
        ]
      },
      {
        "id": "S15-2",
        "date": "19 AUG",
        "dow": "WED",
        "title": "Pull Strength + Erg Power",
        "type": "HYROX",
        "duration": "70 min",
        "rpe": "7",
        "blocks": [
          {
            "label": "WARM-UP",
            "items": [
              "SkiErg 6 min easy",
              "Band pulldown 2×12 + cable row 2×10"
            ]
          },
          {
            "label": "STRENGTH",
            "items": [
              "Chest-supported row 5×6 @ RPE 8; 2 min rest",
              "Lat pulldown 4×8 @ RPE 8; 90 sec rest",
              "Single-arm cable row 3×10/side; 60 sec between sides",
              "Heavy sled pull 6×12.5 m at 80–90% Pro load; 90 sec rest",
              "No bonus length this week; finish with clean mechanics and reserve"
            ]
          },
          {
            "label": "ERG POWER",
            "items": [
              "SkiErg 6×250 m @ RPE 7–8; 75 sec rest",
              "Keep each split within 2 sec",
              "Long pull, strong finish, relaxed recovery"
            ]
          },
          {
            "label": "WALL-BALL SKILL · WEEK 2",
            "items": [
              "Let breathing settle 3 min, then use a 9 kg ball",
              "7-minute EMOM: 8 wall balls at the start of every minute = 56 total",
              "Complete the 8 reps in 15–20 sec and rest fully for the balance of the minute",
              "Film minute 1 or 7 from the side: check full depth, stable heels and no right-hip shift",
              "Stop if accuracy or squat position deteriorates"
            ]
          },
          {
            "label": "ACCESSORY",
            "items": [
              "Reverse pec deck 3×15",
              "Cable curl 3×10 + rope pressdown 3×10",
              "Front plank 3×45 sec"
            ]
          },
          {
            "label": "COOLDOWN",
            "items": [
              "Easy walk 5 min",
              "Physio right-hip drill 2 sets"
            ]
          }
        ]
      },
      {
        "id": "S15-3",
        "date": "20 AUG",
        "dow": "THU",
        "title": "Easy Aerobic Run",
        "type": "RUN",
        "duration": "7 km · 42–50 min",
        "rpe": "4",
        "blocks": [
          {
            "label": "MAIN",
            "items": [
              "7 km flat Z2 at 6:00–6:30/km or HR ≤142",
              "No strides and no fast finish",
              "Use this run to absorb Tuesday, not prove fitness"
            ]
          },
          {
            "label": "POST-RUN",
            "items": [
              "Walk 5 min",
              "Active hamstring floss 2×8/side",
              "Physio hip drill 2 sets"
            ]
          }
        ]
      },
      {
        "id": "S15-4",
        "date": "21 AUG",
        "dow": "FRI",
        "title": "Wall Balls + Sandbag Lunges",
        "type": "HYROX",
        "duration": "70 min",
        "rpe": "6–7",
        "blocks": [
          {
            "label": "WARM-UP",
            "items": [
              "Bike or jog 8 min easy",
              "Kettlebell hip shift 2×30 sec/side + bench upper-back stretch 2×5 breaths",
              "Dowel overhead squat 2×4 slow reps with a 2-sec bottom pause",
              "2×8 light wall balls; 45 sec rest"
            ]
          },
          {
            "label": "WALL-BALL DENSITY · WEEK 2",
            "items": [
              "Use the official Pro ball: 9 kg",
              "5-minute EMOM: complete 14 wall balls at the start of every minute = 70 total",
              "Finish each set within 25–35 sec; rest for the remainder of the minute",
              "Cues: heels stable, knees over middle toes, ball close, legs drive, soft catch",
              "Stop after two consecutive no-reps or if the right hip shifts; do not chase the total"
            ]
          },
          {
            "label": "LUNGE CAPACITY",
            "items": [
              "4×25 m sandbag lunges at controlled race load; 90 sec rest",
              "Alternate lead leg naturally",
              "Front knee tracks over mid-foot; torso tall",
              "Stop the set if right hip rotates or stride shortens"
            ]
          },
          {
            "label": "TRANSITION PRACTICE · 3 ROUNDS",
            "items": [
              "400 m easy-moderate run",
              "20 m farmer carry",
              "Walk 60 sec, then rest until 2 min has elapsed",
              "Keep total effort at RPE 7; no extra wall balls"
            ]
          },
          {
            "label": "COOLDOWN",
            "items": [
              "Walk 5–8 min",
              "Physio hip drill 2 sets",
              "Log legal reps, no-reps, leg RPE, shoulder RPE and next-morning response"
            ]
          }
        ]
      },
      {
        "id": "S15-5",
        "date": "22 AUG",
        "dow": "SAT",
        "title": "Recovery Run or AVOHK Replacement",
        "type": "RUN",
        "duration": "5 km easy · 32–38 min",
        "rpe": "3–4",
        "note": "If racing AVOHK 5K, Tuesday's 5×1 km must be replaced by 6 km easy. Do not keep both quality sessions.",
        "blocks": [
          {
            "label": "RECOVERY OPTION",
            "items": [
              "5 km very easy at 6:20–6:50/km",
              "Flat route, relaxed cadence",
              "Finish feeling better than you started"
            ]
          },
          {
            "label": "RACE OPTION",
            "items": [
              "Warm up 2 km + drills + 4 strides",
              "Run 5K progressively: controlled first 2 km, commit through km 3–4, race final km",
              "Cool down 1–2 km",
              "Only use this option if Tuesday was changed to easy running"
            ]
          }
        ]
      },
      {
        "id": "S15-6",
        "date": "23 AUG",
        "dow": "SUN",
        "title": "Long Aerobic Run",
        "type": "RUN",
        "duration": "14 km · 85–95 min",
        "rpe": "4–5",
        "blocks": [
          {
            "label": "PRE-RUN",
            "items": [
              "5 min walk + 8 min easy jog",
              "Right-hip activation 1–2 sets",
              "Carry water and 35–45 g carbohydrate"
            ]
          },
          {
            "label": "MAIN",
            "items": [
              "First 4 km easy around 6:20–6:40/km",
              "Middle 7 km stable Z2, HR ≤142",
              "Final 3 km steady only if legs remain symmetrical; maximum RPE 5",
              "No hard hill surges"
            ]
          },
          {
            "label": "FUEL",
            "items": [
              "Take 25–30 g carbohydrate around 35–40 min",
              "Optional second 20–25 g around 70 min",
              "Drink to thirst, more in Hong Kong heat"
            ]
          },
          {
            "label": "COOLDOWN",
            "items": [
              "Walk 8 min",
              "Protein-rich meal plus carbohydrate",
              "Record fatigue and morning Body Battery before race week"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "S16",
    "label": "W16",
    "dates": "24–30 Aug",
    "phase": "RACE WEEK",
    "volume": "25–27 km including race",
    "focus": "Reduce fatigue while retaining speed and strength. PEGASUS is the benchmark that resets the autumn pace model.",
    "gate": "Do not add kilometres during the taper. If hip, hamstring or knee symptoms return, remove the primer before removing easy running.",
    "days": [
      {
        "id": "S16-0",
        "date": "24 AUG",
        "dow": "MON",
        "title": "Strength Primer · Full Body",
        "type": "STRENGTH",
        "duration": "50 min",
        "rpe": "5–6",
        "blocks": [
          {
            "label": "WARM-UP",
            "items": [
              "Bike 5 min",
              "90/90 switches 1×6/side + physio hip drill 2 sets",
              "One light ramp set per main exercise"
            ]
          },
          {
            "label": "MAIN",
            "items": [
              "Leg press 3×5 @ RPE 6; 2 min rest",
              "Romanian deadlift 3×6 @ RPE 6; 2 min rest",
              "Chest-supported row 3×8 @ RPE 6; 75 sec rest",
              "Machine chest press 3×8 @ RPE 6; 75 sec rest",
              "Hamstring curl 2×8 @ RPE 6; 60 sec rest"
            ]
          },
          {
            "label": "PREHAB",
            "items": [
              "Eccentric calf 2×10/side + tibialis 2×15",
              "Pallof press 2×10/side",
              "Finish every set fresh; no finisher"
            ]
          }
        ]
      },
      {
        "id": "S16-1",
        "date": "25 AUG",
        "dow": "TUE",
        "title": "4×600 m Race Primer",
        "type": "RUN",
        "duration": "7 km total · 42–48 min",
        "rpe": "7",
        "blocks": [
          {
            "label": "WARM-UP",
            "items": [
              "2 km easy",
              "Dynamic drills + 4×15 sec strides",
              "Jog 2 min"
            ]
          },
          {
            "label": "MAIN",
            "items": [
              "4×600 m at approximately 4:40–4:55/km or 10K effort",
              "Jog 2 min between repetitions",
              "Finish controlled with fast, relaxed mechanics"
            ]
          },
          {
            "label": "COOLDOWN",
            "items": [
              "Jog easy to 7 km total",
              "No extra repetitions even if feeling strong"
            ]
          }
        ]
      },
      {
        "id": "S16-2",
        "date": "26 AUG",
        "dow": "WED",
        "title": "Easy Run + Mobility",
        "type": "RUN",
        "duration": "5 km · 30–35 min",
        "rpe": "3–4",
        "blocks": [
          {
            "label": "MAIN",
            "items": [
              "5 km easy at 6:15–6:45/km",
              "Flat route, conversational breathing",
              "No strides"
            ]
          },
          {
            "label": "MOBILITY",
            "items": [
              "Physio hip drill 2 sets",
              "Active hamstring floss 2×8/side",
              "90/90 switches 1×6/side"
            ]
          }
        ]
      },
      {
        "id": "S16-3",
        "date": "27 AUG",
        "dow": "THU",
        "title": "Full Rest",
        "type": "REST",
        "duration": "All day",
        "rpe": "0",
        "blocks": [
          {
            "label": "RECOVERY",
            "items": [
              "Normal walking only",
              "Prioritise sleep and hydration",
              "No make-up strength or cardio",
              "Check shoes, race kit and transport"
            ]
          }
        ]
      },
      {
        "id": "S16-4",
        "date": "28 AUG",
        "dow": "FRI",
        "title": "Shakeout + Strides",
        "type": "RUN",
        "duration": "4 km · 25–30 min",
        "rpe": "3–5",
        "blocks": [
          {
            "label": "MAIN",
            "items": [
              "3 km very easy",
              "4×15 sec relaxed strides; 60–75 sec walk recovery",
              "Jog/walk to 4 km total"
            ]
          },
          {
            "label": "POST",
            "items": [
              "Physio hip drill 1–2 activation sets",
              "Stop while feeling fresh"
            ]
          }
        ]
      },
      {
        "id": "S16-5",
        "date": "29 AUG",
        "dow": "SAT",
        "title": "Rest + Race Preparation",
        "type": "REST",
        "duration": "All day",
        "rpe": "0",
        "blocks": [
          {
            "label": "PREP",
            "items": [
              "Normal carbohydrate-rich meals; do not overeat",
              "Hydrate steadily and include normal electrolytes",
              "Lay out shoes, bib, watch and clothing",
              "Target full night's sleep; no gym session"
            ]
          }
        ]
      },
      {
        "id": "S16-6",
        "date": "30 AUG",
        "dow": "SUN",
        "title": "PEGASUS Tsuen Wan 10K",
        "type": "RACE",
        "duration": "10 km + warm-up",
        "rpe": "8–9",
        "race": true,
        "blocks": [
          {
            "label": "WARM-UP · 20–25 MIN",
            "items": [
              "10–12 min easy jog",
              "Dynamic drills: leg swings, marching and ankle hops",
              "4×20 sec strides with 60 sec easy",
              "Finish warm-up 5–8 min before start"
            ]
          },
          {
            "label": "RACE EXECUTION",
            "items": [
              "Km 1–2: RPE 7, deliberately controlled",
              "Km 3–6: settle at sustainable 10K effort; run hills by effort, not pace",
              "Km 7–8: hold form and cadence before increasing effort",
              "Km 9–10: progress to RPE 9 if hip, hamstring and knee remain normal"
            ]
          },
          {
            "label": "COURSE RULES",
            "items": [
              "Shorten stride uphill and keep cadence",
              "Do not attack early downhill sections",
              "Take water only as needed; no new nutrition strategy"
            ]
          },
          {
            "label": "POST-RACE",
            "items": [
              "Walk 10 min",
              "Record finish time, splits, HR, RPE and symptoms",
              "The result recalibrates September threshold pace and JPMCC target"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "S17",
    "label": "W17",
    "dates": "31 Aug – 6 Sep",
    "phase": "ABSORB + SHIN-CHECK REBUILD",
    "volume": "30–34 km running · aerobic work preserved",
    "focus": "Absorb PEGASUS without losing momentum: keep the aerobic engine active, preserve muscle with two substantial strength exposures, and use a structured right-shin check before faster running returns.",
    "gate": "This is not a blanket downgrade. Continue the listed run volume when walking, stairs and the warm-up remain at 0–1/10 with normal gait. Pain reaching 2/10, rising during the run, focal bony tenderness, hopping pain or any stride change converts the remaining impact work to equal-duration bike or elliptical and triggers physio review.",
    "days": [
      {
        "id": "S17-0",
        "date": "31 AUG",
        "dow": "MON",
        "title": "Post-Race Full Rest",
        "type": "REST",
        "duration": "All day",
        "rpe": "0",
        "blocks": [
          {
            "label": "RECOVERY + DATA CAPTURE",
            "items": [
              "20–30 min gentle walking only if it improves stiffness",
              "Hydrate normally, include sodium with meals, and distribute 25–35 g protein across 3–4 meals",
              "No gym, wall balls or make-up kilometres",
              "PEGASUS recorded: 1:03:25 over 10.17 km, about 6:14/km; Garmin heart-rate data reviewed privately and Amar's symptom note retained for km 3–6",
              "Check walking, stairs, ten calf raises and five small two-leg hops once; do not repeatedly press or provoke a painful spot"
            ]
          }
        ]
      },
      {
        "id": "S17-1",
        "date": "1 SEP",
        "dow": "TUE",
        "title": "Flat Recovery Run + Shin Response",
        "type": "RUN",
        "duration": "6–7 km · 40–48 min",
        "rpe": "3–4",
        "blocks": [
          {
            "label": "WARM-UP · 10–12 MIN",
            "items": [
              "5 min brisk walk, ankle rocks 2×10/side and tibialis raises 2×12",
              "Jog 5–7 min very easily on a flat treadmill at 0–0.5% or a flat outdoor loop",
              "Proceed only with symmetrical stride and shin discomfort no higher than 1/10"
            ]
          },
          {
            "label": "MAIN RUN",
            "items": [
              "Run fully conversational at RPE 3–4; HR cap 142 and no pace target",
              "Use a predictable flat surface; no hills, surges, strides or progression finish",
              "At 10, 20 and 30 min, reassess pain and gait rather than waiting for symptoms to worsen",
              "If pain reaches 2/10 or changes stride, stop running and complete the planned time on bike or elliptical at Z2"
            ]
          },
          {
            "label": "COOLDOWN + LOG",
            "items": [
              "Walk 5 min, then complete the physio-prescribed hamstring work exactly as given",
              "Log shin pain during, two hours after and the next morning; note whether hopping or stairs changed"
            ]
          }
        ]
      },
      {
        "id": "S17-2",
        "date": "2 SEP",
        "dow": "WED",
        "title": "Long-Window Aerobic + Physio",
        "type": "RUN",
        "duration": "8–9 km · 55–65 min",
        "rpe": "3–4",
        "note": "Wednesday uses the longer WFH window for controlled aerobic volume. No separate strength session today.",
        "blocks": [
          {
            "label": "WARM-UP + SHIN GATE",
            "items": [
              "Bike 5 min easy, ankle rocks 2×10/side, bent-knee calf raise 2×12 and tibialis raise 2×15",
              "Jog 8 min easy at 0–0.5% incline; normal gait and pain 0–1/10 are required to continue"
            ]
          },
          {
            "label": "AEROBIC MAIN",
            "items": [
              "Run 45–52 min in Z2, HR ≤142 and RPE 3–4; treadmill is preferred while the shin response is being established",
              "Keep cadence natural and foot strike quiet; do not artificially shorten the stride",
              "If the shin fails the gate, preserve the full aerobic duration on bike or elliptical instead of forcing impact kilometres"
            ]
          },
          {
            "label": "PHYSIO + TRUNK",
            "items": [
              "Complete the physio-prescribed right-hamstring sequence exactly as prescribed",
              "Pallof press 3×10/side with 2-sec hold + side plank 3×30 sec/side",
              "No loaded lower-body strength or wall balls today"
            ]
          }
        ]
      },
      {
        "id": "S17-3",
        "date": "3 SEP",
        "dow": "THU",
        "title": "AM Easy Run + PM Full-Body Strength",
        "type": "STRENGTH",
        "duration": "AM 40–48 min · PM 65–70 min",
        "rpe": "6–7",
        "note": "Split day 1 of 2. The morning run remains easy; the evening gym session preserves muscle and force without grinding.",
        "blocks": [
          {
            "label": "AM RUN · 6–7 KM",
            "items": [
              "Warm up with 5 min walk/jog, ankle rocks and 2×12 tibialis raises",
              "Run 6–7 km flat and conversational at RPE 3–4; no steady minutes this week",
              "The shin gate remains 0–1/10 stable with normal gait; 2/10, worsening pain or altered gait ends impact work"
            ]
          },
          {
            "label": "PM PRIMARY STRENGTH",
            "items": [
              "Bike 6 min easy + two progressive warm-up sets for leg press and Romanian deadlift",
              "Leg press 3×6 @ RPE 6–7; 2 min rest; controlled 3-sec lowering",
              "Romanian deadlift 3×6 @ RPE 6–7; 2 min rest; stop the set if the hamstring becomes painful",
              "Machine chest press 4×8 + chest-supported row 4×8; 90 sec rest",
              "Hamstring curl 3×10 + neutral-grip pulldown 3×10; 75 sec rest"
            ]
          },
          {
            "label": "PHYSIQUE + PREHAB",
            "items": [
              "Lateral raise, cable curl and rope pressdown 3×12 each; 60 sec rest",
              "Bent-knee calf isometric 3×30 sec/side + tibialis raise 3×15 only if symptom-free",
              "Pallof press 3×10/side; finish with 5 min easy walk and log next-morning response"
            ]
          }
        ]
      },
      {
        "id": "S17-4",
        "date": "4 SEP",
        "dow": "FRI",
        "title": "HYROX Skill + Upper Strength + Compromised Aerobic",
        "type": "HYROX",
        "duration": "85–95 min",
        "rpe": "6",
        "note": "Friday uses the longer WFH window as one combined gym session. This is technique under controlled fatigue, not a race simulation.",
        "blocks": [
          {
            "label": "WARM-UP · 12 MIN",
            "items": [
              "Bike or SkiErg 5 min easy, ankle rocks 2×10/side and tibialis raise 2×15",
              "Band row 2×12 + bodyweight squat to target 2×8",
              "Two unloaded sled lengths; keep the shin quiet before adding load"
            ]
          },
          {
            "label": "SLED + WALL-BALL SKILL",
            "items": [
              "Sled push 4×12.5 m and sled pull 4×12.5 m at 70–75% Pro load; 90 sec rest; film one clean length of each",
              "Wall-ball 5-minute EMOM: 16 legal reps each minute at 9 kg = 80 total",
              "Finish each wall-ball set within 30–35 sec; full depth, stable heels, ball close and legs drive first",
              "Stop after two consecutive depth, target or balance misses; do not make up failed reps"
            ]
          },
          {
            "label": "UPPER STRENGTH + CARRY",
            "items": [
              "Lat pulldown 4×8 + incline machine press 4×8; 90 sec rest",
              "Reverse pec deck 3×15 + farmer carry 4×30 m; 60–75 sec rest",
              "Keep 2 reps in reserve; preserve quality for the aerobic finish"
            ]
          },
          {
            "label": "COMPROMISED AEROBIC",
            "items": [
              "If the shin has passed Tuesday through Thursday: run 3×1 km easy-to-steady at RPE 4–5 with 90 sec walk/jog",
              "Use treadmill at 0.5–1%; form must remain symmetrical and relaxed",
              "If impact is not green, perform 3×5 min SkiErg or row at the same RPE with 90 sec easy instead"
            ]
          },
          {
            "label": "COOLDOWN",
            "items": [
              "Walk 5 min, complete the prescribed hamstring work and log shin response two hours later",
              "No extra evening run, leg finisher or high-repetition crunches"
            ]
          }
        ]
      },
      {
        "id": "S17-5",
        "date": "5 SEP",
        "dow": "SAT",
        "title": "Outdoor Long Easy Run",
        "type": "RUN",
        "duration": "9–11 km · 60–75 min",
        "rpe": "4",
        "blocks": [
          {
            "label": "PRE-RUN + GATE",
            "items": [
              "Choose a flat outdoor route in cool hours; carry water and electrolytes",
              "Walk 5 min, jog 8 min easy, then reassess the shin before committing to the full route"
            ]
          },
          {
            "label": "MAIN RUN",
            "items": [
              "Keep the run conversational at HR ≤142; heat may make pace 20–45 sec/km slower",
              "Avoid cambered roads, hard downhill running and pace chasing",
              "Take 25–30 g carbohydrate at 40–45 min if running beyond 65 min",
              "No progression finish; stop impact if pain rises or gait changes"
            ]
          },
          {
            "label": "COOLDOWN",
            "items": [
              "Walk 5–8 min, rehydrate and eat 25–35 g protein with the next meal",
              "Record pain immediately, two hours later and on Sunday morning"
            ]
          }
        ]
      },
      {
        "id": "S17-6",
        "date": "6 SEP",
        "dow": "SUN",
        "title": "Full Rest + Physio Review",
        "type": "REST",
        "duration": "20–30 min optional",
        "rpe": "0–2",
        "blocks": [
          {
            "label": "RECOVERY",
            "items": [
              "No running and no make-up kilometres; easy walking only if it improves recovery",
              "Actual deviation logged: 7.01 km of outdoor running replaced the planned rest day; carry that load forward rather than treating it as missing recovery mileage",
              "Complete the prescribed hamstring exercises and gentle ankle mobility",
              "Green means 0–1/10 stable, normal gait and normal next morning; only green unlocks Week 18 quality",
              "Focal tenderness, hopping pain, night pain, swelling or recurring symptoms require sports-physio or medical assessment before quality running"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "S18",
    "label": "W18",
    "dates": "7–13 Sep",
    "phase": "HYBRID BUILD · RUN + MUSCLE",
    "volume": "42–45 km · 3 strength/HYROX exposures",
    "focus": "Thursday's threshold run and upper-strength work are complete. Friday's Pro-specific HYROX session remains the next protected priority; use Saturday's 5–6 km recovery run as the flexible mileage lever.",
    "gate": "Proceed aggressively through the planned Wednesday–Friday block while mechanics stay normal. Mild general heaviness is not an automatic downgrade. Escalating focal pain, altered gait, hopping pain or loss of warm-up coordination is the stop signal; when that appears, preserve the engine with non-impact aerobic work and obtain physio input.",
    "days": [
      {
        "id": "S18-0",
        "date": "7 SEP",
        "dow": "MON",
        "title": "Completed Run + Strength · No PM Repeat",
        "type": "STRENGTH",
        "duration": "6.33 km run · 53 min strength · completed",
        "rpe": "7–8",
        "note": "Completed before review. This replaces the full Monday prescription: do not repeat the planned PM session or add make-up work today.",
        "blocks": [
          {
            "label": "AM RUN · 5 KM",
            "items": [
              "5 min walk/jog, ankle rocks 2×10/side and tibialis raises 2×15",
              "Run 5 km conversational at RPE 3–4 and HR ≤142 on flat terrain",
              "No strides; finish by 5:50 a.m. to be home before 6:00 a.m."
            ]
          },
          {
            "label": "PM PRIMARY LOWER STRENGTH",
            "items": [
              "Bike 5 min, 90/90 hip switches 2×6/side and two progressive warm-up sets",
              "Front squat or Panatta hack squat 4×5 @ RPE 7–8; 2:30 rest; no grinding",
              "Romanian deadlift 4×6 @ RPE 7; 2 min rest; stop if the hamstring becomes painful",
              "Rear-foot-supported split squat 3×8/side @ RPE 7; 90 sec rest",
              "Seated hamstring curl 3×10 @ RPE 7–8; 75 sec rest"
            ]
          },
          {
            "label": "LOWER-LEG + ABS",
            "items": [
              "Bent-knee calf isometric 3×35 sec/side + tibialis raise 3×15–20",
              "Ab-wheel from knees 3×6–8 or stability-ball rollout 3×10; stop before abdominal cramp",
              "Pallof press 3×10/side with 2-sec hold; walk 5 min and log next-morning response"
            ]
          }
        ]
      },
      {
        "id": "S18-1",
        "date": "8 SEP",
        "dow": "TUE",
        "title": "Completed Recovery Run · No More Training",
        "type": "RUN",
        "duration": "8.01 km · 46:32 · completed",
        "rpe": "5–6",
        "note": "Recovery had improved before the run, but the planned 5–6 km ceiling became 8.01 km. Close the day here: no strides, lifting, conditioning or make-up work.",
        "blocks": [
          {
            "label": "WARM-UP + MAIN",
            "items": [
              "Completed 8.01 km outdoors in 46:32 (about 5:49/km), average HR 155 and maximum HR 173",
              "This exceeded the recovery-day distance and effort caps; count it as meaningful aerobic load, not easy filler",
              "No strides, progression finish or second workout today",
              "Prioritise carbohydrate, 25–35 g protein, fluids and the prescribed lower-leg/hamstring work"
            ]
          },
          {
            "label": "COOLDOWN + DECISION",
            "items": [
              "Log shin and hamstring response two hours after the run and again Wednesday morning",
              "Any symptom increase, focal tenderness, hopping pain or altered gait removes Thursday's fast running and triggers physio review"
            ]
          }
        ]
      },
      {
        "id": "S18-2",
        "date": "9 SEP",
        "dow": "WED",
        "title": "Completed Aerobic Durability + Physio",
        "type": "RUN",
        "duration": "11.01 km · 1:01:49 · completed",
        "rpe": "3–4",
        "note": "The protected aerobic durability session is complete: 11.01 km on the treadmill in 1:01:49 at about 5:37/km, average HR 137. The extra kilometre is modest and does not justify removing Thursday's threshold; proceed through the existing warm-up gate.",
        "blocks": [
          {
            "label": "WARM-UP · 12 MIN",
            "items": [
              "Bike 4 min easy, then 8 min progressive treadmill jog at 0.5% incline",
              "Ankle rocks 2×10/side, tibialis raise 2×15 and supported hip airplane 2×5/side",
              "Continue when gait and coordination are normal; general heaviness alone does not cancel the session"
            ]
          },
          {
            "label": "AEROBIC MAIN · COMPLETE",
            "items": [
              "Completed 11.01 km on the treadmill in 1:01:49 (about 5:37/km), average HR 137 and maximum HR 163",
              "The average cardiovascular load remained controlled; count this as successful durability work",
              "No additional run or conditioning today",
              "Keep Thursday's speed stimulus protected unless pain or gait becomes an objective red flag"
            ]
          },
          {
            "label": "COOLDOWN + PHYSIO",
            "items": [
              "Walk 5 min after the completed run and recheck shin and gait later today",
              "Complete the prescribed hamstring sequence plus side plank 3×30 sec/side",
              "Eat 25–35 g protein with carbohydrate and restore fluids before Thursday's split day"
            ]
          }
        ]
      },
      {
        "id": "S18-3",
        "date": "10 SEP",
        "dow": "THU",
        "title": "Completed Threshold + Upper Strength",
        "type": "RUN",
        "duration": "10.02 km · 58:16 + 40:21 strength · completed",
        "rpe": "7",
        "note": "The planned 3×8-minute threshold session and the upper-strength exposure are complete. The run reached 10.02 km overall; close the day after normal recovery work and keep Friday's Pro HYROX session protected.",
        "blocks": [
          {
            "label": "AM THRESHOLD · COMPLETE",
            "items": [
              "Garmin recorded the structured New Territories Threshold · 3×8 min session: 10.02 km in 58:16 overall (about 5:49/km including warm-up, recoveries and cool-down)",
              "Average HR 161 and maximum HR 186; do not use the overall pace as the threshold-repetition pace",
              "Count the key quality stimulus as completed and do not add make-up intervals today"
            ]
          },
          {
            "label": "UPPER STRENGTH · COMPLETE",
            "items": [
              "Completed 40:21 of strength work, average HR 124 and maximum HR 155",
              "Garmin does not establish exercise-by-exercise loads here; retain Strong as the progression log for sets, reps and weights",
              "The short easy cycle is incidental movement, not another training session"
            ]
          },
          {
            "label": "RECOVERY + FRIDAY GATE",
            "items": [
              "No more running or conditioning today; restore carbohydrate, 25–35 g protein, fluids and sleep",
              "Proceed with Friday's Pro HYROX session when gait is normal and shin/hamstring symptoms remain 0–1/10",
              "Escalating focal pain, hopping pain or altered gait replaces Friday's run portions with SkiErg while preserving pain-free station technique"
            ]
          }
        ]
      },
      {
        "id": "S18-4",
        "date": "11 SEP",
        "dow": "FRI",
        "title": "HYROX Pro Skill + Compromised Running",
        "type": "HYROX",
        "duration": "90–100 min",
        "rpe": "7",
        "note": "Completed exactly 3×1 km as prescribed—there was no fourth running interval. The attached Strong summary is authoritative for exercise counts and loads; Garmin is used only for compatible device metrics.",
        "blocks": [
          {
            "label": "COMPLETED · VERIFIED FROM WORKOUT LOG",
            "items": [
              "94 min total · 31,050 kg logged volume · 5 PRs",
              "Running: exactly 3×1 km treadmill; best kilometre 5:15. Do not count warm-up, cooldown or incidental movement as a fourth interval",
              "SkiErg 5:00; sled push 6 sets, best 235 kg × 12; sled pull 6 sets, best 170 kg × 12",
              "Burpees 3×12; wall balls 3×20 plus 2×30 at 9 kg"
            ]
          },
          {
            "label": "WARM-UP · 12 MIN",
            "items": [
              "SkiErg 5 min easy, band row 2×12, squat-to-target 2×8 and two unloaded sled lengths",
              "Complete the shin gate before treadmill running or loaded carries"
            ]
          },
          {
            "label": "PRO SLED STRENGTH",
            "items": [
              "Sled push 5×12.5 m at 80–90% Pro load; 90 sec rest; long arms and short powerful steps",
              "Sled pull 6×12.5 m at 80–90% Pro load; 90 sec rest; hips low and short hand-over-hand cycles",
              "Stop adding load when posture, traction or rope recovery deteriorates"
            ]
          },
          {
            "label": "COMPROMISED SET · 3 ROUNDS",
            "items": [
              "1 km treadmill run at projected Pro Doubles effort, RPE 6–7, then 12 burpee broad jumps and 20 wall balls at 9 kg",
              "Rest 2 min between rounds; run pace stays repeatable and wall balls stay legal",
              "If the shin is not fully green, replace each 1 km with 4 min SkiErg while keeping the station work"
            ]
          },
          {
            "label": "WALL-BALL QUALITY",
            "items": [
              "After 4 min rest, complete 30 legal reps; rest 20 sec; then 20 legal reps",
              "Full depth, target accuracy and balanced drive matter more than claiming an unbroken number",
              "Log legal reps, no-reps, shoulder RPE, leg RPE and partner handover observations"
            ]
          },
          {
            "label": "COOLDOWN",
            "items": [
              "Walk or bike 6 min easy and complete the prescribed hamstring sequence",
              "No additional strength finisher or evening run"
            ]
          }
        ]
      },
      {
        "id": "S18-5",
        "date": "12 SEP",
        "dow": "SAT",
        "title": "Recovery run · verified 5.83 km",
        "type": "RUN",
        "duration": "34:51",
        "rpe": "3",
        "blocks": [
          {
            "label": "MAIN",
            "items": [
              "Run 5 km outdoors in cool hours on a flat route, fully conversational at HR ≤142",
              "Add the sixth kilometre only if the legs improve during the run",
              "This is the flexible mileage lever after Tuesday's extra volume; Wednesday–Friday remain protected",
              "No strides or progression after Friday's compromised work"
            ]
          },
          {
            "label": "RECOVERY",
            "items": [
              "Walk 5 min and eat 25–35 g protein with carbohydrate at the next meal",
              "Record shin response and overall leg heaviness for Sunday's review"
            ]
          }
        ],
        "note": "Garmin verified 12 September: 5.83 km in 34:51. Easy cycling also recorded separately. Device measurements do not change the prescribed interval counts."
      },
      {
        "id": "S18-6",
        "date": "13 SEP",
        "dow": "SUN",
        "title": "Full Rest + Weekly Review",
        "type": "REST",
        "duration": "20 min optional",
        "rpe": "0–2",
        "blocks": [
          {
            "label": "RECOVERY",
            "items": [
              "No training; easy walking and prescribed physio only if they improve recovery",
              "Review sleep, appetite, easy-run HR, shin response and right-hamstring response",
              "Progress Week 19 only when gait is normal and no symptom escalated across two consecutive days"
            ]
          }
        ]
      }
    ]
  }
];
