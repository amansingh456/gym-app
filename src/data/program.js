// Everything the app knows about the 8-week plan lives here.
// Edit numbers in this file and every screen updates.

export const PROFILE = {
  startWeight: 98,
  goalWeight: 92,
  height: "6'3\"",
  calories: '2,000–2,200 kcal',
  protein: '120–140 g',
};

export const PHASES = [
  {
    id: 'foundation',
    name: 'Foundation',
    weeks: [1, 2],
    effort: 'Pick weights where the last rep feels like a 7 out of 10',
    note: 'Learn each movement with light weights. Sore muscles are normal.',
  },
  {
    id: 'build',
    name: 'Build',
    weeks: [3, 4, 5],
    effort: 'Pick weights where the last rep feels like an 8 out of 10',
    note: 'When you hit every target rep in a session, go up in weight next time.',
  },
  {
    id: 'push',
    name: 'Push',
    weeks: [6, 7, 8],
    effort: 'Pick weights where the last rep feels like a 9 out of 10',
    note: 'Heaviest weeks. Keep form strict even when it gets hard.',
  },
];

export function phaseForWeek(week) {
  const w = Math.min(Math.max(week, 1), 8);
  return PHASES.find((p) => p.weeks.includes(w));
}

// Plank starts at 30 s and adds 10 s each week, capped at 90 s.
export const plankSeconds = (week) => Math.min(30 + (Math.min(Math.max(week, 1), 8) - 1) * 10, 90);

// kind: 'strength' (sets with a rep target per set), 'move' (one round of reps),
//       'cardio' (one block), 'circuit' (rounds)
const CHEST = [12, 10, 12];
const ARMS = [12, 10, 8, 8];

