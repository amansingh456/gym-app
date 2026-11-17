import { useState } from 'react';
import { sessionBlocks } from '../data/program';

// The 90 minutes in order: warm-up, then weights, then incline walk, then stretch.
function SessionBar({ week }) {
  const blocks = sessionBlocks(week);
  const starts = blocks.reduce((acc, b) => [...acc, acc.at(-1) + b.min], [0]);
  return (
    <div className="session">
      <p className="session-title">Your 90 minutes, in order</p>
      <div className="session-bar">
        {blocks.map((b, i) => {
          const from = starts[i];
          const to = starts[i + 1];
          return (
            <div key={b.label} className={`seg tone-${b.tone}`} style={{ flex: b.min }}>
              <span className="seg-label">{b.label}</span>
              <span className="seg-min">{b.min} min</span>
              <span className="seg-clock">minute {from}–{to}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function WorkoutTracker({ workout, week, sets, onSet, onDemo, editable = true, title, next }) {
  const [open, setOpen] = useState(null);
  if (workout.rest) {
    return (
      <section className="panel workout rest-day">
        <header className="panel-head"><h2>{title || 'Rest day'}</h2></header>
        <p className="rest-copy">No gym today. Muscles grow on rest days. Keep the evening walk, drink your water, and get to bed on time.</p>
        {next && (
          <div className="next-up">
            <p className="session-title">Tomorrow: {next.title}</p>
            <ul>
              {next.items.map((it) => (
                <li key={it.id}>
                  <button className="next-item" onClick={() => onDemo?.(it)}>
                    {it.gif && <img src={`/exercise/${it.gif}.gif`} alt="" loading="lazy" />}
                    <span>{it.name}</span>
                    <span className="ex-dose">{it.kind === 'cardio' ? it.reps : `${it.sets} × ${it.reps}`}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    );
  }
  const totalSets = workout.items.reduce((n, it) => n + it.sets, 0);
  const doneSets = workout.items.reduce((n, it) => n + Math.min(sets[it.id] || 0, it.sets), 0);

  return (
    <section className="panel workout" aria-labelledby={`wk-${workout.day}`}>
      <header className="panel-head">
        <div>
          <h2 id={`wk-${workout.day}`}>{title || workout.title}</h2>
          <p className="sub">{workout.tag}. {editable ? `${doneSets} of ${totalSets} sets done.` : `${totalSets} sets.`}</p>
        </div>
      </header>
      {!workout.noFinisher && <SessionBar week={week} />}

      <ol className="ex-list">
        {workout.items.map((it) => {
          const done = Math.min(sets[it.id] || 0, it.sets);
          const complete = done >= it.sets;
          const unit = it.kind === 'circuit' ? 'rounds' : it.kind === 'cardio' ? '' : 'sets';
          return (
            <li key={it.id} className={complete && editable ? 'ex complete' : 'ex'}>
              <div className="ex-main">
                {it.gif && (
                  <button className="ex-thumb" onClick={() => onDemo(it)} aria-label={`Watch ${it.name} demo`}>
                    <img src={`/exercise/${it.gif}.gif`} alt="" loading="lazy" />
                  </button>
                )}
                <button className="ex-name" onClick={() => setOpen(open === it.id ? null : it.id)} aria-expanded={open === it.id}>
                  <span>{it.name}</span>
                  <span className="ex-dose">
                    {it.kind === 'cardio' ? it.reps : `${it.sets} × ${it.reps}`}
                  </span>
                </button>
                {editable && (
                  <div className="pips" role="group" aria-label={`${it.name} ${unit} completed`}>
                    {Array.from({ length: it.sets }).map((_, i) => (
                      <button
                        key={i}
                        className={i < done ? 'pip on' : 'pip'}
                        onClick={() => onSet(it, i < done ? i : i + 1)}
                        aria-label={it.kind === 'cardio' ? 'Mark done' : `${unit} ${i + 1}`}
                        aria-pressed={i < done}
                      >
                        {it.kind === 'cardio' ? '✓' : i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {open === it.id && (
                <div className="ex-detail">
                  <ul className="cues">{it.cues.map((c) => <li key={c}>{c}</li>)}</ul>
                  <div className="ex-actions">
                    {it.rest && <span className="rest-note">Rest {it.rest} s between sets</span>}
                    <button className="chip on" onClick={() => onDemo(it)}>Watch demo</button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
