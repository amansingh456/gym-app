import { addDays, prettyDate, weekdayIndex } from '../lib/dates';

const ROWS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// 8 weeks × 7 days. Brightness = share of habits ticked that day.
export default function Heatmap({ startDate, today, scoreFor }) {
  // align the grid to the Monday on or before the start date
  const start = addDays(startDate, -weekdayIndex(startDate));
  return (
    <div className="heatmap" role="img" aria-label="Habit completion for each day of the 8 weeks">
      <div className="hm-rows">{ROWS.map((r) => <span key={r}>{r}</span>)}</div>
      <div className="hm-grid">
        {Array.from({ length: 8 }).map((_, w) => (
          <div key={w} className="hm-col">
            {ROWS.map((_, d) => {
              const key = addDays(start, w * 7 + d);
              const future = key > today;
              const before = key < startDate;
              const s = future || before ? null : scoreFor(key);
              const level = s == null ? 'none' : s === 0 ? 0 : s < 0.34 ? 1 : s < 0.67 ? 2 : s < 1 ? 3 : 4;
              return (
                <span
                  key={key}
                  className={`hm-cell l${level} ${key === today ? 'today' : ''}`}
                  title={`${prettyDate(key)}: ${s == null ? 'not yet' : `${Math.round(s * 100)}% of habits`}`}
                />
              );
            })}
            <span className="hm-week">W{w + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