const EX = {
  // Daily warm-up
  jumpingJacks: { name: 'Jumping jacks', kind: 'move', reps: '50', yt: ['jumpingJacks'], cues: ['Land softly on the balls of your feet', 'Arms fully overhead each rep', 'Steady rhythm, keep breathing'] },
  bwSquat: { name: 'Bodyweight squats', kind: 'move', reps: '20', gif: 'bw-squat', yt: ['bwSquat'], cues: ['Feet shoulder-width, toes slightly out', 'Sit back and down, chest up', 'Push through your whole foot'] },
  highKnees: { name: 'High knees', kind: 'move', reps: '50', yt: ['highKnees'], cues: ['Knees up to hip height', 'Stay on the balls of your feet', 'Pump your arms'] },
  burpee: { name: 'Burpees', kind: 'move', reps: '20', yt: ['burpee'], cues: ['Hands down, jump or step back to a plank', 'Chest to floor or a push-up', 'Jump up and clap overhead'] },
  pushup: { name: 'Push-ups', kind: 'move', reps: '20', gif: 'pushups', yt: ['pushup'], cues: ['Body in one straight line', 'Elbows about 45° from your body', 'Drop to your knees when form breaks'] },
  pullup: { name: 'Pull-ups', kind: 'move', reps: '10', gif: 'pullups', yt: ['pullup'], video: 'pullUps', cues: ['Start from a dead hang', 'Chest toward the bar', 'Use a band or slow negatives if needed'] },

  // Chest, 3 sets: 12, 10, 12
  flatPress: { name: 'Flat dumbbell bench press', repsList: CHEST, rest: 90, gif: 'chest-press', yt: ['chestPress'], video: 'benchPress', cues: ['Shoulder blades pinned to the bench', 'Elbows about 45° from your body', 'Feet planted the whole set'] },
  inclinePress: { name: 'Incline dumbbell press', repsList: CHEST, rest: 90, gif: 'incline-press', yt: ['inclinePress'], cues: ['Bench at 30°', 'Lower to your upper chest', 'Press up and slightly back'] },
  pecDeck: { name: 'Pec deck fly', repsList: CHEST, rest: 75, gif: 'pec-deck', yt: ['pecDeck'], cues: ['Slight bend in the elbows, locked in', 'Squeeze hands together for 1 second', 'Control the way back'] },
  cableCross: { name: 'Cable crossover', repsList: CHEST, rest: 75, gif: 'cable-crossover', yt: ['cableCross'], cues: ['Small forward lean, one foot ahead', 'Hug a big tree, hands meet low', 'Feel the stretch on the way back'] },

  // Triceps, 4 sets: 12, 10, 8, 8
  pushdown: { name: 'Rope triceps pushdown', repsList: ARMS, rest: 60, gif: 'pushdown', yt: ['pushdown'], video: 'tri', cues: ['Elbows pinned to your sides', 'Spread the rope at the bottom', 'Stay upright, don’t lean over'] },
  overheadTri: { name: 'Overhead dumbbell triceps extension', repsList: ARMS, rest: 60, gif: 'overhead-tri', yt: ['overheadTri'], cues: ['Elbows point forward, not out', 'Lower behind your head', 'Full lockout at the top'] },
  benchDips: { name: 'Bench dips', repsList: ARMS, rest: 60, gif: 'bench-dips', yt: ['benchDips'], video: 'dips', cues: ['Hands shoulder-width on the bench edge', 'Lower until elbows reach 90°', 'Keep your back close to the bench'] },

  // Back, 3 sets: 12, 10, 12
  latPulldown: { name: 'Lat pulldown', repsList: CHEST, rest: 90, gif: 'lat-pulldown', yt: ['latPulldown'], video: 'latpullDown', cues: ['Pull the bar to your upper chest', 'Drive elbows down and back', 'Small lean back, no swinging'] },
  cableRow: { name: 'Seated cable row', repsList: CHEST, rest: 90, gif: 'cable-row', yt: ['cableRow'], video: 'sittedRow', cues: ['Sit tall, no rocking', 'Pull to your lower ribs', 'Squeeze shoulder blades together'] },
  oneArmRow: { name: 'One-arm dumbbell row', repsList: CHEST, rest: 75, gif: 'one-arm-row', yt: ['oneArmRow'], cues: ['Back flat, chest square to the floor', 'Pull your elbow toward your hip', 'No twisting through the torso'] },
  straightArm: { name: 'Straight-arm pulldown', repsList: CHEST, rest: 75, gif: 'straight-arm-pulldown', yt: ['straightArm'], cues: ['Arms nearly straight the whole rep', 'Sweep the bar down to your thighs', 'Hips back slightly, chest proud'] },

  // Biceps, 4 sets: 12, 10, 8, 8
  dbCurl: { name: 'Dumbbell curl', repsList: ARMS, rest: 60, gif: 'db-curl', yt: ['dbCurl'], cues: ['Elbows stay still at your sides', 'Lower slowly, 2 seconds', 'No hip swing'] },
  hammerCurl: { name: 'Hammer curl', repsList: ARMS, rest: 60, gif: 'hammer-curl', yt: ['hammerCurl'], video: 'forarms', cues: ['Thumbs up the whole rep', 'Elbows stay still', 'Lower slowly'] },
  preacher: { name: 'Preacher curl', repsList: ARMS, rest: 60, gif: 'preacher-curl', yt: ['preacher'], cues: ['Armpits snug on the pad', 'Don’t fully lock out at the bottom', 'Squeeze at the top'] },

  // Shoulders, 3 sets: 12, 10, 12
  shoulderPress: { name: 'Dumbbell shoulder press', repsList: CHEST, rest: 90, gif: 'shoulder-press', yt: ['shoulderPress'], video: 'shoulder', cues: ['Ribs down, core braced', 'Press straight overhead', 'Glutes stay on the bench'] },
  lateralRaise: { name: 'Lateral raise', repsList: CHEST, rest: 60, gif: 'lateral-raise', yt: ['lateralRaise'], cues: ['Lead with your elbows', 'Stop at shoulder height', 'Shoulders down, no shrugging'] },
  facePull: { name: 'Face pull', repsList: CHEST, rest: 60, gif: 'face-pull', yt: ['facePull'], cues: ['Rope at eye level', 'Pull hands apart toward your ears', 'Pause and squeeze the upper back'] },

  // Legs, 4 sets: 12, 10, 8, 8
  legPress: { name: 'Leg press', repsList: ARMS, rest: 90, gif: 'leg-press', yt: ['legPress'], cues: ['Feet shoulder-width, mid-platform', 'Lower until knees reach about 90°', 'Don’t lock knees hard at the top'] },
  rdl: { name: 'Dumbbell Romanian deadlift', repsList: ARMS, rest: 90, gif: 'rdl', yt: ['rdl'], cues: ['Push hips back like closing a door', 'Back flat, neck neutral', 'Dumbbells slide close to your legs'] },
  lunge: { name: 'Walking lunges', repsList: ARMS, repsUnit: 'each leg', rest: 90, gif: 'lunge', yt: ['lunge'], video: 'hanuman-dand', cues: ['Front knee over your mid-foot', 'Torso tall', 'Back knee hovers just off the floor'] },

  // Cardio and core
  inclineWalk: { name: 'Incline treadmill walk', kind: 'cardio', reps: '45 min', gif: 'incline-walk', yt: ['inclineWalk'], video: 'cardio', cues: ['Incline 8–10, speed 5–5.5 km/h', 'Hands off the rails', 'A pace you can talk at, not sing'] },
  inclineWalk30: { name: 'Incline treadmill walk', kind: 'cardio', reps: '30 min', gif: 'incline-walk', yt: ['inclineWalk'], video: 'cardio', cues: ['Incline 10–12, speed 5–5.5 km/h', 'Hands off the rails', 'Push the pace in the last 10 minutes'] },
  coreCircuit: { name: 'Core circuit: plank, side plank, dead bug, bird dog', kind: 'circuit', rounds: 3, reps: '3 rounds', gif: 'dead-bug', yt: ['plank', 'sidePlank', 'deadBug', 'birdDog'], video: 'abs', cues: ['30 s each move, 15 s between', 'Low back stays flat in dead bug', 'Move slowly and breathe out on effort'] },

  // Saturday fat-burn circuit, 4 rounds
  thruster: { name: 'Dumbbell thrusters', kind: 'circuit', rounds: 4, reps: '12 per round', gif: 'thruster', yt: ['thruster'], cues: ['Squat, then drive the weights overhead in one move', 'Use the leg drive, not just arms', 'Elbows high at the bottom'] },
  kbSwing: { name: 'Kettlebell swings', kind: 'circuit', rounds: 4, reps: '15 per round', gif: 'kb-swing', yt: ['swing'], cues: ['Hinge at the hips, not a squat', 'Snap hips forward to float the bell', 'Arms stay relaxed'] },
  stepUp: { name: 'Dumbbell step-ups', kind: 'circuit', rounds: 4, reps: '10 each leg', gif: 'step-up', yt: ['stepUp'], cues: ['Whole foot on the box', 'Drive through the top leg', 'Step down slowly'] },
  mountain: { name: 'Mountain climbers', kind: 'circuit', rounds: 4, reps: '30 s per round', gif: 'mountain-climber', yt: ['mountain'], cues: ['Shoulders over your hands', 'Hips low and level', 'Fast knees, steady breathing'] },
  burpeeRound: { name: 'Burpees', kind: 'circuit', rounds: 4, reps: '10 per round', yt: ['burpee'], cues: ['Hands down, jump or step back', 'Chest to floor or a push-up', 'Jump up and clap overhead'] },

  // Sunday cardio burn
  rower: { name: 'Rowing machine', kind: 'cardio', reps: '10 min', gif: 'rower', yt: ['rower'], cues: ['Legs, then body, then arms', 'Reverse on the way back', 'Aim for 24–28 strokes per minute'] },
  intervals: { name: 'Bike intervals: 30 s hard, 90 s easy', kind: 'circuit', rounds: 10, reps: '10 rounds', gif: 'bike', yt: ['intervals'], cues: ['Hard means you can’t talk', 'Easy means full recovery', 'Stop at 8 if form or pace drops'] },

  // Daily cool-down
  kegelHold: { name: 'Kegel holds', kind: 'circuit', rounds: 3, reps: '10 squeezes, hold 5 s', yt: ['kegelHold'], video: 'kegel2', cues: ['Squeeze as if stopping urine midstream', 'Hold 5 s, relax 5 s', 'Don’t squeeze glutes or hold your breath'] },
  kegelQuick: { name: 'Kegel quick squeezes', kind: 'circuit', rounds: 3, reps: '10 fast squeezes', yt: ['kegelQuick'], video: 'kegel3', cues: ['Squeeze hard and let go right away', '1 second per squeeze', 'Full relax between sets'] },
  plank: { name: 'Plank', kind: 'cardio', reps: '30 s', gif: 'plank', yt: ['plank'], video: 'plank', cues: ['Elbows under shoulders', 'Hips level, no sag or pike', 'Squeeze glutes and thighs'] },
};

