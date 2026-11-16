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
    effort: 'Stop each set with 3–4 reps still in the tank',
    note: 'Learn form with light weights. Sore muscles are normal this week.',
  },
  {
    id: 'build',
    name: 'Build',
    weeks: [3, 4, 5],
    effort: 'Stop each set with 2–3 reps left',
    note: 'First two lifts of each day get a 4th set. Hit 12 reps on every set, then add weight next session. Sunday intervals start.',
  },
  {
    id: 'push',
    name: 'Push',
    weeks: [6, 7, 8],
    effort: 'Stop each set with only 1–2 reps left',
    note: 'Work harder on every set. Post-workout incline walk goes up to 25 minutes.',
  },
];

export function phaseForWeek(week) {
  const w = Math.min(Math.max(week, 1), 8);
  return PHASES.find((p) => p.weeks.includes(w));
}

// Every gym day follows the same 90-minute shape.
export function sessionBlocks(week) {
  const walk = week >= 6 ? 25 : 20;
  return [
    { label: 'Warm-up', min: 10, tone: 'violet' },
    { label: 'Weights', min: 90 - 10 - walk - 5, tone: 'ice' },
    { label: 'Incline walk', min: walk, tone: 'amber' },
    { label: 'Stretch', min: 5, tone: 'muted' },
  ];
}

