const subjectMap = {
  MS: {
    Math: MSMath,
    Physics: MSPhysics,
    Chemistry: MSChemistry,
    Biology: MSBiology,
    EarthSpace: MSEarthSpace,
    Energy: MSEnergy,
  },
  HS: {
    Math: HSMath,
    Physics: HSPhysics,
    Chemistry: HSChemistry,
    Biology: HSBiology,
    EarthSpace: HSEarthSpace,
    Energy: HSEnergy,
  },
};

const allSubjectNames = ["Math", "Physics", "Chemistry", "Biology", "EarthSpace", "Energy"];

let level = "";
let currentQuestion = "";
let currentSubject = null;
let currentSubjectName = "";
let currentAnswer = "";
let questionType = "";
let maxQuestions = 30;
let selectedSubjects = [];
let sessionStarted = false;
let timedMode = false;
let audioMode = false;
let questionStartTime = 0;
let timerInterval = null;
let timerStartTimeout = null;
let questionFilter = "mixed";
let currentStreak = 0;
let bestStreak = 0;
const selectedSubjectNames = new Set();
const askedQuestions = new Set();

const stats = {};
const answeredQuestions = [];

let reviewMode = false;
let reviewQueue = [];
let sessionReviewQueue = [];
let newlyQueued = 0;

function loadReviewQueue() {
  try { return JSON.parse(localStorage.getItem('sb_review_queue') || '[]'); } catch(e) { return []; }
}
function saveReviewQueue(q) {
  localStorage.setItem('sb_review_queue', JSON.stringify(q));
}

const submitBtn = document.getElementById("Submit");

function rebuildSelectedSubjects() {
  selectedSubjects = [...selectedSubjectNames]
    .map(n => ({ name: n, data: subjectMap[level][n] }))
    .filter(s => s.data);
}

function MSSelect() {
  level = "MS";
  rebuildSelectedSubjects();
  beep(660, 60);
  document.getElementById("Cadet").classList.add("selected");
  document.getElementById("Lieutenant").classList.remove("selected");
  updateStatus();
}

function HSSelect() {
  level = "HS";
  rebuildSelectedSubjects();
  beep(880, 60);
  document.getElementById("Lieutenant").classList.add("selected");
  document.getElementById("Cadet").classList.remove("selected");
  updateStatus();
}

function extractOption(question, letter) {
  const order = ["W", "X", "Y", "Z"];
  const idx = order.indexOf(letter);
  const start = question.indexOf(letter + ") ") + 3;
  const nextLetter = order[idx + 1];
  const end = nextLetter ? question.indexOf(nextLetter + ") ") : question.length;
  return question.slice(start, end).trim();
}

function getSelectedAnswer(question) {
  const options = ["W", "X", "Y", "Z"];
  for (let i = 0; i < options.length; i++) {
    const radio = document.getElementById("c" + (i + 1));
    if (radio && radio.checked) return extractOption(question, options[i]);
  }
  return "";
}

function AddMCQuestion() {
  if (level === "" || selectedSubjects.length === 0) return;

  if (currentQuestion !== "") checkAndShowAnswer();

  if (maxQuestions <= 0) {
    showResults();
    return;
  }

  if (!sessionStarted) {
    sessionStarted = true;
    submitBtn.style.display = "none";
    document.getElementById("ranks")?.remove();
    document.getElementById("SubjectContainer")?.remove();
    document.getElementById("CampaignLength")?.remove();
    document.getElementById("OptionsPanel")?.remove();
    document.getElementById("status-indicator")?.remove();
    document.getElementById("home-link-wrap")?.remove();
    startCountdown(loadQuestion);
    return;
  }

  loadQuestion();
}