const pick = (section, ids) => ids.map((id) => ({ id, section, kind: 'strength', ...EX[id] }));
const WARMUP = pick('Warm-up', ['jumpingJacks', 'bwSquat', 'highKnees', 'burpee', 'pushup', 'pullup']);
const COOLDOWN = pick('Cool-down', ['kegelHold', 'kegelQuick', 'plank']);

export const SCHEDULE = [
  { day: 'Mon', full: 'Monday', title: 'Rest day', tag: 'Recover', items: [], rest: true },
  { day: 'Tue', full: 'Tuesday', title: 'Chest + triceps', tag: 'Chest 3 sets of 12, 10, 12. Triceps 4 sets of 12, 10, 8, 8', main: 'Chest + triceps',
    items: [...WARMUP, ...pick('Chest', ['flatPress', 'inclinePress', 'pecDeck', 'cableCross']), ...pick('Triceps', ['pushdown', 'overheadTri', 'benchDips']), ...COOLDOWN] },
  { day: 'Wed', full: 'Wednesday', title: 'Back + biceps', tag: 'Back 3 sets of 12, 10, 12. Biceps 4 sets of 12, 10, 8, 8', main: 'Back + biceps',
    items: [...WARMUP, ...pick('Back', ['latPulldown', 'cableRow', 'oneArmRow', 'straightArm']), ...pick('Biceps', ['dbCurl', 'hammerCurl', 'preacher']), ...COOLDOWN] },
  { day: 'Thu', full: 'Thursday', title: 'Cardio + core', tag: 'Steady burn', main: 'Cardio + core',
    items: [...WARMUP, ...pick('Cardio', ['inclineWalk']), ...pick('Core', ['coreCircuit']), ...COOLDOWN] },
  { day: 'Fri', full: 'Friday', title: 'Shoulders + legs', tag: 'Shoulders 3 sets of 12, 10, 12. Legs 4 sets of 12, 10, 8, 8', main: 'Shoulders + legs',
    items: [...WARMUP, ...pick('Shoulders', ['shoulderPress', 'lateralRaise', 'facePull']), ...pick('Legs', ['legPress', 'rdl', 'lunge']), ...COOLDOWN] },
  { day: 'Sat', full: 'Saturday', title: 'Fat-burn circuit', tag: '4 rounds, rest 60 s between rounds, then cardio', main: 'Circuit + cardio',
    items: [...WARMUP, ...pick('Circuit, 4 rounds', ['thruster', 'kbSwing', 'stepUp', 'mountain', 'burpeeRound']), ...pick('Cardio', ['inclineWalk30']), ...COOLDOWN] },
  { day: 'Sun', full: 'Sunday', title: 'Cardio burn', tag: 'Row, intervals, incline walk, core', main: 'Cardio + core',
    items: [...WARMUP, ...pick('Cardio', ['rower', 'intervals', 'inclineWalk30']), ...pick('Core', ['coreCircuit']), ...COOLDOWN] },
];

