import { useState } from 'react';
import { YT, gifSrc } from '../data/program';

// Real demo for one exercise: looping GIF, numbered cues, and embedded YouTube Shorts.
export default function ExerciseDemo({ ex, onLocalVideo }) {
  const shorts = (ex.yt || []).map((k) => YT[k]).filter(Boolean);
  const [pick, setPick] = useState(0);
  const [play, setPlay] = useState(false);
  const short = shorts[pick];

  return (
    <div className="demo">
      <div className="demo-left">
        {ex.gif && (
          <figure className="demo-gif">
            <img src={gifSrc(ex.gif)} alt={`${ex.name}: start and end position`} />
            <figcaption>Start and end position, looping</figcaption>
          </figure>
        )}
        <div className="demo-info">
          <p className="demo-dose">{ex.kind === 'cardio' ? ex.reps : `${ex.sets ?? ex.base ?? 3} × ${ex.reps}`}{ex.rest ? `, rest ${ex.rest} s` : ''}</p>
          <ol className="cue-list">
            {ex.cues.map((c, i) => <li key={c}><span className="cue-num">{i + 1}</span>{c}</li>)}
          </ol>
          {ex.video && onLocalVideo && (
            <button className="chip" onClick={() => onLocalVideo(ex.video)}>Play my saved video</button>
          )}
        </div>
      </div>

      {short && (
        <div className="demo-short">
          {shorts.length > 1 && (
            <div className="short-tabs" role="tablist" aria-label="Choose a video">
              {shorts.map((s, i) => (
                <button key={s.id} role="tab" aria-selected={i === pick} className={i === pick ? 'chip on' : 'chip'}
                  onClick={() => { setPick(i); setPlay(false); }}>
                  {s.title.split(' ').slice(0, 2).join(' ')}
                </button>
              ))}
            </div>
          )}
          <div className="short-frame">
            {play ? (
              <iframe
                key={short.id}
                src={`https://www.youtube-nocookie.com/embed/${short.id}?autoplay=1&rel=0&playsinline=1`}
                title={short.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <button className="short-poster" onClick={() => setPlay(true)} aria-label={`Play ${short.title}`}>
                <img src={`https://i.ytimg.com/vi/${short.id}/hqdefault.jpg`} alt="" />
                <span className="big-play" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                </span>
              </button>
            )}
          </div>
          <p className="short-meta">
            {short.title} <span className="dim">by {short.by}</span>
          </p>
          <a className="link" href={`https://www.youtube.com/shorts/${short.id}`} target="_blank" rel="noreferrer">Open on YouTube</a>
        </div>
      )}
    </div>
  );
}
