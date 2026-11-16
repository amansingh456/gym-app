import { useState } from 'react';
import { PHOTOS, VIDEOS } from '../data/program';
import { POSES } from '../data/poses';
import VideoPlayer from './VideoPlayer';
import FormFigure from './FormFigure';
import FormGuide from './FormGuide';

const TABS = [
  { id: 'videos', label: 'Videos' },
  { id: 'form', label: 'Form guides' },
  { id: 'photos', label: 'Photos' },
];

export default function MediaView({ tab, onTab, videoIndex, onVideoIndex }) {
  const [pose, setPose] = useState('squat');
  const [photo, setPhoto] = useState(null);

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

      {tab === 'form' && (
        <div className="form-layout">
          <section className="panel">
            <FormGuide poseId={pose} key={pose} />
          </section>
          <div className="pose-grid" role="list">
            {Object.entries(POSES).map(([id, p]) => (
              <button key={id} role="listitem" className={id === pose ? 'pose-card on' : 'pose-card'} onClick={() => setPose(id)}>
                <FormFigure poseId={id} playing={false} compact showGhost={false} />
                <span>{p.title}</span>
              </button>
            ))}
          </div>
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