// Rough minutes for each part of the session, for the bar at the top of a workout.
export function sessionBlocks(day) {
  return [
    { label: 'Warm-up', min: 15, tone: 'violet' },
    { label: day.main || 'Main workout', min: 65, tone: 'ice' },
    { label: 'Kegels + plank', min: 10, tone: 'amber' },
  ];
}

// Returns a weekday's workout with sets filled in. Only the plank time changes by week.
export function workoutFor(weekdayIdx, week) {
  const day = SCHEDULE[weekdayIdx];
  const items = day.items.map((it) => {
    if (it.id === 'plank') return { ...it, sets: 1, reps: `${plankSeconds(week)} s` };
    if (it.repsList) return { ...it, sets: it.repsList.length, reps: it.repsList.join(', ') + (it.repsUnit ? ` ${it.repsUnit}` : '') };
    if (it.kind === 'circuit') return { ...it, sets: it.rounds };
    return { ...it, sets: 1 };
  });
  return { ...day, items };
}

export const DIET = [
  {
    id: 'pre', time: '6:30', name: 'Before gym',
    items: [{ name: 'Black coffee, 1 cup', kcal: 5, protein: 0 }],
  },
  {
    id: 'post', time: '8:30', name: 'After workout',
    items: [
      { name: 'Whey protein, 1 scoop', kcal: 120, protein: 24 },
      { name: 'Apple or guava', kcal: 90, protein: 0 },
      { name: '6 kaju + 6 badam', kcal: 100, protein: 3 },
    ],
  },
  {
    id: 'lunch', time: '13:30', name: 'Lunch',
    items: [
      { name: '2 chapati', kcal: 240, protein: 8 },
      { name: 'Dal, 1 bowl', kcal: 170, protein: 9 },
      { name: 'Soya chunk curry (30 g dry), replaces extra curry', kcal: 170, protein: 15, swap: true },
      { name: 'Curd, 200 g', kcal: 120, protein: 7, swap: true },
    ],
  },
  {
    id: 'snack', time: '17:30', name: 'Evening snack',
    items: [
      { name: 'Pumpkin + sunflower seeds, anjeer, kismis', kcal: 170, protein: 5 },
      { name: 'Roasted chana, 30 g', kcal: 110, protein: 6, swap: true },
    ],
  },
  {
    id: 'dinner', time: '20:30', name: 'Dinner',
    items: [
      { name: '2 chapati', kcal: 240, protein: 8 },
      { name: 'Dal, 1 bowl', kcal: 170, protein: 9 },
      { name: 'White rice, ½ bowl', kcal: 100, protein: 2 },
      { name: 'Paneer, 100 g (up from 50 g)', kcal: 270, protein: 19, swap: true },
    ],
  },
];

