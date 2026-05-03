// ── SUBJECT MAP ───────────────────────────────────────────────────────────────
const BZ_SUBJECTS = {
  MS: { Math: MSMath, Physics: MSPhysics, Chemistry: MSChemistry, Biology: MSBiology, EarthSpace: MSEarthSpace, Energy: MSEnergy },
  HS: { Math: HSMath, Physics: HSPhysics, Chemistry: HSChemistry, Biology: HSBiology, EarthSpace: HSEarthSpace, Energy: HSEnergy },
};
const BZ_ALL_SUBJECTS = ["Math", "Physics", "Chemistry", "Biology", "EarthSpace", "Energy"];

// ── BOTS ──────────────────────────────────────────────────────────────────────
const MY_BOTS = [
  { id: 'alpha', name: 'ALPHA', icon: '◈', accuracy: 0.63, buzzRate: 0.11, team: 'my' },
  { id: 'beta',  name: 'BETA',  icon: '◉', accuracy: 0.55, buzzRate: 0.08, team: 'my' },
  { id: 'gamma', name: 'GAMMA', icon: '◊', accuracy: 0.70, buzzRate: 0.10, team: 'my' },
];
const EN_BOTS = [
  { id: 'delta',   name: 'DELTA',   icon: '▲', accuracy: 0.66, buzzRate: 0.12, team: 'en' },
  { id: 'epsilon', name: 'EPSILON', icon: '▼', accuracy: 0.52, buzzRate: 0.07, team: 'en' },
  { id: 'zeta',    name: 'ZETA',    icon: '■', accuracy: 0.74, buzzRate: 0.13, team: 'en' },
  { id: 'eta',     name: 'ETA',     icon: '●', accuracy: 0.59, buzzRate: 0.09, team: 'en' },
];

// ── DIFFICULTY ────────────────────────────────────────────────────────────────
let bzDifficulty = 'cadet';
const BZ_DIFF = {
  cadet:    { buzzMult: 0.45, accMult: 0.60 },
  standard: { buzzMult: 1.00, accMult: 1.00 },
  elite:    { buzzMult: 2.00, accMult: 1.20 },
};

function bzSetDifficulty(level) {
  bzDifficulty = level;
  ['cadet','standard','elite'].forEach(d => {
    const btn = $('diff-' + d);
    if (btn) btn.classList.toggle('selected', d === level);
  });
  beep(level === 'cadet' ? 440 : level === 'standard' ? 660 : 880, 60);
}

function bzEffective(bot) {
  const d = BZ_DIFF[bzDifficulty];
  return {
    buzzRate: Math.min(0.95, bot.buzzRate * d.buzzMult),
    accuracy: Math.min(0.98, bot.accuracy * d.accMult),
  };
}

// ── SETUP STATE ───────────────────────────────────────────────────────────────
let bzLevel = '';
const bzSubjectNames = new Set();
let bzSubjects = [];
let bzTotalRounds = 20;
let bzCurAnsTime = 5;     // answer time for current question (set per-question)
let bzAudioMode = true;   // default: read aloud

// ── GAME STATE ────────────────────────────────────────────────────────────────
let bzRound = 0;
let bzMyScore = 0;
let bzEnScore = 0;
const bzAsked = new Set();
const bzStats = { buzzed: 0, correct: 0, wrong: 0, noAnswer: 0 };

let bzCurQ = '';
let bzCurSubj = null;
let bzCurSubjName = '';
let bzCurAnswer = '';
let bzCurType = '';
let bzPickedMC = '';

let bzMyLocked = false;
let bzEnLocked = false;

// Phase: SETUP | READING | BUZZ_OPEN | PLAYER | BOT | RESULT | DONE
let bzPhase = 'SETUP';

// Timers
let bzBotTimers = [];
let bzBuzzWindowTimer = null;  // 7s buzz window interval
let bzBuzzLeft = 7;
let bzAnsTimer5 = null;        // 5s answering countdown
let bzAnsLeft5 = 5;       // current countdown value (set from bzAnsTime on each buzz)

const CIRC = 2 * Math.PI * 33; // ≈207.3

// ══ SETUP LOGIC ══════════════════════════════════════════════════════════════

