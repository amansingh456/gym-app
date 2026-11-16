import { useState } from 'react';
import { WATER } from '../data/program';

const GROUPS = ['Morning', 'Food', 'Recovery', 'Custom'];

export default function Checklist({ habits, done, onToggle, water, onWater, onAdd, onRemove, onRestore, workoutLabel }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const count = habits.filter((h) => done[h.id]).length;

  const submit = (e) => {
    e.preventDefault();
    const label = draft.trim();
    if (!label) return;
    onAdd(label);
    setDraft('');
  };

  return (
    <section className="panel checklist" aria-labelledby="habits-title">
      <header className="panel-head">
        <div>
          <h2 id="habits-title">Today’s habits</h2>
          <p className="sub">Clears itself at midnight. {count} of {habits.length} done.</p>
        </div>
        <button className="chip" onClick={() => setEditing((x) => !x)} aria-pressed={editing}>
          {editing ? 'Done editing' : 'Edit list'}
        </button>
      </header>

      <div className="meter" aria-hidden="true">
        {habits.map((h) => <span key={h.id} className={done[h.id] ? 'on' : ''} />)}
      </div>

      {GROUPS.map((g) => {
        const list = habits.filter((h) => (h.group || 'Custom') === g);
        if (!list.length) return null;
        return (
          <div key={g} className="habit-group">
            <h3>{g}</h3>
            <ul>
              {list.map((h) => {
                const label = h.id === 'workout' && workoutLabel ? workoutLabel : h.label;
                return (
                  <li key={h.id} className={done[h.id] ? 'habit done' : 'habit'}>
                    <button className="habit-btn" onClick={() => onToggle(h.id)} aria-pressed={!!done[h.id]}>
                      <span className="tick" aria-hidden="true">
                        <svg viewBox="0 0 20 20"><path d="M4 10.5l4 4 8-9" /></svg>
                      </span>
                      <span className="habit-label">{label}</span>
                      {h.auto === 'weight' && <span className="auto-tag">Ticks when you log weight</span>}
                    </button>
                    {h.id === 'water' && (
                      <div className="water" role="group" aria-label="Water glasses">
                        {Array.from({ length: WATER.goal }).map((_, i) => (
                          <button
                            key={i}
                            className={i < water ? 'glass full' : 'glass'}
                            onClick={() => onWater(i < water ? i : i + 1)}
                            aria-label={`${i + 1} glass${i ? 'es' : ''}`}
                          />
                        ))}
                        <span className="water-num">{((water * WATER.glassMl) / 1000).toFixed(1)} L</span>
                      </div>
                    )}
                    {editing && (
                      <button className="remove" onClick={() => onRemove(h.id)} aria-label={`Remove ${h.label}`}>Remove</button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      {editing && (
        <div className="habit-edit">
          <form onSubmit={submit} className="add-habit">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a habit, e.g. 10 min stretching" aria-label="New habit" />
            <button className="btn" type="submit">Add habit</button>
          </form>
          <button className="link" onClick={onRestore}>Restore the default list</button>
        </div>
      )}
    </section>
  );
}
