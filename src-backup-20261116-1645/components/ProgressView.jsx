import { useState } from 'react';
import WeightChart from './WeightChart';
import Heatmap from './Heatmap';
import { prettyDate } from '../lib/dates';

export default function ProgressView({ settings, onSettings, weights, onLogWeight, onDeleteWeight, today, scoreFor, streak, best }) {
  const todays = weights.find((w) => w.date === today);
  const [kg, setKg] = useState(todays ? String(todays.kg) : '');
  const sorted = [...weights].sort((a, b) => (a.date < b.date ? 1 : -1));
  const latest = sorted[0]?.kg;
  const lost = latest != null ? settings.startWeight - latest : 0;
  const goalSpan = settings.startWeight - settings.goalWeight;
  const pct = goalSpan > 0 ? Math.max(0, Math.min(1, lost / goalSpan)) : 0;

  // average of the last 7 logged days vs the 7 before that
  const avgOf = (arr) => (arr.length ? arr.reduce((s, w) => s + w.kg, 0) / arr.length : null);
  const thisWeek = avgOf(sorted.slice(0, 7));
  const lastWeek = avgOf(sorted.slice(7, 14));
  const weekly = thisWeek != null && lastWeek != null ? lastWeek - thisWeek : null;

  const submit = (e) => {
    e.preventDefault();
    const n = Number(kg);
    if (!Number.isFinite(n) || n < 30 || n > 250) return;
    onLogWeight(Math.round(n * 10) / 10);
  };

  return (
    <div className="view progress-view">
      <section className="panel progress-hero">
        <div className="goal-bar-wrap">
          <div className="goal-ends"><span>{settings.startWeight} kg</span><span>{settings.goalWeight} kg</span></div>
          <div className="goal-bar"><span style={{ width: `${pct * 100}%` }} /></div>
          <p className="big-stat"><strong>{lost > 0 ? lost.toFixed(1) : '0.0'} kg</strong> down of {goalSpan} kg</p>
        </div>
        <dl className="stat-row">
          <div><dt>Latest</dt><dd>{latest != null ? `${latest} kg` : 'No entry'}</dd></div>
          <div><dt>Weekly change</dt><dd>{weekly != null ? `${weekly >= 0 ? '−' : '+'}${Math.abs(weekly).toFixed(2)} kg` : 'After 2 weeks'}</dd></div>
          <div><dt>Habit streak</dt><dd>{streak} days</dd></div>
          <div><dt>Best streak</dt><dd>{best} days</dd></div>
        </dl>
      </section>

      <section className="panel">
        <header className="panel-head">
          <div>
            <h2>Weight trend</h2>
            <p className="sub">Dots are daily weigh-ins, the filled line is your 7-day average, the dashed line is the target pace.</p>
          </div>
          <form className="weigh-form" onSubmit={submit}>
            <label htmlFor="kg" className="sr-only">Today’s weight in kg</label>
            <input id="kg" inputMode="decimal" value={kg} onChange={(e) => setKg(e.target.value)} placeholder="97.4" />
            <span className="dim">kg</span>
            <button className="btn" type="submit">{todays ? 'Update today' : 'Log today'}</button>
          </form>
        </header>
        <WeightChart entries={weights} startDate={settings.startDate} startWeight={settings.startWeight} goalWeight={settings.goalWeight} />
        <p className="sub">Judge progress by the average line. Single days swing 1–2 kg with water and salt.</p>
        {sorted.length > 0 && (
          <details className="log-list">
            <summary>All entries ({sorted.length})</summary>
            <ul>
              {sorted.map((w) => (
                <li key={w.date}>
                  <span>{prettyDate(w.date, { day: 'numeric', month: 'short', weekday: 'short' })}</span>
                  <strong>{w.kg} kg</strong>
                  <button className="link" onClick={() => onDeleteWeight(w.date)}>Delete</button>
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>

      <section className="panel">
        <header className="panel-head">
          <div>
            <h2>Habit consistency</h2>
            <p className="sub">Each square is a day. Brighter means more habits ticked.</p>
          </div>
        </header>
        <Heatmap startDate={settings.startDate} today={today} scoreFor={scoreFor} />
      </section>

      <section className="panel settings">
        <header className="panel-head"><h2>Plan settings</h2></header>
        <div className="settings-grid">
          <label>
            <span>Start date</span>
            <input type="date" value={settings.startDate} onChange={(e) => e.target.value && onSettings({ ...settings, startDate: e.target.value })} />
          </label>
          <label>
            <span>Start weight (kg)</span>
            <input type="number" step="0.1" value={settings.startWeight} onChange={(e) => onSettings({ ...settings, startWeight: Number(e.target.value) || settings.startWeight })} />
          </label>
          <label>
            <span>Goal weight (kg)</span>
            <input type="number" step="0.1" value={settings.goalWeight} onChange={(e) => onSettings({ ...settings, goalWeight: Number(e.target.value) || settings.goalWeight })} />
          </label>
        </div>
        <p className="sub">Saved on this device only. Changing the start date moves your week number and the heatmap.</p>
      </section>
    </div>
  );
}