function bzMS() {
  bzLevel = 'MS'; bzRebuild(); beep(660, 60);
  $('Cadet').classList.add('selected');
  $('Lieutenant').classList.remove('selected');
  bzStatus();
}
function bzHS() {
  bzLevel = 'HS'; bzRebuild(); beep(880, 60);
  $('Lieutenant').classList.add('selected');
  $('Cadet').classList.remove('selected');
  bzStatus();
}
function bzRebuild() {
  bzSubjects = [...bzSubjectNames]
    .map(n => ({ name: n, data: BZ_SUBJECTS[bzLevel]?.[n] }))
    .filter(s => s.data);
}
function bzSubject(name, cb) {
  if (name === 'Everything') {
    if (cb.checked) BZ_ALL_SUBJECTS.forEach(n => { bzSubjectNames.add(n); $(n).checked = true; });
    else            { bzSubjectNames.clear(); BZ_ALL_SUBJECTS.forEach(n => { $(n).checked = false; }); }
  } else {
    cb.checked ? bzSubjectNames.add(name) : bzSubjectNames.delete(name);
  }
  const lbl = cb.parentElement;
  lbl.classList.remove('flash'); void lbl.offsetWidth; lbl.classList.add('flash');
  beep(cb.checked ? 600 : 400, 50);
  if (bzLevel) bzRebuild();
  bzStatus();
}
function bzUpdateRounds() {
  bzTotalRounds = Number($('RoundSlider').value);
  $('RoundDisplay').textContent = bzTotalRounds + ' TOSS-UPS';
  bzSliderTrail();
}
function bzSetMode(val) {
  bzAudioMode = (val === 'audio');
  beep(bzAudioMode ? 660 : 440, 60);
}
function bzSliderTrail() {
  const s = $('RoundSlider');
  if (!s) return;
  const pct = (s.value - s.min) / (s.max - s.min) * 100;
  s.style.background = `linear-gradient(to right, var(--cyan) ${pct}%, var(--surface) ${pct}%)`;
}
function bzStatus() {
  const el = $('bz-status');
  if (!el) return;
  const ready = bzLevel && bzSubjectNames.size > 0;
  const lvText = bzLevel === 'MS' ? 'AGENT [ MIDDLE SCHOOL ]' : bzLevel === 'HS' ? 'COMMANDER [ HIGH SCHOOL ]' : null;
  const lvRow = lvText
    ? `<div class="status-row"><span class="status-check">✓</span><span class="status-item">${lvText}</span></div>`
    : `<div class="status-row"><span class="status-arrow">→</span><span class="status-needed">SELECT OPERATIVE CLASS</span></div>`;
  const sjRow = bzSubjectNames.size > 0
    ? `<div class="status-row"><span class="status-check">✓</span><span class="status-item">${[...bzSubjectNames].join(' · ')}</span></div>`
    : `<div class="status-row"><span class="status-arrow">→</span><span class="status-needed">SELECT AT LEAST ONE MODULE</span></div>`;
  const dc = ready ? 'dot-ready' : 'dot-offline';
  const c  = ready ? 'var(--green)' : 'var(--orange)';
  const t  = ready ? 'SYSTEMS READY' : 'SYSTEMS OFFLINE';
  el.innerHTML = `${lvRow}${sjRow}<div class="status-row status-overall"><span class="${dc}"></span><span style="color:${c};text-shadow:0 0 8px ${c}">${t}</span></div>`;
}

// ══ GAME START ════════════════════════════════════════════════════════════════

function bzStart() {
  if (!bzLevel || bzSubjectNames.size === 0) { beep(200, 200); return; }
  ['ranks','SubjectContainer','RoundCount','ModePanel','DifficultyPanel','bz-status','BzLaunch']
    .forEach(id => $(id)?.remove());
  $('game-area').style.display = 'block';
  bzBuildTeams();
  bzCountdown(() => bzLoad());
}

function bzBuildTeams() {
  const mc = $('my-col'), ec = $('en-col');
  mc.innerHTML += memberHTML('you', '⚡', 'YOU', true);
  MY_BOTS.forEach(b => { mc.innerHTML += memberHTML(b.id, b.icon, b.name, false); });
  EN_BOTS.forEach(b => { ec.innerHTML += memberHTML(b.id, b.icon, b.name, false); });
}
function memberHTML(id, icon, name, isYou) {
  return `<div class="member" id="m-${id}">
    <span class="m-icon">${icon}</span>
    <span class="m-name${isYou ? ' you-label' : ''}">${name}</span>
    <span class="m-status" id="ms-${id}"></span>
  </div>`;
}

// ══ COUNTDOWN ════════════════════════════════════════════════════════════════

function bzCountdown(cb) {
  $('BuzzBtn').disabled = true;
  $('q-subject').textContent = '';
  let n = 3;
  $('q-text').innerHTML = `<h1 class="countdown">${n}</h1>`;
  beep(440, 120);
  const iv = setInterval(() => {
    n--;
    if (n > 0) {
      $('q-text').innerHTML = `<h1 class="countdown">${n}</h1>`;
      beep(440, 120);
    } else {
      clearInterval(iv);
      $('q-text').innerHTML = `<h1 class="countdown" style="color:var(--green);text-shadow:0 0 40px var(--green)">GO</h1>`;
      beep(880, 200);
      setTimeout(cb, 600);
    }
  }, 800);
}

