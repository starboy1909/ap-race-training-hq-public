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

const weeks: Week[] = [
  {
    id: "S12",
    label: "W12",
    dates: "27 Jul – 2 Aug",
    phase: "RECOVER",
    volume: "10–15 km optional",
    focus: "Post-Delhi reset. Recovery is the training objective.",
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
    phase: "REBUILD",
    volume: "28–32 km",
    focus: "Rebuild frequency. Strength returns at 70%. No hard compromised work.",
    days: [
      { id: "S13-0", date: "3 AUG", dow: "MON", title: "Lower Strength Re-entry", type: "STRENGTH", duration: "60 min", rpe: "6", blocks: [{ label: "MAIN", items: ["Leg press 3×8 at ~70%", "Split squat 3×8/side", "Romanian deadlift 3×8", "Eccentric calves + tibialis"] }] },
      { id: "S13-1", date: "4 AUG", dow: "TUE", title: "Easy Z2 + Strides", type: "RUN", duration: "40 min", rpe: "4", blocks: [{ label: "MAIN", items: ["35 min Z2", "4×15 sec relaxed strides", "Full walk-back recovery"] }] },
      { id: "S13-2", date: "5 AUG", dow: "WED", title: "Pull + Row Technique", type: "STRENGTH", duration: "60 min", rpe: "6–7", blocks: [{ label: "MAIN", items: ["Chest-supported row", "Lat pulldown", "Seated cable row", "Row 5×500m smooth, 90 sec rest"] }] },
      { id: "S13-3", date: "6 AUG", dow: "THU", title: "Easy Run", type: "RUN", duration: "35 min", rpe: "4" },
      { id: "S13-4", date: "7 AUG", dow: "FRI", title: "Push + Trunk", type: "STRENGTH", duration: "55 min", rpe: "6–7", blocks: [{ label: "MAIN", items: ["Machine chest press", "Shoulder press", "Cable triceps", "Pallof press + planks"] }] },
      { id: "S13-5", date: "8 AUG", dow: "SAT", title: "Long Easy Run", type: "RUN", duration: "60 min", rpe: "5", blocks: [{ label: "MAIN", items: ["Z2 throughout", "HR cap 142", "Flat route"] }] },
      { id: "S13-6", date: "9 AUG", dow: "SUN", title: "Full Rest", type: "REST", duration: "All day", rpe: "0" },
    ],
  },
  {
    id: "S14",
    label: "W14",
    dates: "10–16 Aug",
    phase: "RUN BASE",
    volume: "34–38 km",
    focus: "Threshold returns. First controlled HYROX partner-technique exposure.",
    days: [
      { id: "S14-0", date: "10 AUG", dow: "MON", title: "Lower Strength", type: "STRENGTH", duration: "65 min", rpe: "7" },
      { id: "S14-1", date: "11 AUG", dow: "TUE", title: "Easy + Strides", type: "RUN", duration: "45 min", rpe: "4" },
      { id: "S14-2", date: "12 AUG", dow: "WED", title: "Partner Sled Skill", type: "HYROX", duration: "60 min", rpe: "6–7", blocks: [{ label: "TECHNIQUE", items: ["Push 6×12.5m, controlled heavy", "Pull 6×12.5m, short rope cycles", "Film handover and transition practice", "No fatigue chasing"] }] },
      { id: "S14-3", date: "13 AUG", dow: "THU", title: "Threshold 3×8 min", type: "RUN", duration: "50 min", rpe: "7", blocks: [{ label: "MAIN", items: ["3×8 min at 4:35–4:50/km", "2:30 easy jog", "Start conservative"] }] },
      { id: "S14-4", date: "14 AUG", dow: "FRI", title: "Upper Strength", type: "STRENGTH", duration: "60 min", rpe: "7" },
      { id: "S14-5", date: "15 AUG", dow: "SAT", title: "Hill Strength Run", type: "RUN", duration: "55 min", rpe: "7", blocks: [{ label: "MAIN", items: ["8×60 sec uphill", "Jog down fully", "Keep mechanics clean"] }] },
      { id: "S14-6", date: "16 AUG", dow: "SUN", title: "Easy Recovery", type: "RUN", duration: "30 min", rpe: "3–4" },
    ],
  },
  {
    id: "S15",
    label: "W15",
    dates: "17–23 Aug",
    phase: "10K BUILD",
    volume: "38–42 km",
    focus: "PEGASUS-specific hills and 10K pace. Stations stay technical.",
    days: [
      { id: "S15-0", date: "17 AUG", dow: "MON", title: "Lower Strength", type: "STRENGTH", duration: "65 min", rpe: "7" },
      { id: "S15-1", date: "18 AUG", dow: "TUE", title: "5×1 km", type: "RUN", duration: "55 min", rpe: "8", blocks: [{ label: "MAIN", items: ["5×1 km at 4:10–4:20/km", "2 min jog", "Even execution, no hero first rep"] }] },
      { id: "S15-2", date: "19 AUG", dow: "WED", title: "Pull + Erg", type: "STRENGTH", duration: "60 min", rpe: "7" },
      { id: "S15-3", date: "20 AUG", dow: "THU", title: "Easy Run", type: "RUN", duration: "40 min", rpe: "4" },
      { id: "S15-4", date: "21 AUG", dow: "FRI", title: "Partner Wall Ball Skill", type: "HYROX", duration: "50 min", rpe: "6–7", blocks: [{ label: "MAIN", items: ["5×15 wall balls at 9 kg", "Practice 15/15 switches", "3×20m sandbag lunges", "Short transition walk-through"] }] },
      { id: "S15-5", date: "22 AUG", dow: "SAT", title: "Easy or AVOHK 5K", type: "RUN", duration: "40 min", rpe: "4–8" },
      { id: "S15-6", date: "23 AUG", dow: "SUN", title: "Long Easy Run", type: "RUN", duration: "70 min", rpe: "5" },
    ],
  },
  {
    id: "S16",
    label: "W16",
    dates: "24–30 Aug",
    phase: "RACE WEEK",
    volume: "24–28 km + race",
    focus: "Mini-taper for PEGASUS. This result resets the autumn pace model.",
    days: [
      { id: "S16-0", date: "24 AUG", dow: "MON", title: "Light Strength", type: "STRENGTH", duration: "40 min", rpe: "5–6" },
      { id: "S16-1", date: "25 AUG", dow: "TUE", title: "4×800 m Primer", type: "RUN", duration: "40 min", rpe: "7" },
      { id: "S16-2", date: "26 AUG", dow: "WED", title: "Easy Run", type: "RUN", duration: "30 min", rpe: "4" },
      { id: "S16-3", date: "27 AUG", dow: "THU", title: "Full Rest", type: "REST", duration: "All day", rpe: "0" },
      { id: "S16-4", date: "28 AUG", dow: "FRI", title: "Shakeout + Strides", type: "RUN", duration: "25 min", rpe: "4" },
      { id: "S16-5", date: "29 AUG", dow: "SAT", title: "Rest + Race Prep", type: "REST", duration: "All day", rpe: "0" },
      { id: "S16-6", date: "30 AUG", dow: "SUN", title: "PEGASUS Tsuen Wan 10K", type: "RACE", duration: "10 km", rpe: "9", race: true, blocks: [{ label: "RACE PLAN", items: ["Run even effort, not even pace", "First 2 km controlled", "Use climbs to cap effort", "Result calibrates threshold and JPMCC"] }] },
    ],
  },
];

