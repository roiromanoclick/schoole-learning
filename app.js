// ================= עזרים =================
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = a => a[rnd(0, a.length - 1)];
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fmt = n => n.toLocaleString('en-US');
const ltr = s => `<span class="ltr">${s}</span>`;
const frac = (k, n) => `<span class="frac"><span>${k}</span><span>${n}</span></span>`;

// ================= מספרים במילים =================
const UF = ['', 'אחת', 'שתיים', 'שלוש', 'ארבע', 'חמש', 'שש', 'שבע', 'שמונה', 'תשע'];
const UM = ['', 'אחד', 'שניים', 'שלושה', 'ארבעה', 'חמישה', 'שישה', 'שבעה', 'שמונה', 'תשעה'];
const TEENF = ['עשר', 'אחת עשרה', 'שתים עשרה', 'שלוש עשרה', 'ארבע עשרה', 'חמש עשרה', 'שש עשרה', 'שבע עשרה', 'שמונה עשרה', 'תשע עשרה'];
const TEENM = ['עשרה', 'אחד עשר', 'שנים עשר', 'שלושה עשר', 'ארבעה עשר', 'חמישה עשר', 'שישה עשר', 'שבעה עשר', 'שמונה עשר', 'תשעה עשר'];
const TENS = ['', '', 'עשרים', 'שלושים', 'ארבעים', 'חמישים', 'שישים', 'שבעים', 'שמונים', 'תשעים'];
const THC = ['', '', '', 'שלושת', 'ארבעת', 'חמשת', 'ששת', 'שבעת', 'שמונת', 'תשעת'];

function tokensUnder100(n, masc) {
  if (n === 0) return [];
  if (n < 10) return [(masc ? UM : UF)[n]];
  if (n < 20) return [(masc ? TEENM : TEENF)[n - 10]];
  const t = Math.floor(n / 10), u = n % 10;
  return u ? [TENS[t], (masc ? UM : UF)[u]] : [TENS[t]];
}
const joinTokens = t => t.map((w, i) => (i > 0 && i === t.length - 1 ? 'ו' + w : w)).join(' ');

function numWords(n) {
  const tokens = [];
  const th = Math.floor(n / 1000), h = Math.floor((n % 1000) / 100), rest = n % 100;
  if (th) {
    if (th === 1) tokens.push('אלף');
    else if (th === 2) tokens.push('אלפיים');
    else if (th <= 9) tokens.push(THC[th] + ' אלפים');
    else if (th === 10) tokens.push('עשרת אלפים');
    else tokens.push(joinTokens(tokensUnder100(th, true)) + ' אלף');
  }
  if (h) tokens.push(h === 1 ? 'מאה' : h === 2 ? 'מאתיים' : UF[h] + ' מאות');
  tokens.push(...tokensUnder100(rest, false));
  return joinTokens(tokens);
}

// ================= שברים במילים =================
const DEN = {
  3: ['שליש', 'שלישים', 'm'], 4: ['רבע', 'רבעים', 'm'], 5: ['חמישית', 'חמישיות', 'f'],
  6: ['שישית', 'שישיות', 'f'], 7: ['שביעית', 'שביעיות', 'f'], 8: ['שמינית', 'שמיניות', 'f'],
  9: ['תשיעית', 'תשיעיות', 'f'], 10: ['עשירית', 'עשיריות', 'f'],
};
const NUMM = ['', '', 'שני', 'שלושה', 'ארבעה', 'חמישה', 'שישה', 'שבעה', 'שמונה', 'תשעה'];
const NUMF = ['', '', 'שתי', 'שלוש', 'ארבע', 'חמש', 'שש', 'שבע', 'שמונה', 'תשע'];
function fracWords(k, n) {
  if (n === 2) return 'חצי';
  const [one, many, g] = DEN[n];
  if (k === 1) return one;
  return (g === 'm' ? NUMM : NUMF)[k] + ' ' + many;
}