// ══ LOAD QUESTION ═════════════════════════════════════════════════════════════

function bzLoad() {
  bzRound++;
  if (bzRound > bzTotalRounds) { bzGameOver(); return; }

  bzMyLocked = false;
  bzEnLocked = false;
  bzPickedMC = '';
  bzPhase = 'READING';

  [...MY_BOTS, ...EN_BOTS].forEach(b => bzMember(b.id, 'idle'));
  bzMember('you', 'idle');

  $('round-result').textContent = '';
  $('round-result').className = '';
  $('NextBtn').style.display = 'none';
  $('opp-chance-banner').style.display = 'none';
  $('locked-banner').style.display = 'none';
  $('timer-wrap').style.display = 'none';
  bzHideAnswer();
  bzHideBot();
  $('BuzzBtn').style.display = '';
  $('BuzzBtn').disabled = false;

  $('round-info').textContent = `TOSS-UP ${bzRound} / ${bzTotalRounds}`;

  const avail = bzSubjects
    .map(s => ({ ...s, keys: Object.keys(s.data).filter(k => !bzAsked.has(k)) }))
    .filter(s => s.keys.length > 0);
  if (!avail.length) { bzGameOver(); return; }

  const pick = avail[rnd(avail.length)];
  bzCurSubjName = pick.name;
  bzCurSubj     = pick.data;
  const key     = pick.keys[rnd(pick.keys.length)];
  bzAsked.add(key);
  bzCurQ      = key;
  bzCurAnswer = pick.data[key];
  bzCurType   = key.includes('W)') ? 'MC' : 'OE';

  $('q-subject').textContent = `[ ${bzCurSubjName.toUpperCase()} · ${bzCurType === 'MC' ? 'MULTIPLE CHOICE' : 'OPEN ENDED'} ]`;

  // Estimate how long the question will take to read (for bot timing)
  const readMs = bzAudioMode ? bzEstimateSpeechMs(bzCurQ) : Math.min(bzCurQ.length * 16, 4500);

  bzScheduleBots([...MY_BOTS, ...EN_BOTS], readMs);
  bzDisplayQuestion();
}

// ── Question display (audio or text) ─────────────────────────────────────────

function bzDisplayQuestion() {
  if (bzAudioMode) {
    $('q-text').innerHTML = '<span class="audio-listen">◈ &nbsp; LISTENING &nbsp; — &nbsp; BUZZ TO INTERRUPT</span>';
    bzSpeak(bzCurQ, () => {
      // Speech finished — open 7s buzz window (question stays hidden in audio mode)
      if (bzPhase !== 'READING') return;
      bzOpenBuzzWindow();
    });
  } else {
    // Display mode: typewriter, then open buzz window when done
    const el = $('q-text');
    el.textContent = '';
    let i = 0;
    const iv = setInterval(() => {
      el.textContent = bzCurQ.slice(0, i);
      i++;
      if (i > bzCurQ.length) {
        clearInterval(iv);
        if (bzPhase === 'READING') bzOpenBuzzWindow();
      }
    }, 16);
  }
}

// Reveal the full question text (used when audio mode ends or player buzzes mid-speech)
function bzRevealQuestion() {
  const el = $('q-text');
  if (bzCurType === 'MC') {
    const wIdx = bzCurQ.indexOf('W) ');
    const stem = wIdx !== -1 ? bzCurQ.slice(0, wIdx).trim() : bzCurQ;
    const opts = wIdx !== -1
      ? `<div class="q-opts">${['W','X','Y','Z'].map(l =>
          `<div class="q-opt"><span class="q-opt-letter">${l})</span> ${bzOptText(bzCurQ, l)}</div>`
        ).join('')}</div>`
      : '';
    el.innerHTML = `<span>${stem}</span>${opts}`;
  } else {
    el.textContent = bzCurQ;
  }
}

// ── Speech synthesis ──────────────────────────────────────────────────────────

function bzSpeak(text, onDone) {
  if (!window.speechSynthesis) { onDone?.(); return; }
  window.speechSynthesis.cancel();
  let readable = text;
  if (text.includes('W) ')) {
    const wIdx = text.indexOf('W) ');
    const stem = text.slice(0, wIdx).trim();
    const opts = ['W','X','Y','Z'].map(l => `${l}: ${bzOptText(text, l)}`).join('. ');
    readable = stem + '. ' + opts;
  }
  const utt = new SpeechSynthesisUtterance(readable);
  utt.rate = 0.92;
  utt.pitch = 1;
  if (onDone) utt.onend = onDone;
  window.speechSynthesis.speak(utt);
}

function bzStopSpeech() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

// Rough estimate of speech duration in ms (at rate ~0.92)
function bzEstimateSpeechMs(text) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(3000, words * 310); // ~3 words/sec at rate 0.92
}