const races = [
  { date: "25 Jul 2026", name: "HYROX Delhi", type: "Pro Doubles Men", status: "DONE", priority: "Baseline", location: "Delhi", note: "1:27:54 · AG 14 · Overall 91" },
  { date: "30 Aug 2026", name: "PEGASUS Tsuen Wan 10K", type: "Road 10K", status: "REGISTERED", priority: "B", location: "Hong Kong", note: "Post-Delhi run benchmark" },
  { date: "31 Oct 2026", name: "HYROX Shanghai", type: "Pro Doubles Men", status: "WATCH", priority: "A option", location: "Shanghai", note: "Qualification attempt if ticket + partner confirmed" },
  { date: "4 Nov 2026", name: "JPM Corporate Challenge", type: "5.6K", status: "EXPECTED", priority: "B", location: "Hong Kong", note: "Date still provisional" },
  { date: "21–22 Nov 2026", name: "HYROX Guangzhou", type: "Pro Doubles Men", status: "WATCH", priority: "A", location: "Guangzhou", note: "Best close-to-home qualifier option" },
  { date: "Late 2026", name: "Extended Travel Block", type: "Maintenance block", status: "PLANNED", priority: "TRAVEL", location: "Private", note: "Reduced-volume training block" },
  { date: "Jan 2027", name: "January Road Race", type: "Decision pending", status: "DECIDE", priority: "C", location: "HK / Xiamen / Mumbai", note: "Do not force a marathon into a HYROX season" },
  { date: "Feb 2027", name: "HYROX Bangkok", type: "Pro Doubles Men", status: "WATCH", priority: "A", location: "Bangkok", note: "Primary second qualification window" },
  { date: "Spring 2027", name: "HYROX Osaka", type: "Pro Doubles Men", status: "WATCH", priority: "A", location: "Osaka", note: "Final practical APAC attempt if scheduled before cutoff" },
  { date: "10–13 Jun 2027", name: "HYROX World Championships", type: "Pro Doubles Men", status: "TARGET", priority: "A+", location: "Hong Kong", note: "Qualification cutoff 16 May 2027" },
];