function loadQuestion() {
  stopTimer();
  maxQuestions--;
  submitBtn.innerHTML = maxQuestions === 0 ? "FINISH OPERATION" : "ADVANCE >";

  if (reviewMode) {
    if (sessionReviewQueue.length === 0) { showResults(); return; }
    const idx = Math.floor(Math.random() * sessionReviewQueue.length);
    const item = sessionReviewQueue.splice(idx, 1)[0];
    currentSubjectName = item.subjectName;
    currentSubject = { [item.question]: item.correctAnswer };
    currentQuestion = item.question;
  } else {
    const available = selectedSubjects
      .map(s => ({ ...s, keys: Object.keys(s.data).filter(k => !askedQuestions.has(k) && matchesFilter(k)) }))
      .filter(s => s.keys.length > 0);
    if (available.length === 0) { showResults(); return; }
    const pick = available[Math.floor(Math.random() * available.length)];
    currentSubjectName = pick.name;
    currentSubject = pick.data;
    currentQuestion = pick.keys[Math.floor(Math.random() * pick.keys.length)];
    askedQuestions.add(currentQuestion);
  }

  const container = document.getElementById("QuestionContainer");
  container.innerHTML = "";

  const timerHTML = timedMode ? `<div id="question-timer">⏱ 0.0s</div>` : "";

  if (currentQuestion.includes("W)")) {
    const wIdx = currentQuestion.indexOf("W) ");
    const questionText = wIdx !== -1 ? currentQuestion.slice(0, wIdx).trim() : currentQuestion;
    const opts = ["W", "X", "Y", "Z"].map((l, i) => {
      const optText = audioMode ? "" : ` ${extractOption(currentQuestion, l)}`;
      return `<label class="mc-label"><input id="c${i+1}" type="radio" name="mcq">
        <span class="opt-letter">${l})</span>${optText}
      </label>`;
    }).join("");
    container.innerHTML = `
      ${timerHTML}
      ${audioMode ? "" : `<h2 class="question-text">${questionText}</h2>`}
      <div class="mc-options">${opts}</div>`;
    questionType = "MC";
  } else {
    container.innerHTML = `
      ${timerHTML}
      ${audioMode ? "" : `<h2 class="question-text">${currentQuestion}</h2>`}
      <input id="OpenInput">`;
    questionType = "OE";
  }

  submitBtn.style.display = "block";
  document.getElementById("key-hint").style.display = "block";
  document.getElementById("EndEarly").style.display = "inline-block";
  document.getElementById("AbandonBtn").style.display = "inline-block";
  typeText(document.getElementById("Title"), reviewMode ? "REVIEW ACTIVE" : "MISSION ACTIVE");

  if (audioMode) {
    speakQuestion(currentQuestion, timedMode ? startTimer : null);
  } else if (timedMode) {
    timerStartTimeout = setTimeout(startTimer, 5000);
  }
}