// kind: 'strength' (sets × reps), 'cardio' (one block), 'circuit' (rounds)
// main: true marks the first two lifts that get a 4th set from week 3.
const EX = {
  latPulldown: { name: 'Lat pulldown', reps: '10–12', base: 3, main: true, rest: 90, pose: 'pulldown', video: 'latpullDown', cues: ['Pull the bar to your upper chest', 'Drive elbows down and back', 'Small lean back, no swinging'] },
  chestPress: { name: 'Machine or dumbbell chest press', reps: '10–12', base: 3, main: true, rest: 90, pose: 'bench', video: 'benchPress', cues: ['Shoulder blades pinned to the bench', 'Elbows about 45° from your body', 'Feet planted the whole set'] },
  cableRow: { name: 'Seated cable row', reps: '10–12', base: 3, rest: 75, pose: 'row', video: 'sittedRow', cues: ['Sit tall, no rocking', 'Pull to your lower ribs', 'Squeeze shoulder blades together'] },
  shoulderPress: { name: 'Dumbbell shoulder press', reps: '10–12', base: 3, rest: 75, pose: 'press', video: 'shoulder', cues: ['Ribs down, core braced', 'Press straight overhead', 'Glutes stay on the bench'] },
  dbCurl: { name: 'Dumbbell curl', reps: '12', base: 2, rest: 60, pose: 'curl', cues: ['Elbows stay still at your sides', 'Lower slowly, 2 seconds', 'No hip swing'] },
  pushdown: { name: 'Triceps pushdown', reps: '12', base: 2, rest: 60, pose: 'pushdown', video: 'tri', cues: ['Elbows pinned to your sides', 'Lock out fully at the bottom', 'Stay upright, don’t lean over'] },

  gobletSquat: { name: 'Goblet squat', reps: '10–12', base: 3, main: true, rest: 90, pose: 'squat', cues: ['Chest up, dumbbell at your chest', 'Knees track over your toes', 'Heels stay flat on the floor'] },
  legPress: { name: 'Leg press', reps: '12', base: 3, main: true, rest: 90, cues: ['Feet shoulder-width, mid-platform', 'Lower until knees reach about 90°', 'Don’t lock knees hard at the top'] },
  rdl: { name: 'Dumbbell Romanian deadlift', reps: '10–12', base: 3, rest: 90, pose: 'rdl', cues: ['Push hips back like closing a door', 'Back flat, neck neutral', 'Dumbbells slide close to your legs'] },
  legCurl: { name: 'Leg curl', reps: '12', base: 3, rest: 60, cues: ['Hips stay pressed into the pad', 'Squeeze at the top', 'Lower in 2 seconds'] },
  calfRaise: { name: 'Calf raise', reps: '15', base: 3, rest: 45, cues: ['Full stretch at the bottom', 'Pause 1 second at the top', 'Knees soft, not bent'] },
  plank: { name: 'Plank', reps: '30 s', base: 3, rest: 45, pose: 'plank', video: 'plank', cues: ['Elbows under shoulders', 'Hips level, no sag or pike', 'Squeeze glutes and thighs'] },

  inclineWalk: { name: 'Incline treadmill walk', kind: 'cardio', reps: '45 min', pose: 'walk', video: 'cardio', cues: ['Incline 8–10, speed 5–5.5 km/h', 'Hands off the rails', 'A pace you can talk at, not sing'] },
  coreCircuit: { name: 'Core circuit: plank, side plank, dead bug, bird dog', kind: 'circuit', reps: '3 rounds', pose: 'deadbug', video: 'abs', cues: ['30 s each move, 15 s between', 'Low back stays flat in dead bug', 'Move slowly and breathe out on effort'] },

  inclinePress: { name: 'Incline dumbbell press', reps: '10–12', base: 3, main: true, rest: 90, pose: 'bench', video: 'benchPress', cues: ['Bench at 30°, shoulder blades pinned', 'Lower to your upper chest', 'Press up and slightly back'] },
  widePulldown: { name: 'Wide-grip pulldown or assisted pull-up', reps: '10–12', base: 3, main: true, rest: 90, pose: 'pulldown', video: 'pullUps', cues: ['Hands just outside your shoulders', 'Drive elbows down and back', 'Lead with your chest, control the way up'] },
  oneArmRow: { name: 'One-arm dumbbell row', reps: '10–12 each', base: 3, rest: 75, pose: 'dbrow', cues: ['Back flat, chest square to the floor', 'Pull your elbow toward your hip', 'No twisting through the torso'] },
  lateralRaise: { name: 'Lateral raise', reps: '15', base: 3, rest: 60, pose: 'lateral', cues: ['Lead with your elbows', 'Stop at shoulder height', 'Shoulders down, no shrugging'] },
  facePull: { name: 'Face pull', reps: '15', base: 3, rest: 60, cues: ['Rope at eye level', 'Pull hands apart toward your ears', 'Pause and squeeze the upper back'] },
  hammerCurl: { name: 'Hammer curl', reps: '12', base: 2, rest: 60, pose: 'curl', cues: ['Thumbs up the whole rep', 'Elbows stay still', 'Lower slowly'] },
  overheadTri: { name: 'Overhead triceps extension', reps: '12', base: 2, rest: 60, video: 'tri', cues: ['Elbows point forward, not out', 'Lower behind your head', 'Full lockout at the top'] },

  legPressB: { name: 'Leg press', reps: '10–12', base: 3, main: true, rest: 90, cues: ['Feet shoulder-width, mid-platform', 'Lower until knees reach about 90°', 'Push through the whole foot'] },
  lunge: { name: 'Walking lunges', reps: '10 each leg', base: 3, main: true, rest: 90, pose: 'lunge', video: 'hanuman-dand', cues: ['Front knee over your mid-foot', 'Torso tall', 'Back knee hovers just off the floor'] },
  hipThrust: { name: 'Hip thrust', reps: '12', base: 3, rest: 75, pose: 'hipthrust', cues: ['Chin tucked, ribs down', 'Drive through your heels', 'Squeeze glutes hard at the top'] },
  legExt: { name: 'Leg extension', reps: '12', base: 3, rest: 60, cues: ['Back against the pad', 'Pause at the top', 'Lower in 2 seconds'] },
  legCurlB: { name: 'Leg curl', reps: '12', base: 3, rest: 60, cues: ['Hips stay pressed into the pad', 'Squeeze at the top', 'Lower in 2 seconds'] },
  deadBug: { name: 'Dead bug', reps: '10', base: 3, rest: 45, pose: 'deadbug', video: 'abs3', cues: ['Low back pressed to the floor', 'Opposite arm and leg move together', 'Breathe out as you reach'] },

  intervals: { name: 'Bike or rower intervals: 30 s hard, 90 s easy', kind: 'circuit', reps: '8–10 rounds', video: 'cardio', cues: ['Hard means you can’t talk', 'Easy means full recovery', 'Stop at 8 if form or pace drops'] },
  sundayWalk: { name: 'Incline walk', kind: 'cardio', reps: '30 min', pose: 'walk', video: 'cardio', cues: ['Incline 8–10, speed 5–5.5 km/h', 'Hands off the rails', 'Steady, conversational pace'] },
};

