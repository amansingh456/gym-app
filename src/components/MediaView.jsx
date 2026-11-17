import { useState } from 'react';
import { LIBRARY, PHOTOS, VIDEOS, thumbSrc } from '../data/program';
import VideoPlayer from './VideoPlayer';
import ExerciseDemo from './ExerciseDemo';

const TABS = [
  { id: 'videos', label: 'My videos' },
  { id: 'library', label: 'Exercise library' },
  { id: 'photos', label: 'Photos' },
];

export default function MediaView({ tab, onTab, videoIndex, onVideoIndex, onLocalVideo }) {
  const [exId, setExId] = useState(LIBRARY[0].id);
  const [photo, setPhoto] = useState(null);
  const ex = LIBRARY.find((e) => e.id === exId);

  return (
    <div className="view media-view">
      <div className="seg-tabs" role="tablist" aria-label="Media type">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'on' : ''} onClick={() => onTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'videos' && (
        <div className="video-layout">
          <VideoPlayer items={VIDEOS} index={videoIndex} onIndex={onVideoIndex} />
          <aside className="playlist" aria-label="Video list">
            <h2>{VIDEOS.length} videos</h2>
            <ol>
              {VIDEOS.map((v, i) => (
                <li key={v.id}>
                  <button className={i === videoIndex ? 'pl-item on' : 'pl-item'} onClick={() => onVideoIndex(i)} aria-current={i === videoIndex}>
                    <video src={`${v.src}#t=1`} preload="metadata" muted playsInline tabIndex={-1} aria-hidden="true" />
                    <span>{v.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      )}

      {tab === 'library' && (
        <div className="library">
          <section className="panel">
            <header className="panel-head"><h2>{ex.name}</h2></header>
            <ExerciseDemo key={ex.id} ex={ex} onLocalVideo={onLocalVideo} />
          </section>
          <div className="lib-grid" role="list">
            {LIBRARY.map((e) => (
              <button key={e.id} role="listitem" className={e.id === exId ? 'lib-card on' : 'lib-card'}
                onClick={() => { setExId(e.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                {thumbSrc(e) && <img src={thumbSrc(e)} alt="" loading="lazy" />}
                <span>{e.name}</span>
              </button>
            ))}
          </div>
          <p className="dim credit">Demo GIFs are made from the public-domain Free Exercise DB. Videos are YouTube Shorts from the creators named under each one.</p>
        </div>
      )}

      {tab === 'photos' && (
        <div className="photo-grid">
          {PHOTOS.map((p, i) => (
            <button key={p.src} className="photo" onClick={() => setPhoto(i)}>
              <img src={p.src} alt={p.title} loading="lazy" />
              <span>{p.title}</span>
            </button>
          ))}
          <p className="dim photo-tip">Add your own shots to public/image and list them in src/data/program.js.</p>
        </div>
      )}

      {photo != null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={PHOTOS[photo].title} onClick={() => setPhoto(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setPhoto(null);
            if (e.key === 'ArrowRight') setPhoto((photo + 1) % PHOTOS.length);
            if (e.key === 'ArrowLeft') setPhoto((photo - 1 + PHOTOS.length) % PHOTOS.length);
          }}
          tabIndex={-1}
          ref={(el) => el?.focus()}
        >
          <button className="lb-nav prev" onClick={(e) => { e.stopPropagation(); setPhoto((photo - 1 + PHOTOS.length) % PHOTOS.length); }} aria-label="Previous photo">‹</button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={PHOTOS[photo].src} alt={PHOTOS[photo].title} />
            <figcaption>{PHOTOS[photo].title} <span className="dim">{photo + 1} of {PHOTOS.length}</span></figcaption>
          </figure>
          <button className="lb-nav next" onClick={(e) => { e.stopPropagation(); setPhoto((photo + 1) % PHOTOS.length); }} aria-label="Next photo">›</button>
          <button className="lb-close" onClick={() => setPhoto(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
