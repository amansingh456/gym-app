import { useState } from 'react';
import { sessionBlocks } from '../data/program';

function SessionBar({ week }) {
  const blocks = sessionBlocks(week);
  return (
    <div className="session-bar" aria-label="90 minute session breakdown">
      {blocks.map((b) => (
        <div key={b.label} className={`seg tone-${b.tone}`} style={{ flex: b.min }}>
          <span className="seg-min">{b.min}′</span>
          <span className="seg-label">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function WorkoutTracker({ workout, week, sets, onSet, onForm, onVideo, editable = true, title }) {
  const [open, setOpen] = useState(null);
  if (workout.rest) {
    return (
      <section className="panel workout rest-day">
        <header className="panel-head"><h2>{title || 'Rest day'}</h2></header>
        <p className="rest-copy">No gym today. Muscles grow on rest days. Keep the evening walk, drink your water, and get to bed on time.</p>
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
                    {it.pose && <button className="chip" onClick={() => onForm(it.pose)}>Form guide</button>}
                    {it.video && <button className="chip" onClick={() => onVideo(it.video)}>Watch video</button>}
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
