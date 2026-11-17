// Date helpers. Every "day" key is local time, so the checklist resets at your own midnight.

export function dayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key, n) {
  const d = parseKey(key);
  d.setDate(d.getDate() + n);
  return dayKey(d);
}

export function daysBetween(fromKey, toKey) {
  const ms = parseKey(toKey) - parseKey(fromKey);
  return Math.round(ms / 86400000);
}

// Monday = 0 … Sunday = 6, so the week reads the way the plan does.
export function weekdayIndex(key) {
  return (parseKey(key).getDay() + 6) % 7;
}

export function programWeek(startKey, todayKey) {
  const diff = daysBetween(startKey, todayKey);
  if (diff < 0) return 1;
  return Math.floor(diff / 7) + 1;
}

export function prettyDate(key, opts = { weekday: 'long', day: 'numeric', month: 'short' }) {
  return parseKey(key).toLocaleDateString('en-IN', opts);
}
