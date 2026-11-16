import Rings from './Rings';
import Checklist from './Checklist';
import WorkoutTracker from './WorkoutTracker';
import { WATER } from '../data/program';
import { prettyDate } from '../lib/dates';

export default function TodayView({
  today, week, phase, workout, next, habits, log, streak,
  onToggle, onWater, onAdd, onRemove, onRestore, onSet, onDemo,
}) {
  const done = log.habits || {};
  const sets = log.sets || {};
  const rest = workout.rest;
  const habitScore = habits.length ? habits.filter((h) => done[h.id]).length / habits.length : 0;
  const totalSets = workout.items.reduce((n, it) => n + it.sets, 0);
  const doneSets = workout.items.reduce((n, it) => n + Math.min(sets[it.id] || 0, it.sets), 0);
  const setScore = totalSets ? doneSets / totalSets : 0;
  const water = log.water || 0;
  const waterScore = Math.min(water / WATER.goal, 1);
  const parts = rest ? [habitScore, waterScore] : [habitScore, setScore, waterScore];
  const overall = Math.round((parts.reduce((a, b) => a + b, 0) / parts.length) * 100);
  const after = week > 8;

  const rings = rest
    ? [{ label: 'habits', value: habitScore, tone: 'ice' }, { label: 'water', value: waterScore, tone: 'amber' }]
    : [{ label: 'habits', value: habitScore, tone: 'ice' }, { label: 'sets', value: setScore, tone: 'violet' }, { label: 'water', value: waterScore, tone: 'amber' }];

  return (
    <div className="view today-view">
      <section className="hud">
        <div className="hud-grid" aria-hidden="true" />
        <div className="hud-copy">
          <p className="hud-date">{prettyDate(today)}</p>
          <h1 className="hud-title">{rest ? 'Recovery day' : workout.title}</h1>
          <p className="hud-sub">
            {after && 'You’ve finished the 8 weeks. Keep the habits going. '}
            {!after && `Week ${week} of 8, ${phase.name.toLowerCase()} phase. `}
            {rest ? `No gym today. Walk, eat well, sleep. Next session: ${next.title} tomorrow.` : `${phase.effort}.`}
          </p>
          <dl className="hud-stats">
            <div><dt>Habits</dt><dd>{Math.round(habitScore * 100)}%</dd></div>
            {!rest && <div><dt>Sets</dt><dd>{doneSets}/{totalSets}</dd></div>}
            <div><dt>Water</dt><dd>{((water * WATER.glassMl) / 1000).toFixed(1)} L</dd></div>
            <div><dt>Streak</dt><dd>{streak} {streak === 1 ? 'day' : 'days'}</dd></div>
          </dl>
          <ul className="ring-key">
            <li><span className="swatch tone-ice" />Habits (outer ring)</li>
            {!rest && <li><span className="swatch tone-violet" />Sets</li>}
            <li><span className="swatch tone-amber" />Water</li>
          </ul>
        </div>
        <Rings size={232} rings={rings} center={<><strong>{overall}%</strong><span>of today</span></>} />
      </section>

      <div className="today-cols">
        <Checklist
          habits={habits}
          done={done}
          onToggle={onToggle}
          water={water}
          onWater={onWater}
          onAdd={onAdd}
          onRemove={onRemove}
          onRestore={onRestore}
          restDay={rest}
          workoutLabel={`Finish ${workout.title}`}
        />
        <WorkoutTracker
          workout={workout}
          week={week}
          sets={sets}
          onSet={onSet}
          onDemo={onDemo}
          next={rest ? next : null}
          title={rest ? 'Rest day' : `Today: ${workout.title}`}
        />
      </div>
    </div>
  );
}
