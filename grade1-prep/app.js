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

// ================= עולם 11 – קווים (מתיחת קו וחיבור נקודות) =================
const NS = 'http://www.w3.org/2000/svg';
function mkAct(say, vis, act) { return { say, vis, opts: [{ h: '⭐', ok: true }], cls: 'hide', act }; }
const TRACES = {
  line: 'M30 100 L270 100', vert: 'M150 20 L150 180', diag: 'M30 170 L270 30',
  zig: 'M25 150 L85 50 L145 150 L205 50 L265 150', stairs: 'M30 165 L90 165 L90 125 L150 125 L150 85 L210 85 L210 45 L270 45',
  wave: 'M20 100 C60 20 100 20 150 100 S240 180 280 100',
  circle: 'M75 100 A75 75 0 1 1 225 100 A75 75 0 1 1 75 100', square: 'M70 40 L230 40 L230 160 L70 160 L70 40',
  tri: 'M150 25 L255 165 L45 165 L150 25', house: 'M60 170 L60 95 L150 30 L240 95 L240 170 L60 170'
};
function traceAct(d) {
  return (vis, done) => {
    vis.innerHTML = '<svg class="trace" viewBox="0 0 300 200" aria-label="עקבו אחרי הקו"><path class="tg" d="' + d + '"/><path class="tu" d=""/><circle class="ts" r="11"/></svg>';
    const svg = vis.firstChild, guide = svg.querySelector('.tg'), user = svg.querySelector('.tu'), st = svg.querySelector('.ts');
    const N = 44, len = guide.getTotalLength(), pts = [], hit = [];
    for (let i = 0; i < N; i++) { const p = guide.getPointAtLength(len * i / (N - 1)); pts.push(p); hit.push(false); }
    st.setAttribute('cx', pts[0].x); st.setAttribute('cy', pts[0].y);
    let down = false, dd = '', fin = false;
    const xy = e => { const r = svg.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 300, (e.clientY - r.top) / r.height * 200]; };
    const add = e => {
      if (fin) return;
      const q = xy(e); dd += (dd ? ' L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); user.setAttribute('d', dd);
      let n = 0;
      for (let i = 0; i < N; i++) { if (!hit[i] && Math.hypot(pts[i].x - q[0], pts[i].y - q[1]) < 24) hit[i] = true; if (hit[i]) n++; }
      if (n >= N * 0.85) { fin = true; guide.setAttribute('class', 'tg ok'); st.style.display = 'none'; done(); }
    };
    svg.addEventListener('pointerdown', e => { if (e.preventDefault) e.preventDefault(); down = true; dd = ''; try { svg.setPointerCapture(e.pointerId); } catch (x) { } add(e); });
    svg.addEventListener('pointermove', e => { if (down) add(e); });
    const up = () => { down = false; };
    svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
    vis.__trace = { pts: pts, svg: svg };
  };
}
const DOTSETS = {
  house: { closed: true, pts: [[60, 170], [60, 100], [150, 30], [240, 100], [240, 170]] },
  zig: { closed: false, pts: [[25, 150], [65, 60], [105, 150], [145, 60], [185, 150], [225, 60], [265, 150]] },
  circle8: { closed: true, pts: Array.from({ length: 8 }, (_, i) => [150 + 80 * Math.sin(i * Math.PI / 4), 100 - 80 * Math.cos(i * Math.PI / 4)]) },
  star: { closed: true, pts: Array.from({ length: 10 }, (_, i) => { const r = i % 2 ? 38 : 88, a = i * Math.PI / 5; return [150 + r * Math.sin(a), 105 - r * Math.cos(a)]; }) }
};
function dotsAct(set) {
  return (vis, done) => {
    const P = set.pts, n = P.length;
    let h = '<svg class="trace" viewBox="0 0 300 200" aria-label="חברו את הנקודות"><g class="lines"></g>';
    P.forEach((p, i) => { h += '<g class="dot' + (i === 0 ? ' nx' : '') + '" data-n="' + (i + 1) + '" style="cursor:pointer"><circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="19"/><text x="' + p[0].toFixed(1) + '" y="' + (p[1] + 8).toFixed(1) + '" text-anchor="middle">' + (i + 1) + '</text></g>'; });
    vis.innerHTML = h + '</svg>';
    const svg = vis.firstChild, lines = svg.querySelector('.lines'), dots = svg.querySelectorAll('.dot');
    let next = 1, fin = false;
    const line = (a, b) => { const l = document.createElementNS(NS, 'line'); l.setAttribute('x1', a[0]); l.setAttribute('y1', a[1]); l.setAttribute('x2', b[0]); l.setAttribute('y2', b[1]); lines.appendChild(l); };
    dots.forEach((g, i) => {
      g.addEventListener('click', () => {
        if (fin) return;
        if (i + 1 !== next) { g.setAttribute('class', 'dot shk'); setTimeout(() => { g.setAttribute('class', 'dot' + (i + 1 < next ? ' dn' : '')); }, 400); return; }
        g.setAttribute('class', 'dot dn'); tone([500 + i * 50], 0.08, 'triangle', 0.12);
        if (i > 0) line(P[i - 1], P[i]);
        next++;
        if (next > n) { if (set.closed) line(P[n - 1], P[0]); fin = true; done(); }
        else dots[next - 1].setAttribute('class', 'dot nx');
      });
    });
    vis.__dots = { svg: svg, dots: dots };
  };
}
function genLines() {
  const tr = [].concat(take(['line', 'vert', 'diag'], 2), take(['zig', 'stairs', 'wave'], 2), take(['circle', 'square', 'tri', 'house'], 2));
  const dt = shuffle(['house', 'zig']).concat(['circle8', 'star']);
  const T = k => mkAct('עקבו אחרי הקו עם האצבע', '', traceAct(TRACES[tr[k]]));
  const Dn = k => mkAct('חברו את הנקודות לפי המספרים', '', dotsAct(DOTSETS[dt[k]]));
  return [T(0), T(1), Dn(0), T(2), Dn(1), T(3), T(4), Dn(2), T(5), Dn(3)];
}

