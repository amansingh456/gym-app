
import { useState } from 'react';
import './App.css';


const IMAGES = [
  '/image/general.jpeg',
  '/image/hair.jpeg',
  '/image/latpulldown.jpeg',
  '/image/trademil.jpeg',
];

const VIDEOS = [
  '/video/abs.mp4',
  '/video/benchPress.mp4',
  '/video/hanuman-dand.mp4',
  '/video/kegel2.mp4',
  '/video/kegel3.mp4',
  '/video/kegel4.mp4',
  '/video/latpullDown.mp4',
  '/video/plank.mp4',
  '/video/pullUps.mp4',
  '/video/shoulder.mp4',
  '/video/sittedRow.mp4',
  '/video/tri.mp4',
  '/video/abs3.mp4',
  '/video/cardio.mp4',
  '/video/dips.mp4',
  '/video/pullUps2.mp4',
  '/video/pullUps3.mp4',
  '/video/pushup.mp4',
];

function App() {
  const [currentPage, setCurrentPage] = useState('main');
  const [modalImage, setModalImage] = useState(null);

  const cleanFileName = (fullPath) => {

    let withoutExtension = fullPath.substring(0, fullPath.lastIndexOf('.'));

    let baseFileName = withoutExtension.substring(withoutExtension.lastIndexOf('/') + 1);

    return baseFileName;
  }

  return (
    <div className="app">
      {/* Main Page */}
      {currentPage === 'main' && (
        <div className="container">
          <div className="header">
            <h1 className="main-title" contentEditable suppressContentEditableWarning>
              Premium Gym Plan
            </h1>
            <p className="subtitle" contentEditable suppressContentEditableWarning>
              12-Week Transformation • 5 Strength Days + Weekend Cardio
            </p>
            <div className="nav-buttons">
              <button className="nav-btn img-btn" onClick={() => setCurrentPage('images')}>
                📷 Images
              </button>
              <button className="nav-btn vid-btn" onClick={() => setCurrentPage('videos')}>
                🎥 Videos
              </button>
            </div>
          </div>



        <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Saturday & Sunday</h2>
              </div>
            </div>
            <div className="warmup-grid">
              <div className="warmup-item">300 Jumping Jacks</div>
              <div className="warmup-item">150 High Knees</div>
              <div className="warmup-item">50 Pushups</div>
              <div className="warmup-item">50 Squats</div>
              <div className="warmup-item">Few Pullups</div>

            </div>

            <div className="warmup-grid">
              <div className="warmup-item">10 Pushups * 15 leg-raises  * 20 sec hollow hold * 40 mountain climbing * Plank 1 mint ( *3 )</div>
            </div>
          </div>  



          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Warm Up</h2>
              </div>
            </div>
            <div className="warmup-grid">
              <div className="warmup-item">100 Jumping Jacks</div>
              <div className="warmup-item">100 High Knees</div>
              <div className="warmup-item">50 Pushups</div>
              <div className="warmup-item">50 Squats</div>
              <div className="warmup-item">Few Pullups</div>
            </div>
          </div>

          {/* Warm-up Section */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">After Excersice</h2>
              </div>
            </div>
            <div className="warmup-grid">
              <div className="warmup-item">Crunches - 15*3</div>
              <div className="warmup-item">Russian Twister - 15*3</div>
              <div className="warmup-item">Leg Raises - 15*3</div>
              <div className="warmup-item">Plank - 40 sec * 3</div>
              <div className="warmup-item">Kegel - (Hanuman Dand, Lunges, Reverse Hip thrust, Knee Support Pelvic press, Butterfly)</div>
              <div className="warmup-item">Cat & Camel</div>
            </div>
          </div>

          {/* Day 1 */}
          <div className="card gradient-2">
            <div className="card-header">
              <h2 className="card-title">Day 1 — Tuesday</h2>
              <span className="badge pink">Back & Tricep</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Muscle</th>
                  <th>Exercise</th>
                  <th>Sets × Reps</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Back</td><td>Bench Press</td><td>4 × 10</td></tr>
                <tr><td></td><td>Incline Bench Press</td><td>4 × 12</td></tr>
                <tr><td></td><td>Chest Fly</td><td>3 × 8</td></tr>
              </tbody>
              <tbody>
                <tr><td>Tricep</td><td>Bench Dip</td><td>4 × 10</td></tr>
                <tr><td></td><td>Overhead Tricep Extension</td><td>4 × 12</td></tr>
                <tr><td></td><td>Tricep Cable Extension</td><td>3 × 8</td></tr>
              </tbody>
            </table>
          </div>

          {/* Day 2 & 3 Grid */}
          <div className="grid">
            <div className="card gradient-3">
              <div className="card-header">
                <div>
                  <h2 className="card-title">Day 2 — Wednesday</h2>
                  <span className="badge cyan">Back & Biceps</span>
                </div>
              </div>
              <table>
                <thead>
                  <tr><th>Muscle</th><th>Exercise</th><th>Sets × Reps</th></tr>
                </thead>
                <tbody>
                  <tr><td>Back</td><td>Dumbbell Shoulder Press</td><td>4 × 10</td></tr>
                  <tr><td></td><td>Side Lateral Raise</td><td>4 × 15</td></tr>
                  <tr><td></td><td>Front Raise</td><td>3 × 12</td></tr>
                   <tr><td>Biceps</td><td>Barbell Curl</td><td>3 × 12</td></tr>
                  <tr><td></td><td>Hammer Curl</td><td>3 × 12</td></tr>
                  <tr><td></td><td>Cable Curl</td><td>2 × 15</td></tr>
                </tbody>
              </table>
            </div>

            <div className="card gradient-4">
              <div className="card-header">
                <div>
                  <h2 className="card-title">Day 3 — Thursday</h2>
                  <span className="badge green">Shoulders & Legs</span>
                </div>
              </div>
              <table>
                <thead>
                  <tr><th>Muscle</th><th>Exercise</th><th>Sets × Reps</th></tr>
                </thead>
                <tbody>
                  <tr><td>Shoulders</td><td>Dumbbell Shoulder Press</td><td>4 × 10</td></tr>
                  <tr><td></td><td>Side Lateral Raise</td><td>4 × 15</td></tr>
                  <tr><td></td><td>Front Raise</td><td>3 × 12</td></tr>

                  <tr><td>Legs</td><td>Squats</td><td>4 × 10</td></tr>
                  <tr><td></td><td>Leg Press</td><td>4 × 12</td></tr>
                  <tr><td></td><td>Leg Extension</td><td>3 × 15</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Images Page */}
      {currentPage === 'images' && (
        <div className="container">
          <button className="back-btn" onClick={() => setCurrentPage('main')}>
            ← Back to Home
          </button>
          <h1 className="page-title">📷 Progress Images</h1>
          <div className="gallery-container">
            {IMAGES.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--muted)', gridColumn: '1/-1' }}>
                No images yet. Add images to public/images/ folder
              </p>
            ) : (
              IMAGES.map((img, index) => (

                <div
                  key={index}
                  className="gallery-item"
                  onClick={() => setModalImage(img)}
                >
                  <img src={img} alt={`Progress ${index + 1}`} />
                  <h1>{cleanFileName(img)}</h1>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Videos Page */}
      {currentPage === 'videos' && (
        <div className="container">
          <button className="back-btn" onClick={() => setCurrentPage('main')}>
            ← Back to Home
          </button>
          <h1 className="page-title">🎥 Workout Videos</h1>
          <div className="gallery-container">
            {VIDEOS.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--muted)', gridColumn: '1/-1' }}>
                No videos yet. Add videos to public/videos/ folder
              </p>
            ) : (
              VIDEOS.map((vid, index) => (

                <div key={index} className="video-item">
                  <video src={vid} controls preload="metadata" />
                  <h1>{cleanFileName(vid)}</h1>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Image Modal */}
      {modalImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Full view"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              borderRadius: '12px',
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;