// ══ BOT SCHEDULING ════════════════════════════════════════════════════════════

function bzScheduleBots(bots, readMs) {
  bots.forEach(bot => {
    if (Math.random() > bzEffective(bot).buzzRate) return;

    // Buzz between 40% through reading and 2s after reading finishes
    // (within the 7s buzz window)
    const minAt = readMs * 0.85;  // mostly buzz after question finishes, rarely interrupt
    const maxAt = readMs + 3500;
    const at = minAt + Math.random() * (maxAt - minAt);

    const t = setTimeout(() => {
      if (bzPhase !== 'READING' && bzPhase !== 'BUZZ_OPEN') return;
      if (bot.team === 'my' && bzMyLocked) return;
      if (bot.team === 'en' && bzEnLocked) return;
      bzBotBuzz(bot);
    }, at);
    bzBotTimers.push(t);
  });
}

function bzCancelTimers() {
  bzBotTimers.forEach(clearTimeout);
  bzBotTimers = [];
}

// ══ 7-SECOND BUZZ WINDOW ═════════════════════════════════════════════════════

function bzOpenBuzzWindow() {
  if (bzPhase === 'BOT' || bzPhase === 'PLAYER' || bzPhase === 'RESULT' || bzPhase === 'DONE') return;
  bzPhase = 'BUZZ_OPEN';
  bzBuzzLeft = 7;

  const arc = $('ring-arc');
  arc.style.strokeDasharray = `${CIRC} ${CIRC}`;
  arc.className = 'ring-arc';
  $('timer-num').textContent = '7';
  $('timer-wrap').style.display = 'block';

  bzBuzzWindowTimer = setInterval(() => {
    bzBuzzLeft -= 0.1;
    const frac = Math.max(0, bzBuzzLeft / 7);
    arc.style.strokeDasharray = `${frac * CIRC} ${CIRC}`;
    $('timer-num').textContent = Math.ceil(bzBuzzLeft);
    if (bzBuzzLeft <= 2)      arc.className = 'ring-arc danger';
    else if (bzBuzzLeft <= 4) arc.className = 'ring-arc warn';
    if (bzBuzzLeft <= 0) {
      bzStopBuzzWindow();
      bzCancelTimers();
      bzResult('TIME EXPIRED — QUESTION DEAD', 'neutral');
      bzStats.noAnswer++;
      bzAfterResult();
    }
  }, 100);
}

function bzStopBuzzWindow() {
  if (bzBuzzWindowTimer) { clearInterval(bzBuzzWindowTimer); bzBuzzWindowTimer = null; }
  $('timer-wrap').style.display = 'none';
}

// ══ BOT BUZZES IN ════════════════════════════════════════════════════════════

function bzBotBuzz(bot) {
  if (bzPhase !== 'READING' && bzPhase !== 'BUZZ_OPEN') return;
  if (bot.team === 'my' && bzMyLocked) return;
  if (bot.team === 'en' && bzEnLocked) return;

  bzPhase = 'BOT';
  bzCancelTimers();
  bzStopBuzzWindow();
  bzStopAnsTimer();
  bzStopSpeech();
  bzHideAnswer();

  // Reveal question only in display mode
  if (!bzAudioMode) bzRevealQuestion();

  $('BuzzBtn').disabled = true;
  $('BuzzBtn').style.display = 'none';
  bzMember(bot.id, 'buzzing');
  beep(660, 80);

  const ov = $('bot-overlay');
  $('bot-icon').textContent = bot.icon;
  $('bot-name').textContent = bot.name + ' IS ANSWERING...';
  $('bot-msg').textContent = '...';
  ov.style.display = 'flex';
  ov.style.borderColor = 'var(--orange)';
  ov.style.boxShadow = '0 0 30px var(--orange)55';
  $('bot-icon').style.textShadow = '';

  // Slow, human-like think time: 2.5 – 7 seconds
  const thinkMs = 2500 + Math.random() * 4500;
  setTimeout(() => {
    const correct = Math.random() < bzEffective(bot).accuracy;
    bzBotAnswer(bot, correct);
  }, thinkMs);
}

