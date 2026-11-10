// ================= עזרים =================
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ================= המילים (מתוך דף המשחק) =================
const WORDS = [
  ['teacher', 'מורה'], ['day', 'יום'], ['talk', 'לדבר'], ['happy', 'שמח'], ['friend', 'חבר'],
  ['see', 'לראות'], ['family', 'משפחה'], ['board', 'לוח'], ['thanks', 'תודה'], ['me', 'אני'],
  ['home', 'בית'], ['computer', 'מחשב'], ['class', 'כיתה'], ['week', 'שבוע'], ['Sunday', 'יום ראשון'],
  ['food', 'אוכל'], ['new', 'חדש'], ['lunch', 'ארוחת צהריים'], ['please', 'בבקשה'], ['paper', 'דף נייר'],
];

const LEVELS = [
  { id: 'easy', name: 'קל – 6 זוגות', icon: '🌱', pairs: 6 },
  { id: 'mid', name: 'בינוני – 10 זוגות', icon: '🌟', pairs: 10 },
  { id: 'full', name: 'מלא – כל 20 הזוגות', icon: '🏆', pairs: 20 },
];

// ================= קול (הגייה באנגלית) =================
function speak(text) {
  try {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = 0.85;
    speechSynthesis.speak(u);
  } catch (e) { /* אין קול – ממשיכים */ }
}