// ================= ציור =================
function shapeSVG(n, k, { clickable = false, circle = false, filled = null } = {}) {
  const on = filled || new Set(shuffle([...Array(n).keys()]).slice(0, k));
  let cells = '';
  if (circle) {
    const cx = 90, cy = 90, r = 80;
    for (let i = 0; i < n; i++) {
      const a1 = -Math.PI / 2 + (i * 2 * Math.PI) / n, a2 = -Math.PI / 2 + ((i + 1) * 2 * Math.PI) / n;
      const p = a => `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
      cells += `<path class="cell${on.has(i) ? ' on' : ''}" data-i="${i}" d="M${cx} ${cy} L${p(a1)} A${r} ${r} 0 0 1 ${p(a2)} Z"/>`;
    }
    return `<svg width="180" height="180" viewBox="0 0 180 180" class="${clickable ? 'click' : ''}">${cells}</svg>`;
  }
  const w = 300, h = 70, cw = w / n;
  for (let i = 0; i < n; i++)
    cells += `<rect class="cell${on.has(i) ? ' on' : ''}" data-i="${i}" x="${i * cw + 2}" y="2" width="${cw}" height="${h}"/>`;
  return `<svg width="${w + 4}" height="${h + 4}" viewBox="0 0 ${w + 4} ${h + 4}" class="${clickable ? 'click' : ''}">${cells}</svg>`;
}

function fromSides(a, b, c) { // a מול A וכו׳. מחזיר את הקודקודים A,B,C
  const cosA = (b * b + c * c - a * a) / (2 * b * c);
  return [[0, 0], [c, 0], [b * cosA, b * Math.sqrt(Math.max(0, 1 - cosA * cosA))]];
}
function fromAngles(A, B, C) {
  const r = x => (x * Math.PI) / 180;
  return fromSides(Math.sin(r(A)), Math.sin(r(B)), Math.sin(r(C)));
}
function triSVG(pts, { sides, angles, rotate = 0 }) {
  const rot = (rotate * Math.PI) / 180;
  let P = pts.map(([x, y]) => [x * Math.cos(rot) - y * Math.sin(rot), -(x * Math.sin(rot) + y * Math.cos(rot))]);
  const xs = P.map(p => p[0]), ys = P.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const W = 300, H = 200, pad = 40;
  const s = Math.min((W - 2 * pad) / (maxX - minX), (H - 2 * pad) / (maxY - minY));
  P = P.map(([x, y]) => [pad + (x - minX) * s + ((W - 2 * pad) - (maxX - minX) * s) / 2, pad + (y - minY) * s + ((H - 2 * pad) - (maxY - minY) * s) / 2]);
  const G = [(P[0][0] + P[1][0] + P[2][0]) / 3, (P[0][1] + P[1][1] + P[2][1]) / 3];
  const away = (p, d) => { const dx = p[0] - G[0], dy = p[1] - G[1], l = Math.hypot(dx, dy) || 1; return [p[0] + (dx / l) * d, p[1] + (dy / l) * d]; };
  let out = `<polygon points="${P.map(p => p.join(',')).join(' ')}" fill="#dbeafe" stroke="#1d4ed8" stroke-width="3"/>`;
  const text = (p, t) => `<text x="${p[0].toFixed(1)}" y="${(p[1] + 6).toFixed(1)}" font-size="18" font-weight="bold" text-anchor="middle" fill="#111">${t}</text>`;
  if (sides) { // a: BC, b: AC, c: AB
    const mids = [[P[1], P[2]], [P[0], P[2]], [P[0], P[1]]];
    mids.forEach(([p, q], i) => { const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; out += text(away(m, 18), sides[i]); });
  }
  if (angles) {
    angles.forEach((ang, i) => {
      out += text(away(P[i], 24), ang + '°');
      if (ang === 90) {
        const V = P[i], U = P[(i + 1) % 3], Wp = P[(i + 2) % 3];
        const un = v => { const l = Math.hypot(v[0] - V[0], v[1] - V[1]); return [(v[0] - V[0]) / l, (v[1] - V[1]) / l]; };
        const u = un(U), w = un(Wp), z = 14;
        out += `<polyline fill="none" stroke="#dc2626" stroke-width="2" points="${V[0] + u[0] * z},${V[1] + u[1] * z} ${V[0] + (u[0] + w[0]) * z},${V[1] + (u[1] + w[1]) * z} ${V[0] + w[0] * z},${V[1] + w[1] * z}"/>`;
      }
    });
  }
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${out}</svg>`;
}

// טבלת תרגיל מאונך: סימן הפעולה במרכז (משמאל לשני המספרים), שורת העברות למעלה ושורת תוצאה למטה
function vtable(a, op, b, ans, carryCell, resCell, crossable = false) {
  const sa = String(a), sb = String(b), w = Math.max(sa.length, sb.length, String(ans).length);
  const digit = (str, i) => str[i - (w - str.length)] ?? '';
  const row = f => Array.from({ length: w }, (_, i) => f(i, w)).join('');
  return `<table class="vg ltr"><tr><td class="op"></td>${row((i) => `<td>${carryCell(i, w)}</td>`)}</tr>
    <tr><td class="op" rowspan="2">${op}</td>${row((i) => `<td${crossable && digit(sa, i) !== '' ? ` class="cross" data-c="${i}" title="לחצו כדי למחוק (פריטה)"` : ''}>${digit(sa, i)}</td>`)}</tr>
    <tr>${row((i) => `<td class="ul">${digit(sb, i)}</td>`)}</tr>
    <tr><td class="op"></td>${row((i) => `<td>${resCell(i, w)}</td>`)}</tr></table>`;
}

function vgridHTML(a, op, b, ans) {
  const nr = String(ans).length;
  const hint = op === '−'
    ? 'חיסור: כשצריך לפרוט – <b>לחצו על הספרה במספר העליון כדי למחוק אותה</b>, ורשמו בתיבה שמעליה את הערך החדש (בעמודה שקיבלה 10 אפשר לרשום 2 ספרות, למשל 13). אחר כך רשמו את התוצאה מימין לשמאל.'
    : 'רשמו את התוצאה ספרה אחר ספרה, מימין לשמאל. בשורה העליונה (המקווקוות) אפשר לרשום העברות.';
  return `<div class="hint">${hint}</div>` +
    vtable(a, op, b, ans,
      () => '<input type="text" class="scratch" maxlength="2" inputmode="numeric" autocomplete="off" title="העברה / פריטה">',
      (i, w) => (i >= w - nr ? '<input type="text" class="res" maxlength="1" inputmode="numeric" autocomplete="off">' : ''),
      op === '−');
}

function vpartial(a, op, b, ans, part, carries, newLen = 0) {
  return vtable(a, op, b, ans,
    (i, w) => (carries[w - 1 - i] ? `<span class="cr">${carries[w - 1 - i]}</span>` : ''),
    (i, w) => { const k = i - (w - part.length); return k < 0 ? '' : k < newLen ? `<span class="pop">${part[k]}</span>` : part[k]; });
}

// ================= מחוללי שאלות =================
// num: {inputs:[label], answers:[..]}   mc: {options, correct}   color: {n,k}

function genTens() {
  const t = rnd(1, 6);
  const hi = () => rnd(2, 9) * 10, lo = () => rnd(2, 9);
  let prompt, ans, why;
  if (t === 1) { const a = hi(), b = hi(); ans = a * b; prompt = `${ltr(`${a} × ${b} = □`)}`; why = `${ltr(`${a / 10} × ${b / 10} = ${a * b / 100}`)}. מוסיפים שני אפסים (אחד מכל מספר) ← ${fmt(ans)}.`; }
  else if (t === 2) { const a = hi(), b = lo(); ans = a * b; prompt = ltr(`${a} × ${b} = □`); why = `${ltr(`${a / 10} × ${b} = ${a * b / 10}`)}. מוסיפים אפס אחד ← ${fmt(ans)}.`; }
  else if (t === 3) { const q = lo(), d = hi(); ans = q; prompt = ltr(`${fmt(q * d)} ÷ ${d} = □`); why = `מוחקים אפס משני המספרים: ${ltr(`${q * d / 10} ÷ ${d / 10} = ${q}`)}.`; }
  else if (t === 4) { const q = hi(), d = hi(); ans = q; prompt = ltr(`${fmt(q * d)} ÷ ${d} = □`); why = `מוחקים אפס משני המספרים: ${ltr(`${q * d / 10} ÷ ${d / 10} = ${q}`)}.`; }
  else if (t === 5) { const x = pick([hi(), lo()]), b = hi(); ans = x; prompt = ltr(`□ × ${b} = ${fmt(x * b)}`); why = `חסר גורם, לכן מחלקים: ${ltr(`${fmt(x * b)} ÷ ${b} = ${x}`)}.`; }
  else { const q = pick([hi(), lo()]), d = hi(); ans = q * d; prompt = ltr(`□ ÷ ${d} = ${q}`); why = `פעולה הפוכה לחילוק היא כפל: ${ltr(`${q} × ${d} = ${fmt(ans)}`)}.`; }
  return { kind: 'num', prompt: `השלימו את המספר החסר:<br>${prompt}`, inputs: [''], answers: [ans], why };
}

function genVMul() {
  const a = rnd(102, 999), b = rnd(2, 9), ans = a * b;
  const h = Math.floor(a / 100), t = Math.floor(a / 10) % 10, u = a % 10;
  return {
    kind: 'vgrid', prompt: 'פתרו בכפל מאונך:', a, op: '×', b, ans,
    why: `כופלים מימין לשמאל: ${ltr(`${u} × ${b} = ${u * b}`)}, ${ltr(`${t} × ${b} = ${t * b}`)}, ${ltr(`${h} × ${b} = ${h * b}`)} (ועוד העברות). התוצאה: ${fmt(ans)}.`,
  };
}

function genDivRem() {
  const b = rnd(3, 9), a = rnd(20, 200);
  const q = Math.floor(a / b), r = a % b;
  const why = `${ltr(`${b} × ${q} = ${b * q}`)}, ו-${ltr(`${a} − ${b * q} = ${r}`)}. לכן ${ltr(`${a} ÷ ${b} = ${q}`)} ושארית ${r}. (השארית תמיד קטנה מהמחלק!)`;
  const t = rnd(1, 4);
  if (t === 4 && r > 0)
    return { kind: 'num', prompt: `בטיול יש ${a} תלמידים. בכל מיניבוס יש מקום ל-${b} תלמידים. כמה מיניבוסים צריך להזמין?`, a, b, inputs: [''], answers: [q + 1], why: `${ltr(`${a} ÷ ${b} = ${q}`)} ושארית ${r}. התלמידים שנשארו צריכים עוד מיניבוס, ולכן צריך ${q + 1} מיניבוסים.` };
  const prompt = [
    () => ltr(`${a} ÷ ${b} = □ (שארית □)`),
    () => `יש ${a} סוכריות. מחלקים אותן שווה בשווה בין ${b} ילדים. כמה סוכריות יקבל כל ילד, וכמה סוכריות יישארו?`,
    () => `מסדרים ${a} ספרים במדפים, ${b} ספרים בכל מדף. כמה מדפים יתמלאו, וכמה ספרים יישארו?`,
  ][t === 4 ? 0 : t - 1]();
  return { kind: 'num', prompt, a, b, inputs: ['מנה', 'שארית'], answers: [q, r], why };
}

function genAddSub() {
  const isAdd = Math.random() < 0.5, word = Math.random() < 0.3;
  let a, b, ans;
  if (isAdd) { a = rnd(1000, 89999); b = rnd(1000, 99999 - a); ans = a + b; }
  else {
    a = Math.random() < 0.35 ? rnd(1, 9) * pick([1000, 10000]) : rnd(10000, 99999);
    b = rnd(1000, a - 1); ans = a - b;
  }
  const why = isAdd
    ? `מחברים מימין לשמאל, וכשהסכום בעמודה גדול מ-9 ממירים 10 ליחידות מהעמודה הבאה. התוצאה: ${fmt(ans)}.`
    : `מחסרים מימין לשמאל, וכשאי אפשר לחסר – פורטים (לוקחים 1 מהעמודה השמאלית ופורטים ל-10). התוצאה: ${fmt(ans)}.`;
  const op = isAdd ? '+' : '−';
  const prompt = word
    ? (isAdd
      ? `בספרייה יש ${fmt(a)} ספרים בעברית ו-${fmt(b)} ספרים באנגלית. כמה ספרים יש בסך הכול? פתרו בטור:`
      : `באצטדיון יש ${fmt(a)} מקומות. נמכרו ${fmt(b)} כרטיסים. כמה מקומות נשארו פנויים? פתרו בטור:`)
    : (isAdd ? 'פתרו בחיבור מאונך:' : 'פתרו בחיסור מאונך:');
  return { kind: 'vgrid', prompt, a, op, b, ans, why };
}

function randomNumber(minLen, maxLen) {
  const len = rnd(minLen, maxLen);
  let s = String(rnd(1, 9));
  for (let i = 1; i < len; i++) s += Math.random() < 0.3 ? '0' : String(rnd(0, 9));
  return Number(s);
}
const expand = n => {
  const s = String(n), parts = [];
  for (let i = 0; i < s.length; i++) if (s[i] !== '0') parts.push(fmt(Number(s[i]) * 10 ** (s.length - 1 - i)));
  return parts;
};

function genDecimal() {
  const t = rnd(1, 3), n = randomNumber(4, 5);
  if (t === 1) {
    const parts = expand(n), right = parts.join(' + ');
    const opts = new Set([right]);
    for (let guard = 0; opts.size < 4 && guard < 100; guard++) {
      const p = parts.map(x => Number(x.replace(/,/g, ''))), i = rnd(0, p.length - 1);
      if (Math.random() < 0.5 && p[i] >= 10) p[i] /= 10; else p[i] *= 10;
      opts.add(p.map(fmt).join(' + '));
    }
    const options = shuffle([...opts]);
    return { kind: 'mc', prompt: `איך כותבים את המספר ${ltr(fmt(n))} לפי המבנה העשרוני?`, options: options.map(o => ltr(o)), correct: options.indexOf(right), why: `כל ספרה כפולה בערך המקום שלה: ${ltr(right)}.` };
  }
  if (t === 2) {
    const s = String(n), idxs = [...s].map((c, i) => i).filter(i => s[i] !== '0');
    const i = pick(idxs), pos = s.length - 1 - i, d = Number(s[i]), val = d * 10 ** pos;
    let shown = '', k = 0;
    for (let j = 0; j < s.length; j++) { shown += j === i ? `<span class="hl">${s[j]}</span>` : s[j]; k++; if ((s.length - 1 - j) % 3 === 0 && j < s.length - 1) shown += ','; }
    const opts = new Set([val, val * 10, d]);
    if (val >= 10) opts.add(val / 10);
    while (opts.size < 4) opts.add(d * 10 ** rnd(0, 4));
    const options = shuffle([...opts].slice(0, 4));
    return { kind: 'mc', prompt: `מה הערך של הספרה המסומנת במספר ${ltr(shown)}?`, options: options.map(o => ltr(fmt(o))), correct: options.indexOf(val), why: `הספרה ${d} נמצאת במקום ה${['יחידות', 'עשרות', 'מאות', 'אלפים', 'עשרות אלפים'][pos]}, ולכן ערכה ${fmt(val)}.` };
  }
  return { kind: 'num', prompt: `כתבו כמספר:<br>${ltr(expand(n).join(' + '))}`, inputs: [''], answers: [n], why: `מחברים את כל הערכים: ${fmt(n)}. מקום שאין בו ערך הוא אפס.` };
}

function genWords() {
  const n = randomNumber(3, 5);
  if (Math.random() < 0.7)
    return { kind: 'num', prompt: 'כתבו את המספר בספרות:', visual: `<div class="words">${numWords(n)}</div>`, inputs: [''], answers: [n], why: `המספר הוא ${fmt(n)}.` };
  const opts = new Set([n]);
  const s = String(n);
  while (opts.size < 4) {
    const i = rnd(0, s.length - 1), arr = [...s];
    arr[i] = i === 0 ? String(rnd(1, 9)) : String(rnd(0, 9));
    const m = Number(arr.join(''));
    if (m >= 100) opts.add(m);
  }
  const options = shuffle([...opts]);
  return { kind: 'mc', prompt: `איזה מספר מתאים למילים?`, visual: `<div class="words">${numWords(n)}</div>`, options: options.map(o => ltr(fmt(o))), correct: options.indexOf(n), why: `המספר הוא ${fmt(n)}.` };
}

function genFraction() {
  const t = rnd(1, 3);
  const n = t === 3 ? rnd(3, 8) : rnd(3, 10);
  const k = rnd(1, n - 1);
  const circle = n <= 8 && Math.random() < 0.5;
  if (t === 1) {
    return { kind: 'num', prompt: 'איזה שבר מתאר את החלק הצבוע? כתבו כמה חלקים צבועים וכמה חלקים שווים יש בשלם.', visual: shapeSVG(n, k, { circle }), inputs: ['חלקים צבועים (מונה)', 'חלקים בשלם (מכנה)'], answers: [k, n], why: `הצורה מחולקת ל-${n} חלקים שווים, ו-${k} מהם צבועים. השבר הוא ${frac(k, n)}.` };
  }
  if (t === 2) {
    const right = fracWords(k, n), opts = new Set([right, fracWords(n - k, n)]);
    while (opts.size < 4) opts.add(fracWords(rnd(1, 4), rnd(3, 10)));
    const options = shuffle([...opts].slice(0, 4));
    return { kind: 'mc', prompt: 'איך קוראים במילים לחלק הצבוע?', visual: shapeSVG(n, k, { circle }), options, correct: options.indexOf(right), why: `${k} מתוך ${n} חלקים צבועים, זה ${frac(k, n)} וקוראים לו "${right}".` };
  }
  return { kind: 'color', prompt: `צבעו ${fracWords(k, n)} מהשלם (${frac(k, n)}). לחצו על החלקים כדי לצבוע.`, n, k, circle, why: `המכנה ${n} אומר שהשלם מחולק ל-${n} חלקים שווים, והמונה ${k} אומר לצבוע ${k} חלקים.` };
}

const SIDE_TYPES = ['שווה צלעות', 'שווה שוקיים', 'שונה צלעות'];
const ANGLE_TYPES = ['חד זווית', 'ישר זווית', 'קהה זווית'];
const sidesName = (a, b, c) => (a === b && b === c ? 0 : a === b || b === c || a === c ? 1 : 2);

function genSides() {
  const type = rnd(0, 2);
  let s;
  if (type === 0) { const x = rnd(3, 9); s = [x, x, x]; }
  else if (type === 1) { const x = rnd(3, 9); let y; do y = rnd(2, 2 * x - 1); while (y === x); s = shuffle([x, x, y]); }
  else { do s = [rnd(3, 12), rnd(3, 12), rnd(3, 12)]; while (new Set(s).size < 3 || Math.max(...s) >= s.reduce((p, c) => p + c) - Math.max(...s)); }
  const t = sidesName(...s);
  const why = [`כל שלוש הצלעות שוות (${s[0]}), לכן המשולש שווה צלעות.`, 'שתי צלעות שוות באורכן, לכן המשולש שווה שוקיים.', 'כל הצלעות באורכים שונים, לכן המשולש שונה צלעות.'][t];
  const drawn = Math.random() < 0.6;
  return {
    kind: 'mc', prompt: drawn ? 'סווגו את המשולש לפי צלעותיו:' : `משולש שאורכי צלעותיו הם ${ltr(s.join(', '))} ס״מ הוא משולש...`,
    visual: drawn ? triSVG(fromSides(...s), { sides: s, rotate: pick([0, 0, 15, -20, 180]) }) : '',
    options: SIDE_TYPES, correct: t, why,
  };
}

function genAngles() {
  const type = rnd(0, 2);
  let ang;
  if (type === 1) { const x = rnd(15, 75); ang = [90, x, 90 - x]; }
  else if (type === 2) { const a = rnd(95, 140), x = rnd(10, 180 - a - 10); ang = [a, x, 180 - a - x]; }
  else { do { const a = rnd(35, 85), b = rnd(35, 85); ang = [a, b, 180 - a - b]; } while (ang[2] >= 90 || ang[2] < 20); }
  ang = shuffle(ang);
  const t = ang.some(x => x === 90) ? 1 : ang.some(x => x > 90) ? 2 : 0;
  const why = ['כל הזוויות קטנות מ-90°, לכן המשולש חד זווית.', 'יש זווית של 90° בדיוק, לכן המשולש ישר זווית.', 'יש זווית גדולה מ-90°, לכן המשולש קהה זווית.'][t] + ' (סכום זוויות במשולש הוא 180°.)';
  const drawn = Math.random() < 0.6;
  return {
    kind: 'mc', prompt: drawn ? 'סווגו את המשולש לפי זוויותיו:' : `משולש שזוויותיו הן ${ltr(ang.map(a => a + '°').join(', '))} הוא משולש...`,
    visual: drawn ? triSVG(fromAngles(...ang), { angles: ang, rotate: pick([0, 0, 25, -30, 90]) }) : '',
    options: ANGLE_TYPES, correct: t, why,
  };
}

const TOPICS = [
  { id: 'tens', name: 'כפל וחילוק בעשרות שלמות', icon: '🔟', gen: genTens },
  { id: 'vmul', name: 'כפל מאונך (תלת-ספרתי בחד-ספרתי)', icon: '✖️', gen: genVMul },
  { id: 'divrem', name: 'חילוק עם שארית ושאלות מילוליות', icon: '➗', gen: genDivRem },
  { id: 'addsub', name: 'חיבור וחיסור עד 100,000', icon: '➕', gen: genAddSub },
  { id: 'decimal', name: 'מבנה עשרוני', icon: '🏠', gen: genDecimal },
  { id: 'words', name: 'ממילים לספרות', icon: '🔤', gen: genWords },
  { id: 'fraction', name: 'שברים פשוטים', icon: '🍕', gen: genFraction },
  { id: 'triangles', name: 'מיון משולשים', icon: '🔺', gen: () => (Math.random() < 0.5 ? genSides() : genAngles()) },
];

// ================= דוגמאות פתורות (שלב אחר שלב) =================
function demoVMul(a0, b0) {
  const b = b0 ?? rnd(3, 9), a = a0 ?? rnd(124, 999), ans = a * b, ds = String(a).split('').reverse().map(Number);
  const names = ['יחידות', 'עשרות', 'מאות'];
  let carry = 0, part = ''; const carries = {}, steps = [];
  steps.push(`<b>דוגמה:</b> ${ltr(`${a} × ${b}`)}<br>כופלים כל ספרה ב-${b}, מימין לשמאל, ומעבירים כשצריך.` + vpartial(a, '×', b, ans, '', carries));
  ds.forEach((d, i) => {
    const p = d * b + carry, last = i === ds.length - 1;
    let t = `ספרת ה${names[i]}: ${ltr(`${d} × ${b} = ${d * b}`)}`;
    if (carry) t += ` ועוד ${carry} שהועברו = ${p}`;
    part = (last ? String(p) : String(p % 10)) + part;
    t += last ? `. זו הספרה האחרונה, לכן כותבים ${p}.` : `. כותבים ${p % 10}` + (p >= 10 ? ` ומעבירים ${Math.floor(p / 10)} לעמודה הבאה.` : '.');
    carry = Math.floor(p / 10);
    if (!last && carry) carries[i + 1] = carry; else if (!last) delete carries[i + 1];
    steps.push(vpartial(a, '×', b, ans, part, carries, last ? String(p).length : 1) + t);
  });
  steps.push(`<b>התוצאה: ${fmt(ans)}</b> ✅`);
  return steps;
}

function demoAddSub(op, a0, b0) {
  const names = ['יחידות', 'עשרות', 'מאות', 'אלפים', 'עשרות אלפים'];
  const steps = [], carries = {}; let part = '';
  if (op === '+') {
    const a = a0 ?? rnd(20000, 59999), b = b0 ?? rnd(10000, 99999 - a), ans = a + b;
    const A = String(a).split('').reverse().map(Number), B = String(b).split('').reverse().map(Number);
    steps.push(`<b>דוגמה:</b> ${ltr(`${fmt(a)} + ${fmt(b)}`)}<br>מחברים עמודה אחר עמודה, מימין לשמאל.` + vpartial(a, '+', b, ans, '', carries));
    let carry = 0;
    for (let i = 0; i < Math.max(A.length, B.length); i++) {
      const x = A[i] || 0, y = B[i] || 0, sum = x + y + carry, last = i === Math.max(A.length, B.length) - 1;
      let t = `ה${names[i]}: ${ltr(`${x} + ${y}${carry ? ' + ' + carry : ''} = ${sum}`)}`;
      part = (last ? String(sum) : String(sum % 10)) + part;
      t += last ? `. כותבים ${sum}.` : sum >= 10 ? `. כותבים ${sum % 10} ומעבירים 1 לעמודה הבאה.` : `. כותבים ${sum}.`;
      carry = sum >= 10 ? 1 : 0;
      if (!last && carry) carries[i + 1] = 1; else delete carries[i + 1];
      steps.push(vpartial(a, '+', b, ans, part, carries, last ? String(sum).length : 1) + t);
    }
    steps.push(`<b>התוצאה: ${fmt(ans)}</b> ✅`);
    return steps;
  }
  const a = a0 ?? rnd(30000, 90000), b = b0 ?? rnd(1000, a - 1), ans = a - b;
  const A = String(a).split('').reverse().map(Number), B = String(b).split('').reverse().map(Number);
  steps.push(`<b>דוגמה:</b> ${ltr(`${fmt(a)} − ${fmt(b)}`)}<br>מחסרים עמודה אחר עמודה, מימין לשמאל. אם אי אפשר לחסר – פורטים.` + vpartial(a, '−', b, ans, '', carries));
  for (let i = 0; i < A.length; i++) {
    const y = B[i] || 0; let t = `ה${names[i]}: `;
    if (A[i] < y) {
      let j = i + 1; while (A[j] === 0) j++;
      A[j]--; for (let k = i + 1; k < j; k++) A[k] = 9; A[i] += 10;
      t += `אי אפשר לחסר ${y} מ-${A[i] - 10}, לכן פורטים: לוקחים 1 מעמודת ה${names[j]} והופכים ל-10 ביחידות העמודה (עכשיו יש ${A[i]}). `;
    }
    const d = A[i] - y; part = String(d) + part;
    t += `${ltr(`${A[i]} − ${y} = ${d}`)}. כותבים ${d}.`;
    steps.push(vpartial(a, '−', b, ans, part.replace(/^0+(?=.)/, m => (i === A.length - 1 ? '' : m)), {}, i === A.length - 1 && d === 0 ? 0 : 1) + t);
  }
  steps.push(`<b>התוצאה: ${fmt(ans)}</b> ✅`);
  return steps;
}

function demoDivRem(a0, b0) {
  const b = b0 ?? rnd(3, 9), a = a0 ?? b * rnd(5, 15) + rnd(1, b - 1), q = Math.floor(a / b), r = a % b;
  return [
    `<b>דוגמה:</b> ${ltr(`${a} ÷ ${b}`)}<br>שואלים: כמה פעמים ${b} "נכנס" ב-${a}, בלי לעבור אותו?`,
    `בודקים בלוח הכפל של ${b}:<br>${ltr(`${b} × ${q} = ${b * q}`)} ✅ (קטן או שווה ל-${a})<br>${ltr(`${b} × ${q + 1} = ${b * (q + 1)}`)} ❌ (גדול מ-${a})<br>לכן המנה היא <b>${q}</b>.`,
    `מחסרים כדי למצוא את השארית:<br>${ltr(`${a} − ${b * q} = ${r}`)}<br>השארית היא <b>${r}</b>, והיא קטנה מ-${b} ✅`,
    `<b>התשובה: ${q} ושארית ${r}</b><br>בדיקה: ${ltr(`${b} × ${q} + ${r} = ${a}`)} ✅`,
  ];
}

// הפתרון המודרך של אותה שאלה שבה טעו (אותם מספרים)
function buildDemo(topic, q) {
  if (q.kind === 'vgrid') return q.op === '×' ? demoVMul(q.a, q.b) : demoAddSub(q.op, q.a, q.b);
  if (topic.id === 'divrem') {
    const steps = demoDivRem(q.a, q.b);
    if (q.answers.length === 1) steps.push(`כיוון שנשארה שארית ${q.a % q.b}, צריך עוד אחד: <b>${q.answers[0]}</b> ✅`);
    return steps;
  }
  const steps = [`<b>השאלה:</b><br>${q.prompt}${q.kind !== 'color' && q.visual ? q.visual : ''}`];
  let ans;
  if (q.kind === 'mc') ans = q.options[q.correct];
  else if (q.kind === 'num') ans = q.answers.map((x, i) => `${q.inputs[i] ? q.inputs[i].split(' ')[0] + ': ' : ''}${fmt(x)}`).join(' · ');
  else ans = shapeSVG(q.n, q.k, { circle: q.circle, filled: new Set([...Array(q.k).keys()]) });
  steps.push(`<b>איך פותרים:</b><br>${q.why}`);
  steps.push(`<b>התשובה: ${ans}</b> ✅`);
  return steps;
}

// ================= ממשק =================
if (typeof document !== 'undefined') {
  const app = document.getElementById('app');
  const store = { get: () => { try { return JSON.parse(localStorage.getItem('math4') || '{}'); } catch { return {}; } }, set: v => localStorage.setItem('math4', JSON.stringify(v)) };
  let S = null;
  const PRAISE = ['כל הכבוד! 🎉', 'מצוין! ⭐', 'נכון מאוד! 👏', 'יפה מאוד! 💪', 'בול! 🎯'];

  // ----- סיסמת הורה (שומר סף לעזרה, לא אבטחה אמיתית) -----
  const hashPw = t => { let h = 5381; for (const c of t) h = ((h << 5) + h + c.charCodeAt(0)) | 0; return String(h); };
  const getPw = () => localStorage.getItem('math4pw');
  function dialog(title, fields, onOk, info) {
    const ov = document.createElement('div');
    ov.className = 'overlay';
    ov.innerHTML = `<div class="dlg"><h3>${title}</h3>${info ? `<p>${info}</p>` : ''}
      ${fields.map(f => `<input type="password" placeholder="${f}" autocomplete="off">`).join('')}
      <div class="err"></div><button class="go" id="dOk">אישור</button> <button class="ghost" id="dNo">ביטול</button></div>`;
    document.body.appendChild(ov);
    const ins = [...ov.querySelectorAll('input')];
    if (ins[0]) ins[0].focus();
    const close = () => ov.remove();
    const submit = () => { const err = onOk(ins.map(i => i.value)); if (err) ov.querySelector('.err').textContent = err; else close(); };
    ov.querySelector('#dOk').onclick = submit;
    ov.querySelector('#dNo').onclick = close;
    ins.forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); }));
  }
  function askParent(onApproved) {
    if (!getPw()) { dialog('נדרשת סיסמת הורה', [], () => null, 'ההורה צריך להגדיר סיסמה בתפריט הראשי (🔑 סיסמת הורה).'); return; }
    dialog('אישור הורה 🔒', ['סיסמת הורה'], ([v]) => (hashPw(v) === getPw() ? (onApproved(), null) : 'סיסמה שגויה'));
  }
  function setParentPassword() {
    const has = !!getPw();
    dialog(has ? 'שינוי סיסמת הורה' : 'הגדרת סיסמת הורה', has ? ['סיסמה נוכחית', 'סיסמה חדשה'] : ['סיסמה חדשה'], vals => {
      const nw = vals[vals.length - 1];
      if (has && hashPw(vals[0]) !== getPw()) return 'הסיסמה הנוכחית שגויה';
      if (nw.length < 3) return 'לפחות 3 תווים';
      localStorage.setItem('math4pw', hashPw(nw)); return null;
    });
  }

  const hasData = (id, best) => !!(localStorage.getItem(sessKey(id)) || best[id] != null);
  function resetTopic(id) {
    localStorage.removeItem(sessKey(id));
    const b = store.get(); delete b[id]; store.set(b);
  }

  function isDone(id) {
    const d = loadSaved(id);
    return !!d && d.items.every(x => x.done);
  }

  function progress(id) {
    const d = loadSaved(id);
    if (!d) return '';
    const n = d.items.filter(x => x.done).length;
    return n === d.items.length ? '✅ בוצע!' : `▶ ממשיכים: נענו ${n} מתוך ${d.items.length}`;
  }

  function home() {
    S = null; stopDemo();
    const best = store.get();
    app.innerHTML = `
      <button class="mock${isDone('mock') ? ' done' : ''}" id="mock">${isDone('mock') ? '✔ ' : ''}📝 מבחן ניסיון – כל הנושאים (16 שאלות)${progress('mock') ? ' · ' + progress('mock') : ''}</button>
      ${localStorage.getItem(sessKey('mock')) ? '<div class="center" style="margin:-8px 0 12px"><button class="reset" data-reset="mock">🔄 איפוס מבחן הניסיון</button></div>' : ''}
      <div class="grid">${TOPICS.map(t => `
        <div class="topic${isDone(t.id) ? ' done' : ''}" data-id="${t.id}">${isDone(t.id) ? '<div class="tick">✔ בוצע</div>' : ''}<div class="ic">${t.icon}</div><div class="nm">${t.name}</div>
        <div class="best">${best[t.id] != null ? `שיא: ${best[t.id]}/10` : 'עוד לא תרגלתם'}</div>
        <div class="best prog">${progress(t.id)}</div>
        ${hasData(t.id, best) ? `<button class="reset" data-reset="${t.id}">🔄 איפוס</button>` : ''}</div>`).join('')}</div>`;
    app.insertAdjacentHTML('beforeend', '<div class="center"><button class="ghost" id="pw">🔑 סיסמת הורה (לעזרה)</button> <button class="reset" id="resetAll">🗑 איפוס כל התרגולים</button></div>');
    document.getElementById('resetAll').onclick = () => {
      if (confirm('לאפס את כל התרגולים (כל הנושאים ומבחן הניסיון)? ההתקדמות והשיאים יימחקו.')) { [...TOPICS.map(t => t.id), 'mock'].forEach(resetTopic); home(); }
    };
    document.getElementById('pw').onclick = setParentPassword;
    document.getElementById('mock').onclick = () => start('mock');
    app.querySelectorAll('[data-reset]').forEach(b => b.onclick = e => {
      e.stopPropagation();
      const id = b.dataset.reset, name = id === 'mock' ? 'מבחן הניסיון' : TOPICS.find(t => t.id === id).name;
      if (confirm(`לאפס את "${name}"? ההתקדמות והשיא יימחקו.`)) { resetTopic(id); home(); }
    });
    app.querySelectorAll('.topic').forEach(el => el.onclick = () => start(el.dataset.id));
  }

  // ----- שמירת התקדמות (נשמרת גם ביציאה לתפריט ובסגירת הדף) -----
  const sessKey = id => 'math4sess_' + id;
  function persist() {
    if (!S || !S.items) return;
    const data = { id: S.id, idx: S.idx, items: S.items.map(it => ({ tid: it.topic.id, q: it.q, attempts: it.attempts, done: it.done, ok: it.ok, sel: [...it.sel], vals: it.vals, scratch: it.scratch, strikes: it.strikes || [], wrong: [...it.wrong], praise: it.praise })) };
    try { localStorage.setItem(sessKey(S.id), JSON.stringify(data)); } catch { /* מלא / חסום – מתעלמים */ }
  }
  function loadSaved(id) {
    try {
      const d = JSON.parse(localStorage.getItem(sessKey(id)));
      if (!d || !d.items || !d.items.length) return null;
      return { id: d.id, idx: d.idx, items: d.items.map(x => ({ topic: TOPICS.find(t => t.id === x.tid), q: x.q, attempts: x.attempts, done: x.done, ok: x.ok, sel: new Set(x.sel), vals: x.vals || [], scratch: x.scratch || [], strikes: x.strikes || [], wrong: new Set(x.wrong), praise: x.praise })) };
    } catch { return null; }
  }

  function start(id, fresh = false) {
    const saved = fresh ? null : loadSaved(id);
    if (saved) {
      S = saved;
      if (S.items.every(x => x.done)) return finish();
      return goTo(S.idx);
    }
    const queue = id === 'mock' ? shuffle(TOPICS.flatMap(t => [t, t])) : Array(10).fill(TOPICS.find(t => t.id === id));
    S = { id, idx: 0, items: queue.map(topic => ({ topic, q: null, attempts: 0, done: false, ok: false, sel: new Set(), vals: [], scratch: [], wrong: new Set() })) };
    goTo(0);
  }

  const cur = () => S.items[S.idx];
  const scoreOf = () => S.items.filter(it => it.ok).length;

  // שומר את מה שהילד/ה הקלידו בשאלה הנוכחית לפני מעבר
  function saveInputs() {
    if (!S || !S.items || !document.getElementById('fb')) return;
    const it = cur();
    it.vals = [...app.querySelectorAll('input:not(.scratch)')].map(i => i.value);
    it.scratch = [...app.querySelectorAll('input.scratch')].map(i => i.value);
    it.strikes = [...app.querySelectorAll('td.cross.x')].map(td => Number(td.dataset.c));
    persist();
  }

  function goTo(i) {
    if (S.items[S.idx] && S.items[S.idx].q) saveInputs();
    stopDemo();
    S.idx = Math.max(0, Math.min(S.items.length - 1, i));
    const it = cur();
    if (!it.q) it.q = it.topic.gen();
    persist();
    renderQ();
  }

  function renderQ() {
    const it = cur(), q = it.q, total = S.items.length;
    let body = '';
    if (q.kind === 'num')
      body = `<div class="answers">${q.inputs.map((l, i) => `<label>${l}<input type="text" inputmode="numeric" autocomplete="off" data-i="${i}"></label>`).join('')}</div><div class="center"><button class="go" id="chk">בדיקה</button></div>`;
    else if (q.kind === 'vgrid')
      body = `<div class="visual">${vgridHTML(q.a, q.op, q.b, q.ans)}</div><div class="center"><button class="go" id="chk">בדיקה</button></div>`;
    else if (q.kind === 'mc')
      body = `<div class="opts">${q.options.map((o, i) => `<button class="opt" data-i="${i}">${o}</button>`).join('')}</div>`;
    else
      body = `<div class="visual" id="shape">${shapeSVG(q.n, q.k, { clickable: true, circle: q.circle, filled: new Set(it.sel) })}</div><div class="center"><button class="go" id="chk">בדיקה</button></div>`;
    const dots = S.items.map((x, i) => `<button class="dot${i === S.idx ? ' cur' : ''}${x.done ? (x.ok ? ' ok' : ' no') : x.attempts ? ' try' : ''}" data-i="${i}">${i + 1}</button>`).join('');
    app.innerHTML = `<div class="card">
      <div class="top"><button class="menu" id="topMenu">🏠 תפריט</button><span>${S.id === 'mock' ? it.topic.name + ' · ' : ''}שאלה ${S.idx + 1} מתוך ${total}</span><span>${S.items.every(x => x.done) ? '<b style="color:#16a34a">✔ בוצע</b> · ' : ''}⭐ ${scoreOf()}</span></div>
      <div class="dots">${dots}</div>
      <div class="prompt">${q.prompt}</div>
      ${q.kind !== 'color' && q.visual ? `<div class="visual">${q.visual}</div>` : ''}
      ${body}<div id="demo"></div><div id="fb"></div>
      <div class="nav"><button class="go" id="prev" ${S.idx === 0 ? 'disabled' : ''}>→ הקודמת</button>
        <button class="go" id="next">${S.idx === total - 1 ? 'לסיכום 🏁' : 'הבאה ←'}</button></div>
      <div class="center"><button class="ghost" id="finish">🏁 סיום וציון</button> <button class="ghost" id="redo">↺ שאלה זו מחדש</button> <button class="ghost" id="restart">🔄 התחלה מחדש</button> <button class="ghost" id="quit">חזרה לתפריט (ההתקדמות נשמרת)</button></div></div>`;
    document.getElementById('quit').onclick = document.getElementById('topMenu').onclick = () => { saveInputs(); home(); };
    document.getElementById('redo').onclick = resetQuestion;
    document.getElementById('restart').onclick = () => { if (confirm('להתחיל את התרגול מההתחלה? ההתקדמות תימחק.')) start(S.id, true); };
    document.getElementById('finish').onclick = () => { saveInputs(); finish(); };
    document.getElementById('prev').onclick = () => goTo(S.idx - 1);
    document.getElementById('next').onclick = () => (S.idx === total - 1 ? (saveInputs(), finish()) : goTo(S.idx + 1));
    app.querySelectorAll('.dot').forEach(d => d.onclick = () => goTo(Number(d.dataset.i)));

    // שחזור מצב קודם
    const inputs = [...app.querySelectorAll('input:not(.scratch)')];
    inputs.forEach((inp, i) => { inp.value = it.vals[i] ?? ''; });
    app.querySelectorAll('input.scratch').forEach((inp, i) => { inp.value = it.scratch[i] ?? ''; });
    (it.strikes || []).forEach(c => { const td = app.querySelector(`td.cross[data-c="${c}"]`); if (td) td.classList.add('x'); });
    app.querySelectorAll('td.cross').forEach(td => td.onclick = () => { if (it.done) return; td.classList.toggle('x'); saveInputs(); });
    it.wrong.forEach(i => { const b = app.querySelectorAll('.opt')[i]; if (b) { b.classList.add('bad'); b.disabled = true; } });

    if (q.kind === 'vgrid') {
      const res = inputs;
      if (!it.done) res[res.length - 1].focus();
      res.forEach((inp, i) => {
        inp.addEventListener('input', () => { inp.value = inp.value.replace(/\D/g, ''); if (inp.value && i > 0) res[i - 1].focus(); });
        inp.addEventListener('keydown', e => {
          if (e.key === 'Enter') check();
          if (e.key === 'Backspace' && !inp.value && i < res.length - 1) res[i + 1].focus();
        });
      });
    } else {
      if (!it.done && inputs[0]) inputs[0].focus();
      inputs.forEach((inp, i, all) => inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') { if (i < all.length - 1) all[i + 1].focus(); else check(); }
      }));
    }
    app.querySelectorAll('.opt').forEach(b => b.onclick = () => check(Number(b.dataset.i)));
    app.querySelectorAll('svg .cell').forEach(c => c.onclick = () => {
      if (it.done) return;
      const i = Number(c.dataset.i);
      it.sel.has(i) ? it.sel.delete(i) : it.sel.add(i);
      c.classList.toggle('on');
      persist();
    });
    const chk = document.getElementById('chk'); if (chk) chk.onclick = () => check();
    if (it.done) showFeedback(); else if (it.attempts) showRetry();
  }

  let demoTimer = null;
  const stopDemo = () => { clearInterval(demoTimer); demoTimer = null; };
  function openDemo() {
    stopDemo();
    const steps = buildDemo(cur().topic, cur().q), box = document.getElementById('demo');
    let i = 0;
    const draw = () => {
      const playing = demoTimer !== null;
      box.innerHTML = `<div class="demo"><div class="demo-top">💡 הפתרון של השאלה הזו · שלב ${i + 1} מתוך ${steps.length}</div>
        <div class="demo-body">${steps[i]}</div>
        <div class="center"><button class="go" id="dPrev" ${i === 0 ? 'disabled' : ''}>→ הקודם</button>
        <button class="go" id="dPlay" style="background:#f59e0b">${playing ? '⏸ עצור' : (i === steps.length - 1 ? '🔁 הפעל שוב' : '▶ הפעל אוטומטית')}</button>
        <button class="go" id="dNext" ${i === steps.length - 1 ? 'disabled' : ''}>הבא ←</button>
        <button class="ghost" id="dClose">סגירה</button></div></div>`;
      document.getElementById('dPrev').onclick = () => { stopDemo(); i--; draw(); };
      document.getElementById('dNext').onclick = () => { stopDemo(); i++; draw(); };
      document.getElementById('dClose').onclick = () => { stopDemo(); box.innerHTML = ''; };
      document.getElementById('dPlay').onclick = () => {
        if (demoTimer) { stopDemo(); draw(); return; }
        if (i === steps.length - 1) i = 0;
        demoTimer = setInterval(() => { if (i < steps.length - 1) i++; if (i >= steps.length - 1) stopDemo(); draw(); }, 2500);
        draw();
      };
    };
    draw();
  }

  const MAX_TRIES = 3;
  // מאפס שאלה אחת (גם אחרי שנכשלו בה 3 פעמים) ומתחיל אותה מההתחלה, עם אותם מספרים
  function resetQuestion() {
    stopDemo();
    Object.assign(cur(), { attempts: 0, done: false, ok: false, sel: new Set(), vals: [], scratch: [], strikes: [], wrong: new Set(), praise: undefined });
    persist(); renderQ();
  }

  function showRetry() {
    const left = MAX_TRIES - cur().attempts;
    document.getElementById('fb').innerHTML = `<div class="fb no"><b>❌ לא מדויק, נסו שוב!</b> נשארו עוד ${left === 1 ? 'ניסיון אחד' : left + ' ניסיונות'}.</div>`;
  }

  function showFeedback() {
    const it = cur(), q = it.q, ok = it.ok;
    let correctText;
    if (q.kind === 'vgrid') correctText = fmt(q.ans);
    else if (q.kind === 'num') correctText = q.answers.map((a, i) => `${q.inputs[i] ? q.inputs[i].split(' ')[0] + ': ' : ''}${fmt(a)}`).join(' · ');
    else if (q.kind === 'mc') correctText = q.options[q.correct];
    else correctText = `${q.k} חלקים צבועים`;
    app.querySelectorAll('input').forEach(i => { i.disabled = true; if (ok) i.style.borderColor = '#16a34a'; });
    if (q.kind === 'mc') app.querySelectorAll('.opt').forEach((b, i) => { b.disabled = true; if (i === q.correct && (ok || it.attempts >= MAX_TRIES)) b.classList.add('good'); });
    document.getElementById('fb').innerHTML = `<div class="fb ${ok ? 'ok' : 'no'}">
      <b>${ok ? '✅ ' + (it.praise || (it.praise = pick(PRAISE))) : 'לא נורא, בואו נבין ביחד 🤔'}</b>
      ${ok ? '' : `<div>התשובה הנכונה: ${correctText}</div>`}<div>${q.why}</div></div>
      <div class="center"><button class="go" id="again1" style="background:#16a34a">↺ ${ok ? 'לפתור שוב' : 'לנסות שוב מההתחלה'}</button>
      ${ok ? '' : '<button class="go" id="help" style="background:#f59e0b">🔒 עזרה – באישור הורה</button>'}</div>`;
    document.getElementById('again1').onclick = resetQuestion;
    const help = document.getElementById('help');
    if (help) help.onclick = () => askParent(openDemo);
    const chk = document.getElementById('chk'); if (chk) chk.disabled = true;
  }

  function check(choice) {
    const it = cur(), q = it.q;
    if (it.done) return;
    let ok = false;
    const inputs = [...app.querySelectorAll('input:not(.scratch)')];
    if (q.kind === 'vgrid') {
      const vals = inputs.map(i => i.value);
      if (vals.some(v => v === '')) return;
      ok = Number(vals.join('')) === q.ans;
    } else if (q.kind === 'num') {
      const vals = inputs.map(i => i.value.replace(/[,\s]/g, ''));
      if (vals.some(v => v === '')) return;
      ok = vals.every((v, i) => Number(v) === q.answers[i]);
    } else if (q.kind === 'mc') {
      ok = choice === q.correct;
    } else {
      ok = it.sel.size === q.k;
    }
    it.attempts++;
    saveInputs();
    if (!ok && it.attempts < MAX_TRIES) { // עוד ניסיון, בלי לחשוף את התשובה
      if (q.kind === 'mc') { it.wrong.add(choice); const b = app.querySelectorAll('.opt')[choice]; b.classList.add('bad'); b.disabled = true; }
      if (q.kind === 'num') { inputs[0].focus(); inputs[0].select(); }
      if (q.kind === 'vgrid') inputs[inputs.length - 1].focus();
      persist();
      showRetry();
      refreshDot();
      return;
    }
    it.done = true; it.ok = ok;
    persist();
    if (q.kind === 'mc' && !ok) it.wrong.add(choice);
    showFeedback();
    refreshDot();
    document.querySelector('.top span:last-child').innerHTML = `${S.items.every(x => x.done) ? '<b style="color:#16a34a">✔ בוצע</b> · ' : ''}⭐ ${scoreOf()}`;
  }

  function refreshDot() {
    const it = cur(), d = app.querySelectorAll('.dot')[S.idx];
    d.className = `dot cur${it.done ? (it.ok ? ' ok' : ' no') : it.attempts ? ' try' : ''}`;
  }

  function finish() {
    stopDemo(); persist();
    const total = S.items.length, score = scoreOf(), pct = Math.round((score / total) * 100);
    const answered = S.items.filter(x => x.done).length;
    if (S.id !== 'mock' && answered === total) { const b = store.get(); b[S.id] = Math.max(b[S.id] || 0, score); store.set(b); }
    const per = {};
    S.items.forEach(x => { const p = per[x.topic.id] || (per[x.topic.id] = [0, 0]); p[1]++; if (x.ok) p[0]++; });
    const rows = TOPICS.filter(t => per[t.id]).map(t => `<tr><td>${t.icon} ${t.name}</td><td>${per[t.id][0]}/${per[t.id][1]}</td></tr>`).join('');
    app.innerHTML = `<div class="card center">
      ${answered === total ? '<div class="doneBanner">✔ בוצע!</div>' : ''}
      <div class="big">${pct >= 90 ? '🏆' : pct >= 70 ? '😀' : '💪'}</div>
      <h2>${score} מתוך ${total} (${pct}%)</h2>
      ${answered < total ? `<p>⚠️ נשארו ${total - answered} שאלות ללא מענה סופי.</p>` : ''}
      <p>${pct >= 90 ? 'מדהים! אתם מוכנים למבחן!' : pct >= 70 ? 'טוב מאוד! עוד קצת תרגול ואתם שם.' : 'ממשיכים לתרגל – כל סיבוב משפר!'}</p>
      <table class="res">${rows}</table>
      <button class="go" id="back">↩ חזרה לשאלות</button> <button class="go" id="again">תרגול חדש</button> <button class="go" id="menu" style="background:#6b7280">לתפריט</button></div>`;
    const id = S.id;
    document.getElementById('back').onclick = () => goTo(S.idx);
    document.getElementById('again').onclick = () => start(id, true);
    document.getElementById('menu').onclick = home;
  }

  window.addEventListener('beforeunload', () => { if (S && S.items && document.getElementById('fb')) saveInputs(); });
  app.addEventListener('input', () => { if (S && S.items) saveInputs(); });

  home();
} else {
  module.exports = { TOPICS, numWords, fracWords, buildDemo };
}