const splits = [
  ["Run total", "47:33", "87", "Primary limiter"],
  ["Ski", "4:22", "128", "Technique + division of work"],
  ["Sled push", "2:25", "49", "Best station"],
  ["Sled pull", "5:51", "99", "Large opportunity"],
  ["Burpee broad jump", "3:24", "87", "Solid"],
  ["Row", "4:57", "99", "Improve handover"],
  ["Farmers carry", "1:50", "69", "Strength"],
  ["Sandbag lunges", "4:54", "109", "Late-race weakness"],
  ["Wall balls", "5:23", "116", "Late-race weakness"],
  ["Roxzone", "7:23", "103", "Execution opportunity"],
];

const phaseRoadmap = [
  ["27 Jul–16 Aug", "Recover + rebuild", "Pain-free consistency"],
  ["17–30 Aug", "10K sharpening", "PEGASUS benchmark"],
  ["31 Aug–4 Oct", "Threshold + aerobic durability", "Raise sustainable run pace"],
  ["Autumn", "Travel-adjusted endurance", "Front-load key quality sessions"],
  ["19 Oct–22 Nov", "HYROX specific", "Two race-specific sessions/week"],
  ["Late year", "Travel maintenance", "Protect fitness, no peak work"],
  ["14 Dec–Feb", "Qualifier build 1", "Bangkok or confirmed APAC race"],
  ["Mar–16 May", "Qualifier build 2", "Last high-quality attempts"],
  ["17 May–9 Jun", "Worlds taper or next-cycle bridge", "Depends on qualification"],
];

const augustCells = [
  ["27", "Rest · recovery", "rest"],
  ["28", "Mobility", "mobility"],
  ["29", "Rest", "rest"],
  ["30", "25m leg check", "run"],
  ["31", "Upper + mobility", "strength"],
  ["1", "30m easy", "run"],
  ["2", "Rest + debrief", "rest"],
  ["3", "Lower strength", "strength"],
  ["4", "Easy + strides", "run"],
  ["5", "Pull + row", "strength"],
  ["6", "35m easy", "run"],
  ["7", "Push + trunk", "strength"],
  ["8", "60m long run", "run"],
  ["9", "Rest", "rest"],
  ["10", "Lower strength", "strength"],
  ["11", "Easy + strides", "run"],
  ["12", "Partner sleds", "hyrox"],
  ["13", "3×8m threshold", "run"],
  ["14", "Upper strength", "strength"],
  ["15", "Hill strength run", "run"],
  ["16", "30m recovery", "run"],
  ["17", "Lower strength", "strength"],
  ["18", "5×1 km", "run"],
  ["19", "Pull + erg", "strength"],
  ["20", "40m easy", "run"],
  ["21", "Partner wall balls", "hyrox"],
  ["22", "Easy / AVOHK 5K", "run"],
  ["23", "70m long run", "run"],
  ["24", "Light strength", "strength"],
  ["25", "4×800m primer", "run"],
  ["26", "30m easy", "run"],
  ["27", "Rest", "rest"],
  ["28", "Shakeout", "run"],
  ["29", "Race prep", "rest"],
  ["30", "PEGASUS 10K", "race"],
];