function checkAndShowAnswer() {
  const timeTaken = stopTimer();

  if (questionType === "MC") {
    currentAnswer = getSelectedAnswer(currentQuestion);
  } else if (questionType === "OE") {
    const input = document.getElementById("OpenInput");
    currentAnswer = input ? input.value.toLowerCase() : "";
  }

  const correctAnswer = currentSubject[currentQuestion];

  function normalize(s) {
    return s.toLowerCase().replace(/\s*(,|and)\s*/g, ",").replace(/[^a-z0-9,]/g, " ").replace(/\s+/g, " ").trim();
  }

  function levenshtein(a, b) {
    const dp = Array.from({ length: a.length + 1 }, (_, i) =>
      Array.from({ length: b.length + 1 }, (_, j) => i || j)
    );
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++)
        dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    return dp[a.length][b.length];
  }

  function fuzzyMatch(a, b) {
    const na = normalize(a), nb = normalize(b);
    if (na === nb) return true;
    if (nb.length <= 4) return false;
    const threshold = Math.max(2, Math.floor(Math.max(na.length, nb.length) * 0.2));
    return levenshtein(na, nb) <= threshold;
  }

  const isCorrect =
    fuzzyMatch(currentAnswer, correctAnswer) ||
    (questionType === "OE" && normalize(currentAnswer) === normalize(correctAnswer));

  if (isCorrect) { currentStreak++; bestStreak = Math.max(bestStreak, currentStreak); }
  else { currentStreak = 0; }
  updateStreakDisplay();

  if (!stats[currentSubjectName]) stats[currentSubjectName] = { correct: 0, total: 0, totalTime: 0 };
  stats[currentSubjectName].total++;
  if (isCorrect) stats[currentSubjectName].correct++;
  if (timeTaken !== null) stats[currentSubjectName].totalTime += timeTaken;

  if (reviewMode && isCorrect) {
    reviewQueue = reviewQueue.filter(item => item.question !== currentQuestion);
    saveReviewQueue(reviewQueue);
  }

  answeredQuestions.push({
    question: currentQuestion,
    subjectName: currentSubjectName,
    correctAnswer,
    userAnswer: currentAnswer,
    wasCorrect: isCorrect,
    timeTaken,
  });

  beep(isCorrect ? 880 : 220, isCorrect ? 100 : 150);

  const answerEl = document.getElementById("answer");
  answerEl.className = isCorrect ? "correct" : "incorrect";
  answerEl.innerHTML = isCorrect
    ? "Correct!" + (timeTaken !== null ? ` <span class="time-tag">${timeTaken.toFixed(1)}s</span>` : "")
    : `Incorrect. The correct answer was: ${correctAnswer}` + (timeTaken !== null ? ` <span class="time-tag">${timeTaken.toFixed(1)}s</span>` : "");
}

function UpdateQuestions() {
  const slider = document.getElementById("QuestionSlider");
  document.getElementById("AmountQuestions").innerHTML = slider.value + " QUESTIONS";
  maxQuestions = Number(slider.value);
  updateSliderTrail();
}

function addSubject(subjectName, checkbox) {
  if (subjectName === "Everything") {
    if (checkbox.checked) {
      allSubjectNames.forEach(n => {
        selectedSubjectNames.add(n);
        document.getElementById(n).checked = true;
      });
    } else {
      selectedSubjectNames.clear();
      allSubjectNames.forEach(n => { document.getElementById(n).checked = false; });
    }
  } else {
    checkbox.checked ? selectedSubjectNames.add(subjectName) : selectedSubjectNames.delete(subjectName);
  }

  const label = checkbox.parentElement;
  label.classList.remove("flash");
  void label.offsetWidth;
  label.classList.add("flash");
  beep(checkbox.checked ? 600 : 400, 50);

  if (level !== "") rebuildSelectedSubjects();
  updateStatus();
}

function savePracticeStats() {
  const key = "sb_practice_" + level;
  let saved;
  try { saved = JSON.parse(localStorage.getItem(key) || "{}"); } catch(e) { saved = {}; }

  for (const [subj, data] of Object.entries(stats)) {
    if (!saved[subj]) saved[subj] = { correct: 0, total: 0 };
    saved[subj].correct += data.correct;
    saved[subj].total   += data.total;
  }

  const totalAnswered = answeredQuestions.length;
  const totalCorrect  = Object.values(stats).reduce((s, v) => s + v.correct, 0);
  saved._sessions  = (saved._sessions  || 0) + 1;
  saved._total     = (saved._total     || 0) + totalAnswered;
  saved._correct   = (saved._correct   || 0) + totalCorrect;
  saved._bestStreak = Math.max(saved._bestStreak || 0, bestStreak);

  localStorage.setItem(key, JSON.stringify(saved));

  if (!reviewMode) {
    const existing = loadReviewQueue();
    const existingSet = new Set(existing.map(i => i.question));
    const newMissed = answeredQuestions
      .filter(q => !q.wasCorrect && !existingSet.has(q.question))
      .map(q => ({ question: q.question, correctAnswer: q.correctAnswer, subjectName: q.subjectName, level }));
    newlyQueued = newMissed.length;
    if (newMissed.length > 0) saveReviewQueue([...existing, ...newMissed]);
  }
}