// ================= עולם 12 – משלימים מספרים =================
function genFill() {
  const seqH = a => `<div class="seq sm">${a.map(x => (x === '?' ? '<span class="qm">❓</span>' : `<span>${x}</span>`)).join('')}</div>`;
  const eqH = (a, op, b, c) => `<div class="seq sm">${[a, '<span class="ar">' + op + '</span>', b, '<span class="ar">＝</span>', c].map(x => (x === '?' ? '<span class="qm">❓</span>' : x === a || x === b || x === c ? `<span>${x}</span>` : x)).join('')}</div>`;
  const qs = [];
  for (let i = 0; i < 2; i++) { const s = rnd(1, 15); qs.push(mkQ('איזה מספר חסר?', seqH([s, s + 1, '?', s + 3, s + 4]), numOpts(s + 2, 1, 20))); }
  { const s = rnd(6, 20); qs.push(mkQ('סופרים אחורה. איזה מספר חסר?', seqH([s, s - 1, '?', s - 3]), numOpts(s - 2, 1, 20))); }
  take([[2, 4, 6, 8], [4, 6, 8, 10], [6, 8, 10, 12], [10, 12, 14, 16], [12, 14, 16, 18]], 2).forEach(a => qs.push(mkQ('סופרים בקפיצות של שתיים. איזה מספר חסר?', seqH([a[0], a[1], '?', a[3]]), numOpts(a[2], 1, 20))));
  take([1, 2, 3, 4, 5, 6, 7, 8, 9], 3).forEach(a => qs.push(mkQ(`${a} ועוד כמה יהיה עשר?`, eqH(a, '➕', '?', 10), numOpts(10 - a, 0, 10))));
  take([5, 8, 12, 15, 16], 2).forEach(a => qs.push(mkQ(`${a} ועוד כמה יהיה עשרים?`, eqH(a, '➕', '?', 20), numOpts(20 - a, 0, 20))));
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
  { id: 'lines', name: 'קווים ונקודות', icon: '✏️', color: '#7b2cbf', gen: genLines },
  { id: 'fill', name: 'משלימים מספרים', icon: '🔟', color: '#00798c', gen: genFill },
];

