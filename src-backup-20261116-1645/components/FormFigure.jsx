import { useEffect, useRef, useState } from 'react';
import { POSES } from '../data/poses';

// Fill in far-side joints so every pose has a full skeleton.
function complete(p) {
  const out = { ...p };
  ['sh', 'el', 'wr', 'hp', 'kn', 'an'].forEach((k) => {
    if (!out[`${k}2`]) out[`${k}2`] = out[k];
  });
  return out;
}

function lerp(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function blend(a, b, t) {
  const out = {};
  Object.keys(a).forEach((k) => {
    out[k] = lerp(a[k], b[k] || a[k], t);
  });
  return out;
}

// 0 → 1 → 0 with short holds at each end, eased, so the motion reads like a real rep.
function repCurve(phase) {
  const p = phase % 1;
  let t;
  if (p < 0.08) t = 0;
  else if (p < 0.46) t = (p - 0.08) / 0.38;
  else if (p < 0.56) t = 1;
  else if (p < 0.94) t = 1 - (p - 0.56) / 0.38;
  else t = 0;
  return 0.5 - Math.cos(Math.PI * t) / 2;
}

const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

function Skeleton({ j, pose, ghost, dashed }) {
  const front = pose.front;
  const foot = pose.foot || [10, 0];
  const foot2 = pose.foot2 || foot;
  const shM = front ? mid(j.sh, j.sh2) : j.sh;
  const hpM = front ? mid(j.hp, j.hp2) : j.hp;
  const cls = ghost ? 'bone ghost' : 'bone';
  const dash = dashed ? '3 5' : undefined;
  const seg = (p, q, extra = '') => (
    <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} className={`${cls} ${extra}`} strokeDasharray={dash} />
  );
  return (
    <g>
      {/* far side limbs first, dimmer */}
      {seg(j.sh2, j.el2, 'far')}
      {seg(j.el2, j.wr2, 'far')}
      {seg(j.hp2, j.kn2, 'far')}
      {seg(j.kn2, j.an2, 'far')}
      {seg(j.an2, [j.an2[0] + foot2[0], j.an2[1] + foot2[1]], 'far')}
      {front && seg(j.sh, j.sh2)}
      {front && seg(j.hp, j.hp2)}
      {seg(shM, hpM, 'torso')}
      {seg(shM, j.head)}
      {seg(j.hp, j.kn)}
      {seg(j.kn, j.an)}
      {seg(j.an, [j.an[0] + foot[0], j.an[1] + foot[1]])}
      {seg(j.sh, j.el)}
      {seg(j.el, j.wr)}
      <circle cx={j.head[0]} cy={j.head[1]} r={11} className={ghost ? 'skull ghost' : 'skull'} strokeDasharray={dash} />
      {!ghost && ['sh', 'el', 'wr', 'hp', 'kn', 'an'].map((k) => (
        <circle key={k} cx={j[k][0]} cy={j[k][1]} r={2.6} className="joint" />
      ))}
    </g>
  );
}

function Gear({ gear = [], j }) {
  return gear.map((g, i) => {
    const p = j[g.at];
    const o = g.offset || [0, 0];
    const x = p[0] + o[0];
    const y = p[1] + o[1];
    if (g.type === 'db') {
      return g.vertical
        ? <rect key={i} x={x - 4} y={y - 9} width={8} height={18} rx={2} className="gear" />
        : <rect key={i} x={x - 9} y={y - 4} width={18} height={8} rx={2} className="gear" />;
    }
    if (g.type === 'bar') return <circle key={i} cx={x} cy={y} r={4.5} className="gear" />;
    if (g.type === 'plate') return <circle key={i} cx={x} cy={y} r={11} className="gear" />;
    if (g.type === 'cable') return <line key={i} x1={g.from[0]} y1={g.from[1]} x2={x} y2={y} className="cable" />;
    return null;
  });
}

function Props({ props = [] }) {
  return props.map((p, i) =>
    p.type === 'rect'
      ? <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx={2} className="prop" />
      : <line key={i} x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} className="prop-line" />,
  );
}

export default function FormFigure({ poseId, playing = true, speed = 1, showGhost = true, compact = false }) {
  const pose = POSES[poseId];
  const [phase, setPhase] = useState(0);
  const raf = useRef(0);
  const last = useRef(0);
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!playing || reduce) return undefined;
    const loop = (ts) => {
      const dt = last.current ? (ts - last.current) / 1000 : 0;
      last.current = ts;
      setPhase((p) => (p + (dt * speed) / 3.6) % 1);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf.current);
      last.current = 0;
    };
  }, [playing, speed, reduce]);

  if (!pose) return null;
  const a = complete(pose.a);
  const b = complete(pose.b);
  const t = reduce || compact ? 1 : repCurve(phase);
  const j = blend(a, b, t);

  return (
    <svg viewBox="0 0 240 240" className={`figure ${compact ? 'compact' : ''}`} role="img" aria-label={`${pose.title} form guide`}>
      <defs>
        <pattern id={`grid-${poseId}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" className="grid-line" />
        </pattern>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="240" height="240" fill={`url(#grid-${poseId})`} />
      <line x1="0" y1="222" x2="240" y2="222" className="floor" />
      <Props props={pose.props} />
      {showGhost && (
        <>
          <Skeleton j={a} pose={pose} ghost dashed />
          <Skeleton j={b} pose={pose} ghost dashed />
        </>
      )}
      <g filter="url(#glow)">
        <Gear gear={pose.gear} j={j} />
        <Skeleton j={j} pose={pose} />
      </g>
      {!compact && pose.marks.map((k, i) => (
        <g key={k} className="mark">
          <circle cx={j[k][0]} cy={j[k][1]} r={8} />
          <text x={j[k][0]} y={j[k][1] + 3.5} textAnchor="middle">{i + 1}</text>
        </g>
      ))}
    </svg>
  );
}