function startReviewMode() {
  reviewQueue = loadReviewQueue();
  if (reviewQueue.length === 0) { beep(200, 200); return; }
  reviewMode = true;
  sessionReviewQueue = [...reviewQueue];
  maxQuestions = sessionReviewQueue.length;
  sessionStarted = true;
  submitBtn.style.display = "none";
  document.getElementById("ranks")?.remove();
  document.getElementById("SubjectContainer")?.remove();
  document.getElementById("CampaignLength")?.remove();
  document.getElementById("OptionsPanel")?.remove();
  document.getElementById("status-indicator")?.remove();
  document.getElementById("home-link-wrap")?.remove();
  document.getElementById("review-launch")?.remove();
  startCountdown(loadQuestion);
}

function showResults() {
  savePracticeStats();
  const container = document.getElementById("QuestionContainer");
  document.getElementById("answer").innerHTML = "";
  document.getElementById("streak-display").style.display = "none";
  document.getElementById("key-hint").style.display = "none";
  document.getElementById("EndEarly").style.display = "none";
  document.getElementById("AbandonBtn").style.display = "none";
  submitBtn.style.display = "none";

  const totalAnswered = answeredQuestions.length;
  const totalCorrect = Object.values(stats).reduce((s, v) => s + v.correct, 0);
  const overallPct = totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const scoreColor = overallPct >= 70 ? "var(--green)" : overallPct >= 40 ? "var(--orange)" : "var(--magenta)";

  const barChartHTML = `
    <div class="bar-chart">
      ${Object.entries(stats).map(([name, data]) => {
        const pct = data.total ? Math.round((data.correct / data.total) * 100) : 0;
        const color = pct >= 70 ? "var(--green)" : pct >= 40 ? "var(--orange)" : "var(--magenta)";
        return `
          <div class="bar-col">
            <span class="bar-col-pct" style="color:${color}">${pct}%</span>
            <div class="bar-col-track">
              <div class="bar-col-fill" style="height:${pct}%; background:${color}; box-shadow: 0 0 8px ${color};"></div>
            </div>
            <span class="bar-col-label">${name}</span>
          </div>`;
      }).join("")}
    </div>`;

  const subjectBarsHTML = Object.entries(stats).map(([name, data]) => {
    const pct = data.total ? Math.round((data.correct / data.total) * 100) : 0;
    const color = pct >= 70 ? "var(--green)" : pct >= 40 ? "var(--orange)" : "var(--magenta)";
    const avgTime = timedMode && data.total ? (data.totalTime / data.total).toFixed(1) + "s avg" : "";
    const feedback =
      pct === 100 ? "Perfect — keep it up!" :
      pct >= 70   ? "Strong — review any misses." :
      pct >= 40   ? "Needs work — revisit this subject." :
                    "Struggling — focus study time here.";
    return `
      <div class="subject-row">
        <span class="subject-label">${name}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width:${pct}%; background:${color};"></div>
        </div>
        <span class="subject-score">${data.correct}/${data.total} (${pct}%)${avgTime ? " · " + avgTime : ""}</span>
        <span class="subject-feedback">${feedback}</span>
      </div>`;
  }).join("");

  const timedHTML = (() => {
    const timed = answeredQuestions.filter(q => q.timeTaken !== null);
    if (!timedMode || timed.length === 0) return "";
    const avg = (timed.reduce((s, q) => s + q.timeTaken, 0) / timed.length).toFixed(1);
    const fastest = timed.reduce((a, b) => a.timeTaken < b.timeTaken ? a : b);
    const slowest = timed.reduce((a, b) => a.timeTaken > b.timeTaken ? a : b);
    const trim = t => t.length > 60 ? t.slice(0, 60) + "…" : t;
    return `
      <h3>RESPONSE TIMES</h3>
      <div class="timing-stats">
        <div class="timing-row"><span class="timing-label">AVERAGE</span><span class="timing-val">${avg}s</span></div>
        <div class="timing-row"><span class="timing-label">FASTEST</span><span class="timing-val">${fastest.timeTaken.toFixed(1)}s</span><span class="timing-q">${trim(fastest.question)}</span></div>
        <div class="timing-row"><span class="timing-label">SLOWEST</span><span class="timing-val">${slowest.timeTaken.toFixed(1)}s</span><span class="timing-q">${trim(slowest.question)}</span></div>
      </div>`;
  })();

  const missed = answeredQuestions.filter(q => !q.wasCorrect);
  const missedHTML = missed.length === 0
    ? `<p class="no-misses">Perfect score — no incorrect answers!</p>`
    : missed.map(q => `
      <div class="missed-card">
        <p class="missed-q">${q.question}</p>
        <p class="missed-yours">Your answer: <span>${q.userAnswer || "(no answer)"}</span></p>
        <p class="missed-correct">Correct answer: <span>${q.correctAnswer}</span></p>
        <p class="missed-subject">Subject: ${q.subjectName}${q.timeTaken !== null ? ` · ${q.timeTaken.toFixed(1)}s` : ""}</p>
      </div>`).join("");

  container.innerHTML = `
    <div class="results-screen">
      <h2>${reviewMode ? "REVIEW DEBRIEF" : "MISSION DEBRIEF"}</h2>
      <div class="overall-score">
        <svg class="score-ring" viewBox="0 0 120 120">
          <circle class="ring-bg"   cx="60" cy="60" r="50"/>
          <circle class="ring-fill" cx="60" cy="60" r="50"
            stroke="${scoreColor}"
            stroke-dasharray="${overallPct * 3.14159} 314.159"
            transform="rotate(-90 60 60)"/>
        </svg>
        <div class="score-text">
          <span class="score-pct" style="color:${scoreColor}">${overallPct}%</span>
          <span class="score-fraction">${totalCorrect} / ${totalAnswered}</span>
          ${bestStreak > 0 ? `<span class="score-streak">best chain: ${bestStreak}</span>` : ""}
        </div>
      </div>
      ${timedHTML}
      <h3>SUBJECT BREAKDOWN</h3>
      ${barChartHTML}
      <div class="subject-breakdown">${subjectBarsHTML}</div>
      <h3>MISSED QUESTIONS (${missed.length})</h3>
      <div class="missed-list">${missedHTML}</div>
      ${reviewMode
        ? `<p class="review-note">⚑ ${Object.values(stats).reduce((s,v)=>s+v.correct,0)} cleared from queue — ${reviewQueue.length} still pending.</p>`
        : newlyQueued > 0 ? `<p class="review-note">⚑ ${newlyQueued} missed question${newlyQueued !== 1 ? 's' : ''} added to your Review Queue.</p>` : ''}
      <div class="debrief-actions">
        <button class="debrief-btn" onclick="location.reload()">PRACTICE AGAIN</button>
        <button class="debrief-btn debrief-btn-secondary" onclick="location.href='index.html'">HOME BASE</button>
      </div>
    </div>`;
}

