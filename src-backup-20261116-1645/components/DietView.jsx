import { DIET, DIET_COMPARE, TARGETS } from '../data/program';

const TONES = ['violet', 'ice', 'amber', 'rose', 'mint'];

function totals() {
  return DIET.reduce(
    (acc, m) => {
      m.items.forEach((it) => {
        acc.kcal += it.kcal;
        acc.protein += it.protein;
      });
      return acc;
    },
    { kcal: 0, protein: 0 },
  );
}

function Donut({ meals, total }) {
  const r = 70;
  const len = 2 * Math.PI * r;
  const offsets = meals.reduce((acc, m) => [...acc, acc.at(-1) + (m.kcal / total) * len], [0]);
  return (
    <svg viewBox="0 0 200 200" className="donut" role="img" aria-label="Calories by meal">
      <circle cx="100" cy="100" r={r} className="ring-track" strokeWidth="22" />
      {meals.map((m, i) => {
        const frac = m.kcal / total;
        return (
          <circle key={m.id} cx="100" cy="100" r={r} className={`donut-seg tone-${TONES[i]}`} strokeWidth="22"
            strokeDasharray={`${Math.max(frac * len - 3, 0)} ${len}`} strokeDashoffset={-offsets[i]} transform="rotate(-90 100 100)" />
        );
      })}
      <text x="100" y="98" textAnchor="middle" className="donut-big">{total.toLocaleString('en-IN')}</text>
      <text x="100" y="120" textAnchor="middle" className="donut-small">kcal a day</text>
    </svg>
  );
}

function CompareBars() {
  const maxK = 2400;
  const maxP = 150;
  return (
    <div className="compare">
      {[
        { key: 'kcal', label: 'Calories', max: maxK, lo: TARGETS.kcalMin, hi: TARGETS.kcalMax, unit: 'kcal' },
        { key: 'protein', label: 'Protein', max: maxP, lo: TARGETS.proteinMin, hi: TARGETS.proteinMax, unit: 'g' },
      ].map((m) => (
        <div key={m.key} className="compare-block">
          <h3>{m.label}</h3>
          {DIET_COMPARE.map((row, i) => (
            <div key={row.label} className="cbar-row">
              <span className="cbar-label">{row.label}</span>
              <div className="cbar">
                <span className="cbar-band" style={{ left: `${(m.lo / m.max) * 100}%`, width: `${((m.hi - m.lo) / m.max) * 100}%` }} />
                <span className={`cbar-fill ${i === 0 ? 'old' : 'new'}`} style={{ width: `${(row[m.key] / m.max) * 100}%` }} />
              </div>
              <span className="cbar-val">{row[m.key].toLocaleString('en-IN')} {m.unit}</span>
            </div>
          ))}
          <p className="sub">Shaded band is the target: {m.lo.toLocaleString('en-IN')}–{m.hi.toLocaleString('en-IN')} {m.unit}.</p>
        </div>
      ))}
    </div>
  );
}

export default function DietView() {
  const t = totals();
  const meals = DIET.map((m) => ({
    ...m,
    kcal: m.items.reduce((s, it) => s + it.kcal, 0),
    protein: m.items.reduce((s, it) => s + it.protein, 0),
  }));
  const maxProtein = Math.max(...meals.map((m) => m.protein));

  return (
    <div className="view diet-view">
      <section className="panel diet-hero">
        <Donut meals={meals} total={t.kcal} />
        <div className="diet-summary">
          <h2>Your revised vegetarian day</h2>
          <p className="big-stat"><strong>{t.protein} g</strong> protein, <strong>{t.kcal.toLocaleString('en-IN')}</strong> kcal</p>
          <p>Roughly a 900–1,000 kcal daily deficit against what you burn, which works out to about 0.8 kg a week with room for estimation error.</p>
          <ul className="legend">
            {meals.map((m, i) => (
              <li key={m.id}><span className={`swatch tone-${TONES[i]}`} />{m.name} <span className="dim">{m.kcal} kcal</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="panel">
        <header className="panel-head"><div><h2>Why the changes</h2><p className="sub">Your first version came in too low on both counts for 90 minutes of training plus a daily walk.</p></div></header>
        <CompareBars />
      </section>

      <section className="panel">
        <header className="panel-head"><div><h2>Meals</h2><p className="sub">Highlighted items are the swaps that add protein.</p></div></header>
        <ol className="meal-timeline">
          {meals.map((m, i) => (
            <li key={m.id} className={`meal tone-${TONES[i]}`}>
              <div className="meal-time">{m.time}</div>
              <div className="meal-body">
                <div className="meal-head">
                  <h3>{m.name}</h3>
                  <span className="dim">{m.kcal} kcal, {m.protein} g protein</span>
                </div>
                <div className="pbar" aria-hidden="true"><span style={{ width: `${(m.protein / maxProtein) * 100}%` }} /></div>
                <ul>
                  {m.items.map((it) => (
                    <li key={it.name} className={it.swap ? 'swap' : ''}>
                      <span>{it.name}</span>
                      <span className="dim">{it.kcal} kcal, {it.protein} g</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
        <div className="diet-notes">
          <p><strong>Paneer check:</strong> 50 g gives about 9–10 g protein, not 20 g. You need about 100 g for 20 g.</p>
          <p><strong>Oil:</strong> keep it to 3–4 tsp for the whole day. One extra tablespoon per meal adds about 360 kcal.</p>
          <p><strong>To reach 140 g protein:</strong> add a second whey scoop (+24 g) or swap paneer for tofu.</p>
        </div>
      </section>
    </div>
  );
}