export const DIET_COMPARE = [
  { label: 'Your original plan', kcal: 1700, protein: 80 },
  { label: 'Revised plan', kcal: 2075, protein: 115 },
];

export const TARGETS = { kcalMin: 2000, kcalMax: 2200, proteinMin: 120, proteinMax: 140 };

export const DEFAULT_HABITS = [
  { id: 'coffee', label: 'Black coffee before the gym', group: 'Morning', gymDay: true },
  { id: 'workout', label: 'Finish today’s session', group: 'Morning', gymDay: true },
  { id: 'weigh', label: 'Morning weigh-in', group: 'Morning', auto: 'weight' },
  { id: 'shake', label: 'Whey + fruit + 6 kaju + 6 badam', group: 'Food' },
  { id: 'lunch', label: 'Lunch with soya curry and curd', group: 'Food' },
  { id: 'snack', label: 'Seeds snack + roasted chana', group: 'Food' },
  { id: 'dinner', label: 'Dinner with 100 g paneer', group: 'Food' },
  { id: 'protein', label: 'Hit 120 g protein', group: 'Food' },
  { id: 'oil', label: 'Oil and ghee under 4 tsp', group: 'Food' },
  { id: 'water', label: 'Drink 3 L of water', group: 'Recovery', auto: 'water' },
  { id: 'core', label: 'Plank + kegels', group: 'Recovery' },
  { id: 'walk', label: 'Evening walk, 5–6 km', group: 'Recovery' },
  { id: 'sleep', label: 'Lights out for 7–8 h of sleep', group: 'Recovery' },
];

// Gym-only habits are hidden on rest days and don't count toward that day's score.
export function habitsForDay(habits, isRestDay) {
  return isRestDay ? habits.filter((h) => !h.gymDay) : habits;
}

export const WATER = { glassMl: 300, goal: 12, doneAt: 10 };