// ── STARFIELD ──────────────────────────────────────────────────────────────────
(function () {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function init() {
    stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      speed: Math.random() * 0.25 + 0.04,
      opacity: Math.random() * 0.6 + 0.2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,244,255,${s.opacity})`;
      ctx.fill();
      s.y += s.speed;
      if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => { resize(); init(); });
  resize(); init(); draw();
})();

// ── AUDIO BEEP ────────────────────────────────────────────────────────────────
function beep(freq = 880, duration = 80) {
  try {
    const ac = new (window.AudioContext || window["webkitAudioContext"])();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.12, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration / 1000);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + duration / 1000);
  } catch (e) {}
}

// ── SPEECH ────────────────────────────────────────────────────────────────────
function speakQuestion(questionStr, onComplete) {
  if (!window.speechSynthesis) { onComplete?.(); return; }
  window.speechSynthesis.cancel();
  const wIdx = questionStr.indexOf("W) ");
  let text;
  if (wIdx !== -1) {
    const questionText = questionStr.slice(0, wIdx).trim();
    const optTexts = ["W", "X", "Y", "Z"].map(l => `${l}: ${extractOption(questionStr, l)}`).join(". ");
    text = questionText + ". " + optTexts;
  } else {
    text = questionStr;
  }
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.92;
  utt.pitch = 1;
  if (onComplete) utt.onend = onComplete;
  window.speechSynthesis.speak(utt);
}

// ── TIMER ─────────────────────────────────────────────────────────────────────
function startTimer() {
  questionStartTime = Date.now();
  timerInterval = setInterval(() => {
    const el = document.getElementById("question-timer");
    if (!el) return;
    const elapsed = ((Date.now() - questionStartTime) / 1000).toFixed(1);
    el.textContent = `⏱ ${elapsed}s`;
    el.className = elapsed > 15 ? "timer-warning" : "";
  }, 100);
}

function stopTimer() {
  clearTimeout(timerStartTimeout);
  timerStartTimeout = null;
  clearInterval(timerInterval);
  timerInterval = null;
  if (!timedMode || questionStartTime === 0) return null;
  const t = (Date.now() - questionStartTime) / 1000;
  questionStartTime = 0;
  return t;
}

// ── TYPING EFFECT ─────────────────────────────────────────────────────────────
function typeText(el, text, speed = 50) {
  el.innerHTML = "";
  let i = 0;
  const iv = setInterval(() => {
    el.innerHTML = text.slice(0, i) + '<span class="blink-cursor">|</span>';
    i++;
    if (i > text.length) clearInterval(iv);
  }, speed);
}

// ── STATUS INDICATOR ──────────────────────────────────────────────────────────
function updateStatus() {
  const indicator = document.getElementById("status-indicator");
  if (!indicator) return;

  const ready = level !== "" && selectedSubjectNames.size > 0;
  const levelText = level === "MS" ? "AGENT [ MIDDLE SCHOOL ]" : level === "HS" ? "COMMANDER [ HIGH SCHOOL ]" : null;
  const subjectList = [...selectedSubjectNames].join(" · ");

  const levelRow = levelText
    ? `<div class="status-row"><span class="status-check">✓</span><span class="status-item">${levelText}</span></div>`
    : `<div class="status-row"><span class="status-arrow">→</span><span class="status-needed">SELECT OPERATIVE CLASS</span></div>`;

  const subjectRow = selectedSubjectNames.size > 0
    ? `<div class="status-row"><span class="status-check">✓</span><span class="status-item">${subjectList}</span></div>`
    : `<div class="status-row"><span class="status-arrow">→</span><span class="status-needed">SELECT AT LEAST ONE MODULE</span></div>`;

  const dotClass = ready ? "dot-ready" : "dot-offline";
  const statusColor = ready ? "var(--green)" : "var(--orange)";
  const statusText = ready ? "SYSTEMS READY" : "SYSTEMS OFFLINE";

  indicator.innerHTML = `
    ${levelRow}
    ${subjectRow}
    <div class="status-row status-overall">
      <span class="${dotClass}"></span>
      <span style="color:${statusColor};text-shadow:0 0 8px ${statusColor}">${statusText}</span>
    </div>`;
}

// ── COUNTDOWN ─────────────────────────────────────────────────────────────────
function startCountdown(callback) {
  const container = document.getElementById("QuestionContainer");
  let count = 3;
  container.innerHTML = `<h1 class="countdown">${count}</h1>`;
  beep(440, 120);
  const iv = setInterval(() => {
    count--;
    if (count > 0) {
      container.innerHTML = `<h1 class="countdown">${count}</h1>`;
      beep(440, 120);
    } else {
      clearInterval(iv);
      container.innerHTML = `<h1 class="countdown" style="color:var(--green);text-shadow:0 0 40px var(--green)">GO</h1>`;
      beep(880, 200);
      setTimeout(callback, 500);
    }
  }, 800);
}

// ── SLIDER TRAIL ─────────────────────────────────────────────────────────────
function updateSliderTrail() {
  const slider = document.getElementById("QuestionSlider");
  if (!slider) return;
  const pct = (slider.value - slider.min) / (slider.max - slider.min) * 100;
  slider.style.background = `linear-gradient(to right, #00f5ff ${pct}%, #0f1535 ${pct}%)`;
}

// ── STREAK ────────────────────────────────────────────────────────────────────
function updateStreakDisplay() {
  const el = document.getElementById("streak-display");
  if (!el) return;
  if (currentStreak === 0) { el.style.display = "none"; return; }
  el.style.display = "flex";
  const color = currentStreak >= 25 ? "var(--magenta)" : currentStreak >= 10 ? "var(--orange)" : "var(--green)";
  el.innerHTML = `<span style="color:${color};text-shadow:0 0 12px ${color}">⚡ CHAIN: ${currentStreak}</span>`;
  if ([5, 10, 25].includes(currentStreak)) {
    el.classList.remove("streak-pop");
    void el.offsetWidth;
    el.classList.add("streak-pop");
  }
}

// ── QUESTION FILTER ───────────────────────────────────────────────────────────
function matchesFilter(key) {
  if (questionFilter === "mc") return key.includes("W)");
  if (questionFilter === "oe") return !key.includes("W)");
  return true;
}

// ── INIT ──────────────────────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  typeText(document.getElementById("Title"), "COMMAND DECK");
  updateSliderTrail();

  // Review queue UI
  const rq = loadReviewQueue();
  const rlEl = document.getElementById("review-launch");
  if (rlEl) {
    if (rq.length > 0) {
      rlEl.innerHTML = `<button class="review-queue-btn" onclick="startReviewMode()">⚑ DRILL REVIEW QUEUE <span class="review-queue-count">${rq.length}</span></button>`;
    } else {
      rlEl.innerHTML = `<p class="review-queue-empty">Review queue is empty — missed questions appear here after practice.</p>`;
    }
  }

  // URL param auto-select (from weak spot link on Progress page)
  const params = new URLSearchParams(location.search);
  const pLevel = params.get('level');
  const pSubject = params.get('subject');
  if (pLevel === 'MS') MSSelect();
  else if (pLevel === 'HS') HSSelect();
  if (pSubject) {
    const cb = document.getElementById(pSubject);
    if (cb) { cb.checked = true; addSubject(pSubject, cb); }
  }
  document.getElementById("QuestionSlider").addEventListener("input", updateSliderTrail);
  updateStatus();
  document.getElementById("TimedMode").addEventListener("change", e => { timedMode = e.target.checked; });
  document.getElementById("AudioMode").addEventListener("change", e => { audioMode = e.target.checked; });
  document.querySelectorAll('input[name="qtype"]').forEach(r =>
    r.addEventListener("change", e => { questionFilter = e.target.value; })
  );

  document.addEventListener("keydown", e => {
    if (document.activeElement?.id === "OpenInput") return;
    if (e.key === "Enter") { e.preventDefault(); AddMCQuestion(); return; }
    if (questionType === "MC") {
      const map = { w: 0, x: 1, y: 2, z: 3 };
      const idx = map[e.key.toLowerCase()];
      if (idx !== undefined)
        document.querySelectorAll('input[name="mcq"]').forEach((r, i) => r.checked = i === idx);
    }
  });
});
