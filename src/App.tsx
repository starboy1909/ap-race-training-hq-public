import { useMemo, useState, type FormEvent } from 'react';
import { buildPlan, planReviewed } from './trainingPlan';
import { A_RACES } from './seasonPlan';
import completions from './data/completions.json';
import strengthLog from './data/strength.json';
import { Nav } from './components/Nav.tsx';
import { Header } from './components/Header.tsx';
import { Toast } from './components/Toast.tsx';
import { Today } from './screens/Today.tsx';
import { Calendar } from './screens/Calendar.tsx';
import { Profile } from './screens/Profile.tsx';
import { Races } from './screens/Races.tsx';
import { More } from './screens/More.tsx';
import { Records } from './screens/Records.tsx';
import { Coaching } from './screens/Coaching.tsx';
import { Season } from './screens/Season.tsx';
import { useHashRoute } from './lib/useHashRoute.ts';
import { todayIso, dateOf } from './lib/dates.ts';
import { readJson, writeJson, download } from './lib/storage.ts';
import { isSnapshotFile, mergeSnapshot, mergeBackup } from './lib/backup.ts';
import { findWeekForDate, indexLogsByDate } from './lib/calendar.ts';
import type { Completion, StrengthEntry, ManualLog, Snapshot } from './lib/types.ts';
import './styles.css';

// Storage keys live here on purpose: scripts/verify-training-plan.mjs reads this file for them.
const keys = ['rmr_completed_v4', 'ap_training_checkins_v1', 'ap_training_sessions_v1', 'ap_private_garmin_v1', 'ap_marathon_branch_v1'];

export default function App() {
  const today = todayIso();
  const [route, navigate] = useHashRoute();
  const weeks = useMemo(() => buildPlan(), []);
  const days = useMemo(() => weeks.flatMap(w => w.days), [weeks]);
  const nextRace = days.find(d => d.race && d.iso! >= today && A_RACES.includes(d.iso!));
  const upcoming = weeks.filter(w => dateOf(w.days[6]) >= today).slice(0, 6);
  const current = findWeekForDate(weeks, today) || weeks[weeks.length - 1];
  const todayDay = days.find(d => dateOf(d) === today);
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => readJson(keys[0], {}));
  const [checkins] = useState<ManualLog[]>(() => readJson(keys[1], []));
  const [logs, setLogs] = useState<ManualLog[]>(() => readJson(keys[2], []));
  const [snapshot, setSnapshot] = useState<Snapshot>(() => readJson(keys[3], {}));
  const [message, setMessage] = useState('');
  const [recordView, setRecordView] = useState('sessions');
  const index = useMemo(() => indexLogsByDate(completions as Completion[], strengthLog as StrengthEntry[], logs), [logs]);

  function save(key: string, value: unknown) {
    const ok = writeJson(key, value);
    setMessage(ok ? 'Saved on this device' : 'Could not save: device storage is unavailable or full. Export a backup.');
    return ok;
  }
  function toggle(id: string) { const next = { ...completed, [id]: !completed[id] }; if (save(keys[0], next)) setCompleted(next); }
  function session(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget); const entry = Object.fromEntries(f.entries()) as ManualLog;
    entry.id = crypto.randomUUID(); entry.load = Number(entry.minutes) * Number(entry.rpe);
    const next = [...logs, entry]; if (save(keys[2], next)) { setLogs(next); e.currentTarget.reset(); }
  }
  async function importData(file?: File) {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (isSnapshotFile(data)) { const next = mergeSnapshot(snapshot, data); if (save(keys[3], next)) setSnapshot(next); return; }
      const values = mergeBackup(keys, { completed, checkins, logs, snapshot }, data);
      const previous = Object.fromEntries(Object.keys(values).map(k => [k, localStorage.getItem(k)]));
      try { for (const [key, value] of Object.entries(values)) localStorage.setItem(key, JSON.stringify(value)); }
      catch (error) { for (const [key, value] of Object.entries(previous)) { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value); } throw error; }
      location.reload();
    } catch { setMessage('Import failed. Use a Race HQ backup or compact Garmin snapshot JSON. Existing records are retained.'); }
  }
  const archiveRows = days.filter(d => dateOf(d) <= '2026-09-20' && (/completed|verified/i.test(d.title) || d.note?.includes('verified')));
  const exportBackup = () => download('race-hq-private-backup.json', { version: 1, exportedAt: new Date().toISOString(), storage: Object.fromEntries(keys.map(k => [k, readJson(k, null)])) });

  return <main className="app-shell">
    <Header today={today} nextRace={nextRace} reviewed={planReviewed} />
    <Nav current={route.tab} />
    <Toast message={message} onClose={() => setMessage('')} />
    {route.tab === 'today' && <Today today={today} day={todayDay} week={todayDay && findWeekForDate(weeks, today)} days={days} nextRace={nextRace} completed={completed} index={index} onToggle={toggle} />}
    {route.tab === 'calendar' && <Calendar weeks={weeks} today={today} routeDate={route.date} completed={completed} index={index} onToggle={toggle} navigate={navigate} />}
    {route.tab === 'profile' && <Profile sub={route.sub} />}
    {route.tab === 'races' && <Races today={today} />}
    {route.tab === 'more' && !route.sub && <More />}
    {route.tab === 'more' && route.sub === 'records' && <Records today={today} completions={completions as Completion[]} strength={strengthLog as StrengthEntry[]} logs={logs} snapshot={snapshot} archiveRows={archiveRows} view={recordView} setView={setRecordView} onSession={session} onImport={importData} onExport={exportBackup} />}
    {route.tab === 'more' && route.sub === 'coach' && <Coaching week={current} />}
    {route.tab === 'more' && route.sub === 'season' && <Season today={today} upcoming={upcoming} />}
    <footer>AMAR / ENDURANCE LAB <span>One plan · one record · consistent progression</span></footer>
  </main>;
}
