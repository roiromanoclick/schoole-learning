// ================= עזרים =================
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = a => a[rnd(0, a.length - 1)];
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const take = (a, n) => shuffle(a).slice(0, n);

const colsFor = n => (n <= 5 ? n : Math.min(7, Math.ceil(n / 2)));
const grp = (e, n, o) => {
  o = o || {};
  let h = '';
  for (let i = 0; i < n; i++) h += `<span class="it${o.x && i >= n - o.x ? ' x' : ''}" style="--i:${i}">${e}</span>`;
  return `<div class="grp${o.tap ? ' tap' : ''}" style="--cols:${colsFor(n)}">${h}</div>`;
};
const oGl = (t, ok) => ({ h: `<span class="gl">${t}</span>`, ok });
const oEm = (e, ok, label) => ({ h: `<span class="em">${e}</span>${label ? `<small>${label}</small>` : ''}`, ok });
const oGrp = (e, n, ok) => ({ h: grp(e, n), ok });
const oSvg = (kind, color, ok) => ({ h: shapeSVG(kind, color), ok });
const oCol = (hex, ok) => ({ h: `<span class="sw" style="background:${hex}"></span>`, ok });

// שאלה: say – מה אומרים/כותבים, vis – ציור, opts – תשובות, cls – פריסה
function mkQ(say, vis, opts, cls) {
  const o = shuffle(opts);
  return { say, vis: vis || '', opts: o, cls: cls || (o.length === 2 ? 'n2' : o.length === 4 ? 'n4' : '') };
}
// כמה תשובות מספריות: התשובה הנכונה + שתי מסיחות
function numOpts(n, lo, hi) {
  const set = new Set([n]);
  const near = shuffle([n - 2, n - 1, n + 1, n + 2].filter(x => x >= lo && x <= hi));
  for (const x of near) if (set.size < 3) set.add(x);
  while (set.size < 3) set.add(rnd(lo, hi));
  return [...set].map(x => oGl(x, x === n));
}

