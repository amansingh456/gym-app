import { daysBetween } from '../lib/dates';

// Weight over the 8 weeks: logged points, 7-day average, and the straight-line target.
export default function WeightChart({ entries, startDate, startWeight, goalWeight }) {
  const W = 640;
  const H = 260;
  const pad = { l: 44, r: 16, t: 16, b: 32 };
  const days = 56;
  const pts = entries
    .map((e) => ({ x: daysBetween(startDate, e.date), kg: e.kg }))
    .filter((p) => p.x >= 0 && p.x <= days + 14)
    .sort((a, b) => a.x - b.x);
  const maxX = Math.max(days, ...pts.map((p) => p.x));
  const all = [startWeight, goalWeight, ...pts.map((p) => p.kg)];
  const lo = Math.floor(Math.min(...all) - 1);
  const hi = Math.ceil(Math.max(...all) + 1);
  const X = (d) => pad.l + (d / maxX) * (W - pad.l - pad.r);
  const Y = (kg) => pad.t + ((hi - kg) / (hi - lo)) * (H - pad.t - pad.b);

  const avg = pts.map((p) => {
    const win = pts.filter((q) => q.x <= p.x && q.x > p.x - 7);
    return { x: p.x, kg: win.reduce((s, q) => s + q.kg, 0) / win.length };
  });
  const path = (arr) => arr.map((p, i) => `${i ? 'L' : 'M'}${X(p.x).toFixed(1)},${Y(p.kg).toFixed(1)}`).join(' ');
  const area = avg.length > 1 ? `${path(avg)} L${X(avg.at(-1).x)},${H - pad.b} L${X(avg[0].x)},${H - pad.b} Z` : '';
  const ticks = [];
  for (let kg = lo; kg <= hi; kg += hi - lo > 8 ? 2 : 1) ticks.push(kg);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Weight trend against the 8-week target">
      <defs>
        <linearGradient id="wfill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--ice)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--ice)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((kg) => (
        <g key={kg}>
          <line x1={pad.l} x2={W - pad.r} y1={Y(kg)} y2={Y(kg)} className="axis-line" />
          <text x={pad.l - 8} y={Y(kg) + 4} textAnchor="end" className="axis-text">{kg}</text>
        </g>
      ))}
      {Array.from({ length: 9 }).map((_, w) => (
        <text key={w} x={X(w * 7)} y={H - 10} textAnchor="middle" className="axis-text">{w === 0 ? 'Start' : `W${w}`}</text>
      ))}
      <line x1={X(0)} y1={Y(startWeight)} x2={X(days)} y2={Y(goalWeight)} className="target-line" />
      <text x={X(days) - 4} y={Y(goalWeight) - 8} textAnchor="end" className="target-text">Target {goalWeight} kg</text>
      {area && <path d={area} fill="url(#wfill)" />}
      {avg.length > 1 && <path d={path(avg)} className="avg-line" />}
      {pts.map((p) => <circle key={`${p.x}-${p.kg}`} cx={X(p.x)} cy={Y(p.kg)} r={3.5} className="w-dot" />)}
      {!pts.length && <text x={W / 2} y={H / 2} textAnchor="middle" className="axis-text">Log your first morning weight to start the line</text>}
    </svg>
  );
}