export default function App() {
  const [tab, setTab] = useState("plan");
  const [weekId, setWeekId] = useState("S12");
  const [openDay, setOpenDay] = useState("S12-1");
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
  const nextRaceDays = 34;

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
          <p className="eyebrow">AMAR PANDEY · TRAINING SYSTEM V6.2</p>
          <h1>SEASON <span>2026/27</span></h1>
          <div className="status-line">
            <span className="phase-pill">RECOVER</span>
            <span>W12–16 rolling prescription</span>
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
              <label>Date<input name="checkinDate" type="date" defaultValue="2026-07-27" required /></label>
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
            <div><span>RACE TRAVEL</span><b>Race travel block</b><p>Recovery and race execution take priority. No itinerary details shown.</p></div>
            <div><span>SHORT TRAVEL</span><b>Short travel block</b><p>Front-load key quality sessions. Travel runs remain optional.</p></div>
            <div><span>EXTENDED TRAVEL</span><b>Extended travel block</b><p>Use two runs and two short circuits weekly. Recovery takes priority.</p></div>
          </section>
        </section>
      )}

      {tab === "races" && (
        <section className="view">
          <div className="view-heading">
            <p className="section-kicker">QUALIFYING STRATEGY</p>
            <h2>Race HQ</h2>
            <p>Only A-races get a true taper. Everything else must support the qualification campaign.</p>
          </div>
          <div className="race-list">
            {races.map((race) => (
              <article className="race-card" key={race.name}>
                <div className="race-date">{race.date}</div>
                <div><small>{race.location} · {race.type}</small><h3>{race.name}</h3><p>{race.note}</p></div>
                <div className={`race-status ${race.status.toLowerCase()}`}>{race.status}</div>
                <div className="priority">{race.priority}</div>
              </article>
            ))}
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
            <p className="section-kicker">DELHI · 25 JUL 2026</p>
            <h2>1:27:54 baseline</h2>
            <p>AG 14 · Overall 91 · Top 47.4%</p>
          </div>
          <div className="metric-grid">
            <div><span>RUNNING</span><b>47:33</b><small>Largest lever</small></div>
            <div><span>FUNCTIONAL</span><b>33:06</b><small>Late stations faded</small></div>
            <div><span>ROXZONE</span><b>7:23</b><small>Execution cost</small></div>
            <div><span>AVG RUN</span><b>5:56</b><small>Run 3–7 deterioration</small></div>
          </div>
          <div className="analysis-grid">
            <section className="split-table">
              <div className="table-head"><b>SPLIT</b><b>TIME</b><b>RANK</b><b>READ</b></div>
              {splits.map(([name, time, rank, read]) => (
                <div className="table-row" key={name}><span>{name}</span><b>{time}</b><span>{rank}</span><span>{read}</span></div>
              ))}
            </section>
            <aside className="diagnostic">
              <p className="section-kicker">WHAT THE RESULT SAYS</p>
              <h3>Four priorities</h3>
              <ol>
                <li><b>Run durability.</b><span>Run 3–7 averaged roughly 6:40/km. The goal is controlled sub-5:30 compromised running before chasing elite-style volume.</span></li>
                <li><b>Roxzone discipline.</b><span>7:23 is a major non-fitness cost. Rehearse entry, exit and partner communication.</span></li>
                <li><b>Sled pull.</b><span>Push ranked 49, pull ranked 99. Technique and ownership are unbalanced.</span></li>
                <li><b>Late-race capacity.</b><span>Lunges and wall balls ranked 109 and 116. Train them after threshold work, but only after the leg is cleared.</span></li>
              </ol>
            </aside>
          </div>
          <section className="target-ladder">
            <div><span>NOW</span><b>1:27:54</b><p>Delhi baseline</p></div>
            <div><span>GATE 1</span><b>Sub-1:20</b><p>Run + Roxzone cleanup</p></div>
            <div><span>GATE 2</span><b>Sub-1:15</b><p>Competitive APAC execution</p></div>
            <div><span>QUALIFIER AIM</span><b>Placing-led</b><p>Time alone does not secure a slot</p></div>
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
