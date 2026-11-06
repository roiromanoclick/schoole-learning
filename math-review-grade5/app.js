// ================= עזרים =================
const dflt = (v, f) => (v == null ? f : v); // במקום האופרטור הכפול (תאימות לדפדפנים ישנים)
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = a => a[rnd(0, a.length - 1)];
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fmt = n => n.toLocaleString('en-US');
const ltr = s => `<span class="ltr">${s}</span>`;
const frac = (k, n) => `<span class="frac"><span>${k}</span><span>${n}</span></span>`;

// טבלת תרגיל מאונך: סימן הפעולה במרכז (משמאל לשני המספרים), שורת העברות למעלה ושורת תוצאה למטה
function vtable(a, op, b, ans, carryCell, resCell, crossable = false) {
  const sa = String(a), sb = String(b), w = Math.max(sa.length, sb.length, String(ans).length);
  const digit = (str, i) => dflt(str[i - (w - str.length)], '');
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
// num: {inputs:[label], answers:[..], dec?}   mc: {options, correct}   vgrid: כפל מאונך   steps: פתרון מודרך (אופציונלי)
const x = (a, b) => ltr(`${fmt(a)} × ${fmt(b)}`);

function genTable() {
  const a = rnd(3, 9), b = rnd(3, 9), p = a * b, t = rnd(1, 5);
  if (t === 1) return { kind: 'num', prompt: `השלימו את התוצאה:<br>${ltr(`${a} × ${b} = □`)}`, inputs: [''], answers: [p], why: `${ltr(`${a} × ${b} = ${p}`)}. (גם ${ltr(`${b} × ${a} = ${p}`)} – סדר הגורמים לא משנה.)` };
  if (t === 2) return { kind: 'num', prompt: `השלימו את המספר החסר:<br>${ltr(`□ × ${b} = ${p}`)}`, inputs: [''], answers: [a], why: `חסר גורם, לכן מחלקים: ${ltr(`${p} ÷ ${b} = ${a}`)}.` };
  if (t === 3) return { kind: 'num', prompt: `ידוע ש-${ltr(`${a} × ${b} = ${p}`)}.<br>כמה זה ${ltr(`${p} ÷ ${b}`)} ?`, inputs: [''], answers: [a], why: `חילוק וכפל הם פעולות הפוכות: ${ltr(`${a} × ${b} = ${p}`)} ולכן ${ltr(`${p} ÷ ${b} = ${a}`)}.` };
  if (t === 4) {
    const wrong = [p + a, p - b, p + 1].filter(v => v !== p && v > 0);
    const o = shuffle([[p, true], ...wrong.slice(0, 3).map(v => [v, false])]);
    return { kind: 'mc', prompt: `מה התוצאה של ${ltr(`${a} × ${b}`)} ?`, options: o.map(v => ltr(fmt(v[0]))), correct: o.findIndex(v => v[1]), why: `${ltr(`${a} × ${b} = ${p}`)}.` };
  }
  const c = pick([a + 1, a + 2, a - 1].filter(v => v > 1 && v !== a));
  const o = shuffle([[`${a} × ${b}`, true], [`${c} × ${b}`, false], [`${a} + ${b}`, false], [`${a} × ${b + 1}`, false]]);
  return { kind: 'mc', prompt: `איזה תרגיל שווה ל-${ltr(fmt(p))} ?`, options: o.map(v => ltr(v[0])), correct: o.findIndex(v => v[1]), why: `${ltr(`${a} × ${b} = ${p}`)}.` };
}

function genTens() {
  const t = rnd(1, 6);
  const hi = () => rnd(2, 9) * 10, lo = () => rnd(2, 9);
  let prompt, ans, why;
  if (t === 1) { const n = rnd(12, 99), k = pick([10, 100, 1000]); ans = n * k; prompt = ltr(`${n} × ${fmt(k)} = □`); why = `כופלים ב-${fmt(k)}: מוסיפים ${String(k).length - 1} אפסים. ${ltr(`${n} × ${fmt(k)} = ${fmt(ans)}`)}.`; }
  else if (t === 2) { const a = lo(), b = lo() * pick([10, 100]); ans = a * b; prompt = ltr(`${a} × ${fmt(b)} = □`); why = `כופלים את הספרות ומוסיפים את האפסים: ${ltr(`${a} × ${b / (b >= 100 && b % 100 === 0 ? 100 : 10)} = ${ans / (b >= 100 && b % 100 === 0 ? 100 : 10)}`)}, ואז מוסיפים ${b >= 100 && b % 100 === 0 ? 'שני אפסים' : 'אפס אחד'} ← ${fmt(ans)}.`; }
  else if (t === 3) { const a = hi(), b = hi(); ans = a * b; prompt = ltr(`${a} × ${b} = □`); why = `${ltr(`${a / 10} × ${b / 10} = ${a * b / 100}`)}. מוסיפים שני אפסים (אחד מכל מספר) ← ${fmt(ans)}.`; }
  else if (t === 4) { const a = lo() * 10, b = lo() * 100; ans = a * b; prompt = ltr(`${a} × ${fmt(b)} = □`); why = `${ltr(`${a / 10} × ${b / 100} = ${a * b / 1000}`)}. מוסיפים שלושה אפסים (אחד מהראשון ושניים מהשני) ← ${fmt(ans)}.`; }
  else if (t === 5) { const f = lo(), k = pick([10, 100]), pr = f * k; ans = f; prompt = ltr(`□ × ${k} = ${fmt(pr)}`); why = `חסר גורם, לכן מחלקים: ${ltr(`${fmt(pr)} ÷ ${k} = ${f}`)}.`; }
  else { const a = hi(), b = lo(); ans = a * b; prompt = ltr(`${a} × ${b} = □`); why = `${ltr(`${a / 10} × ${b} = ${a * b / 10}`)}. מוסיפים אפס אחד ← ${fmt(ans)}.`; }
  return { kind: 'num', prompt: `השלימו את המספר החסר:<br>${prompt}`, inputs: [''], answers: [ans], why };
}

function genVMul() {
  const four = Math.random() < 0.4;
  const a = four ? rnd(1002, 4999) : rnd(102, 999), b = rnd(2, 9), ans = a * b;
  const ds = String(a).split('').reverse().map(Number);
  const nm = ['יחידות', 'עשרות', 'מאות', 'אלפים'];
  return {
    kind: 'vgrid', prompt: 'פתרו בכפל מאונך:', a, op: '×', b, ans,
    why: `כופלים מימין לשמאל, ספרה אחר ספרה: ${ds.map((d, i) => ltr(`${d} × ${b} = ${d * b}`) + ` (${nm[i]})`).join(', ')} – ועוד העברות. התוצאה: ${fmt(ans)}.`,
  };
}

function stepsMul2(a, b) {
  const u = b % 10, t = Math.floor(b / 10), p1 = a * u, p2 = a * t * 10, ans = a * b;
  const steps = [`<b>דוגמה:</b> ${x(a, b)}<br>מפרקים את ${b} ל-${t * 10} ו-${u}, וכופלים את ${fmt(a)} בכל חלק בנפרד.`];
  if (u) steps.push(`כופלים ביחידות: ${x(a, u)} = <b>${fmt(p1)}</b>`);
  steps.push(`כופלים בעשרות: ${x(a, t * 10)} = <b>${fmt(p2)}</b><br>(קודם ${x(a, t)} = ${fmt(a * t)}, ואז מוסיפים אפס.)`);
  if (u) steps.push(`מחברים את שני החלקים: ${ltr(`${fmt(p1)} + ${fmt(p2)}`)} = <b>${fmt(ans)}</b>`);
  steps.push(`<b>התוצאה: ${fmt(ans)}</b> ✅`);
  return steps;
}

function genMul2() {
  const t = rnd(1, 4);
  let a, b;
  if (t === 1) { a = rnd(12, 99); b = rnd(2, 9) * 10; }
  else if (t === 4) { a = rnd(101, 250); b = rnd(11, 29); }
  else { a = rnd(12, 99); b = rnd(11, 99); }
  if (b % 10 === 0 && t !== 1) b += 3;
  const ans = a * b, u = b % 10, tn = Math.floor(b / 10);
  const why = `${x(a, u || tn * 10)}${u ? ` = ${fmt(a * u)}` : ''}${u ? `, ${x(a, tn * 10)} = ${fmt(a * tn * 10)}` : ` = ${fmt(ans)}`}${u ? `, ואז ${ltr(`${fmt(a * u)} + ${fmt(a * tn * 10)} = ${fmt(ans)}`)}` : ''}.`;
  return { kind: 'num', prompt: `פתרו (אפשר להיעזר בטיוטה):<br>${ltr(`${fmt(a)} × ${b} = □`)}`, inputs: [''], answers: [ans], why, steps: stepsMul2(a, b) };
}

function genProps() {
  const t = rnd(1, 4);
  if (t === 1) {
    const a = rnd(12, 19), b = rnd(3, 9), u = a % 10;
    const o = shuffle([[`(10 × ${b}) + (${u} × ${b})`, true], [`(10 × ${b}) + (${u} + ${b})`, false], [`(10 + ${u}) × ${b} × ${b}`, false], [`(${a} × 10) + (${a} × ${b})`, false]]);
    return { kind: 'mc', prompt: `כדי לחשב ${ltr(`${a} × ${b}`)} בראש, אפשר לפרק את ${a} ל-10 ו-${u}. איזה תרגיל נכון?`, options: o.map(v => ltr(v[0])), correct: o.findIndex(v => v[1]),
      why: `פירוק לפי תכונת הפילוג: ${ltr(`${a} × ${b} = (10 + ${u}) × ${b} = 10 × ${b} + ${u} × ${b} = ${10 * b} + ${u * b} = ${a * b}`)}.` };
  }
  if (t === 2) {
    const a = rnd(11, 89), b = rnd(11, 89), ra = Math.round(a / 10) * 10, rb = Math.round(b / 10) * 10, est = ra * rb;
    const cand = [est, est * 10, est / 10, est + ra].filter((v, i, ar) => ar.indexOf(v) === i && v > 0);
    const o = shuffle(cand.slice(0, 4).map(v => [v, v === est]));
    return { kind: 'mc', prompt: `אמדו: ${ltr(`${a} × ${b}`)} הוא בערך...`, options: o.map(v => ltr(fmt(v[0]))), correct: o.findIndex(v => v[1]),
      why: `מעגלים לעשרות הקרובות: ${ltr(`${a} ≈ ${ra}`)} ו-${ltr(`${b} ≈ ${rb}`)}. ${ltr(`${ra} × ${rb} = ${fmt(est)}`)}.` };
  }
  if (t === 3) {
    const a = rnd(3, 9), b = rnd(3, 9) + 10;
    return { kind: 'num', prompt: `השלימו בעזרת תכונת החילוף:<br>${ltr(`${a} × ${b} = □ × ${a}`)}`, inputs: [''], answers: [b], why: `בכפל אפשר להחליף את סדר הגורמים: ${ltr(`${a} × ${b} = ${b} × ${a}`)}.` };
  }
  const a = rnd(2, 6), b = rnd(2, 5), c = rnd(2, 4);
  return { kind: 'num', prompt: `חשבו לפי סדר פעולות החשבון:<br>${ltr(`${a} + ${b} × ${c} = □`)}`, inputs: [''], answers: [a + b * c], why: `קודם כפל ואחר כך חיבור: ${ltr(`${b} × ${c} = ${b * c}`)}, ואז ${ltr(`${a} + ${b * c} = ${a + b * c}`)}.` };
}

function genDecimal() {
  const t = rnd(1, 3);
  let A, d, f, prompt, why;
  if (t === 3) {
    A = rnd(11, 59); d = 1; f = rnd(2, 9);
    const ans = A * f / 10, a = A / 10;
    why = `${ltr(`${A} × ${f} = ${A * f}`)}, ומחלקים ב-10 (כי יש ספרה אחת אחרי הנקודה): ${fmt(ans)}.`;
    return { kind: 'num', dec: true, prompt: `חשבו:<br>${ltr(`${fmt(a)} × ${f} = □`)}`, inputs: [''], answers: [ans], why };
  }
  d = t === 1 ? 1 : 2; A = d === 1 ? rnd(11, 99) : rnd(101, 999); f = pick([10, 100, 1000]);
  const base = Math.pow(10, d), ans = A * f / base, a = A / base;
  const zeros = String(f).length - 1;
  why = `כשכופלים ב-${fmt(f)} הנקודה העשרונית זזה ${zeros} מקומות ימינה: ${ltr(`${fmt(a)} × ${fmt(f)} = ${fmt(ans)}`)}.`;
  return { kind: 'num', dec: true, prompt: `חשבו:<br>${ltr(`${a} × ${fmt(f)} = □`)}`, inputs: [''], answers: [ans], why };
}

const NAMES = ['דנה', 'רוני', 'נועה', 'מאיה', 'תמר', 'עידו', 'איתי', 'יובל', 'אורי', 'גל'];
function genWords() {
  const t = rnd(1, 6), n = pick(NAMES);
  if (t === 1) { const a = rnd(12, 48), b = rnd(3, 9); return { kind: 'num', prompt: `בכל קופסה יש ${a} עפרונות. כמה עפרונות יש ב-${b} קופסאות?`, inputs: ['עפרונות'], answers: [a * b], why: `כל קופסה זהה, לכן כופלים: ${x(a, b)} = ${fmt(a * b)} עפרונות.` }; }
  if (t === 2) { const a = rnd(12, 35), b = rnd(11, 25); return { kind: 'num', prompt: `באולם יש ${b} שורות, ובכל שורה ${a} כיסאות. כמה כיסאות יש באולם?`, inputs: ['כיסאות'], answers: [a * b], why: `כופלים את מספר השורות במספר הכיסאות בשורה: ${x(a, b)} = ${fmt(a * b)} כיסאות.`, steps: stepsMul2(a, b) }; }
  if (t === 3) { const a = rnd(15, 85), b = rnd(3, 9); return { kind: 'num', prompt: `מחיר כרטיס לסרט הוא ${a} ש״ח. כמה ישלמו על ${b} כרטיסים?`, inputs: ['שקלים'], answers: [a * b], why: `${x(a, b)} = ${fmt(a * b)} ש״ח.` }; }
  if (t === 4) { const a = rnd(12, 45), b = rnd(3, 9), c = rnd(10, 40); return { kind: 'num', prompt: `${n} קנתה ${b} ספרים, כל ספר עולה ${a} ש״ח. בנוסף שילמה ${c} ש״ח על משלוח. כמה שילמה בסך הכול?`, inputs: ['שקלים'], answers: [a * b + c], why: `קודם מחשבים את מחיר הספרים: ${x(a, b)} = ${fmt(a * b)}. אחר כך מוסיפים את המשלוח: ${ltr(`${fmt(a * b)} + ${c} = ${fmt(a * b + c)}`)} ש״ח.` }; }
  if (t === 5) { const a = rnd(12, 60), b = rnd(3, 9); return { kind: 'num', prompt: `לדני יש ${a} מדבקות. ל${n} יש פי ${b} מדבקות מלדני. כמה מדבקות יש ל${n}?`, inputs: ['מדבקות'], answers: [a * b], why: `"פי ${b}" פירושו כפל ב-${b}: ${x(a, b)} = ${fmt(a * b)} מדבקות.` }; }
  const a = rnd(12, 40), b = rnd(3, 9);
  return { kind: 'num', prompt: `כל יום ${n} קוראת ${a} עמודים. כמה עמודים תקרא ב-${b} ימים?`, inputs: ['עמודים'], answers: [a * b], why: `${x(a, b)} = ${fmt(a * b)} עמודים.` };
}

const TOPICS = [
  { id: 'table', name: 'לוח הכפל וקשרי כפל וחילוק', icon: '🔢', gen: genTable },
  { id: 'tens', name: 'כפל בעשר, במאה, באלף ובעשרות', icon: '🔟', gen: genTens },
  { id: 'vmul', name: 'כפל מאונך במספר חד-ספרתי', icon: '✖️', gen: genVMul },
  { id: 'mul2', name: 'כפל במספר דו-ספרתי', icon: '🧮', gen: genMul2 },
  { id: 'props', name: 'תכונות הכפל ואומדן', icon: '🧠', gen: genProps },
  { id: 'decimal', name: 'כפל מספרים עשרוניים', icon: '🔵', gen: genDecimal },
  { id: 'words', name: 'בעיות מילוליות בכפל', icon: '📖', gen: genWords },
];

// ================= דוגמאות פתורות (שלב אחר שלב) =================
function demoVMul(a0, b0) {
  const b = dflt(b0, rnd(3, 9)), a = dflt(a0, rnd(124, 999)), ans = a * b, ds = String(a).split('').reverse().map(Number);
  const names = ['יחידות', 'עשרות', 'מאות', 'אלפים'];
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


function buildDemo(topic, q) {
  if (q.kind === 'vgrid') return demoVMul(q.a, q.b);
  const steps = [`<b>השאלה:</b><br>${q.prompt}${q.visual || ''}`];
  let ans;
  if (q.kind === 'mc') ans = q.options[q.correct];
  else ans = q.answers.map((v, i) => `${q.inputs[i] ? q.inputs[i].split(' ')[0] + ': ' : ''}${fmt(v)}`).join(' · ');
  if (q.steps) steps.push(...q.steps.slice(1, -1));
  else steps.push(`<b>איך פותרים:</b><br>${q.why}`);
  steps.push(`<b>התשובה: ${ans}</b> ✅`);
  return steps;
}

// ================= ממשק =================
if (typeof document !== 'undefined') {
  const app = document.getElementById('app');
  const store = { get: () => { try { return JSON.parse(localStorage.getItem('math5') || '{}'); } catch (e) { return {}; } }, set: v => localStorage.setItem('math5', JSON.stringify(v)) };
  let S = null;
  const PRAISE = ['כל הכבוד! 🎉', 'מצוין! ⭐', 'נכון מאוד! 👏', 'יפה מאוד! 💪', 'בול! 🎯'];

  // ----- סיסמת הורה (שומר סף לעזרה, לא אבטחה אמיתית) -----
  const hashPw = t => { let h = 5381; for (const c of t) h = ((h << 5) + h + c.charCodeAt(0)) | 0; return String(h); };
  const getPw = () => localStorage.getItem('math5pw');
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
      localStorage.setItem('math5pw', hashPw(nw)); return null;
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
      <button class="mock${isDone('mock') ? ' done' : ''}" id="mock">${isDone('mock') ? '✔ ' : ''}📝 מבחן ניסיון – כל הנושאים ( שאלות)${progress('mock') ? ' · ' + progress('mock') : ''}</button>
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
  const sessKey = id => 'math5sess_' + id;
  function persist() {
    if (!S || !S.items) return;
    const data = { id: S.id, idx: S.idx, items: S.items.map(it => ({ tid: it.topic.id, q: it.q, attempts: it.attempts, done: it.done, ok: it.ok, sel: [...it.sel], vals: it.vals, scratch: it.scratch, strikes: it.strikes || [], wrong: [...it.wrong], praise: it.praise })) };
    try { localStorage.setItem(sessKey(S.id), JSON.stringify(data)); } catch (e) { /* מלא / חסום – מתעלמים */ }
  }
  function loadSaved(id) {
    try {
      const d = JSON.parse(localStorage.getItem(sessKey(id)));
      if (!d || !d.items || !d.items.length) return null;
      return { id: d.id, idx: d.idx, items: d.items.map(x => ({ topic: TOPICS.find(t => t.id === x.tid), q: x.q, attempts: x.attempts, done: x.done, ok: x.ok, sel: new Set(x.sel), vals: x.vals || [], scratch: x.scratch || [], strikes: x.strikes || [], wrong: new Set(x.wrong), praise: x.praise })) };
    } catch (e) { return null; }
  }

  function start(id, fresh = false) {
    const saved = fresh ? null : loadSaved(id);
    if (saved) {
      S = saved;
      if (S.items.every(x => x.done)) return finish();
      return goTo(S.idx);
    }
    const queue = id === 'mock' ? shuffle([].concat(...TOPICS.map(t => [t, t]))) : Array(10).fill(TOPICS.find(t => t.id === id));
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
      body = `<div class="answers">${q.inputs.map((l, i) => `<label>${l}<input type="text" inputmode="${q.dec ? 'decimal' : 'numeric'}" autocomplete="off" data-i="${i}"></label>`).join('')}</div><div class="center"><button class="go" id="chk">בדיקה</button></div>`;
    else if (q.kind === 'vgrid')
      body = `<div class="visual">${vgridHTML(q.a, q.op, q.b, q.ans)}</div><div class="center"><button class="go" id="chk">בדיקה</button></div>`;
    else if (q.kind === 'mc')
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
    inputs.forEach((inp, i) => { inp.value = dflt(it.vals[i], ''); });
    app.querySelectorAll('input.scratch').forEach((inp, i) => { inp.value = dflt(it.scratch[i], ''); });
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
    if (q.kind === 'vgrid') {
      const vals = inputs.map(i => i.value);
      if (vals.some(v => v === '')) return;
      ok = Number(vals.join('')) === q.ans;
    } else if (q.kind === 'num') {
      const vals = inputs.map(i => (q.dec ? i.value.replace(/\s/g, '').replace(',', '.') : i.value.replace(/[,\s]/g, '')));
      if (vals.some(v => v === '')) return;
      ok = vals.every((v, i) => Number(v) === q.answers[i]);
    } else if (q.kind === 'mc') {
      ok = choice === q.correct;
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
  module.exports = { TOPICS, buildDemo };
}