const VIDEO_TITLES = {
  abs: 'Abs',
  abs3: 'Abs, part 3',
  benchPress: 'Bench press',
  cardio: 'Cardio',
  dips: 'Dips',
  forarms: 'Forearms',
  'hanuman-dand': 'Hanuman dand',
  kegel2: 'Kegel routine 2',
  kegel3: 'Kegel routine 3',
  kegel4: 'Kegel routine 4',
  latpullDown: 'Lat pulldown',
  plank: 'Plank',
  pullUps: 'Pull-ups 1',
  pullUps2: 'Pull-ups 2',
  pullUps3: 'Pull-ups 3',
  pushup: 'Push-ups',
  shoulder: 'Shoulder press',
  sittedRow: 'Seated row',
  tri: 'Triceps',
};

export const VIDEOS = [
  'latpullDown', 'benchPress', 'sittedRow', 'shoulder', 'tri', 'pullUps', 'pullUps2', 'pullUps3',
  'plank', 'abs', 'abs3', 'cardio', 'dips', 'pushup', 'hanuman-dand', 'forarms', 'kegel2', 'kegel3', 'kegel4',
].map((id) => ({ id, title: VIDEO_TITLES[id] || id, src: `/video/${id}.mp4` }));

export const PHOTOS = [
  { src: '/image/latpulldown.jpeg', title: 'Lat pulldown' },
  { src: '/image/trademil.jpeg', title: 'Treadmill' },
  { src: '/image/general.jpeg', title: 'General' },
  { src: '/image/hair.jpeg', title: 'Hair' },
];

// YouTube Shorts per exercise. Each link was checked to be live and embeddable on 16 Nov 2026.
// To swap one, paste the 11-character ID from youtube.com/shorts/<ID>.
export const YT = {
  jumpingJacks: { id: 'uLVt6u15L98', title: 'How to do a jumping jack', by: 'NASM' },
  bwSquat: { id: '3fl7uYmiMVw', title: 'Bodyweight squat', by: 'Girls Gone Strong' },
  highKnees: { id: 'N4VwL0WGhzw', title: 'High knees drill', by: 'Dr. Jordan Fairley' },
  burpee: { id: 'zlYA1SENYG4', title: 'How to do a proper burpee', by: 'WeShape' },
  pushup: { id: 'c-lBErfxszs', title: 'The perfect push-up', by: 'Davis Diley' },
  pullup: { id: 'gVr_qmy3Gfg', title: 'Can’t do pull-ups?', by: 'Hybrid Calisthenics' },
  chestPress: { id: 'z6A4W5Dib28', title: 'Stop doing dumbbell press like this', by: 'Jeremy Ethier' },
  inclinePress: { id: '5CECBjd7HLQ', title: 'Incline dumbbell press', by: 'Renaissance Periodization' },
  pecDeck: { id: 'a9vQ_hwIksU', title: 'The perfect pec deck fly', by: 'Andrew Kwong (DeltaBolic)' },
  cableCross: { id: 'y4RJDSOBEl8', title: 'Cable chest fly mistakes', by: 'Andrew Kwong (DeltaBolic)' },
  pushdown: { id: '1FjkhpZsaxc', title: 'The perfect triceps pushdown', by: 'Andrew Kwong (DeltaBolic)' },
  overheadTri: { id: 'iKX6vEhrGxw', title: 'Fixing the overhead triceps extension', by: 'Renaissance Periodization' },
  benchDips: { id: '4ua3MzaU0QU', title: 'The perfect bench dip', by: 'Andrew Kwong (DeltaBolic)' },
  latPulldown: { id: 'hnSqbBk15tw', title: 'Stop messing up your lat pulldowns', by: 'Jeff Nippard' },
  cableRow: { id: 'UCXxvVItLoM', title: 'Seated cable row', by: 'Renaissance Periodization' },
  oneArmRow: { id: 'ZRSGpBUVcNw', title: 'How to do single arm dumbbell rows', by: 'PureGym' },
  straightArm: { id: 'G9uNaXGTJ4w', title: 'Straight arm pulldown', by: 'Renaissance Periodization' },
  dbCurl: { id: '803JIAWBj_c', title: 'Don’t do biceps curls like this', by: 'Sean Nalewanyj' },
  hammerCurl: { id: 'lmIo_gVE8T4', title: 'How to make dumbbell hammer curls better', by: 'TylerPath' },
  preacher: { id: 'WVI13FBlVOw', title: 'Preacher curl warning', by: 'Sean Nalewanyj' },
  shoulderPress: { id: 'HzIiNhHhhtA', title: 'Seated dumbbell shoulder press', by: 'Renaissance Periodization' },
  lateralRaise: { id: 'f_OGBg2KxgY', title: 'Stop messing up lateral raises', by: 'Jeff Nippard' },
  facePull: { id: '8686PLZB_1Q', title: 'Stop doing face pulls like this', by: 'ATHLEAN-X' },
  legPress: { id: 'nDh_BlnLCGc', title: 'How to leg press with perfect technique', by: 'Jeff Nippard' },
  rdl: { id: 'ecuZtKTNI9U', title: 'How to Romanian deadlift: number one form tip', by: 'Bodybuilding.com' },
  lunge: { id: 'hNHnSC_KXOI', title: 'Walking lunges proper form', by: 'Tanner Weiler' },
  inclineWalk: { id: '6GLC-wdknH0', title: 'How to incline walk on the treadmill properly', by: 'Kaila Wen' },
  plank: { id: 'v25dawSzRTM', title: 'Never do planks like this (3 fixes)', by: 'Jeremy Ethier' },
  sidePlank: { id: 'CmDvpUQaqXM', title: 'Side plank', by: 'Girls Gone Strong' },
  deadBug: { id: 'o4GKiEoYClI', title: 'Dead bug exercise for core stability', by: 'Pursuit Physical Therapy' },
  birdDog: { id: 'BAqsW014YAI', title: 'Bird dog', by: 'Girls Gone Strong' },
  thruster: { id: 'UipBcISeiGU', title: 'How to properly do a dumbbell thruster', by: 'DO MORE CrossFit' },
  swing: { id: 'aSYap2yhW8s', title: 'The best kettlebell swing tutorial', by: 'Squat University' },
  stepUp: { id: 'OxWZ-G-RdCM', title: 'Dumbbell step-up', by: 'Girls Gone Strong' },
  mountain: { id: 'hZb6jTbCLeE', title: 'How to do mountain climbers', by: 'Duke Health' },
  rower: { id: '7EQJFjM4Vs8', title: 'How to use the rowing machine properly', by: 'Jordan Bradburne' },
  intervals: { id: 'jN3HeMMvB5o', title: 'Exercise bike sprint intervals', by: 'NeuStrength' },
  kegelHold: { id: 'fRQ_Ju3sWjk', title: 'Pelvic floor exercises for men', by: 'navish.physio' },
  kegelQuick: { id: 'nOU4StdOWkY', title: 'Pelvic floor quick flicks', by: 'Samson Physical Therapy' },
};

