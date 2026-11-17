// Concentric progress rings for the Today screen. Each ring: { label, value 0–1, tone }.
export default function Rings({ rings, size = 220, center }) {
  const stroke = 14;
  const gap = 6;
  const c = size / 2;
  return (
    <div className="rings" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden="true">
        {rings.map((r, i) => {
          const radius = c - stroke / 2 - i * (stroke + gap);
          const len = 2 * Math.PI * radius;
          const v = Math.max(0, Math.min(1, r.value));
          return (
            <g key={r.label} transform={`rotate(-90 ${c} ${c})`}>
              <circle cx={c} cy={c} r={radius} className="ring-track" strokeWidth={stroke} />
              <circle
                cx={c}
                cy={c}
                r={radius}
                className={`ring-fill tone-${r.tone}`}
                strokeWidth={stroke}
                strokeDasharray={len}
                strokeDashoffset={len * (1 - v)}
                style={{ '--len': len, animationDelay: `${i * 120}ms` }}
              />
            </g>
          );
        })}
      </svg>
      {center && <div className="rings-center">{center}</div>}
    </div>
  );
}