// ================= ממשק =================
if (typeof document !== 'undefined') {
  const app = document.getElementById('app'), fx = document.getElementById('fx');
  const KEY = 'g1prep';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const save = d => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* מתעלמים */ } };
  let D = load();
  D.p = D.p || {}; // התקדמות לפי עולם (0-10)
  const PRAISE = ['כל הכבוד!', 'יופי!', 'מעולה!', 'נהדר!', 'וואו, נכון!'];
  const BIG = 'וואו, את מדהימה! כל הכבוד! עוד מעט את מוכנה לכיתה א׳. איזה כיף לך!';
  let streak = 0;
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
  // ----- הכנת טקסט להקראה: ניקוד לשמות האותיות, מספרים במילים, בלי אימוג׳י -----
  const NIKUD = { 'אלף': 'אָלֶף', 'בית': 'בֵּית', 'גימל': 'גִּימֶל', 'דלת': 'דָּלֶת', 'הא': 'הֵא', 'וו': 'וָו', 'זין': 'זַיִן', 'חית': 'חֵית', 'טית': 'טֵית', 'יוד': 'יוֹד', 'כף': 'כַּף', 'למד': 'לָמֶד', 'מם': 'מֵם', 'נון': 'נוּן', 'סמך': 'סָמֶךְ', 'עין': 'עַיִן', 'פא': 'פֵּא', 'צדי': 'צָדִי', 'קוף': 'קוֹף', 'ריש': 'רֵישׁ', 'שין': 'שִׁין', 'תו': 'תָּו' };
  const NUMW = ['אֶפֶס', 'אֶחָד', 'שְׁנַיִם', 'שְׁלוֹשָׁה', 'אַרְבָּעָה', 'חֲמִישָׁה', 'שִׁשָּׁה', 'שִׁבְעָה', 'שְׁמוֹנָה', 'תִּשְׁעָה', 'עֲשָׂרָה', 'אַחַד עָשָׂר', 'שְׁנֵים עָשָׂר', 'שְׁלוֹשָׁה עָשָׂר', 'אַרְבָּעָה עָשָׂר', 'חֲמִישָׁה עָשָׂר', 'שִׁשָּׁה עָשָׂר', 'שִׁבְעָה עָשָׂר', 'שְׁמוֹנָה עָשָׂר', 'תִּשְׁעָה עָשָׂר', 'עֶשְׂרִים'];
  const NIK_W = {"אדום": "אָדֹם", "אוטובוס": "אוֹטוֹבּוּס", "אוינק": "אוֹיְנְק", "אוכלים": "אוֹכְלִים", "אומר": "אוֹמֵר", "אופניים": "אוֹפַנַּיִים", "אות": "אוֹת", "אחורה": "אָחוֹרָה", "אחר": "אַחַר", "אחרי": "אַחֲרֵי", "איזה": "אֵיזֶה", "איזו": "אֵיזוֹ", "איפה": "אֵיפֹה", "אפרוחים": "אֶפְרוֹחִים", "אריה": "אַרְיֵה", "את": "אֶת", "באות": "בְּאוֹת", "באיזו": "בְּאֵיזוֹ", "בה": "בָּהּ", "בחרו": "בִּחֲרוּ", "בלון": "בָּלוֹן", "בלונים": "בָּלוֹנִים", "במה": "בַּמֶּה", "בניין": "בִּנְיָן", "בננה": "בָּנָנָה", "בקפיצות": "בְּקְפִיצוֹת", "ברווז": "בַּרְוָז", "בא": "בָּא", "גבוה": "גָּבוֹהַּ", "גדול": "גָּדוֹל", "גמל": "גָּמָל", "גשם": "גֶּשֶׁם", "ג׳ירפה": "גִ׳ירָפָה", "דבר": "דָּבָר", "דג": "דָּג", "דגים": "דָּגִים", "האות": "הָאוֹת", "האצבע": "הָאֶצְבַּע", "הב": "הַב", "היו": "הָיוּ", "היי": "הִי", "הכוכב": "הַכּוֹכָב", "הלב": "הַלֵּב", "הלכו": "הָלְכוּ", "המילה": "הַמִּלָּה", "המלבן": "הַמַּלְבֵּן", "המספר": "הַמִּסְפָּר", "המספרים": "הַמִּסְפָּרִים", "המשולש": "הַמְשֻׁלָּשׁ", "הנקודות": "הַנְּקֻדּוֹת", "העיגול": "הָעִגּוּל", "הצבע": "הַצֶּבַע", "הקבוצה": "הַקְּבוּצָה", "הקו": "הַקַּו", "הקובייה": "הַקֻּבִּיָּה", "הר": "הַר", "הראש": "הָרֹאשׁ", "הרגליים": "הָרַגְלַיִם", "הריבוע": "הָרִבּוּעַ", "ואאר": "גְּרְר", "ועוד": "וְעוֹד", "ורוד": "וָרֹד", "ורוצים": "וְרוֹצִים", "זברה": "זֶבְּרָה", "זהה": "זֵהָה", "חברו": "חַבְּרוּ", "חום": "חוּם", "חזיר": "חֲזִיר", "חסר": "חָסֵר", "חתול": "חָתוּל", "טלפון": "טֶלֶפוֹן", "יהיה": "יִהְיֶה", "יותר": "יוֹתֵר", "יחד": "יַחַד", "ינשוף": "יַנְשׁוּף", "ירוק": "יָרֹק", "יש": "יֵשׁ", "כבד": "כָּבֵד", "כבשה": "כִּבְשָׂה", "כדור": "כַּדּוּר", "כדי": "כְּדֵי", "כוכבים": "כּוֹכָבִים", "כותבים": "כּוֹתְבִים", "כחול": "כָּחֹל", "כך": "כָּךְ", "כל": "כָּל", "כלב": "כֶּלֶב", "כמה": "כַּמָּה", "כשיורד": "כְּשֶׁיּוֹרֵד", "כשקר": "כְּשֶׁקַּר", "כתום": "כָּתֹם", "לא": "לֹא", "לב": "לֵב", "לבן": "לָבָן", "לבנה": "לְבֵנָה", "לבננה": "לַבָּנָנָה", "לגזר": "לַגֶּזֶר", "לדוב": "לַדֹּב", "לובשים": "לוֹבְשִׁים", "לוויתן": "לִוְיָתָן", "לחצו": "לִחֲצוּ", "ללימון": "לַלִּימוֹן", "למלפפון": "לַמְלָפְפוֹן", "לספור": "לִסְפֹּר", "לעגבנייה": "לָעַגְבָנִיָּה", "לענבים": "לָעֲנָבִים", "לפי": "לְפִי", "לפני": "לִפְנֵי", "לצפרדע": "לַצְּפַרְדֵּעַ", "לתות": "לַתּוּת", "לתפוז": "לַתַּפּוּז", "מה": "מָה", "מטריה": "מִטְרִיָּה", "מי": "מִי", "מיאו": "מִיאוּ", "מכוניות": "מְכוֹנִיּוֹת", "מספר": "מִסְפָּר", "מצאו": "מִצְאוּ", "מרובע": "מְרֻבָּע", "מרק": "מָרָק", "משאית": "מַשָּׂאִית", "מתחילה": "מַתְחִילָה", "נבט": "נֶבֶט", "נמלה": "נְמָלָה", "נעל": "נַעַל", "נשארו": "נִשְׁאֲרוּ", "סגול": "סָגֹל", "סוס": "סוּס", "סופרים": "סוֹפְרִים", "עגול": "עָגֹל", "עוגה": "עוּגָה", "עוגיות": "עוּגִיּוֹת", "עכבר": "עַכְבָּר", "על": "עַל", "עלה": "עָלֶה", "עם": "עִם", "עץ": "עֵץ", "עקבו": "עִקְבוּ", "עשר": "עֶשֶׂר", "עשרים": "עֶשְׂרִים", "פותחים": "פּוֹתְחִים", "פחות": "פָּחוֹת", "פיל": "פִּיל", "פרה": "פָּרָה", "פרח": "פֶּרַח", "פרחים": "פְּרָחִים", "פרפרים": "פַּרְפָּרִים", "צב": "צָב", "צבע": "צֶבַע", "צהוב": "צָהֹב", "צורה": "צוּרָה", "צפרדע": "צְפַרְדֵּעַ", "קוואק": "קְוַאק", "קוף": "קוֹף", "קוקוריקו": "קוֹקוֹרִיקוֹ", "קוראים": "קוֹרְאִים", "קטן": "קָטָן", "רכבת": "רַכֶּבֶת", "שותים": "שׁוֹתִים", "שחור": "שָׁחֹר", "שייך": "שַׁיָּיךְ", "שיש": "שֶׁיֵּשׁ", "של": "שֶׁל", "שמים": "שָׂמִים", "שמש": "שֶׁמֶשׁ", "שתיים": "שְׁתַּיִם", "תותים": "תּוּתִים", "תמונה": "תְּמוּנָה", "תפוח": "תַּפּוּחַ", "תפוחים": "תַּפּוּחִים", "תרנגול": "תַּרְנְגוֹל", "מוּ": "מוּ", "סמך": "סָמֶךְ", "בואו": "בּוֹאוּ", "נשחק": "נְשַׂחֵק", "כל הכבוד": "כָּל הַכָּבוֹד", "הכבוד": "הַכָּבוֹד", "כמעט": "כִּמְעַט", "נסו": "נַסּוּ", "שוב": "שׁוּב", "נורא": "נוֹרָא", "עוד": "עוֹד", "פעם": "פַּעַם", "אפשר": "אֶפְשָׁר", "יופי": "יוֹפִי", "מעולה": "מְעוּלֶּה", "נהדר": "נֶהְדָּר", "וואו": "וָאוּ", "נכון": "נָכוֹן", "מדהימה": "מַדְהִימָה", "מעט": "מְעַט", "מוכנה": "מוּכָנָה", "לכיתה": "לְכִתָּה", "כיף": "כֵּיף", "לך": "לָךְ", "סיימתם": "סִיַּמְתֶּם", "העולמות": "הָעוֹלָמוֹת", "העולם": "הָעוֹלָם"};
  function prepSpeech(t) {
    t = String(t).replace(/<[^>]*>/g, ' ');
    t = t.replace(/(^|\s)את(?=\s+(מדהימה|מוכנה|גיבורה|יפה|חכמה))/g, '$1אַתְּ');
    t = t.replace(/א׳/g, 'אָלֶף');
    t = t.replace(/\d+/g, m => (+m <= 20 ? NUMW[+m] : m));
    // אות בודדת שמוקראת בשמה (ולא כחלק ממילה)
    t = t.replace(/(^|[\s"'(])([א-ת])(?=$|[\s.,!?"')])/g, (m, a, L) => a + (NAME[L] ? (NIKUD[NAME[L]] || NAME[L]) : L));
    t = t.replace(/(^|[\s"'(])(אלף|בית|גימל|דלת|הא|וו|זין|חית|טית|יוד|כף|למד|מם|נון|סמך|עין|פא|צדי|קוף|ריש|שין|תו)(?=$|[\s.,!?"')])/g, (m, a, w) => a + NIKUD[w]);
    t = t.replace(/[א-ת׳]+/g, w => (NIK_W.hasOwnProperty(w) ? NIK_W[w] : w));
    t = t.replace(/[^\u0590-\u05FF\sA-Za-z0-9.,!?'"״׳-]/g, ' ').replace(/\s+/g, ' ').trim();
    return t;
  }
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
    t = prepSpeech(t);
    if (!t) return;
    if (!voice) pickVoice();
    if (!voice || !('speechSynthesis' in window)) { speakRemote(t); return; }
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(t);
      u.lang = voice.lang || 'he-IL'; u.voice = voice; u.rate = 0.8; u.pitch = 1.1;
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


  // ----- דמויות ורקעים (ציורים מקוריים) -----
  const CHARS = [
    { id: 'ice', name: 'מלכת הקרח', hair: '#f3ead2', dress: '#7fd3f7', dress2: '#bdeaff', accent: '#e8f8ff', bg: 'linear-gradient(#d9f1ff,#f4e6ff)', fl: ['❄️', '✨', '💎', '⛄'], braid: true },
    { id: 'forest', name: 'נסיכת הצמות', hair: '#b5532a', dress: '#2fb39a', dress2: '#7fe0c8', accent: '#ffd166', bg: 'linear-gradient(#dff7e6,#fff1d6)', fl: ['🌸', '🍃', '🦋', '🌷'], braid: true },
    { id: 'pink', name: 'נסיכה אופנתית', hair: '#f6d365', dress: '#ff6fb1', dress2: '#ffb3d6', accent: '#ffe066', bg: 'linear-gradient(#ffe0f0,#ffeefb)', fl: ['💖', '🎀', '👑', '✨'], braid: false }
  ];
  const chById = id => CHARS.filter(c => c.id === id)[0] || CHARS[0];
  function charSVG(c) {
    const hairBack = c.braid
      ? `<path d="M30 40 Q22 70 34 100 Q40 108 46 100 Q42 72 44 48 Z" fill="${c.hair}"/><circle cx="40" cy="104" r="5" fill="${c.accent}"/>`
      : `<path d="M32 36 Q14 60 26 92 Q36 98 42 84 Q38 62 46 44 Z" fill="${c.hair}"/><path d="M88 36 Q106 60 94 92 Q84 98 78 84 Q82 62 74 44 Z" fill="${c.hair}"/>`;
    const sideBraid = c.braid ? `<path d="M90 40 Q98 70 86 100 Q80 108 74 100 Q78 72 76 48 Z" fill="${c.hair}"/><circle cx="80" cy="104" r="5" fill="${c.accent}"/>` : '';
    return `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${c.name}">
      ${hairBack}${sideBraid}
      <path d="M60 78 L22 146 Q60 156 98 146 Z" fill="${c.dress}"/>
      <path d="M60 78 L40 146 Q60 150 80 146 Z" fill="${c.dress2}" opacity=".7"/>
      <path d="M44 84 Q60 96 76 84 L72 76 Q60 84 48 76 Z" fill="${c.dress2}"/>
      <rect x="53" y="66" width="14" height="14" rx="5" fill="#ffd9bd"/>
      <ellipse cx="60" cy="48" rx="25" ry="27" fill="#ffd9bd"/>
      <path d="M34 46 Q36 18 60 18 Q84 18 86 46 Q76 30 60 30 Q44 30 34 46 Z" fill="${c.hair}"/>
      <path d="M46 20 L50 8 L56 16 L60 5 L64 16 L70 8 L74 20 Z" fill="${c.accent}" stroke="#f0b400" stroke-width="1.5" stroke-linejoin="round"/>
      <ellipse cx="50" cy="50" rx="3.6" ry="4.6" fill="#3a2a5a"/><ellipse cx="70" cy="50" rx="3.6" ry="4.6" fill="#3a2a5a"/>
      <circle cx="51.3" cy="48.4" r="1.3" fill="#fff"/><circle cx="71.3" cy="48.4" r="1.3" fill="#fff"/>
      <circle cx="43" cy="60" r="4.5" fill="#ff9aa8" opacity=".55"/><circle cx="77" cy="60" r="4.5" fill="#ff9aa8" opacity=".55"/>
      <path d="M52 62 Q60 70 68 62" fill="none" stroke="#c0394f" stroke-width="2.6" stroke-linecap="round"/>
      <g class="spk"><path d="M100 70 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" fill="#fff" stroke="${c.accent}" stroke-width="1.2"/></g>
    </svg>`;
  }
  let curCh = chById(D.ch);
  const mascotHTML = id => `<div class="mascot"${id ? ' id="' + id + '"' : ''}>${charSVG(curCh)}</div>`;
  function setTheme() {
    document.body.style.background = curCh.bg;
    document.body.style.backgroundAttachment = 'fixed';
    let bg = document.getElementById('bg');
    if (!bg) { bg = document.createElement('div'); bg.id = 'bg'; bg.setAttribute('aria-hidden', 'true'); document.body.appendChild(bg); }
    let h = '';
    for (let i = 0; i < 14; i++) h += `<span style="left:${rnd(2, 95)}%;font-size:${rnd(18, 38)}px;animation-duration:${rnd(14, 28)}s;animation-delay:-${rnd(0, 24)}s">${curCh.fl[i % curCh.fl.length]}</span>`;
    bg.innerHTML = h;
  }

  // ----- מסך בית -----
  function home() {
    fx.innerHTML = '';
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    const t = total();
    app.innerHTML = `<div class="wrap">
      <div class="hero">${mascotHTML()}<h1>מתכוננים לכיתה א׳</h1><div class="total">⭐ <bdi dir="ltr">${t} / ${WORLDS.length * 10}</bdi></div></div>
      <div class="chars">${CHARS.map(c => `<button class="ch${c.id === curCh.id ? ' on' : ''}" data-id="${c.id}" aria-label="${c.name}"><span>${charSVG(c)}</span><b>${c.name}</b></button>`).join('')}</div>
      <button class="play" id="play">▶ בואו נשחק!</button>
      <div class="worlds">${WORLDS.map((w, k) => `<button class="world${prog(w.id) >= 10 ? ' done' : ''}" data-i="${k}" style="--c:${w.color};--k:${k}">
        <span class="wi">${w.icon}</span><span>${w.name}</span><span class="wp">${prog(w.id) >= 10 ? '🏆' : '⭐'} <bdi dir="ltr">${prog(w.id)}/10</bdi></span></button>`).join('')}</div>
      <div class="foot"><button class="tiny" id="mute">${D.mute ? '🔇 קול כבוי' : '🔊 קול'}</button> <button class="tiny" id="reset">🗑 איפוס</button></div></div>`;
    app.querySelectorAll('.ch').forEach(b => { b.onclick = () => { D.ch = b.getAttribute('data-id'); save(D); curCh = chById(D.ch); setTheme(); home(); speak(curCh.name); }; });
    document.getElementById('play').onclick = () => {
      let k = WORLDS.findIndex(w => prog(w.id) < 10);
      if (k < 0) k = 0;
      speak('בואו נשחק!');
      startWorld(k);
    };
    app.querySelectorAll('.world').forEach(b => b.onclick = () => startWorld(Number(b.dataset.i)));
    document.getElementById('mute').onclick = () => { D.mute = !D.mute; save(D); home(); };
    document.getElementById('reset').onclick = () => { if (confirm('למחוק את כל הכוכבים ולהתחיל מחדש?')) { D = { p: {}, mute: D.mute, ch: D.ch }; save(D); home(); } };
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
      <div class="say">${mascotHTML("mascot")}<div class="bubble"><span>${q.say}</span><button class="rb small" id="rep" aria-label="שמעו שוב">🔊</button></div></div>
      <div class="visual" id="vis">${q.vis}</div>
      <div class="opts ${q.cls}" id="opts">${q.opts.map((o, j) => `<button class="opt" data-j="${j}">${o.h}</button>`).join('')}</div>
      <div class="msg" id="msg"></div>
      <button class="next" id="next" hidden>${S.i === S.qs.length - 1 ? '🏆' : '◀️'}</button></div>`;
    document.getElementById('homeb').onclick = home;
    document.getElementById('rep').onclick = () => speak(q.say);
    document.getElementById('mutes').onclick = () => { D.mute = !D.mute; save(D); if (D.mute && 'speechSynthesis' in window) speechSynthesis.cancel(); document.getElementById('mutes').textContent = D.mute ? '🔇' : '🔊'; };
    document.getElementById('next').onclick = () => { if (S.i === S.qs.length - 1) finish(); else { S.i++; question(); } };
    app.querySelectorAll('.opt').forEach(b => b.onclick = () => answer(Number(b.dataset.j)));
    if (q.act) q.act(document.getElementById('vis'), () => answer(0));
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
      streak = S.tries === 0 ? streak + 1 : 0;
      const big = streak >= 6;
      if (big) streak = 0;
      const p = big ? BIG : pick(PRAISE);
      msg.className = 'msg'; msg.textContent = p + ' 🎉';
      mascot.className = 'mascot happy';
      const st = document.querySelectorAll('#stars span')[S.i];
      st.className = 'on pop';
      const id = WORLDS[S.k].id;
      if (prog(id) < S.i + 1) { D.p[id] = S.i + 1; save(D); }
      sfxOk(); speak(p); confetti(big ? 70 : S.i === S.qs.length - 1 ? 40 : 14);
      const nx = document.getElementById('next'); nx.hidden = false;
    } else {
      S.tries++; streak = 0;
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

  setTheme();
  home();
} else {
  module.exports = { WORLDS };
}