// ================= ציורים =================
function shapeSVG(kind, color) {
  const f = `fill="${color}" stroke="#2b2d42" stroke-width="4" stroke-linejoin="round"`;
  let s;
  if (kind === 'circle') s = `<circle cx="50" cy="50" r="42" ${f}/>`;
  else if (kind === 'square') s = `<rect x="12" y="12" width="76" height="76" ${f}/>`;
  else if (kind === 'rect') s = `<rect x="4" y="25" width="92" height="50" ${f}/>`;
  else if (kind === 'triangle') s = `<polygon points="50,9 93,86 7,86" ${f}/>`;
  else if (kind === 'heart') s = `<path d="M50 88 C8 56 4 28 27 19 C40 15 48 23 50 31 C52 23 60 15 73 19 C96 28 92 56 50 88 Z" ${f}/>`;
  else {
    const pts = [];
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 19 : 44; pts.push((50 + r * Math.cos(a)).toFixed(1) + ',' + (53 + r * Math.sin(a)).toFixed(1)); }
    s = `<polygon points="${pts.join(' ')}" ${f}/>`;
  }
  return `<svg viewBox="0 0 100 100" aria-hidden="true">${s}</svg>`;
}
const DICE = { 1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[28, 28], [50, 50], [72, 72]], 4: [[28, 28], [72, 28], [28, 72], [72, 72]], 5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]], 6: [[28, 28], [72, 28], [28, 50], [72, 50], [28, 72], [72, 72]] };
const diceSVG = n => `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="6" y="6" width="88" height="88" rx="16" fill="#fff" stroke="#2b2d42" stroke-width="5"/>${DICE[n].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="#ef476f"/>`).join('')}</svg>`;

// ================= נתונים =================
const LET = [['א', 'אלף'], ['ב', 'בית'], ['ג', 'גימל'], ['ד', 'דלת'], ['ה', 'הא'], ['ו', 'וו'], ['ז', 'זין'], ['ח', 'חית'], ['ט', 'טית'], ['י', 'יוד'], ['כ', 'כף'], ['ל', 'למד'], ['מ', 'מם'], ['נ', 'נון'], ['ס', 'סמך'], ['ע', 'עין'], ['פ', 'פא'], ['צ', 'צדי'], ['ק', 'קוף'], ['ר', 'ריש'], ['ש', 'שין'], ['ת', 'תו']];
const LETTERS = LET.map(x => x[0]);
const CONF = [['ב', 'כ'], ['ד', 'ר'], ['ה', 'ח', 'ת'], ['ו', 'ז'], ['ג', 'נ'], ['ע', 'צ'], ['ס', 'מ'], ['ק', 'ר'], ['פ', 'ט'], ['ל', 'י']];
const SIM = { 'א': 'ע', 'ע': 'א', 'ט': 'ת', 'ת': 'ט', 'כ': 'קח', 'ק': 'כ', 'ח': 'כ', 'ס': 'ש', 'ש': 'ס', 'ב': 'ו', 'ו': 'ב' };
const NAME = {}; LET.forEach(x => { NAME[x[0]] = x[1]; });
const WORDS = [['אריה', '🦁'], ['בננה', '🍌'], ['גמל', '🐪'], ['דג', '🐟'], ['הר', '⛰️'], ['זברה', '🦓'], ['חתול', '🐱'], ['טלפון', '📞'], ['ינשוף', '🦉'], ['כדור', '⚽'], ['לב', '❤️'], ['מטריה', '☂️'], ['נעל', '👟'], ['סוס', '🐴'], ['עוגה', '🎂'], ['פיל', '🐘'], ['צב', '🐢'], ['קוף', '🐒'], ['רכבת', '🚂'], ['שמש', '☀️'], ['תפוח', '🍎']];
const THINGS = [['🍎', 'תפוחים'], ['⭐', 'כוכבים'], ['🎈', 'בלונים'], ['🐟', 'דגים'], ['🍪', 'עוגיות'], ['🚗', 'מכוניות'], ['🌸', 'פרחים'], ['🐥', 'אפרוחים'], ['🦋', 'פרפרים'], ['🍓', 'תותים']];
const COLS = [['אדום', '#e63946'], ['כחול', '#1d70e8'], ['צהוב', '#ffd60a'], ['ירוק', '#2a9d3a'], ['כתום', '#fb8500'], ['סגול', '#8d4fd9'], ['ורוד', '#ff7eb6'], ['חום', '#8b5a2b'], ['שחור', '#222222'], ['לבן', '#ffffff']];
const COLHEX = {}; COLS.forEach(x => { COLHEX[x[0]] = x[1]; });
const OBJCOL = [['🍌', 'לבננה', 'צהוב'], ['🍅', 'לעגבנייה', 'אדום'], ['🥒', 'למלפפון', 'ירוק'], ['🍊', 'לתפוז', 'כתום'], ['🍇', 'לענבים', 'סגול'], ['🐻', 'לדוב', 'חום'], ['🍓', 'לתות', 'אדום'], ['🥕', 'לגזר', 'כתום'], ['🐸', 'לצפרדע', 'ירוק'], ['🍋', 'ללימון', 'צהוב']];
const SHAPES = [['circle', 'עיגול'], ['square', 'ריבוע'], ['triangle', 'משולש'], ['rect', 'מלבן'], ['star', 'כוכב'], ['heart', 'לב']];
const SHCOL = ['#ef476f', '#118ab2', '#ffd166', '#06d6a0', '#9b5de5', '#fb8500'];
const ANIMALS = [['🐄', 'פרה', 'מוּ'], ['🐶', 'כלב', 'הב הב'], ['🐱', 'חתול', 'מיאו'], ['🐑', 'כבשה', 'בֶּה'], ['🐓', 'תרנגול', 'קוקוריקו'], ['🦆', 'ברווז', 'קוואק'], ['🐴', 'סוס', 'היי'], ['🐸', 'צפרדע', 'קרוֹאק'], ['🦁', 'אריה', 'ואאר'], ['🐷', 'חזיר', 'אוינק']];
const CATS = [['פירות', ['🍎', '🍌', '🍇', '🍓', '🍊']], ['חיות', ['🐶', '🐱', '🐴', '🐘', '🦁']], ['כלי רכב', ['🚗', '🚌', '🚲', '✈️', '🚂']], ['בגדים', ['👕', '👖', '🧦', '🧢', '👗']]];
const USES = [['במה אוכלים מרק?', '🥄', ['👟', '✏️', '🧢']], ['מה לובשים על הרגליים?', '👟', ['🥄', '🧸', '🍎']], ['במה כותבים?', '✏️', ['🥄', '🍎', '👟']], ['מה קוראים?', '📖', ['🥄', '⚽', '🍎']], ['במה שותים?', '🥤', ['👟', '✏️', '⚽']], ['מה פותחים כשיורד גשם?', '☂️', ['🥄', '⚽', '📖']], ['מה שמים על הראש כשקר?', '🧢', ['🥄', '⚽', '🍎']]];

// ================= עולם 1 – אותיות =================
function genLetters() {
  const ls = take(LETTERS, 10), qs = [];
  const letterOpts = (L, similar) => {
    const pool = similar ? (CONF.filter(c => c.includes(L)).flat().filter(x => x !== L)) : [];
    const d = take([...new Set(pool)], 2);
    for (const x of shuffle(LETTERS)) if (d.length < 2 && x !== L && !d.includes(x)) d.push(x);
    return [oGl(L, true), ...d.map(x => oGl(x, false))];
  };
  ls.forEach((L, i) => {
    if (i < 5) qs.push(mkQ(`איפה האות ${NAME[L]}?`, '', letterOpts(L, false)));
    else qs.push(mkQ('מצאו אות זהה', `<div class="bigl">${L}</div>`, letterOpts(L, true)));
  });
  return qs;
}

// ================= עולם 2 – צלילים =================
function genSounds() {
  const ws = take(WORDS, 10), qs = [];
  const bad = L => (SIM[L] || '') + L;
  ws.forEach(([w, e], i) => {
    const L = w[0];
    if (i < 7) {
      const d = take(LETTERS.filter(x => !bad(L).includes(x)), 2);
      qs.push(mkQ(`${w}. באיזו אות מתחילה המילה ${w}?`, `<div class="bigem">${e}</div><div class="wordtag">${w}</div>`, [oGl(L, true), ...d.map(x => oGl(x, false))]));
    } else {
      const d = take(WORDS.filter(x => !bad(L).includes(x[0][0])), 2);
      qs.push(mkQ(`איזו תמונה מתחילה באות ${NAME[L]}?`, `<div class="bigl">${L}</div>`, [oEm(e, true, w), ...d.map(x => oEm(x[1], false, x[0]))]));
    }
  });
  return qs;
}

// ================= עולם 3 – מספרים =================
function genNumbers() {
  const qs = [];
  take([3, 7, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], 4).forEach(n => qs.push(mkQ(`איפה המספר ${n}?`, '', numOpts(n, 1, 20))));
  take([4, 6, 8, 11, 12, 13, 14, 15], 3).forEach(n => {
    const [e] = pick(THINGS);
    qs.push(mkQ(`בחרו את הקבוצה שיש בה ${n}`, `<div class="bigl">${n}</div>`, numOpts(n, 1, 20).map(o => oGrp(e, o.h.replace(/\D/g, '') * 1, o.ok)), 'stack'));
  });
  take([1, 2, 3, 4, 5, 6], 3).forEach(n => qs.push(mkQ('כמה נקודות יש על הקובייה?', `<div class="dice">${diceSVG(n)}</div>`, numOpts(n, 1, 6))));
  return qs;
}

// ================= עולם 4 – סופרים =================
function genCount() {
  const qs = [], ns = take([2, 4, 5, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], 8), things = shuffle(THINGS);
  for (let i = 0; i < 8; i++) {
    const n = ns[i], [e, pl] = things[i];
    qs.push(mkQ(`כמה ${pl} יש? לחצו על כל אחד כדי לספור`, grp(e, n, { tap: true }), numOpts(n, 1, 20)));
  }
  for (let i = 8; i < 10; i++) {
    const n = rnd(3, 8), [e, pl] = things[i];
    qs.push(mkQ(`איפה יש ${n} ${pl}?`, '', numOpts(n, 1, 10).map(o => oGrp(e, +o.h.replace(/\D/g, ''), o.ok)), 'stack'));
  }
  return qs;
}

// ================= עולם 5 – חיבור וחיסור =================
function genAddSub() {
  const qs = [], things = shuffle(THINGS), eq = (...p) => `<div class="eq">${p.join('')}</div>`;
  for (let i = 0; i < 5; i++) {
    const a = i < 2 ? rnd(1, 5) : rnd(4, 10), b = i < 2 ? rnd(1, Math.min(5, 10 - a)) : rnd(3, 10), [e] = things[i];
    qs.push(mkQ(`${a} ועוד ${b}. כמה יחד?`, eq(grp(e, a), '<span class="op">➕</span>', grp(e, b), '<span class="op">＝</span><span class="op qm">❓</span>'), numOpts(a + b, 0, 20)));
  }
  for (let i = 5; i < 8; i++) {
    const a = i === 5 ? rnd(3, 9) : rnd(10, 20), b = rnd(1, Math.min(a - 1, 9)), [e] = things[i];
    qs.push(mkQ(`היו ${a}, ${b} הלכו. כמה נשארו?`, grp(e, a, { x: b }), numOpts(a - b, 0, 20)));
  }
  for (let i = 8; i < 10; i++) {
    const t = i === 8 ? rnd(5, 10) : rnd(11, 20), a = t - rnd(1, Math.min(t - 1, 9)), [e] = things[i];
    qs.push(mkQ(`יש ${a}, ורוצים ${t}. כמה חסר?`, eq(grp(e, a), '<span class="op">➕</span><span class="op qm">❓</span><span class="op">＝</span>', grp(e, t)), numOpts(t - a, 0, 20)));
  }
  return qs;
}

// ================= עולם 6 – צורות =================
function genShapes() {
  const qs = [], order = shuffle(SHAPES);
  for (let i = 0; i < 5; i++) {
    const [k, nm] = order[i % order.length], cs = shuffle(SHCOL), ds = take(SHAPES.filter(s => s[0] !== k), 2);
    qs.push(mkQ(`איפה ה${nm}?`, '', [oSvg(k, cs[0], true), ...ds.map((s, j) => oSvg(s[0], cs[j + 1], false))]));
  }
  for (let i = 0; i < 3; i++) {
    const [k] = order[(i + 1) % order.length], c = pick(SHCOL), ds = take(SHAPES.filter(s => s[0] !== k), 2);
    qs.push(mkQ('מצאו צורה זהה', `<div class="dice">${shapeSVG(k, c)}</div>`, [oSvg(k, c, true), ...ds.map(s => oSvg(s[0], c, false))]));
  }
  qs.push(mkQ('איזה דבר עגול?', '', [oEm(pick(['⚽', '🌕', '🍪']), true), oEm('🎁', false), oEm('📺', false)]));
  qs.push(mkQ('איזה דבר מרובע?', '', [oEm(pick(['🎁', '📦']), true), oEm('⚽', false), oEm('🌕', false)]));
  return qs;
}

// ================= עולם 7 – צבעים =================
function genColors() {
  const qs = [], cols = shuffle(COLS);
  for (let i = 0; i < 5; i++) {
    const [nm, hex] = cols[i], d = take(COLS.filter(c => c[0] !== nm), 2);
    qs.push(mkQ(`איפה הצבע ${nm}?`, '', [oCol(hex, true), ...d.map(c => oCol(c[1], false))]));
  }
  take(OBJCOL, 5).forEach(([e, lbl, c]) => {
    const d = take(COLS.filter(x => x[0] !== c), 2);
    qs.push(mkQ(`איזה צבע יש ${lbl}?`, `<div class="bigem">${e}</div>`, [oCol(COLHEX[c], true), ...d.map(x => oCol(x[1], false))]));
  });
  return qs;
}

// ================= עולם 8 – השוואות =================
function genCompare() {
  const qs = [], things = shuffle(THINGS);
  const cmp = (more, i) => {
    const [e, pl] = things[i], a = rnd(2, 9);
    let b = rnd(1, 9);
    while (b === a) b = rnd(1, 9);
    const big = Math.max(a, b), small = Math.min(a, b);
    return mkQ(more ? `איפה יש יותר ${pl}?` : `איפה יש פחות ${pl}?`, '', [oGrp(e, big, more), oGrp(e, small, !more)], 'n2');
  };
  for (let i = 0; i < 3; i++) qs.push(cmp(true, i));
  for (let i = 3; i < 5; i++) qs.push(cmp(false, i));
  const SIZE = [['🐘', 'פיל', '🐭', 'עכבר'], ['🚌', 'אוטובוס', '🚲', 'אופניים'], ['🌳', 'עץ', '🌱', 'נבט'], ['🐋', 'לוויתן', '🐟', 'דג'], ['🏠', 'בית', '🐜', 'נמלה']];
  const sz = shuffle(SIZE);
  [true, true, false].forEach((big, i) => {
    const [a, an, b, bn] = sz[i];
    qs.push(mkQ(big ? 'מי יותר גדול?' : 'מי יותר קטן?', '', [oEm(a, big, an), oEm(b, !big, bn)], 'n2'));
  });
  const [ta, tan, tb, tbn] = pick([['🦒', 'ג׳ירפה', '🐕', 'כלב'], ['🏢', 'בניין', '🏠', 'בית'], ['🌲', 'עץ', '🌷', 'פרח']]);
  qs.push(mkQ('מי יותר גבוה?', '', [oEm(ta, true, tan), oEm(tb, false, tbn)], 'n2'));
  const [ha, han, hb, hbn] = pick([['🐘', 'פיל', '🎈', 'בלון'], ['🚛', 'משאית', '🍃', 'עלה'], ['🧱', 'לבנה', '🎈', 'בלון']]);
  qs.push(mkQ('מי יותר כבד?', '', [oEm(ha, true, han), oEm(hb, false, hbn)], 'n2'));
  return qs;
}

// ================= עולם 9 – דפוסים והמשכים =================
function genPatterns() {
  const qs = [];
  const POOLS = [['🔴', '🔵', '🟡', '🟢'], ['🍎', '🍌', '🍇', '🍓'], ['🐶', '🐱', '🐸', '🐥'], ['⭐', '❤️', '🌙', '☀️']];
  const pat = (shape, pool) => {
    const [A, B, C, D] = shuffle(pool), unit = shape === 'AB' ? [A, B] : shape === 'AAB' ? [A, A, B] : shape === 'ABB' ? [A, B, B] : [A, B, C];
    const seq = Array.from({ length: 6 }, (_, i) => unit[i % unit.length]), ans = seq[5];
    const shown = seq.slice(0, 5).map(x => `<span class="pi">${x}</span>`).join('') + '<span class="pi q">❓</span>';
    const d = take([A, B, C, D].filter(x => x !== ans), 2);
    return mkQ('מה בא אחר כך?', `<div class="pat">${shown}</div>`, [oEm(ans, true), ...d.map(x => oEm(x, false))]);
  };
  shuffle(['AB', 'AAB', 'ABB', 'ABC']).forEach((s, i) => qs.push(pat(s, POOLS[i])));
  const seqHTML = a => `<div class="seq">${a.map(x => (x === '?' ? '<span class="qm">❓</span>' : `<span>${x}</span>`)).join('')}</div>`;
  for (let i = 0; i < 2; i++) { const s = rnd(1, 16); qs.push(mkQ('איזה מספר חסר?', seqHTML([s, s + 1, '?', s + 3]), numOpts(s + 2, 1, 20))); }
  { const s = rnd(1, 17); qs.push(mkQ('איזה מספר בא אחר כך?', seqHTML([s, s + 1, s + 2, '?']), numOpts(s + 3, 1, 20))); }
  take([5, 8, 9, 10, 11, 14, 17, 19], 2).forEach(n => qs.push(mkQ(`איזה מספר בא אחרי ${n}?`, seqHTML([n, '?']), numOpts(n + 1, 1, 20))));
  { const n = rnd(8, 20); qs.push(mkQ(`איזה מספר בא לפני ${n}?`, seqHTML(['?', n]), numOpts(n - 1, 1, 20))); }
  return qs;
}

// ================= עולם 10 – העולם סביבנו =================
function genWorld() {
  const qs = [];
  take(ANIMALS, 4).forEach(([e, nm, snd]) => {
    const d = take(ANIMALS.filter(a => a[1] !== nm), 2);
    qs.push(mkQ(`מי אומר ${snd}?`, `<div class="sound">${snd}</div>`, [oEm(e, true, nm), ...d.map(a => oEm(a[0], false, a[1]))]));
  });
  for (let i = 0; i < 3; i++) {
    const [ca, ia] = pick(CATS), others = CATS.filter(c => c[0] !== ca), [, ib] = pick(others);
    const three = take(ia, 3), odd = pick(ib);
    qs.push(mkQ('מי לא שייך?', '', [...three.map(x => oEm(x, false)), oEm(odd, true)], 'n4'));
  }
  take(USES, 3).forEach(([q, a, ds]) => qs.push(mkQ(q, '', [oEm(a, true), ...take(ds, 2).map(x => oEm(x, false))])));
  return qs;
}

const WORLDS = [
  { id: 'letters', name: 'אותיות', icon: '🔤', color: '#ef476f', gen: genLetters },
  { id: 'sounds', name: 'צלילים', icon: '🔊', color: '#fb5607', gen: genSounds },
  { id: 'numbers', name: 'מספרים', icon: '🔢', color: '#118ab2', gen: genNumbers },
  { id: 'count', name: 'סופרים', icon: '🍎', color: '#06a77d', gen: genCount },
  { id: 'addsub', name: 'חיבור וחיסור', icon: '➕', color: '#9b5de5', gen: genAddSub },
  { id: 'shapes', name: 'צורות', icon: '🔷', color: '#3a86ff', gen: genShapes },
  { id: 'colors', name: 'צבעים', icon: '🎨', color: '#e63946', gen: genColors },
  { id: 'compare', name: 'משווים', icon: '⚖️', color: '#f4a261', gen: genCompare },
  { id: 'patterns', name: 'ממשיכים', icon: '🧩', color: '#2a9d8f', gen: genPatterns },
  { id: 'world', name: 'סביבנו', icon: '🐶', color: '#d6336c', gen: genWorld },
];

// ================= ממשק =================
if (typeof document !== 'undefined') {
  const app = document.getElementById('app'), fx = document.getElementById('fx');
  const KEY = 'g1prep';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const save = d => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* מתעלמים */ } };
  let D = load();
  D.p = D.p || {}; // התקדמות לפי עולם (0-10)
  const PRAISE = ['כל הכבוד!', 'יופי!', 'מעולה!', 'נהדר!', 'בול!', 'וואו, נכון!'];
  const RETRY = ['כמעט! נסו שוב', 'לא נורא, נסו שוב', 'עוד פעם, אפשר!'];
  const prog = id => D.p[id] || 0;
  const total = () => WORLDS.reduce((s, w) => s + prog(w.id), 0);

  // ----- קול -----
  let voice = null;
  const isHe = v => /^(he|iw)([-_]|$)/i.test(v.lang || '') || /hebrew|עברית|carmit|asaf/i.test(v.name || '');
  const pickVoice = () => {
    if (!('speechSynthesis' in window)) return;
    const vs = speechSynthesis.getVoices() || [];
    voice = vs.filter(isHe)[0] || null;
  };
  if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  let remote = null;
  // אין קול עברית במכשיר – משמיעים דרך שירות הקראה חיצוני (אם יש אינטרנט)
  function speakRemote(t) {
    try {
      if (remote) remote.pause();
      remote = new Audio('https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=iw&q=' + encodeURIComponent(t));
      const p = remote.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) { /* ממשיכים בלי קול */ }
  }
  function speak(t) {
    if (D.mute || !t) return;
    if (!voice) pickVoice();
    if (!voice || !('speechSynthesis' in window)) { speakRemote(t); return; }
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(t);
      u.lang = voice.lang || 'he-IL'; u.voice = voice; u.rate = 0.85; u.pitch = 1.1;
      setTimeout(() => speechSynthesis.speak(u), 40);
    } catch (e) { /* אין קול – ממשיכים בלי */ }
  }
  let ac = null;
  function tone(freqs, step, type, vol) {
    if (D.mute) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
      freqs.forEach((f, i) => {
        const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + i * step;
        o.type = type; o.frequency.value = f;
        g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + step * 1.6);
        o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + step * 1.7);
      });
    } catch (e) { /* ללא סאונד */ }
  }
  const sfxOk = () => tone([523, 659, 784, 1047], 0.09, 'triangle', 0.18);
  const sfxNo = () => tone([300, 240], 0.12, 'sine', 0.12);

  function confetti(n) {
    const em = ['🎉', '⭐', '🎈', '✨', '🌈', '💛', '🎊'];
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'cf'; s.textContent = pick(em);
      s.style.left = rnd(2, 96) + 'vw'; s.style.fontSize = rnd(24, 54) + 'px';
      s.style.animationDelay = (Math.random() * 0.7).toFixed(2) + 's'; s.style.animationDuration = (1.8 + Math.random() * 1.6).toFixed(2) + 's';
      fx.appendChild(s);
      setTimeout(() => s.remove(), 4200);
    }
  }

  // ----- מסך בית -----
  function home() {
    fx.innerHTML = '';
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    const t = total();
    app.innerHTML = `<div class="wrap">
      <div class="hero"><div class="mascot">🦊</div><h1>מתכוננים לכיתה א׳</h1><div class="total">⭐ <bdi dir="ltr">${t} / ${WORLDS.length * 10}</bdi></div></div>
      <button class="play" id="play">▶ בואו נשחק!</button>
      <div class="worlds">${WORLDS.map((w, k) => `<button class="world${prog(w.id) >= 10 ? ' done' : ''}" data-i="${k}" style="--c:${w.color};--k:${k}">
        <span class="wi">${w.icon}</span><span>${w.name}</span><span class="wp">${prog(w.id) >= 10 ? '🏆' : '⭐'} <bdi dir="ltr">${prog(w.id)}/10</bdi></span></button>`).join('')}</div>
      <div class="foot"><button class="tiny" id="mute">${D.mute ? '🔇 קול כבוי' : '🔊 קול'}</button> <button class="tiny" id="reset">🗑 איפוס</button></div></div>`;
    document.getElementById('play').onclick = () => {
      let k = WORLDS.findIndex(w => prog(w.id) < 10);
      if (k < 0) k = 0;
      speak('בואו נשחק!');
      startWorld(k);
    };
    app.querySelectorAll('.world').forEach(b => b.onclick = () => startWorld(Number(b.dataset.i)));
    document.getElementById('mute').onclick = () => { D.mute = !D.mute; save(D); home(); };
    document.getElementById('reset').onclick = () => { if (confirm('למחוק את כל הכוכבים ולהתחיל מחדש?')) { D = { p: {}, mute: D.mute }; save(D); home(); } };
  }

  // ----- שאלות -----
  let S = null;
  function startWorld(k) {
    S = { k, qs: WORLDS[k].gen(), i: 0 };
    question();
  }
  function question() {
    const w = WORLDS[S.k], q = S.qs[S.i];
    fx.innerHTML = '';
    S.tries = 0; S.locked = false; S.cnt = 0;
    const stars = Array.from({ length: 10 }, (_, j) => `<span class="${j < S.i ? 'on' : ''}">⭐</span>`).join('');
    app.innerHTML = `<div class="wrap" style="--c:${w.color}">
      <div class="bar"><button class="rb" id="homeb" aria-label="בית">🏠</button><div class="stars" id="stars">${stars}</div><button class="rb small" id="mutes">${D.mute ? '🔇' : '🔊'}</button></div>
      <div class="say"><div class="mascot" id="mascot">🦊</div><div class="bubble"><span>${q.say}</span><button class="rb small" id="rep" aria-label="שמעו שוב">🔊</button></div></div>
      <div class="visual" id="vis">${q.vis}</div>
      <div class="opts ${q.cls}" id="opts">${q.opts.map((o, j) => `<button class="opt" data-j="${j}">${o.h}</button>`).join('')}</div>
      <div class="msg" id="msg"></div>
      <button class="next" id="next" hidden>${S.i === S.qs.length - 1 ? '🏆' : '◀️'}</button></div>`;
    document.getElementById('homeb').onclick = home;
    document.getElementById('rep').onclick = () => speak(q.say);
    document.getElementById('mutes').onclick = () => { D.mute = !D.mute; save(D); if (D.mute && 'speechSynthesis' in window) speechSynthesis.cancel(); document.getElementById('mutes').textContent = D.mute ? '🔇' : '🔊'; };
    document.getElementById('next').onclick = () => { if (S.i === S.qs.length - 1) finish(); else { S.i++; question(); } };
    app.querySelectorAll('.opt').forEach(b => b.onclick = () => answer(Number(b.dataset.j)));
    app.querySelectorAll('.grp.tap .it').forEach(el => el.onclick = () => {
      if (el.classList.contains('counted')) return;
      el.classList.add('counted'); el.dataset.n = ++S.cnt;
      tone([440 + S.cnt * 40], 0.08, 'triangle', 0.12);
      speak(String(S.cnt));
    });
    setTimeout(() => speak(q.say), 250);
  }

  function answer(j) {
    if (S.locked) return;
    const q = S.qs[S.i], o = q.opts[j], btn = app.querySelectorAll('.opt')[j], msg = document.getElementById('msg'), mascot = document.getElementById('mascot');
    if (o.ok) {
      S.locked = true;
      btn.classList.add('good');
      app.querySelectorAll('.opt').forEach(b => { b.disabled = true; });
      const p = pick(PRAISE);
      msg.className = 'msg'; msg.textContent = p + ' 🎉';
      mascot.className = 'mascot happy';
      const st = document.querySelectorAll('#stars span')[S.i];
      st.className = 'on pop';
      const id = WORLDS[S.k].id;
      if (prog(id) < S.i + 1) { D.p[id] = S.i + 1; save(D); }
      sfxOk(); speak(p); confetti(S.i === S.qs.length - 1 ? 40 : 14);
      const nx = document.getElementById('next'); nx.hidden = false;
    } else {
      S.tries++;
      btn.classList.add('bad'); btn.disabled = true;
      msg.className = 'msg try'; msg.textContent = pick(RETRY);
      mascot.className = 'mascot sad';
      setTimeout(() => { const m = document.getElementById('mascot'); if (m) m.className = 'mascot'; }, 600);
      sfxNo(); speak(msg.textContent);
      if (S.tries >= 2) app.querySelectorAll('.opt').forEach((b, k) => { if (q.opts[k].ok) b.classList.add('hint'); });
    }
  }

  function finish() {
    const w = WORLDS[S.k], last = S.k === WORLDS.length - 1, allDone = WORLDS.every(x => prog(x.id) >= 10);
    app.innerHTML = `<div class="wrap fin">
      <div class="trophy">🏆</div>
      <h1>כל הכבוד!</h1>
      <div class="sub">${allDone ? 'סיימתם את כל העולמות! 🌈' : `סיימתם את העולם ${w.icon} ${w.name}`}</div>
      <div class="stars">${'<span class="on">⭐</span>'.repeat(10)}</div>
      ${last ? '' : '<button class="next" id="nextw">עולם הבא ◀️</button>'}
      <button class="play" id="again">🔁 שוב</button>
      <button class="rb" id="homeb" aria-label="בית" style="margin:0 auto">🏠</button></div>`;
    confetti(70); sfxOk(); speak(allDone ? 'כל הכבוד! סיימתם את כל העולמות!' : 'כל הכבוד! סיימתם את העולם');
    const nw = document.getElementById('nextw'); if (nw) nw.onclick = () => startWorld(S.k + 1);
    document.getElementById('again').onclick = () => startWorld(S.k);
    document.getElementById('homeb').onclick = home;
  }

  home();
} else {
  module.exports = { WORLDS };
}
