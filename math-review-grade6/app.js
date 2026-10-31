// ================= עזרים =================
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = a => a[rnd(0, a.length - 1)];
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fmt = n => n.toLocaleString('en-US');
const ltr = s => `<span class="ltr">${s}</span>`;
const frac = (k, n) => `<span class="frac"><span>${k}</span><span>${n}</span></span>`;
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const reduce = (n, d) => { const g = gcd(n, d); return [n / g, d / g]; };
const F = (n, d) => (d === 1 ? String(n) : frac(n, d)); // שבר, או מספר שלם כשהמכנה 1
const FA = ([n, d]) => F(n, d);

// ================= שבר כמנת חילוק =================
function genFracDiv() {
  const v = pick(['mc', 'mc', 'toFrac', 'toFrac', 'val', 'red', 'dec', 'share', 'concept']);
  if (v === 'mc') {
    let a = rnd(1, 9), b = rnd(2, 9);
    if (a === b) a = b - 1;
    const opts = [[`${a} : ${b}`, true], [`${b} : ${a}`, false], [`${a} − ${b}`, false], [`${a} × ${b}`, false]];
    const o = shuffle(opts);
    return {
      kind: 'mc', prompt: `איזה תרגיל חילוק מתאים לשבר ${frac(a, b)} ?`,
      options: o.map(x => ltr(x[0])), correct: o.findIndex(x => x[1]),
      why: `קו השבר הוא סימן חילוק: המונה (למעלה) הוא המחולק והמכנה (למטה) הוא המחלק. לכן ${ltr(`${frac(a, b)} = ${a} : ${b}`)}.`,
    };
  }
  if (v === 'toFrac') {
    let a = rnd(1, 9), b = rnd(2, 9);
    if (a === b) a = b - 1;
    return {
      kind: 'fr', mode: 'exact', ans: [a, b], prompt: `כתבו את התרגיל ${ltr(`${a} : ${b}`)} כשבר (בלי לצמצם):`,
      why: `המספר הראשון (המחולק) הולך למונה, והמספר השני (המחלק) הולך למכנה: ${ltr(`${a} : ${b} = ${frac(a, b)}`)}.`,
    };
  }
  if (v === 'val') {
    const b = rnd(2, 5), k = rnd(1, 5), a = b * k;
    return {
      kind: 'num', prompt: `השלימו: ${ltr(`${frac(a, b)} =`)}`, inputs: ['תוצאה'], answers: [k],
      why: `${ltr(`${frac(a, b)} = ${a} : ${b} = ${k}`)}`,
    };
  }
  if (v === 'red') {
    let a, b;
    do { b = rnd(4, 12); a = rnd(1, b - 1); } while (gcd(a, b) === 1);
    const [rn, rd] = reduce(a, b);
    return {
      kind: 'fr', mode: 'reduce', ans: [rn, rd], prompt: `השלימו וכתבו שבר מצומצם: ${ltr(`${frac(a, b)} =`)}`,
      why: `מצמצמים ב-${gcd(a, b)}: ${ltr(`${frac(a, b)} = ${frac(rn, rd)}`)}.`,
    };
  }
  if (v === 'dec') {
    const [a, b] = pick([[5, 2], [3, 4], [1, 5], [7, 10], [9, 4], [1, 4], [3, 5], [7, 2], [1, 2], [9, 5], [11, 10]]);
    return {
      kind: 'num', prompt: `כתבו כמספר עשרוני: ${ltr(`${frac(a, b)} =`)}`, inputs: ['מספר עשרוני'], answers: [a / b],
      why: `${ltr(`${frac(a, b)} = ${a} : ${b} = ${fmt(a / b)}`)}`,
    };
  }
  if (v === 'share') {
    let a, b;
    do { a = rnd(2, 9); b = rnd(2, 8); } while (a === b || gcd(a, b) !== 1);
    const pizza = Math.random() < 0.5;
    return {
      kind: 'fr', mode: 'reduce', ans: [a, b],
      prompt: pizza ? `מחלקים ${a} פיצות שווה בשווה בין ${b} ילדים. כמה פיצות יקבל כל ילד? (כתבו כשבר)` : `מוזגים ${a} ליטרים של מיץ שווה בשווה ל-${b} כוסות. כמה ליטרים יהיו בכל כוס? (כתבו כשבר)`,
      why: `מחלקים ${a} ב-${b}: ${ltr(`${a} : ${b} = ${frac(a, b)}`)}. ${a > b ? 'התוצאה גדולה מ-1 כי יש יותר ' + (pizza ? 'פיצות' : 'ליטרים') + ' מאשר ' + (pizza ? 'ילדים' : 'כוסות') + '.' : ''}`,
    };
  }
  // concept
  if (Math.random() < 0.5) {
    const o = shuffle([['חילוק', true], ['חיבור', false], ['כפל', false], ['חיסור', false]]);
    return { kind: 'mc', prompt: 'קו השבר מייצג פעולה של...', options: o.map(x => x[0]), correct: o.findIndex(x => x[1]), why: 'קו השבר הוא סימן חילוק: המונה מחולק במכנה.' };
  }
  const a = rnd(1, 8), b = rnd(a + 1, 9), askNum = Math.random() < 0.5;
  const pool = new Set([a, b, a + b, b - a]);
  while (pool.size < 4) pool.add(rnd(1, 15));
  const right = askNum ? a : b, o = shuffle([...pool]);
  return {
    kind: 'mc', prompt: `בשבר ${frac(a, b)} , איזה מספר הוא ה${askNum ? 'מונה' : 'מכנה'}?`, options: o.map(String), correct: o.indexOf(right),
    why: `המונה הוא המספר שמעל לקו השבר (${a}), והמכנה הוא המספר שמתחת לקו השבר (${b}).`,
  };
}