// ================= ממשק =================
if (typeof document !== 'undefined') {
  const app = document.getElementById('app');
  const KEY = 'engmem4';
  const store = { get: () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }, set: v => localStorage.setItem(KEY, JSON.stringify(v)) };
  const PRAISE = ['כל הכבוד! 🎉', 'מצוין! ⭐', 'נכון מאוד! 👏', 'יפה מאוד! 💪', 'זוג מושלם! 🎯'];
  let G = null, timer = null;

  function home() {
    G = null; clearTimeout(timer);
    const best = store.get();
    app.innerHTML = `
      <div class="card center">בחרו רמה. הפכו שני קלפים ומצאו מילה באנגלית ואת הפירוש שלה בעברית. 🔊 לחצו על קלף כדי לשמוע את ההגייה.</div>
      <div class="grid">${LEVELS.map(l => `
        <div class="lvl${best[l.id] != null ? ' done' : ''}" data-id="${l.id}"><div class="ic">${l.icon}</div><div class="nm">${l.name}</div>
        <div class="best">${best[l.id] != null ? `שיא: ${best[l.id]} מהלכים` : 'עוד לא שיחקתם'}</div></div>`).join('')}
        <div class="lvl${best.bank != null ? ' done' : ''}" data-id="bank"><div class="ic">🧺</div><div class="nm">מחסן מילים</div>
        <div class="best">${best.bank != null ? `שיא: ${best.bank} טעויות` : 'שייכו מילים מהמחסן'}</div></div>
        <div class="lvl" data-id="list"><div class="ic">📋</div><div class="nm">רשימת המילים</div><div class="best">ללמוד לפני המשחק</div></div>
      </div>
      ${Object.keys(best).length ? '<div class="center"><button class="reset" id="reset">🔄 איפוס שיאים</button></div>' : ''}`;
    app.querySelectorAll('.lvl').forEach(el => el.onclick = () => el.dataset.id === 'list' ? list() : el.dataset.id === 'bank' ? startBank() : start(el.dataset.id));
    const r = document.getElementById('reset');
    if (r) r.onclick = () => { if (confirm('לאפס את כל השיאים?')) { localStorage.removeItem(KEY); home(); } };
  }

  function list() {
    app.innerHTML = `<div class="card"><div class="top"><button class="menu" id="back">⬅ לתפריט</button><span>רשימת המילים</span></div>
      <table class="res">${WORDS.map(([e, h]) => `<tr><td class="ltr" style="font-weight:bold;color:#1d4ed8">${e}</td><td>${h}</td><td><button class="menu" data-s="${e}">🔊</button></td></tr>`).join('')}</table></div>`;
    document.getElementById('back').onclick = home;
    app.querySelectorAll('[data-s]').forEach(b => b.onclick = () => speak(b.dataset.s));
  }

  function start(id) {
    const lvl = LEVELS.find(l => l.id === id);
    const chosen = shuffle(WORDS.map((w, i) => i)).slice(0, lvl.pairs);
    const tiles = shuffle(chosen.flatMap(i => [{ w: i, lang: 'en' }, { w: i, lang: 'he' }]));
    G = { lvl, tiles, up: [], matched: new Set(), moves: 0, lock: false };
    renderGame();
  }

  function renderGame(msg) {
    const cols = G.lvl.pairs === 20 ? 5 : 4;
    app.innerHTML = `<div class="card">
      <div class="top"><button class="menu" id="back">⬅ לתפריט</button><span>${G.lvl.name}</span><span>מהלכים: <b id="mv">${G.moves}</b> · זוגות: <b id="pr">${G.matched.size}/${G.lvl.pairs}</b></span></div>
      <div class="board" style="grid-template-columns:repeat(${cols},1fr)">${G.tiles.map((t, i) => `
        <button class="tile${G.matched.has(t.w) ? ' ok' : ''}" data-i="${i}"><div class="in">
          <div class="face back">?</div>
          <div class="face front ${t.lang}">${WORDS[t.w][t.lang === 'en' ? 0 : 1]}</div></div></button>`).join('')}</div>
      <div class="fb" id="fb"></div></div>`;
    document.getElementById('back').onclick = () => { if (G.moves === 0 || confirm('לצאת מהמשחק?')) home(); };
    app.querySelectorAll('.tile').forEach(el => el.onclick = () => flip(+el.dataset.i));
  }

  const tileEl = i => app.querySelector(`.tile[data-i="${i}"]`);
  const fb = (t, c) => { const f = document.getElementById('fb'); f.className = 'fb ' + c; f.innerHTML = t; };

  function flip(i) {
    const t = G.tiles[i];
    if (G.lock || G.matched.has(t.w) || G.up.includes(i)) return;
    G.up.push(i);
    tileEl(i).classList.add('up');
    if (t.lang === 'en') speak(WORDS[t.w][0]);
    if (G.up.length < 2) return;
    G.moves++;
    document.getElementById('mv').textContent = G.moves;
    const [a, b] = G.up.map(k => G.tiles[k]);
    if (a.w === b.w && a.lang !== b.lang) {
      G.matched.add(a.w);
      G.up.forEach(k => { tileEl(k).classList.remove('up'); tileEl(k).classList.add('ok'); });
      G.up = [];
      document.getElementById('pr').textContent = G.matched.size + '/' + G.lvl.pairs;
      fb(`${PRAISE[rnd(0, PRAISE.length - 1)]}<br><span class="ltr"><b>${WORDS[a.w][0]}</b></span> = ${WORDS[a.w][1]}`, 'ok');
      speak(WORDS[a.w][0]);
      if (G.matched.size === G.lvl.pairs) timer = setTimeout(finish, 1200);
    } else {
      G.lock = true;
      const idx = [...G.up];
      idx.forEach(k => tileEl(k).classList.add('bad'));
      fb('לא מתאים, נסו שוב 🙂', 'no');
      timer = setTimeout(() => {
        idx.forEach(k => { const e = tileEl(k); if (e) e.classList.remove('up', 'bad'); });
        G.up = []; G.lock = false;
      }, 1400);
    }
  }

  // ----- מחסן מילים: משייכים כל מילה מהמחסן לפירוש שלה ברשימה -----
  const BANK_N = 8;
  function startBank() {
    const idx = shuffle(WORDS.map((w, i) => i)).slice(0, BANK_N);
    G = { bank: true, items: idx, order: shuffle(idx), placed: new Set(), sel: null, errors: 0 };
    renderBank();
  }

  function renderBank(msg) {
    app.innerHTML = `<div class="card">
      <div class="top"><button class="menu" id="back">⬅ לתפריט</button><span>🧺 מחסן מילים</span><span>טעויות: <b>${G.errors}</b> · שויכו: <b>${G.placed.size}/${BANK_N}</b></span></div>
      <div class="hint">בחרו מילה מהמחסן ואז לחצו על הפירוש שלה ברשימה.</div>
      <div class="bank">${G.order.map(w => G.placed.has(w) ? '' : `<button class="chip${G.sel === w ? ' sel' : ''}" data-w="${w}">${WORDS[w][0]}</button>`).join('') || '<span>המחסן ריק 🎉</span>'}</div>
      <div class="slots">${G.items.map(w => `<button class="slot${G.placed.has(w) ? ' ok' : ''}" data-w="${w}"><span class="he">${WORDS[w][1]}</span><span class="fill ltr">${G.placed.has(w) ? WORDS[w][0] : '＿＿＿'}</span></button>`).join('')}</div>
      <div class="fb" id="fb"></div></div>`;
    document.getElementById('back').onclick = () => { if (!G.placed.size || confirm('לצאת מהמשחק?')) home(); };
    app.querySelectorAll('.chip').forEach(el => el.onclick = () => { G.sel = +el.dataset.w; speak(WORDS[G.sel][0]); renderBank(); });
    app.querySelectorAll('.slot').forEach(el => el.onclick = () => drop(+el.dataset.w, el));
  }

  function drop(w, el) {
    if (G.placed.has(w)) return;
    if (G.sel == null) { fb('קודם בחרו מילה מהמחסן 👆', 'no'); return; }
    if (G.sel === w) {
      G.placed.add(w); G.sel = null;
      renderBank();
      fb(`${PRAISE[rnd(0, PRAISE.length - 1)]}<br><span class="ltr"><b>${WORDS[w][0]}</b></span> = ${WORDS[w][1]}`, 'ok');
      if (G.placed.size === BANK_N) timer = setTimeout(finishBank, 1200);
    } else {
      G.errors++;
      renderBank();
      fb('לא מתאים, נסו מילה אחרת 🙂', 'no');
      const e = app.querySelector(`.slot[data-w="${w}"]`);
      if (e) { e.classList.add('bad'); setTimeout(() => e.classList.remove('bad'), 700); }
    }
  }

  function finishBank() {
    const best = store.get(), prev = best.bank, rec = prev == null || G.errors < prev;
    if (rec) { best.bank = G.errors; store.set(best); }
    const stars = G.errors === 0 ? '⭐⭐⭐' : G.errors <= 3 ? '⭐⭐' : '⭐';
    app.innerHTML = `<div class="card center"><div class="big pop">${stars}</div>
      <h2>סיימתם! 🎉</h2><p>שייכתם ${BANK_N} מילים עם ${G.errors} טעויות.</p>
      ${rec ? '<p><b>🏅 שיא חדש!</b></p>' : `<p>השיא שלכם: ${prev} טעויות</p>`}
      <button class="go" id="again">שחקו שוב</button> <button class="menu" id="back">⬅ לתפריט</button></div>`;
    document.getElementById('again').onclick = startBank;
    document.getElementById('back').onclick = home;
  }

  function finish() {
    const best = store.get(), prev = best[G.lvl.id], rec = prev == null || G.moves < prev;
    if (rec) { best[G.lvl.id] = G.moves; store.set(best); }
    const stars = G.moves <= G.lvl.pairs * 1.5 ? '⭐⭐⭐' : G.moves <= G.lvl.pairs * 2.5 ? '⭐⭐' : '⭐';
    app.innerHTML = `<div class="card center"><div class="big pop">${stars}</div>
      <h2>סיימתם! 🎉</h2><p>מצאתם ${G.lvl.pairs} זוגות ב-${G.moves} מהלכים.</p>
      ${rec ? '<p><b>🏅 שיא חדש!</b></p>' : `<p>השיא שלכם: ${prev} מהלכים</p>`}
      <button class="go" id="again">שחקו שוב</button> <button class="menu" id="back">⬅ לתפריט</button></div>`;
    const id = G.lvl.id;
    document.getElementById('again').onclick = () => start(id);
    document.getElementById('back').onclick = home;
  }

  home();
}
