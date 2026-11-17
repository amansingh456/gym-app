import { useState } from 'react';
import { dose, sessionBlocks, thumbSrc } from '../data/program';

// Rough plan for the session: warm-up, main work, cool-down.
function SessionBar({ workout }) {
  const blocks = sessionBlocks(workout);
  const starts = blocks.reduce((acc, b) => [...acc, acc.at(-1) + b.min], [0]);
  return (
    <div className="session">
      <p className="session-title">About 90 minutes, in this order</p>
      <div className="session-bar">
        {blocks.map((b, i) => (
          <div key={b.label} className={`seg tone-${b.tone}`} style={{ flex: b.min }}>
            <span className="seg-label">{b.label}</span>
            <span className="seg-min">{b.min} min</span>
            <span className="seg-clock">minute {starts[i]}–{starts[i + 1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function groupBySection(items) {
  const groups = [];
  items.forEach((it) => {
    const last = groups.at(-1);
    if (last && last.title === it.section) last.items.push(it);
    else groups.push({ title: it.section, items: [it] });
  });
  return groups;
}

function pipLabel(it, i) {
  if (it.repsList) return it.repsList[i];
  if (it.kind === 'circuit') return `R${i + 1}`;
  return '✓';
}

export default function WorkoutTracker({ workout, sets, onSet, onDemo, editable = true, title, next }) {
  const [open, setOpen] = useState(null);

  if (workout.rest) {
    return (
      <section className="panel workout rest-day">
        <header className="panel-head"><h2>{title || 'Rest day'}</h2></header>
        <p className="rest-copy">No gym today. Muscles grow on rest days. Keep the evening walk, plank and kegels, drink your water, and get to bed on time.</p>
        {next && (
          <div className="next-up">
            <p className="session-title">Tomorrow: {next.title}</p>
            <ul>
              {next.items.filter((it) => it.section !== 'Warm-up' && it.section !== 'Cool-down').map((it) => (
                <li key={it.id}>
                  <button className="next-item" onClick={() => onDemo?.(it)}>
                    {thumbSrc(it) ? <img src={thumbSrc(it)} alt="" loading="lazy" /> : <span className="no-gif" />}
                    <span>{it.name}</span>
                    <span className="ex-dose">{dose(it)}</span>
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
          <p className="sub">{workout.tag}. {editable ? `${doneSets} of ${totalSets} done.` : ''}</p>
        </div>
      </header>
      <SessionBar workout={workout} />

      {groupBySection(workout.items).map((g) => {
        const gDone = g.items.filter((it) => (sets[it.id] || 0) >= it.sets).length;
        return (
          <div key={g.title} className="ex-group">
            <h3 className="ex-group-title">
              {g.title}
              {editable && <span className="dim"> {gDone}/{g.items.length}</span>}
            </h3>
            <ol className="ex-list">
              {g.items.map((it) => {
                const done = Math.min(sets[it.id] || 0, it.sets);
                const complete = done >= it.sets;
                return (
                  <li key={it.id} className={complete && editable ? 'ex complete' : 'ex'}>
                    <div className="ex-main">
                      <button className="ex-thumb" onClick={() => onDemo(it)} aria-label={`Watch ${it.name} demo`}>
                        {thumbSrc(it) ? <img src={thumbSrc(it)} alt="" loading="lazy" /> : <span className="thumb-play" aria-hidden="true">▶</span>}
                      </button>
                      <button className="ex-name" onClick={() => setOpen(open === it.id ? null : it.id)} aria-expanded={open === it.id}>
                        <span>{it.name}</span>
                        <span className="ex-dose">{dose(it)}</span>
                      </button>
                      {editable && (
                        <div className="pips" role="group" aria-label={`${it.name} progress`}>
                          {Array.from({ length: it.sets }).map((_, i) => (
                            <button
                              key={i}
                              className={i < done ? 'pip on' : 'pip'}
                              onClick={() => onSet(it, i < done ? i : i + 1)}
                              aria-label={it.repsList ? `Set ${i + 1}, ${it.repsList[i]} reps` : it.kind === 'circuit' ? `Round ${i + 1}` : 'Mark done'}
                              aria-pressed={i < done}
                            >
                              {pipLabel(it, i)}
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
          </div>
        );
      })}
    </section>
  );
}
