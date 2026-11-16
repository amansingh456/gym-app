import { useCallback, useEffect, useRef, useState } from 'react';

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

function fmt(s) {
  if (!Number.isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

function Icon({ name }) {
  const paths = {
    play: <path d="M8 5v14l11-7z" />,
    pause: <path d="M7 5h4v14H7zM13 5h4v14h-4z" />,
    back: <path d="M11 6v12L3 12zM20 6v12l-8-6z" />,
    fwd: <path d="M13 6v12l8-6zM4 6v12l8-6z" />,
    prev: <path d="M6 6h2v12H6zM20 6v12L9 12z" />,
    next: <path d="M16 6h2v12h-2zM4 6v12l11-6z" />,
    vol: <path d="M4 9v6h4l5 4V5L8 9zM16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" strokeWidth="2" stroke="currentColor" />,
    mute: <path d="M4 9v6h4l5 4V5L8 9zM16 9l5 6M21 9l-5 6" strokeWidth="2" stroke="currentColor" />,
    full: <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" strokeWidth="2" stroke="currentColor" />,
    pip: <path d="M3 5h18v14H3zM12 12h7v5h-7z" fill="none" strokeWidth="2" stroke="currentColor" />,
  };
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">{paths[name]}</svg>;
}

export default function VideoPlayer({ items, index, onIndex, autoPlay = false }) {
  const video = useRef(null);
  const shell = useRef(null);
  const item = items[index];
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [rate, setRate] = useState(1);
  const [loop, setLoop] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [mirror, setMirror] = useState(false);
  const [ab, setAb] = useState({ a: null, b: null });
  const [error, setError] = useState(false);
  const [hint, setHint] = useState('');

  // Reset per-clip state as each new clip starts loading.
  const onLoadStart = () => {
    setTime(0);
    setDuration(0);
    setBuffered(0);
    setAb({ a: null, b: null });
    setError(false);
  };

  useEffect(() => {
    if (autoPlay) video.current?.play().catch(() => {});
  }, [item?.src, autoPlay]);

  useEffect(() => {
    if (video.current) video.current.playbackRate = rate;
  }, [rate]);

  useEffect(() => {
    if (video.current) {
      video.current.muted = muted;
      video.current.volume = volume;
    }
  }, [muted, volume]);

  const hintTimer = useRef(0);
  const flash = useCallback((msg) => {
    setHint(msg);
    clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHint(''), 900);
  }, []);

  const toggle = useCallback(() => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }, []);

  const seekBy = useCallback((d) => {
    const v = video.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(v.currentTime + d, 0), v.duration || 0);
  }, []);

  const step = useCallback((dir) => {
    const v = video.current;
    if (!v) return;
    v.pause();
    v.currentTime = Math.min(Math.max(v.currentTime + dir / 30, 0), v.duration || 0);
    flash(dir > 0 ? 'Next frame' : 'Previous frame');
  }, [flash]);

  const fullscreen = () => {
    const el = shell.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  const pip = async () => {
    const v = video.current;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await v.requestPictureInPicture();
    } catch {
      flash('Picture-in-picture not supported here');
    }
  };

  const onKey = (e) => {
    const k = e.key;
    if (['INPUT', 'SELECT'].includes(e.target.tagName) && k !== ' ') return;
    const map = {
      ' ': toggle, k: toggle, K: toggle,
      ArrowLeft: () => seekBy(-5), ArrowRight: () => seekBy(5),
      j: () => seekBy(-10), l: () => seekBy(10),
      ',': () => step(-1), '.': () => step(1),
      m: () => setMuted((x) => !x), f: fullscreen,
      ArrowUp: () => setVolume((x) => Math.min(1, x + 0.1)), ArrowDown: () => setVolume((x) => Math.max(0, x - 0.1)),
    };
    if (map[k]) {
      e.preventDefault();
      map[k]();
    }
  };

  const onTime = () => {
    const v = video.current;
    setTime(v.currentTime);
    if (ab.a != null && ab.b != null && v.currentTime >= ab.b) v.currentTime = ab.a;
  };

  const onProgress = () => {
    const v = video.current;
    if (v.buffered.length) setBuffered(v.buffered.end(v.buffered.length - 1));
  };

  const onEnded = () => {
    if (loop) return;
    if (index < items.length - 1) onIndex(index + 1);
  };

  const markAB = () => {
    if (ab.a == null) {
      setAb({ a: time, b: null });
      flash('Loop start set');
    } else if (ab.b == null) {
      if (time <= ab.a + 0.2) {
        flash('Move past the start point first');
        return;
      }
      setAb({ a: ab.a, b: time });
      flash('Looping this section');
    } else {
      setAb({ a: null, b: null });
      flash('Section loop cleared');
    }
  };

  const pct = (x) => (duration ? `${(x / duration) * 100}%` : '0%');
  const abLabel = ab.a == null ? 'Set loop start' : ab.b == null ? 'Set loop end' : 'Clear section loop';

  if (!item) return null;

  return (
    <div className="player" ref={shell} tabIndex={0} onKeyDown={onKey} aria-label={`Video player: ${item.title}`}>
      <div className="stage" onClick={toggle}>
        {error && (
          <div className="video-missing">
            <p>Can’t load {item.src}</p>
            <p>Put the file in public{item.src} and refresh.</p>
          </div>
        )}
        <video
            ref={video}
            key={item.src}
            src={item.src}
            loop={loop}
            playsInline
            preload="metadata"
            style={{ transform: mirror ? 'scaleX(-1)' : undefined, display: error ? 'none' : undefined }}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={onTime}
            onLoadStart={onLoadStart}
            onLoadedMetadata={(e) => {
              e.currentTarget.playbackRate = rate;
              setDuration(e.currentTarget.duration);
            }}
            onProgress={onProgress}
            onEnded={onEnded}
            onError={() => setError(true)}
          />
        {!playing && !error && (
          <span className="big-play" aria-hidden="true"><Icon name="play" /></span>
        )}
        {hint && <span className="player-hint">{hint}</span>}
      </div>

      <div className="scrub">
        <div className="scrub-track">
          <span className="scrub-buf" style={{ width: pct(buffered) }} />
          <span className="scrub-fill" style={{ width: pct(time) }} />
          {ab.a != null && (
            <span className="scrub-ab" style={{ left: pct(ab.a), width: ab.b != null ? `calc(${pct(ab.b)} - ${pct(ab.a)})` : '2px' }} />
          )}
        </div>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.01}
          value={time}
          onChange={(e) => {
            const v = video.current;
            if (v) v.currentTime = Number(e.target.value);
            setTime(Number(e.target.value));
          }}
          aria-label="Seek"
        />
      </div>

      <div className="controls">
        <div className="ctrl-group">
          <button className="icon-btn" onClick={() => onIndex(Math.max(0, index - 1))} disabled={index === 0} aria-label="Previous video"><Icon name="prev" /></button>
          <button className="icon-btn" onClick={() => seekBy(-5)} aria-label="Back 5 seconds"><Icon name="back" /></button>
          <button className="icon-btn primary" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
            <Icon name={playing ? 'pause' : 'play'} />
          </button>
          <button className="icon-btn" onClick={() => seekBy(5)} aria-label="Forward 5 seconds"><Icon name="fwd" /></button>
          <button className="icon-btn" onClick={() => onIndex(Math.min(items.length - 1, index + 1))} disabled={index === items.length - 1} aria-label="Next video"><Icon name="next" /></button>
          <span className="time">{fmt(time)} <span className="dim">/ {fmt(duration)}</span></span>
        </div>

        <div className="ctrl-group">
          <label className="speed">
            <span className="sr-only">Playback speed</span>
            <select value={rate} onChange={(e) => setRate(Number(e.target.value))}>
              {SPEEDS.map((s) => <option key={s} value={s}>{s}×</option>)}
            </select>
          </label>
          <button className={`chip ${loop ? 'on' : ''}`} onClick={() => setLoop((x) => !x)} aria-pressed={loop}>Repeat</button>
          <button className={`chip ${ab.b != null ? 'on' : ''}`} onClick={markAB}>{abLabel}</button>
          <button className={`chip ${mirror ? 'on' : ''}`} onClick={() => setMirror((x) => !x)} aria-pressed={mirror}>Mirror</button>
          <button className="chip" onClick={() => step(-1)} aria-label="Previous frame">‹ Frame</button>
          <button className="chip" onClick={() => step(1)} aria-label="Next frame">Frame ›</button>
          <button className="icon-btn" onClick={() => setMuted((x) => !x)} aria-label={muted ? 'Unmute' : 'Mute'}><Icon name={muted ? 'mute' : 'vol'} /></button>
          <input
            className="vol"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              setMuted(Number(e.target.value) === 0);
            }}
            aria-label="Volume"
          />
          <button className="icon-btn" onClick={pip} aria-label="Picture in picture"><Icon name="pip" /></button>
          <button className="icon-btn" onClick={fullscreen} aria-label="Full screen"><Icon name="full" /></button>
        </div>
      </div>
      <p className="keys">Space play or pause, arrows skip 5 s, comma and period step one frame, F full screen.</p>
    </div>
  );
}