const withIds = (ids) => ids.map((id) => ({ id, kind: 'strength', ...EX[id] }));

export const SCHEDULE = [
  { day: 'Mon', full: 'Monday', title: 'Rest day', tag: 'Recover', items: [], rest: true },
  { day: 'Tue', full: 'Tuesday', title: 'Upper A', tag: 'Back, chest, arms', items: withIds(['latPulldown', 'chestPress', 'cableRow', 'shoulderPress', 'dbCurl', 'pushdown']) },
  { day: 'Wed', full: 'Wednesday', title: 'Lower A', tag: 'Legs and core', items: withIds(['gobletSquat', 'legPress', 'rdl', 'legCurl', 'calfRaise', 'plank']) },
  { day: 'Thu', full: 'Thursday', title: 'Cardio + core', tag: 'Steady burn', items: withIds(['inclineWalk', 'coreCircuit']), noFinisher: true },
  { day: 'Fri', full: 'Friday', title: 'Upper B', tag: 'Shoulders, back, arms', items: withIds(['inclinePress', 'widePulldown', 'oneArmRow', 'lateralRaise', 'facePull', 'hammerCurl', 'overheadTri']) },
  { day: 'Sat', full: 'Saturday', title: 'Lower B', tag: 'Glutes and legs', items: withIds(['legPressB', 'lunge', 'hipThrust', 'legExt', 'legCurlB', 'deadBug']) },
  { day: 'Sun', full: 'Sunday', title: 'Conditioning', tag: 'Intervals + core', items: withIds(['intervals', 'coreCircuit']), noFinisher: true },
];

// Returns the exercises for a weekday, adjusted for the phase of the given week.
export function workoutFor(weekdayIdx, week) {
  const day = SCHEDULE[weekdayIdx];
  const items = day.items
    .map((it) => {
      if (it.id === 'intervals' && week < 3) return { ...EX.sundayWalk, id: 'sundayWalk', kind: 'cardio' };
      return it;
    })
    .map((it) => {
      if (it.kind === 'cardio') return { ...it, sets: 1 };
      if (it.kind === 'circuit') return { ...it, sets: 3 };
      const sets = week >= 3 && it.main ? 4 : it.base;
      return { ...it, sets };
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
  { id: 'coffee', label: 'Black coffee before the gym', group: 'Morning' },
  { id: 'workout', label: 'Finish today’s session', group: 'Morning' },
  { id: 'weigh', label: 'Morning weigh-in', group: 'Morning', auto: 'weight' },
  { id: 'shake', label: 'Whey + fruit + 6 kaju + 6 badam', group: 'Food' },
  { id: 'lunch', label: 'Lunch with soya curry and curd', group: 'Food' },
  { id: 'snack', label: 'Seeds snack + roasted chana', group: 'Food' },
  { id: 'dinner', label: 'Dinner with 100 g paneer', group: 'Food' },
  { id: 'protein', label: 'Hit 120 g protein', group: 'Food' },
  { id: 'oil', label: 'Oil and ghee under 4 tsp', group: 'Food' },
  { id: 'water', label: 'Drink 3 L of water', group: 'Recovery', auto: 'water' },
  { id: 'walk', label: 'Evening walk, 5–6 km', group: 'Recovery' },
  { id: 'sleep', label: 'Lights out for 7–8 h of sleep', group: 'Recovery' },
];

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