function bzBotAnswer(bot, correct) {
  bzMember(bot.id, correct ? 'ok' : 'fail');
  $('bot-name').textContent = bot.name;

  if (correct) {
    if (bot.team === 'my') bzMyScore += 4;
    else                   bzEnScore += 4;
    $('bot-msg').textContent = '✓ CORRECT  +4';
    $('bot-overlay').style.borderColor = 'var(--green)';
    $('bot-overlay').style.boxShadow   = '0 0 30px var(--green)55';
    $('bot-icon').style.textShadow     = '0 0 20px var(--green)';
    beep(880, 130);
    bzUpdateScores();
    bzPhase = 'RESULT';
    setTimeout(() => { bzHideBot(); bzAfterResult(); }, 2000);
  } else {
    if (bot.team === 'my') { bzMyScore -= 4; bzMyLocked = true; }
    else                   { bzEnScore -= 4; bzEnLocked = true; }
    $('bot-msg').textContent = '✗ INCORRECT  −4';
    $('bot-overlay').style.borderColor = 'var(--magenta)';
    $('bot-overlay').style.boxShadow   = '0 0 30px var(--magenta)55';
    $('bot-icon').style.textShadow     = '0 0 20px var(--magenta)';
    beep(220, 220);
    bzUpdateScores();
    bzPhase = 'RESULT';
    setTimeout(() => {
      bzHideBot();
      bzOppChance(bot.team === 'my' ? 'en' : 'my');
    }, 2000);
  }
}

// ══ OPPONENT CHANCE ══════════════════════════════════════════════════════════

function bzOppChance(whichGetsChance) {
  bzPhase = 'BUZZ_OPEN';
  const bn = $('opp-chance-banner');
  bn.style.display = 'block';

  if (whichGetsChance === 'my') {
    bn.textContent = '⚡ OPPONENT WRONG — YOUR TEAM CAN NOW BUZZ IN!';
    bn.style.borderColor = 'var(--green)';
    bn.style.color = 'var(--green)';
    bn.style.textShadow = '0 0 8px var(--green)55';
    $('BuzzBtn').style.display = '';
    $('BuzzBtn').disabled = false;
    $('locked-banner').style.display = 'none';
    // Schedule remaining my-team bots with short window
    bzScheduleBots(MY_BOTS, 500);
  } else {
    bn.textContent = '⊘ YOUR TEAM ANSWERED WRONG — OPPONENT GETS A CHANCE';
    bn.style.borderColor = 'var(--orange)';
    bn.style.color = 'var(--orange)';
    bn.style.textShadow = '0 0 8px var(--orange)55';
    $('BuzzBtn').style.display = 'none';
    $('locked-banner').style.display = 'block';
    bzScheduleBots(EN_BOTS, 500);
  }

  // 7s window for opponent chance too
  bzBuzzLeft = 7;
  const arc = $('ring-arc');
  arc.style.strokeDasharray = `${CIRC} ${CIRC}`;
  arc.className = 'ring-arc';
  $('timer-num').textContent = '7';
  $('timer-wrap').style.display = 'block';

  bzBuzzWindowTimer = setInterval(() => {
    bzBuzzLeft -= 0.1;
    const frac = Math.max(0, bzBuzzLeft / 7);
    arc.style.strokeDasharray = `${frac * CIRC} ${CIRC}`;
    $('timer-num').textContent = Math.ceil(bzBuzzLeft);
    if (bzBuzzLeft <= 2)      arc.className = 'ring-arc danger';
    else if (bzBuzzLeft <= 4) arc.className = 'ring-arc warn';
    if (bzBuzzLeft <= 0) {
      bzStopBuzzWindow();
      bzCancelTimers();
      bzResult('TIME EXPIRED — QUESTION DEAD', 'neutral');
      bzStats.noAnswer++;
      bzAfterResult();
    }
  }, 100);
}

// ══ PLAYER BUZZES IN ═════════════════════════════════════════════════════════

function bzPlayerBuzz() {
  if (bzPhase !== 'READING' && bzPhase !== 'BUZZ_OPEN') return;
  if (bzMyLocked) return;

  bzPhase = 'PLAYER';
  bzCancelTimers();
  bzStopBuzzWindow();
  bzStopSpeech();

  // In display mode: stop typewriter mid-flight and hide question while answering
  // In audio mode: question never appears at all
  if (!bzAudioMode) {
    bzRevealQuestion();
    $('q-text').style.visibility = 'hidden';
  }

  beep(880, 110);
  bzMember('you', 'buzzing');
  $('BuzzBtn').style.display = 'none';
  $('opp-chance-banner').style.display = 'none';
  $('locked-banner').style.display = 'none';

  bzShowAnswerPanel();
  bzStartAnsTimer();
}

function bzShowAnswerPanel() {
  const panel = $('answer-panel');
  panel.style.display = 'flex';
  const mc = $('mc-panel'), oe = $('oe-panel');

  if (bzCurType === 'MC') {
    mc.style.display = 'flex';
    oe.style.display = 'none';
    bzPickedMC = '';
    ['W','X','Y','Z'].forEach(l => {
      const btn = mc.querySelector(`[data-l="${l}"]`);
      btn.textContent = `${l})`;
      btn.classList.remove('sel');
    });
  } else {
    mc.style.display = 'none';
    oe.style.display = 'block';
    const inp = $('BuzzerOE');
    inp.value = '';
    setTimeout(() => inp.focus(), 40);
  }

  // MC: fixed 5s. OE: 1 second per 3 letters in the answer (min 4s)
  bzCurAnsTime = bzCurType === 'MC'
    ? 5
    : 5 + Math.ceil(bzCurAnswer.length / 2);
  bzAnsLeft5 = bzCurAnsTime;
  $('ans-countdown').textContent = bzCurAnsTime;
  $('ans-countdown').className = 'ans-cd';
  // No submit button for MC (auto-submits on pick); show it for OE
  $('ConfirmBtn').style.display = bzCurType === 'OE' ? 'inline-block' : 'none';
}
function bzHideAnswer() { $('answer-panel').style.display = 'none'; }

