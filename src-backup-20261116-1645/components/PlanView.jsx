import { useState } from 'react';
import { PHASES, SCHEDULE, phaseForWeek, workoutFor } from '../data/program';
import WorkoutTracker from './WorkoutTracker';

export default function PlanView({ currentWeek, todayIdx, onForm, onVideo }) {
  const [week, setWeek] = useState(Math.min(Math.max(currentWeek, 1), 8));
  const [day, setDay] = useState(todayIdx);
  const phase = phaseForWeek(week);
  const workout = workoutFor(day, week);

  return (
    <div className="view plan-view">
      <section className="panel">
        <header className="panel-head">
          <div>
            <h2>8-week timeline</h2>
            <p className="sub">Pick a week to see its sets. You’re in week {Math.min(currentWeek, 8)}.</p>
          </div>
        </header>
        <div className="timeline" role="tablist" aria-label="Program week">
          {PHASES.map((p) => (
            <div key={p.id} className={`phase-block ${p.id === phase.id ? 'active' : ''}`} style={{ flex: p.weeks.length }}>
              <span className="phase-name">{p.name}</span>
              <div className="phase-weeks">
                {p.weeks.map((w) => (
                  <button
                    key={w}
                    role="tab"
                    aria-selected={w === week}
                    className={`wk ${w === week ? 'sel' : ''} ${w === currentWeek ? 'now' : ''} ${w < currentWeek ? 'past' : ''}`}
                    onClick={() => setWeek(w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="phase-copy">
          <p><strong>{phase.name}, week {week}.</strong> {phase.effort}.</p>
          <p className="dim">{phase.note}</p>
        </div>
      </section>

      <div className="day-strip" role="tablist" aria-label="Day of the week">
        {SCHEDULE.map((d, i) => (
          <button
            key={d.day}
            role="tab"
            aria-selected={i === day}
            className={`day-chip ${i === day ? 'sel' : ''} ${i === todayIdx ? 'today' : ''} ${d.rest ? 'rest' : ''}`}
            onClick={() => setDay(i)}
          >
            <span className="dc-day">{d.day}</span>
            <span className="dc-title">{d.title}</span>
          </button>
        ))}
      </div>

      <WorkoutTracker
        workout={workout}
        week={week}
        sets={{}}
        editable={false}
        title={`${SCHEDULE[day].full}: ${workout.title}`}
        onForm={onForm}
        onVideo={onVideo}
      />
    </div>
  );
}
