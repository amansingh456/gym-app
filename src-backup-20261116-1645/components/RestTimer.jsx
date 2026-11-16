import { useEffect, useRef, useState } from 'react';
import { chime } from '../lib/beep';

// Floating rest countdown. `request` is { seconds, endsAt, label, nonce }; a new nonce restarts it.
export default function RestTimer({ request, onClose }) {
  const [left, setLeft] = useState(request.seconds);
  const [total, setTotal] = useState(request.seconds);
  const endAt = useRef(request.endsAt);
  const fired = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      const s = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
      setLeft(s);
      if (s === 0 && !fired.current) {
        fired.current = true;
        chime();
      }
    }, 250);
    return () => clearInterval(id);
  }, []);

  const add = (n) => {
    endAt.current += n * 1000;
    fired.current = false;
    setTotal((t) => t + n);
    setLeft((l) => l + n);
  };

  const r = 22;
  const len = 2 * Math.PI * r;
  const v = total ? left / total : 0;
  const done = left === 0;

  return (
    <div className={`rest-timer ${done ? 'done' : ''}`} role="status" aria-live="polite">
      <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
        <circle cx="28" cy="28" r={r} className="ring-track" strokeWidth="5" />
        <circle cx="28" cy="28" r={r} className="ring-fill tone-amber static" strokeWidth="5"
          strokeDasharray={len} strokeDashoffset={len * (1 - v)} transform="rotate(-90 28 28)" />
      </svg>
      <div className="rest-text">
        <strong>{done ? 'Next set' : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`}</strong>
        <span>{done ? request.label : `Rest after ${request.label}`}</span>
      </div>
      <button className="chip" onClick={() => add(15)}>+15 s</button>
      <button className="chip" onClick={onClose}>{done ? 'Close' : 'Skip'}</button>
    </div>
  );
}