// Every exercise in the plan once, for the exercise library.
export const LIBRARY = (() => {
  const seen = new Set();
  return SCHEDULE.flatMap((d) => d.items)
    .filter((e) => {
      if (seen.has(e.name)) return false;
      seen.add(e.name);
      return true;
    })
    .map((e) => (e.repsList ? { ...e, sets: e.repsList.length, reps: e.repsList.join(', ') } : e));
})();

// Demo GIFs are built from the public-domain Free Exercise DB (github.com/yuhonas/free-exercise-db).
export const gifSrc = (gif) => `/exercise/${gif}.gif`;

// One line describing how much of an exercise to do.
export function dose(it) {
  if (it.repsList) return `${it.repsList.length} sets: ${it.repsList.join(', ')}${it.repsUnit ? ` ${it.repsUnit}` : ''}`;
  if (it.kind === 'move') return `${it.reps} reps`;
  if (it.kind === 'circuit') {
    if (/round/.test(it.reps) && !/per round/.test(it.reps)) return it.reps;
    return `${it.rounds} rounds of ${it.reps.replace(' per round', '')}`;
  }
  return it.reps;
}

// Picture for an exercise: its GIF, or the YouTube thumbnail when there's no GIF.
export function thumbSrc(it) {
  if (it.gif) return gifSrc(it.gif);
  const first = it.yt && YT[it.yt[0]];
  return first ? `https://i.ytimg.com/vi/${first.id}/hqdefault.jpg` : null;
}
