import { useState } from 'react';
import FormFigure from './FormFigure';
import { POSES } from '../data/poses';

// Figure plus playback controls and the numbered cue list that matches the dots.
export default function FormGuide({ poseId }) {
  const pose = POSES[poseId];
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [ghost, setGhost] = useState(true);
  if (!pose) return null;
  return (
    <div className="form-guide">
      <div className="form-stage">
        <FormFigure poseId={poseId} playing={playing} speed={speed} showGhost={ghost} />
      </div>
      <div className="form-side">
        <h3>{pose.title}</h3>
        <p className="tempo">Tempo: {pose.tempo}</p>
        <ol className="cue-list">
          {pose.cues.map((c, i) => (
            <li key={c}><span className="cue-num">{i + 1}</span>{c}</li>
          ))}
        </ol>
        <div className="form-controls">
          <button className="chip" onClick={() => setPlaying((p) => !p)} aria-pressed={!playing}>
            {playing ? 'Pause' : 'Play'}
          </button>
          {[0.5, 1].map((s) => (
            <button key={s} className={`chip ${speed === s ? 'on' : ''}`} onClick={() => setSpeed(s)}>
              {s === 0.5 ? 'Slow' : 'Normal'}
            </button>
          ))}
          <button className={`chip ${ghost ? 'on' : ''}`} onClick={() => setGhost((g) => !g)}>
            Start and end outlines
          </button>
        </div>
        <p className="form-note">Dashed outlines show the start and end positions. Film a set from the side and compare your angles.</p>
      </div>
    </div>
  );
}
