import { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';
import { useStored } from './lib/useStored';
import { useToday } from './lib/useToday';
import { addDays, programWeek, weekdayIndex } from './lib/dates';
import { DEFAULT_HABITS, PROFILE, VIDEOS, WATER, habitsForDay, phaseForWeek, workoutFor } from './data/program';
import TodayView from './components/TodayView';
import PlanView from './components/PlanView';
import DietView from './components/DietView';
import ProgressView from './components/ProgressView';
import MediaView from './components/MediaView';
import Modal from './components/Modal';
import ExerciseDemo from './components/ExerciseDemo';
import VideoPlayer from './components/VideoPlayer';
import RestTimer from './components/RestTimer';

const TABS = [
  { id: 'today', label: 'Today', icon: 'M12 3v3M12 18v3M3 12h3M18 12h3M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z' },
  { id: 'plan', label: 'Plan', icon: 'M4 6h16M4 12h16M4 18h10' },
  { id: 'diet', label: 'Diet', icon: 'M12 3c4 4 6 7 6 10a6 6 0 0 1-12 0c0-3 2-6 6-10z' },
  { id: 'progress', label: 'Progress', icon: 'M4 18l5-6 4 3 7-9' },
  { id: 'media', label: 'Media', icon: 'M5 5h14v14H5zM10 9v6l5-3z' },
];

const EMPTY_LOG = { habits: {}, sets: {}, water: 0 };

function readHash() {
  const h = window.location.hash.replace('#', '');
  return TABS.some((t) => t.id === h) ? h : 'today';
}

export default function App() {
  const today = useToday();
  const [tab, setTab] = useState(readHash);
  const [settings, setSettings] = useStored('cut8.settings', () => ({
    startDate: today,
    startWeight: PROFILE.startWeight,
    goalWeight: PROFILE.goalWeight,
  }));
  const [habits, setHabits] = useStored('cut8.habits', DEFAULT_HABITS);
  const [logs, setLogs] = useStored('cut8.log', {});
  const [weights, setWeights] = useStored('cut8.weights', []);
  const [modal, setModal] = useState(null);
  const [rest, setRest] = useState(null);
  const [mediaTab, setMediaTab] = useState('videos');
  const [videoIndex, setVideoIndex] = useState(0);

  useEffect(() => {
    const onHash = () => setTab(readHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = (id) => {
    window.location.hash = id;
    setTab(id);
    window.scrollTo({ top: 0 });
  };

  const week = programWeek(settings.startDate, today);
  const phase = phaseForWeek(week);
  const todayIdx = weekdayIndex(today);
  const workout = workoutFor(todayIdx, Math.min(week, 8));
  const nextWorkout = workoutFor((todayIdx + 1) % 7, Math.min(week, 8));
  const todaysHabits = habitsForDay(habits, workout.rest);
  const log = logs[today] || EMPTY_LOG;

  // Every change goes through here, keyed by today's date. A new date means a fresh, empty log.
  const updateLog = useCallback((fn) => {
    setLogs((all) => {
      const cur = all[today] || EMPTY_LOG;
      return { ...all, [today]: fn({ habits: { ...cur.habits }, sets: { ...cur.sets }, water: cur.water || 0 }) };
    });
  }, [setLogs, today]);

  const toggleHabit = (id) => updateLog((l) => ({ ...l, habits: { ...l.habits, [id]: !l.habits[id] } }));

  const setWater = (n) => updateLog((l) => ({ ...l, water: n, habits: { ...l.habits, water: n >= WATER.doneAt } }));

  const setSet = (item, n) => {
    const prev = log.sets?.[item.id] || 0;
    updateLog((l) => {
      const allDone = (s) => workout.items.every((it) => (s[it.id] || 0) >= it.sets);
      const sets = { ...l.sets, [item.id]: n };
      const wasAll = allDone(l.sets);
      const nowAll = allDone(sets);
      // Tick the session habit when every set is logged; untick only if we were the ones who ticked it.
      let workoutDone = l.habits.workout;
      if (nowAll) workoutDone = true;
      else if (wasAll) workoutDone = false;
      return { ...l, sets, habits: { ...l.habits, workout: workoutDone } };
    });
    if (n > prev && item.kind === 'strength' && n < item.sets && item.rest) {
      const now = Date.now();
      setRest({ seconds: item.rest, endsAt: now + item.rest * 1000, label: item.name, nonce: now });
    }
  };

  const logWeight = (kg) => {
    setWeights((ws) => [...ws.filter((w) => w.date !== today), { date: today, kg }]);
    updateLog((l) => ({ ...l, habits: { ...l.habits, weigh: true } }));
  };

  const deleteWeight = (date) => setWeights((ws) => ws.filter((w) => w.date !== date));

  const addHabit = (label) => setHabits((hs) => [...hs, { id: `c${Date.now()}`, label, group: 'Custom' }]);
  const removeHabit = (id) => setHabits((hs) => hs.filter((h) => h.id !== id));
  const restoreHabits = () => setHabits(DEFAULT_HABITS);

  // Score a day against the habits that applied that day (no gym habits on Mondays).
  const scoreFor = useCallback((key) => {
    const l = logs[key];
    const list = habitsForDay(habits, weekdayIndex(key) === 0);
    if (!l || !list.length) return 0;
    return list.filter((h) => l.habits?.[h.id]).length / list.length;
  }, [logs, habits]);

  // A day counts toward the streak at 80% of habits. Today only counts once it qualifies.
  const { streak, best } = useMemo(() => {
    const ok = (k) => scoreFor(k) >= 0.8;
    let s = 0;
    let k = ok(today) ? today : addDays(today, -1);
    while (ok(k) && s < 1000) {
      s += 1;
      k = addDays(k, -1);
    }
    let run = 0;
    let top = 0;
    let prevKey = null;
    Object.keys(logs).sort().forEach((key) => {
      if (ok(key)) {
        run = prevKey && addDays(prevKey, 1) === key ? run + 1 : 1;
        prevKey = key;
        top = Math.max(top, run);
      } else {
        run = 0;
        prevKey = null;
      }
    });
    return { streak: s, best: Math.max(top, s) };
  }, [logs, scoreFor, today]);

  const openDemo = (ex) => setModal({ type: 'demo', ex });
  const openVideo = (id) => {
    const i = VIDEOS.findIndex((v) => v.id === id);
    if (i >= 0) setModal({ type: 'video', index: i });
  };
  const closeModal = useCallback(() => setModal(null), []);

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#today" onClick={(e) => { e.preventDefault(); go('today'); }}>
          <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
            <circle cx="16" cy="16" r="13" className="brand-ring" />
            <path d="M16 3a13 13 0 0 1 12.4 9" className="brand-arc" />
            <circle cx="16" cy="16" r="4" className="brand-core" />
          </svg>
          <span className="brand-text">
            <strong>Cut 8</strong>
            <span>{settings.startWeight} to {settings.goalWeight} kg</span>
          </span>
        </a>
        <nav className="tabs" aria-label="Sections">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? 'tab on' : 'tab'} onClick={() => go(t.id)} aria-current={tab === t.id ? 'page' : undefined}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d={t.icon} /></svg>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      </header>

      <main className="main">
        {tab === 'today' && (
          <TodayView
            today={today}
            week={week}
            phase={phase}
            workout={workout}
            next={nextWorkout}
            habits={todaysHabits}
            log={log}
            streak={streak}
            onToggle={toggleHabit}
            onWater={setWater}
            onAdd={addHabit}
            onRemove={removeHabit}
            onRestore={restoreHabits}
            onSet={setSet}
            onDemo={openDemo}
          />
        )}
        {tab === 'plan' && <PlanView currentWeek={week} todayIdx={todayIdx} onDemo={openDemo} />}
        {tab === 'diet' && <DietView />}
        {tab === 'progress' && (
          <ProgressView
            key={today}
            settings={settings}
            onSettings={setSettings}
            weights={weights}
            onLogWeight={logWeight}
            onDeleteWeight={deleteWeight}
            today={today}
            scoreFor={scoreFor}
            streak={streak}
            best={best}
          />
        )}
        {tab === 'media' && (
          <MediaView tab={mediaTab} onTab={setMediaTab} videoIndex={videoIndex} onVideoIndex={setVideoIndex} onLocalVideo={openVideo} />
        )}
      </main>

      {modal?.type === 'demo' && (
        <Modal title={modal.ex.name} onClose={closeModal} wide>
          <ExerciseDemo ex={modal.ex} onLocalVideo={openVideo} />
        </Modal>
      )}
      {modal?.type === 'video' && (
        <Modal title={VIDEOS[modal.index].title} onClose={closeModal} wide>
          <VideoPlayer items={VIDEOS} index={modal.index} onIndex={(i) => setModal({ type: 'video', index: i })} autoPlay />
        </Modal>
      )}
      {rest && <RestTimer key={rest.nonce} request={rest} onClose={() => setRest(null)} />}
    </div>
  );
}
