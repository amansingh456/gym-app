# Cut 8: 8-week fat loss tracker

React + Vite. No new dependencies, so your existing `node_modules` works.

## Install the update
1. Copy `src/`, `index.html` and `public/exercise/` from this zip into your project (replace the old `src` folder).
2. Keep your `public/video` and `public/image` folders as they are.
3. `npm run dev`

## What's where
- `src/data/program.js`: exercises, sets, reps, diet, default habits, video and photo lists. Edit here.
- `public/exercise/*.gif`: demo GIFs, built from the public-domain Free Exercise DB.
- YouTube Shorts per exercise are in the `YT` list at the bottom of `src/data/program.js`. Swap any video by pasting a new 11-character ID.
- Your data (checklist, sets, water, weights) is saved in the browser on that device.

## Daily checklist
Keyed by date, so it starts empty every day at midnight. Past days feed the streak and the heatmap on the Progress tab.

## Video player shortcuts
Space play/pause, arrows skip 5 s, `,` and `.` step one frame, `F` full screen. Use "Set loop start / end" to repeat one rep, and "Mirror" to match your own camera view.