// ================= כפל שברים =================
function genFMul() {
  const whole = Math.random() < 0.35;
  if (whole) {
    const n = rnd(2, 6), d = rnd(2, 8), c = rnd(1, d - 1), [rn, rd] = reduce(n * c, d);
    return {
      kind: 'fr', mode: 'reduce', ans: [rn, rd], prompt: `פתרו וצמצמו במידת האפשר:<br>${ltr(`${n} × ${frac(c, d)} =`)}`,
      why: `כותבים ${n} כשבר עם מכנה 1 ואז כופלים: ${ltr(`${frac(n, 1)} × ${frac(c, d)} = ${frac(n * c, d)}${gcd(n * c, d) > 1 ? ' = ' + FA([rn, rd]) : ''}`)}`,
      steps: [
        `כותבים את המספר השלם כשבר שהמכנה שלו הוא 1:<br>${ltr(`${n} = ${frac(n, 1)}`)}`,
        `כופלים מונה במונה: ${ltr(`${n} × ${c} = ${n * c}`)}<br>ומכנה במכנה: ${ltr(`1 × ${d} = ${d}`)}<br>${ltr(`${frac(n, 1)} × ${frac(c, d)} = ${frac(n * c, d)}`)}`,
        gcd(n * c, d) > 1 ? `מצמצמים ב-${gcd(n * c, d)}:<br>${ltr(`${frac(n * c, d)} = ${FA([rn, rd])}`)}` : 'אי אפשר לצמצם יותר (אין מספר שמחלק גם את המונה וגם את המכנה).',
      ],
    };
  }
  const b = rnd(2, 9), d = rnd(2, 9), a = rnd(1, b - 1), c = rnd(1, d - 1), [rn, rd] = reduce(a * c, b * d), g = gcd(a * c, b * d);
  return {
    kind: 'fr', mode: 'reduce', ans: [rn, rd], prompt: `פתרו וצמצמו במידת האפשר:<br>${ltr(`${frac(a, b)} × ${frac(c, d)} =`)}`,
    why: `מונה במונה ומכנה במכנה: ${ltr(`${frac(a, b)} × ${frac(c, d)} = ${frac(a * c, b * d)}${g > 1 ? ' = ' + FA([rn, rd]) : ''}`)}`,
    steps: [
      `כופלים מונה במונה: ${ltr(`${a} × ${c} = ${a * c}`)}`,
      `כופלים מכנה במכנה: ${ltr(`${b} × ${d} = ${b * d}`)}<br>${ltr(`${frac(a, b)} × ${frac(c, d)} = ${frac(a * c, b * d)}`)}`,
      g > 1 ? `מצמצמים ב-${g}:<br>${ltr(`${frac(a * c, b * d)} = ${FA([rn, rd])}`)}` : 'אי אפשר לצמצם יותר (אין מספר שמחלק גם את המונה וגם את המכנה).',
    ],
  };
}