function bzHideBot() {
  const ov = $('bot-overlay');
  ov.style.display = 'none';
  ov.style.borderColor = 'var(--orange)';
  ov.style.boxShadow = '0 0 30px var(--orange)55';
  $('bot-icon').style.textShadow = '';
  $('BuzzBtn').style.display = '';
}

function bzPickMC(btn, letter) {
  if (bzPhase !== 'PLAYER') return;
  document.querySelectorAll('.mc-buzz-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  bzPickedMC = letter;
  beep(600, 40);
  // Auto-submit after a brief flash so the selection is visible
  setTimeout(bzConfirm, 220);
}

// ══ 5-SECOND ANSWER TIMER ════════════════════════════════════════════════════

function bzStartAnsTimer() {
  bzAnsTimer5 = setInterval(() => {
    bzAnsLeft5 -= 0.1;
    const cd = $('ans-countdown');
    cd.textContent = Math.ceil(bzAnsLeft5);
    if (bzAnsLeft5 <= 1)                          cd.className = 'ans-cd danger';
    else if (bzAnsLeft5 <= bzCurAnsTime * 0.4)    cd.className = 'ans-cd warn';
    if (bzAnsLeft5 <= 0) { bzStopAnsTimer(); bzTimeout(); }
  }, 100);
}
function bzStopAnsTimer() {
  if (bzAnsTimer5) { clearInterval(bzAnsTimer5); bzAnsTimer5 = null; }
}
function bzTimeout() {
  bzHideAnswer();
  if (!bzAudioMode) $('q-text').style.visibility = '';
  bzMember('you', 'idle');
  bzResult('TIME EXPIRED — NO ANSWER', 'neutral');
  bzStats.noAnswer++;
  bzAfterResult();
}

// ══ PLAYER SUBMITS ANSWER ════════════════════════════════════════════════════

function bzConfirm() {
  if (bzPhase !== 'PLAYER') return;
  bzStopAnsTimer();
  bzHideAnswer();
  if (!bzAudioMode) $('q-text').style.visibility = '';

  let ans = '';
  if (bzCurType === 'MC') {
    if (!bzPickedMC) { bzTimeout(); return; }
    ans = bzOptText(bzCurQ, bzPickedMC);
  } else {
    ans = $('BuzzerOE').value.trim();
    if (!ans) { bzTimeout(); return; }
  }

  bzStats.buzzed++;
  const ok = bzFuzzy(ans, bzCurAnswer);
  bzMember('you', ok ? 'ok' : 'fail');

  if (ok) {
    bzMyScore += 4;
    bzStats.correct++;
    beep(880, 130);
    bzUpdateScores();
    bzResult(`✓ CORRECT! +4  ·  ${bzCurAnswer}`, 'correct');
    bzAfterResult();
  } else {
    bzMyScore -= 4;
    bzStats.wrong++;
    bzMyLocked = true;
    beep(220, 220);
    bzUpdateScores();
    bzResult(`✗ WRONG −4  ·  Correct: ${bzCurAnswer}`, 'incorrect');
    setTimeout(() => {
      bzResult('', '');
      bzOppChance('en');
    }, 2200);
  }
}

// ══ RESULT / FLOW ════════════════════════════════════════════════════════════

function bzResult(msg, cls) {
  $('round-result').textContent = msg;
  $('round-result').className = cls;
}
function bzAfterResult() {
  bzPhase = 'RESULT';
  bzUpdateScores();
  $('NextBtn').style.display = 'inline-block';
  $('BuzzBtn').style.display = 'none';
}
function bzNext() {
  bzCancelTimers();
  bzStopBuzzWindow();
  bzStopAnsTimer();
  bzStopSpeech();
  bzLoad();
}
function bzUpdateScores() {
  $('my-score').textContent = bzMyScore;
  $('en-score').textContent = bzEnScore;
  $('round-info').textContent = `TOSS-UP ${bzRound} / ${bzTotalRounds}  ·  MY TEAM ${bzMyScore}  ·  OPP ${bzEnScore}`;
}

// ══ MEMBER ROW STATE ═════════════════════════════════════════════════════════

function bzMember(id, state) {
  const el = $(`m-${id}`);
  if (!el) return;
  el.className = 'member' + (state !== 'idle' ? ` ${state}` : '');
  const st = $(`ms-${id}`);
  if (!st) return;
  st.textContent = { buzzing: '● BUZZED', ok: '✓ CORRECT', fail: '✗ WRONG', idle: '' }[state] ?? '';
}

// ══ GAME OVER ════════════════════════════════════════════════════════════════

function bzUpdateStreak() {
  const today = new Date().toISOString().slice(0, 10);
  let s; try { s = JSON.parse(localStorage.getItem('sb_streak') || '{}'); } catch(e) { s = {}; }
  if (s.lastDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  s.count = s.lastDate === yesterday ? (s.count || 0) + 1 : 1;
  s.lastDate = today;
  s.best = Math.max(s.best || 0, s.count);
  localStorage.setItem('sb_streak', JSON.stringify(s));
}

function bzSaveStats() {
  bzUpdateStreak();
  const won = bzMyScore > bzEnScore, tied = bzMyScore === bzEnScore;
  let s; try { s = JSON.parse(localStorage.getItem('sb_buzzer_stats') || '{}'); } catch(e) { s = {}; }
  s.sessions = (s.sessions || 0) + 1;
  s.wins     = (s.wins    || 0) + (won  ? 1 : 0);
  s.losses   = (s.losses  || 0) + (!won && !tied ? 1 : 0);
  s.draws    = (s.draws   || 0) + (tied ? 1 : 0);
  s.buzzed   = (s.buzzed  || 0) + bzStats.buzzed;
  s.correct  = (s.correct || 0) + bzStats.correct;
  s.wrong    = (s.wrong   || 0) + bzStats.wrong;
  const date = new Date().toLocaleDateString('en-US', {month:'short', day:'numeric'});
  const history = s.history || [];
  const acc = bzStats.buzzed ? Math.round(bzStats.correct / bzStats.buzzed * 100) : 0;
  history.push({ date, won: won ? 1 : tied ? 0.5 : 0, myScore: bzMyScore, enScore: bzEnScore, acc });
  if (history.length > 20) history.splice(0, history.length - 20);
  s.history = history;
  localStorage.setItem('sb_buzzer_stats', JSON.stringify(s));
}

function bzGameOver() {
  bzSaveStats();
  bzPhase = 'DONE';
  bzCancelTimers();
  bzStopBuzzWindow();
  bzStopAnsTimer();
  bzStopSpeech();
  ['BuzzBtn','NextBtn'].forEach(id => $(id).style.display = 'none');
  ['teams-panel','question-area','buzz-zone','round-result','opp-chance-banner','locked-banner']
    .forEach(id => $(id).style.display = 'none');

  const won  = bzMyScore > bzEnScore;
  const tied = bzMyScore === bzEnScore;
  const label = tied ? 'DRAW' : won ? 'VICTORY' : 'DEFEAT';
  const col   = tied ? 'var(--cyan)' : won ? 'var(--green)' : 'var(--magenta)';
  const acc   = bzStats.buzzed ? Math.round(bzStats.correct / bzStats.buzzed * 100) : 0;

  $('game-over').innerHTML = `
    <div class="go-result-txt" style="color:${col};text-shadow:0 0 30px ${col}">${label}</div>
    <div class="go-scores">
      <div class="go-score-block">
        <div class="go-score-lbl">YOUR TEAM</div>
        <div class="go-score-num" style="color:var(--green);text-shadow:0 0 25px var(--green)">${bzMyScore}</div>
      </div>
      <div style="color:var(--muted);font-size:1.5rem">VS</div>
      <div class="go-score-block">
        <div class="go-score-lbl">OPPONENTS</div>
        <div class="go-score-num" style="color:var(--magenta);text-shadow:0 0 25px var(--magenta)">${bzEnScore}</div>
      </div>
    </div>
    <div class="go-stats">
      Personal buzzes: ${bzStats.buzzed} &nbsp;·&nbsp; Correct: ${bzStats.correct} &nbsp;·&nbsp; Wrong: ${bzStats.wrong} &nbsp;·&nbsp; Accuracy: ${acc}%<br>
      Unanswered toss-ups: ${bzStats.noAnswer} &nbsp;·&nbsp; Rounds played: ${bzRound - 1} / ${bzTotalRounds}
    </div>
    <button onclick="location.reload()" style="margin-top:2rem;font-size:1rem;padding:0.7rem 2.5rem;border-color:var(--cyan);color:var(--cyan);">
      ↺ PLAY AGAIN
    </button>`;
  $('game-over').style.display = 'block';
  beep(won ? 880 : 220, 450);
}

// ══ UTILITIES ════════════════════════════════════════════════════════════════

function $(id) { return document.getElementById(id); }
function rnd(n) { return Math.floor(Math.random() * n); }

function bzOptText(q, letter) {
  const order = ['W','X','Y','Z'];
  const idx = order.indexOf(letter);
  const start = q.indexOf(letter + ') ') + 3;
  const next  = order[idx + 1];
  const end   = next ? q.indexOf(next + ') ') : q.length;
  return q.slice(start, end).trim();
}
function bzFuzzy(a, b) {
  const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
  const na = norm(a), nb = norm(b);
  if (na === nb) return true;
  if (nb.length <= 3) return false;
  const thr = Math.max(2, Math.floor(Math.max(na.length, nb.length) * 0.25));
  return bzLev(na, nb) <= thr;
}
function bzLev(a, b) {
  const dp = Array.from({length: a.length+1}, (_,i) =>
    Array.from({length: b.length+1}, (_,j) => i||j));
  for (let i=1;i<=a.length;i++) for (let j=1;j<=b.length;j++)
    dp[i][j] = a[i-1]===b[j-1] ? dp[i-1][j-1] : 1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  return dp[a.length][b.length];
}

// ══ STARFIELD ════════════════════════════════════════════════════════════════

(function() {
  const cv = document.getElementById('starfield');
  const cx = cv.getContext('2d');
  let stars = [];
  function resize() { cv.width = innerWidth; cv.height = innerHeight; }
  function init() {
    stars = Array.from({length:200}, () => ({
      x: Math.random()*cv.width, y: Math.random()*cv.height,
      r: Math.random()*1.2+0.2, speed: Math.random()*0.25+0.04, op: Math.random()*0.6+0.2
    }));
  }
  function draw() {
    cx.clearRect(0,0,cv.width,cv.height);
    stars.forEach(s => {
      cx.beginPath(); cx.arc(s.x,s.y,s.r,0,Math.PI*2);
      cx.fillStyle=`rgba(232,244,255,${s.op})`; cx.fill();
      s.y+=s.speed; if(s.y>cv.height){s.y=0;s.x=Math.random()*cv.width;}
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',()=>{resize();init();});
  resize(); init(); draw();
})();

// ══ BEEP ═════════════════════════════════════════════════════════════════════

function beep(freq=880, dur=80) {
  if (window.SBSettings && !window.SBSettings.get('sound')) return;
  try {
    const AC = window.AudioContext || /** @type {any} */(window).webkitAudioContext;
    const ac = new AC();
    const o = ac.createOscillator(), g = ac.createGain();
    o.connect(g); g.connect(ac.destination);
    o.frequency.value=freq; o.type='sine';
    g.gain.setValueAtTime(0.12,ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+dur/1000);
    o.start(ac.currentTime); o.stop(ac.currentTime+dur/1000);
  } catch(e){}
}

function typeText(el, text, speed=50) {
  el.innerHTML=''; let i=0;
  const iv=setInterval(()=>{
    el.innerHTML=text.slice(0,i)+'<span class="blink-cursor">|</span>';
    i++; if(i>text.length) clearInterval(iv);
  },speed);
}

// ══ INIT ═════════════════════════════════════════════════════════════════════

window.addEventListener('DOMContentLoaded', () => {
  typeText($('Title'), 'BUZZER ARENA');
  bzSliderTrail();
  bzStatus();

  // Guard the buzz button so hover/animation glitches can't trigger it —
  // only fire if the user actually pressed down on the button first.
  let buzzBtnDown = false;
  const buzzBtn = $('BuzzBtn');
  buzzBtn.addEventListener('pointerdown', () => { buzzBtnDown = true; });
  buzzBtn.addEventListener('pointerleave', () => { buzzBtnDown = false; });
  buzzBtn.addEventListener('click', () => { if (buzzBtnDown) { buzzBtnDown = false; bzPlayerBuzz(); } });

  document.addEventListener('keydown', e => {
    if ((bzPhase === 'READING' || bzPhase === 'BUZZ_OPEN') && e.code === 'Space') {
      e.preventDefault();
      bzPlayerBuzz();
      return;
    }
    if (bzPhase === 'PLAYER') {
      if (bzCurType === 'MC') {
        const map = {w:0,x:1,y:2,z:3};
        const idx = map[e.key.toLowerCase()];
        if (idx !== undefined) {
          e.preventDefault();
          const btns = document.querySelectorAll('.mc-buzz-btn');
          btns.forEach((b,i) => b.classList.toggle('sel', i===idx));
          bzPickedMC = ['W','X','Y','Z'][idx];
          beep(600, 40);
          setTimeout(bzConfirm, 220);
        }
      }
      if (bzCurType === 'OE' && e.key === 'Enter') { e.preventDefault(); bzConfirm(); }
    }
    if (bzPhase === 'RESULT' && e.key === 'Enter') {
      e.preventDefault(); bzNext();
    }
  });
});