// ================= חילוק שברים =================
function genFDiv() {
  const r = Math.random();
  if (r < 0.1) {
    if (Math.random() < 0.5) {
      const o = shuffle([['הופכים את השבר השני וכופלים', true], ['הופכים את השבר הראשון וכופלים', false], ['הופכים את שני השברים וכופלים', false], ['כופלים מונה במונה ומכנה במכנה בלי להפוך', false]]);
      return { kind: 'mc', prompt: 'כיצד מחלקים שבר בשבר?', options: o.map(x => x[0]), correct: o.findIndex(x => x[1]), why: 'בחילוק שברים משאירים את השבר הראשון כפי שהוא, הופכים את השבר השני ועוברים לכפל.' };
    }
    const o = shuffle([['כי חילוק בשבר שווה לכפל בשבר ההפוך לו (למשל חילוק ב-½ שווה לכפל ב-2)', true], ['כי כך החישוב יוצא תמיד קטן יותר', false], ['כי אסור לחלק שברים', false], ['כי המכנה חייב להיות 1', false]]);
    return { kind: 'mc', prompt: 'מדוע בחילוק שברים הופכים את השבר השני וכופלים?', options: o.map(x => x[0]), correct: o.findIndex(x => x[1]), why: `חילוק בודק כמה פעמים השבר המחלק נכנס בשבר הראשון. למשל, בשלם אחד נכנסים 2 חצאים: ${ltr(`1 : ${frac(1, 2)} = 2 = 1 × ${frac(2, 1)}`)}. לכן אפשר להפוך את השבר השני ולכפול.` };
  }
  if (r < 0.4) {
    const b = rnd(2, 8), a = rnd(1, b - 1), n = rnd(2, 6), [rn, rd] = reduce(a, b * n), g = gcd(a, b * n);
    return {
      kind: 'fr', mode: 'reduce', ans: [rn, rd], prompt: `פתרו וצמצמו במידת האפשר:<br>${ltr(`${frac(a, b)} : ${n} =`)}`,
      why: `כותבים ${n} כשבר ${frac(n, 1)}, הופכים אותו וכופלים: ${ltr(`${frac(a, b)} × ${frac(1, n)} = ${frac(a, b * n)}${g > 1 ? ' = ' + FA([rn, rd]) : ''}`)}`,
      steps: [
        `כותבים את המספר השלם כשבר: ${ltr(`${n} = ${frac(n, 1)}`)}`,
        `משאירים את השבר הראשון, הופכים את השני ועוברים לכפל:<br>${ltr(`${frac(a, b)} : ${frac(n, 1)} = ${frac(a, b)} × ${frac(1, n)}`)}`,
        `כופלים: ${ltr(`${frac(a, b)} × ${frac(1, n)} = ${frac(a, b * n)}`)}`,
        g > 1 ? `מצמצמים ב-${g}:<br>${ltr(`${frac(a, b * n)} = ${FA([rn, rd])}`)}` : 'אי אפשר לצמצם יותר.',
      ],
    };
  }
  let a, b, c, d, ans;
  do {
    b = rnd(2, 8); a = rnd(1, b - 1); d = Math.random() < 0.3 ? b : rnd(2, 8); c = rnd(1, d - 1);
    ans = reduce(a * d, b * c);
  } while (ans[0] / ans[1] > 8);
  const g = gcd(a * d, b * c), [rn, rd] = ans;
  return {
    kind: 'fr', mode: 'reduce', ans, prompt: `פתרו וצמצמו במידת האפשר:<br>${ltr(`${frac(a, b)} : ${frac(c, d)} =`)}`,
    why: `משאירים את הראשון, הופכים את השני וכופלים: ${ltr(`${frac(a, b)} × ${frac(d, c)} = ${frac(a * d, b * c)}${g > 1 ? ' = ' + FA(ans) : ''}`)}`,
    steps: [
      `משאירים את השבר הראשון כפי שהוא, והופכים את השבר השני:<br>${ltr(`${frac(c, d)} ⟵ ${frac(d, c)}`)}`,
      `עוברים לכפל:<br>${ltr(`${frac(a, b)} : ${frac(c, d)} = ${frac(a, b)} × ${frac(d, c)}`)}`,
      `כופלים מונה במונה ומכנה במכנה: ${ltr(`${frac(a * d, b * c)}`)}`,
      g > 1 ? `מצמצמים ב-${g}:<br>${ltr(`${frac(a * d, b * c)} = ${F(rn, rd)}`)}` : 'אי אפשר לצמצם יותר.',
    ],
  };
}

// ================= מנסרות =================
const PRISMS = { 3: 'משולשת', 4: 'מרובעת', 5: 'מחומשת', 6: 'משושה' };
const prismName = n => 'מנסרה ' + PRISMS[n];
const PROPS = {
  bases: { label: 'בסיסים', f: () => 2 }, side: { label: 'פאות צדדיות', f: n => n },
  faces: { label: 'פאות בסך הכול', f: n => n + 2 }, verts: { label: 'קודקודים', f: n => 2 * n }, edges: { label: 'מקצועות', f: n => 3 * n },
};
function prismSVG(n, h = 80) {
  const W = 260, H = 230, cx = 130, r = 78, ry = 26, yb = 175, yt = yb - h;
  const th = i => Math.PI / 2 + (2 * Math.PI * i) / n;
  const bot = i => [cx + r * Math.cos(th(i)), yb + ry * Math.sin(th(i))], top = i => [cx + r * Math.cos(th(i)), yt + ry * Math.sin(th(i))];
  const visFace = i => Math.sin(th(i) + Math.PI / n) > 0.001; // הפאה שבין קודקוד i ל-i+1 פונה אלינו
  const pt = p => p.map(x => x.toFixed(1)).join(',');
  const dash = 'stroke-dasharray="6 5" stroke-opacity=".6"';
  let out = '';
  for (let i = 0; i < n; i++) if (visFace(i)) out += `<polygon points="${pt(bot(i))} ${pt(bot((i + 1) % n))} ${pt(top((i + 1) % n))} ${pt(top(i))}" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="3" stroke-linejoin="round"/>`;
  out += `<polygon points="${Array.from({ length: n }, (_, i) => pt(top(i))).join(' ')}" fill="#e0f2fe" stroke="#1d4ed8" stroke-width="3" stroke-linejoin="round"/>`;
  for (let i = 0; i < n; i++) { // קווים נסתרים (מקווקווים)
    const j = (i + 1) % n;
    if (!visFace(i)) out += `<line x1="${bot(i)[0]}" y1="${bot(i)[1]}" x2="${bot(j)[0]}" y2="${bot(j)[1]}" stroke="#1d4ed8" stroke-width="2" ${dash}/>`;
    if (!visFace(i) && !visFace((i + n - 1) % n)) out += `<line x1="${bot(i)[0]}" y1="${bot(i)[1]}" x2="${top(i)[0]}" y2="${top(i)[1]}" stroke="#1d4ed8" stroke-width="2" ${dash}/>`;
  }
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${out}</svg>`;
}
const PRISM_CONCEPTS = [
  { q: 'לפי מה נותנים למנסרה את שמה?', o: ['לפי צורת הבסיס', 'לפי גובה המנסרה', 'לפי גודל הפאות הצדדיות', 'לפי מספר הבסיסים'], why: 'סוג המנסרה נקבע לפי צורת הבסיס שלה. בסיס משולש – מנסרה משולשת, בסיס מרובע – מנסרה מרובעת, וכן הלאה.' },
  { q: 'כמה בסיסים יש לכל מנסרה?', o: ['שני בסיסים', 'בסיס אחד', 'שלושה בסיסים', 'מספר הבסיסים תלוי בסוג המנסרה'], why: 'לכל מנסרה יש שני בסיסים זהים ומקבילים.' },
  { q: 'האם שני הבסיסים של מנסרה זהים?', o: ['כן, הם זהים ומקבילים', 'כן, אבל הם אינם מקבילים', 'לא, הם שונים זה מזה', 'רק במנסרה מרובעת'], why: 'שני הבסיסים של מנסרה זהים (חופפים) ומקבילים זה לזה.' },
  { q: 'האם גליל הוא מנסרה?', o: ['לא, כי הבסיסים עגולים ויש לו משטח צדדי מעוגל', 'כן, כי יש לו שני בסיסים זהים', 'כן, כי יש לו גובה', 'לא, כי יש לו בסיס אחד'], why: 'לגליל יש שני בסיסים עגולים ומשטח צדדי מעוגל (אין לו פאות צדדיות שטוחות), ולכן הוא אינו מנסרה.' },
  { q: 'מה צורת הפאות הצדדיות של מנסרה?', o: ['מקביליות', 'עיגולים', 'משולשים שונים זה מזה', 'מחומשים'], why: 'הפאות הצדדיות של מנסרה הן מקביליות (במנסרה ישרה – מלבנים).' },
  { q: 'מספר הפאות הצדדיות של מנסרה שווה ל...', o: ['מספר הצלעות של הבסיס', 'מספר הבסיסים', 'תמיד 4', 'מספר המקצועות'], why: 'כל צלע של הבסיס יוצרת פאה צדדית אחת, ולכן מספר הפאות הצדדיות שווה למספר הצלעות של הבסיס.' },
  { q: 'איזה גוף הוא מנסרה?', o: ['תיבה', 'כדור', 'גליל', 'חרוט'], why: 'תיבה היא מנסרה מרובעת. כדור, גליל וחרוט אינם מנסרות כי אין להם פאות שטוחות בלבד.' },
];
function genPrism() {
  const v = pick(['count', 'count', 'count', 'reverse', 'reverse', 'table', 'concept']);
  const n = rnd(3, 6);
  const why = `לבסיס יש ${n} צלעות, ולכן: ${n} פאות צדדיות + 2 בסיסים = ${n + 2} פאות בסך הכול; ${n} × 2 = ${2 * n} קודקודים; ${n} × 3 = ${3 * n} מקצועות.`;
  if (v === 'count') {
    const key = pick(Object.keys(PROPS));
    return {
      kind: 'num', prompt: `כמה ${PROPS[key].label} יש ל${prismName(n)}?`, visual: Math.random() < 0.5 ? prismSVG(n) : '',
      inputs: [PROPS[key].label], answers: [PROPS[key].f(n)], why,
    };
  }
  if (v === 'reverse') {
    const key = pick(['side', 'faces', 'verts', 'edges']);
    const o = [3, 4, 5, 6];
    return {
      kind: 'mc', prompt: `למנסרה יש ${PROPS[key].f(n)} ${PROPS[key].label}. איזו מנסרה זו?`, options: o.map(prismName), correct: o.indexOf(n),
      why: `${why} רק ל${prismName(n)} יש בדיוק ${PROPS[key].f(n)} ${PROPS[key].label}.`,
    };
  }
  if (v === 'table') {
    const keys = ['bases', 'faces', 'verts', 'edges'];
    return { kind: 'num', prompt: `השלימו את הנתונים של ${prismName(n)}:`, visual: Math.random() < 0.5 ? prismSVG(n) : '', inputs: keys.map(k => PROPS[k].label), answers: keys.map(k => PROPS[k].f(n)), why };
  }
  const c = pick(PRISM_CONCEPTS), o = shuffle(c.o.map((t, i) => [t, i === 0]));
  return { kind: 'mc', prompt: c.q, options: o.map(x => x[0]), correct: o.findIndex(x => x[1]), why: c.why };
}

// ================= בעיות מילוליות =================
const NAMES = ['דנה', 'רוני', 'נועה', 'מאיה', 'תמר', 'שירה', 'יעל', 'ליה'];
const SISTER = ['אחותה', 'חברתה'];
function genWords() {
  const t = rnd(0, 6);
  const name = pick(NAMES);
  if (t === 0) { // חיבור שברים עם מכנה משותף
    const d = rnd(4, 10), a = rnd(1, d - 2), b = rnd(1, d - 1 - a), s = pick(SISTER);
    const ans = reduce(a + b, d);
    return {
      kind: 'fr', mode: 'reduce', ans, prompt: `${name} אכלה ${frac(a, d)} מעוגה, ו${s} אכלה ${frac(b, d)} מאותה עוגה. איזה חלק מהעוגה אכלו שתיהן יחד?`,
      why: `מחברים: ${ltr(`${frac(a, d)} + ${frac(b, d)} = ${frac(a + b, d)}${gcd(a + b, d) > 1 ? ' = ' + FA(ans) : ''}`)}`,
      steps: ['הפעולה: <b>חיבור</b> (שתיהן יחד).', `התרגיל: ${ltr(`${frac(a, d)} + ${frac(b, d)}`)}`, `במכנה משותף מחברים רק מונים: ${ltr(`${frac(a + b, d)}${gcd(a + b, d) > 1 ? ' = ' + FA(ans) : ''}`)}`],
    };
  }
  if (t === 1) { // מספר שלם כפול שבר (ליטרים)
    const L = rnd(2, 6), d = pick([2, 3, 4, 5, 8]), c = rnd(1, d - 1), ans = reduce(L * c, d);
    return {
      kind: 'fr', mode: 'reduce', ans, prompt: `בקבוק הכיל ${L} ליטרים של מיץ. שתו ממנו ${frac(c, d)} מהכמות. כמה ליטרים של מיץ שתו?`,
      why: `לוקחים שבר מכמות – כופלים: ${ltr(`${L} × ${frac(c, d)} = ${frac(L * c, d)}${gcd(L * c, d) > 1 ? ' = ' + FA(ans) : ''}`)} ליטרים.`,
      steps: ['"שבר מהכמות" = <b>כפל</b>.', `התרגיל: ${ltr(`${L} × ${frac(c, d)}`)}`, `מחשבים: ${ltr(`${frac(L, 1)} × ${frac(c, d)} = ${frac(L * c, d)}${gcd(L * c, d) > 1 ? ' = ' + FA(ans) : ''}`)} ליטרים.`],
    };
  }
  if (t === 2) { // חצי / שליש משבר
    const d = pick([3, 4, 5, 6, 8]), c = rnd(1, d - 1), [w, wd] = pick([['חצי', 2], ['שליש', 3], ['רבע', 4]]);
    const ans = reduce(c, d * wd);
    return {
      kind: 'fr', mode: 'reduce', ans, prompt: `אורך סרט הוא ${frac(c, d)} מטר. גזרו ממנו ${w} מהאורך. מה אורך החלק שנגזר (במטרים)?`,
      why: `${w} מהאורך = כפל ב-${frac(1, wd)}: ${ltr(`${frac(c, d)} × ${frac(1, wd)} = ${frac(c, d * wd)}${gcd(c, d * wd) > 1 ? ' = ' + FA(ans) : ''}`)} מטר.`,
      steps: [`"${w} מהאורך" = לכפול ב-${frac(1, wd)}.`, `התרגיל: ${ltr(`${frac(c, d)} × ${frac(1, wd)}`)}`, `מחשבים: ${ltr(`${frac(c, d * wd)}${gcd(c, d * wd) > 1 ? ' = ' + FA(ans) : ''}`)} מטר.`],
    };
  }
  if (t === 3) { // מספר פעמים שבר
    const n = rnd(2, 6), d = pick([3, 4, 5, 6]), c = rnd(1, d - 1), ans = reduce(n * c, d);
    return {
      kind: 'fr', mode: 'reduce', ans, prompt: `אמא הכינה ${n} עוגות. בכל עוגה השתמשה ב-${frac(c, d)} כוס סוכר. כמה כוסות סוכר השתמשה בסך הכול?`,
      why: `${n} פעמים ${frac(c, d)} – כפל: ${ltr(`${n} × ${frac(c, d)} = ${frac(n * c, d)}${gcd(n * c, d) > 1 ? ' = ' + FA(ans) : ''}`)} כוסות.`,
      steps: ['כמות זהה שחוזרת על עצמה כמה פעמים = <b>כפל</b>.', `התרגיל: ${ltr(`${n} × ${frac(c, d)}`)}`, `מחשבים: ${ltr(`${frac(n * c, d)}${gcd(n * c, d) > 1 ? ' = ' + FA(ans) : ''}`)} כוסות.`],
    };
  }
  if (t === 4) { // כמה כוסות / חלקים - חילוק שבר בשבר
    const d = pick([4, 5, 6, 8, 10]), k = rnd(2, d - 1 > 5 ? 5 : d - 1), c = pick([1, 1, 1, 2].filter(x => x < d)), a = k * c;
    const ans = reduce(a, c), cup = Math.random() < 0.5;
    return {
      kind: 'fr', mode: 'reduce', ans,
      prompt: cup ? `ל${name} יש ${frac(a, d)} ליטר מיץ. היא מוזגת את המיץ לכוסות, ובכל כוס ${frac(c, d)} ליטר. כמה כוסות מלאות היא יכולה למלא?` : `אורך חבל הוא ${frac(a, d)} מטר. רוצים לחתוך אותו לחלקים שאורך כל אחד מהם ${frac(c, d)} מטר. כמה חלקים יתקבלו?`,
      why: `בודקים כמה פעמים ${frac(c, d)} נכנס ב-${frac(a, d)} – חילוק: ${ltr(`${frac(a, d)} : ${frac(c, d)} = ${frac(a, d)} × ${frac(d, c)} = ${F(...reduce(a * d, d * c))}`)}`,
      steps: ['"כמה פעמים נכנס" = <b>חילוק</b>.', `התרגיל: ${ltr(`${frac(a, d)} : ${frac(c, d)}`)}`, `הופכים את השני וכופלים: ${ltr(`${frac(a, d)} × ${frac(d, c)} = ${frac(a * d, d * c)} = ${FA(ans)}`)}`],
    };
  }
  if (t === 5) { // שבר מכמות שלמה
    const d = pick([2, 3, 4, 5, 6, 10]), c = rnd(1, d - 1), total = d * rnd(2, Math.min(6, Math.floor(40 / d)));
    const sport = pick(['חוג כדורסל', 'חוג ציור', 'חוג שחמט', 'חוג תיאטרון']);
    return {
      kind: 'num', prompt: `בכיתה יש ${total} תלמידים. ${frac(c, d)} מהתלמידים משתתפים ב${sport}. כמה תלמידים משתתפים בחוג?`, inputs: ['תלמידים'], answers: [(total * c) / d],
      why: `שבר מכמות – כופלים: ${ltr(`${total} × ${frac(c, d)} = ${frac(total * c, d)} = ${(total * c) / d}`)} תלמידים. (או: מחלקים ב-${d} וכופלים ב-${c}.)`,
      steps: ['"שבר מהכמות" = <b>כפל</b>.', `התרגיל: ${ltr(`${total} × ${frac(c, d)}`)}`, `מחשבים: ${ltr(`${frac(total * c, d)} = ${(total * c) / d}`)} תלמידים.`],
    };
  }
  // חלוקת שבר למספר שלם של מנות
  const b = pick([2, 3, 4, 5]), a = rnd(1, b - 1), n = rnd(2, 5), ans = reduce(a, b * n);
  return {
    kind: 'fr', mode: 'reduce', ans, prompt: `יש ${frac(a, b)} ליטר חלב. מחלקים אותו שווה בשווה בין ${n} כוסות. כמה ליטרים יהיו בכל כוס?`,
    why: `חילוק שבר במספר שלם: ${ltr(`${frac(a, b)} : ${n} = ${frac(a, b)} × ${frac(1, n)} = ${frac(a, b * n)}${gcd(a, b * n) > 1 ? ' = ' + FA(ans) : ''}`)} ליטר.`,
    steps: ['"מחלקים שווה בשווה" = <b>חילוק</b>.', `התרגיל: ${ltr(`${frac(a, b)} : ${n}`)}`, `הופכים את ${n} וכופלים: ${ltr(`${frac(a, b)} × ${frac(1, n)} = ${frac(a, b * n)}${gcd(a, b * n) > 1 ? ' = ' + FA(ans) : ''}`)} ליטר.`],
  };
}

const TOPICS = [
  { id: 'fracdiv', name: 'שבר כמנת חילוק', icon: '➗', gen: genFracDiv },
  { id: 'fmul', name: 'כפל שברים', icon: '✖️', gen: genFMul },
  { id: 'fdiv', name: 'חילוק שברים', icon: '🔄', gen: genFDiv },
  { id: 'prism', name: 'מנסרות', icon: '🧊', gen: genPrism },
  { id: 'words', name: 'בעיות מילוליות', icon: '📖', gen: genWords },
];

// ================= סיכום כללים =================
const RULES = [
  ['➗ שבר כמנת חילוק', `<p>כל שבר מייצג גם תרגיל חילוק: ${ltr(`${frac(3, 4)} = 3 : 4`)} , ${ltr(`${frac(5, 2)} = 5 : 2 = 2.5`)}</p>
    <ul><li>המספר שמעל לקו השבר נקרא <b>מונה</b>.</li><li>המספר שמתחת לקו השבר נקרא <b>מכנה</b>.</li><li>קו השבר מייצג פעולת <b>חילוק</b>.</li></ul>`],
  ['✖️ כפל שברים', `<ol><li>כופלים מונה במונה.</li><li>כופלים מכנה במכנה.</li><li>מצמצמים את התוצאה אם אפשר.</li></ol>
    <p>${ltr(`${frac(2, 3)} × ${frac(3, 4)} = ${frac(6, 12)} = ${frac(1, 2)}`)}</p>
    <p>מספר שלם כותבים כשבר עם מכנה 1: ${ltr(`3 × ${frac(2, 5)} = ${frac(3, 1)} × ${frac(2, 5)} = ${frac(6, 5)}`)}</p>`],
  ['🔄 חילוק שברים', `<p>משאירים את השבר הראשון כפי שהוא, <b>הופכים את השבר השני</b> ועוברים לכפל.</p>
    <p>${ltr(`${frac(2, 3)} : ${frac(4, 5)} = ${frac(2, 3)} × ${frac(5, 4)} = ${frac(10, 12)} = ${frac(5, 6)}`)}</p>
    <p>חילוק שבר במספר שלם: ${ltr(`${frac(3, 4)} : 2 = ${frac(3, 4)} × ${frac(1, 2)} = ${frac(3, 8)}`)}</p>`],
  ['🧊 מנסרות', `<p>מנסרה היא גוף תלת-ממדי עם שני בסיסים זהים ומקבילים. <b>סוג המנסרה נקבע לפי צורת הבסיס.</b> מספר הפאות הצדדיות שווה למספר הצלעות של הבסיס.</p>
    <table class="res"><tr><th>מנסרה</th><th>בסיסים</th><th>פאות</th><th>קודקודים</th><th>מקצועות</th></tr>
    ${[3, 4, 5, 6].map(n => `<tr><td>${PRISMS[n]}</td><td>2</td><td>${n + 2}</td><td>${2 * n}</td><td>${3 * n}</td></tr>`).join('')}</table>
    <p>גליל אינו מנסרה – יש לו בסיסים עגולים ומשטח צדדי מעוגל.</p>`],
  ['📖 בעיות מילוליות', `<ol><li>מסמנים את הנתונים החשובים.</li><li>חושבים איזו פעולה צריך לבצע.</li><li>כותבים תרגיל מתאים.</li><li>כותבים תשובה מלאה במילים.</li></ol>
    <p>"שבר <b>מ</b>כמות" – כפל. "כמה פעמים נכנס" / "מחלקים שווה בשווה" – חילוק.</p>`],
];

// ================= דוגמאות פתורות (שלב אחר שלב) =================
// הפתרון המודרך של אותה שאלה שבה טעו (אותם מספרים)
function buildDemo(topic, q) {
  const steps = [`<b>השאלה:</b><br>${q.prompt}${q.visual || ''}`];
  if (q.steps) {
    steps.push(...q.steps);
  } else {
    steps.push(`<b>איך פותרים:</b><br>${q.why}`);
  }
  let ans;
  if (q.kind === 'mc') ans = q.options[q.correct];
  else if (q.kind === 'fr') ans = FA(q.ans);
  else ans = q.answers.map((x, i) => `${q.inputs[i] ? q.inputs[i].split(' ')[0] + ': ' : ''}${fmt(x)}`).join(' · ');
  steps.push(`<b>התשובה: ${ans}</b> ✅`);
  return steps;
}

// ================= ממשק =================
if (typeof document !== 'undefined') {
  const app = document.getElementById('app');
  const store = { get: () => { try { return JSON.parse(localStorage.getItem('math6') || '{}'); } catch { return {}; } }, set: v => localStorage.setItem('math6', JSON.stringify(v)) };
  let S = null;
  const PRAISE = ['כל הכבוד! 🎉', 'מצוין! ⭐', 'נכון מאוד! 👏', 'יפה מאוד! 💪', 'בול! 🎯'];

  // ----- סיסמת הורה (שומר סף לעזרה, לא אבטחה אמיתית) -----
  const hashPw = t => { let h = 5381; for (const c of t) h = ((h << 5) + h + c.charCodeAt(0)) | 0; return String(h); };
  const getPw = () => localStorage.getItem('math6pw');
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
      localStorage.setItem('math6pw', hashPw(nw)); return null;
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
      <button class="mock${isDone('mock') ? ' done' : ''}" id="mock">${isDone('mock') ? '✔ ' : ''}📝 מבחן ניסיון – כל הנושאים (${TOPICS.length * 3} שאלות)${progress('mock') ? ' · ' + progress('mock') : ''}</button>
      ${localStorage.getItem(sessKey('mock')) ? '<div class="center" style="margin:-8px 0 12px"><button class="reset" data-reset="mock">🔄 איפוס מבחן הניסיון</button></div>' : ''}
      <div class="grid">${TOPICS.map(t => `
        <div class="topic${isDone(t.id) ? ' done' : ''}" data-id="${t.id}">${isDone(t.id) ? '<div class="tick">✔ בוצע</div>' : ''}<div class="ic">${t.icon}</div><div class="nm">${t.name}</div>
        <div class="best">${best[t.id] != null ? `שיא: ${best[t.id]}/10` : 'עוד לא תרגלתם'}</div>
        <div class="best prog">${progress(t.id)}</div>
        ${hasData(t.id, best) ? `<button class="reset" data-reset="${t.id}">🔄 איפוס</button>` : ''}</div>`).join('')}</div>`;
    app.insertAdjacentHTML('beforeend', '<div class="center"><button class="ghost" id="rules">📖 סיכום וכללים</button> <button class="ghost" id="pw">🔑 סיסמת הורה (לעזרה)</button> <button class="reset" id="resetAll">🗑 איפוס כל התרגולים</button></div>');
    document.getElementById('resetAll').onclick = () => {
      if (confirm('לאפס את כל התרגולים (כל הנושאים ומבחן הניסיון)? ההתקדמות והשיאים יימחקו.')) { [...TOPICS.map(t => t.id), 'mock'].forEach(resetTopic); home(); }
    };
    document.getElementById('pw').onclick = setParentPassword;
    document.getElementById('rules').onclick = rules;
    document.getElementById('mock').onclick = () => start('mock');
    app.querySelectorAll('[data-reset]').forEach(b => b.onclick = e => {
      e.stopPropagation();
      const id = b.dataset.reset, name = id === 'mock' ? 'מבחן הניסיון' : TOPICS.find(t => t.id === id).name;
      if (confirm(`לאפס את "${name}"? ההתקדמות והשיא יימחקו.`)) { resetTopic(id); home(); }
    });
    app.querySelectorAll('.topic').forEach(el => el.onclick = () => start(el.dataset.id));
  }

  function rules() {
    app.innerHTML = `<div class="card"><div class="top"><button class="menu" id="rBack">🏠 תפריט</button><span>📖 סיכום וכללים</span><span></span></div>
      ${RULES.map(([t, body], i) => `<details class="rule"${i === 0 ? ' open' : ''}><summary>${t}</summary>${body}</details>`).join('')}</div>`;
    document.getElementById('rBack').onclick = home;
  }

  // ----- שמירת התקדמות (נשמרת גם ביציאה לתפריט ובסגירת הדף) -----
  const sessKey = id => 'math6sess_' + id;
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
    const queue = id === 'mock' ? shuffle(TOPICS.flatMap(t => [t, t, t])) : Array(10).fill(TOPICS.find(t => t.id === id));
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
      body = `<div class="answers">${q.inputs.map((l, i) => `<label>${l}<input type="text" inputmode="decimal" autocomplete="off" data-i="${i}"></label>`).join('')}</div><div class="center"><button class="go" id="chk">בדיקה</button></div>`;
    else if (q.kind === 'fr')
      body = `<div class="hint center">כתבו את התשובה כשבר: מונה למעלה ומכנה למטה. אם התשובה היא מספר שלם – השאירו את המכנה ריק.</div>
        <div class="answers"><span class="frin"><input type="text" inputmode="numeric" autocomplete="off" aria-label="מונה"><i></i><input type="text" inputmode="numeric" autocomplete="off" aria-label="מכנה"></span></div><div class="center"><button class="go" id="chk">בדיקה</button></div>`;
    else
      body = `<div class="opts">${q.options.map((o, i) => `<button class="opt" data-i="${i}">${o}</button>`).join('')}</div>`;
    const dots = S.items.map((x, i) => `<button class="dot${i === S.idx ? ' cur' : ''}${x.done ? (x.ok ? ' ok' : ' no') : x.attempts ? ' try' : ''}" data-i="${i}">${i + 1}</button>`).join('');
    app.innerHTML = `<div class="card">
      <div class="top"><button class="menu" id="topMenu">🏠 תפריט</button><span>${S.id === 'mock' ? it.topic.name + ' · ' : ''}שאלה ${S.idx + 1} מתוך ${total}</span><span>${S.items.every(x => x.done) ? '<b style="color:#16a34a">✔ בוצע</b> · ' : ''}⭐ ${scoreOf()}</span></div>
      <div class="dots">${dots}</div>
      <div class="prompt">${q.prompt}</div>
      ${q.visual ? `<div class="visual">${q.visual}</div>` : ''}
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
    it.wrong.forEach(i => { const b = app.querySelectorAll('.opt')[i]; if (b) { b.classList.add('bad'); b.disabled = true; } });

    if (!it.done && inputs[0]) inputs[0].focus();
    inputs.forEach((inp, i, all) => inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') { if (i < all.length - 1) all[i + 1].focus(); else check(); }
    }));
    app.querySelectorAll('.opt').forEach(b => b.onclick = () => check(Number(b.dataset.i)));
    app.querySelectorAll('.frin input').forEach(inp => inp.addEventListener('input', () => { inp.value = inp.value.replace(/\D/g, ''); }));
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
    if (q.kind === 'fr') correctText = FA(q.ans);
    else if (q.kind === 'num') correctText = q.answers.map((a, i) => `${q.inputs[i] ? q.inputs[i].split(' ')[0] + ': ' : ''}${fmt(a)}`).join(' · ');
    else correctText = q.options[q.correct];
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
    if (q.kind === 'fr') {
      if (inputs[0].value === '') return;
      const n = Number(inputs[0].value), d = inputs[1].value === '' ? 1 : Number(inputs[1].value);
      if (d === 0) { ok = false; }
      else {
        const same = n * q.ans[1] === q.ans[0] * d;
        ok = same && (q.mode === 'exact' ? n === q.ans[0] && d === q.ans[1] : gcd(n, d) === 1);
        if (same && !ok) { // הערך נכון אבל לא בצורה שנדרשה – לא סופרים ניסיון
          document.getElementById('fb').innerHTML = `<div class="fb no"><b>הערך נכון! 👍</b> ${q.mode === 'exact' ? 'אבל כאן צריך לכתוב את השבר בדיוק כפי שהוא מופיע בתרגיל, בלי לצמצם.' : 'אבל צריך לצמצם את השבר עד הסוף.'}</div>`;
          return;
        }
      }
    } else if (q.kind === 'num') {
      const vals = inputs.map(i => i.value.trim().replace(',', '.'));
      if (vals.some(v => v === '')) return;
      ok = vals.every((v, i) => Number(v) === q.answers[i]);
    } else {
      ok = choice === q.correct;
    }
    it.attempts++;
    saveInputs();
    if (!ok && it.attempts < MAX_TRIES) { // עוד ניסיון, בלי לחשוף את התשובה
      if (q.kind === 'mc') { it.wrong.add(choice); const b = app.querySelectorAll('.opt')[choice]; b.classList.add('bad'); b.disabled = true; }
      if (q.kind !== 'mc') { inputs[0].focus(); inputs[0].select(); }
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
  module.exports = { TOPICS, buildDemo };
}
