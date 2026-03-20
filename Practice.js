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
    Energy: HSEnergyQuestions,
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
const selectedSubjectNames = new Set();

const stats = {};
const answeredQuestions = [];

const submitBtn = document.getElementById("Submit");

function rebuildSelectedSubjects() {
  selectedSubjects = [...selectedSubjectNames]
    .map(n => ({ name: n, data: subjectMap[level][n] }))
    .filter(s => s.data);
}

function MSSelect() { level = "MS"; rebuildSelectedSubjects(); }
function HSSelect() { level = "HS"; rebuildSelectedSubjects(); }

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
    const checkbox = document.getElementById("c" + (i + 1));
    if (checkbox && checkbox.checked) {
      return extractOption(question, options[i]);
    }
  }
  return "";
}

function AddMCQuestion() {
  if (level === "" || selectedSubjects.length === 0) return;

  if (currentQuestion !== "") {
    checkAndShowAnswer();
  }

  if (maxQuestions <= 0) {
    showResults();
    return;
  }
  maxQuestions--;

  submitBtn.innerHTML = "Next Phase";
  const pick = selectedSubjects[Math.floor(Math.random() * selectedSubjects.length)];
  currentSubjectName = pick.name;
  currentSubject = pick.data;
  currentQuestion = Object.keys(currentSubject)[Math.floor(Math.random() * Object.keys(currentSubject).length)];

  const container = document.getElementById("QuestionContainer");
  container.innerHTML = "";

  if (currentQuestion.includes("W)")) {
    container.insertAdjacentHTML("beforeend", `
      <h2>${currentQuestion}</h2>
      <h2>Answers</h2>
      <label><input id="c1" type="checkbox"> W</label>
      <label><input id="c2" type="checkbox"> X</label>
      <label><input id="c3" type="checkbox"> Y</label>
      <label><input id="c4" type="checkbox"> Z</label>
    `);
    questionType = "MC";
  } else {
    container.insertAdjacentHTML("beforeend", `
      <h2>${currentQuestion}</h2>
      <input id="OpenInput">
    `);
    questionType = "OE";
  }

  document.getElementById("ranks")?.remove();
  document.getElementById("SubjectContainer")?.remove();
  document.getElementById("CampaignLength")?.remove();
  document.getElementById("Title").innerHTML = "Neural Trials Online";
}

function checkAndShowAnswer() {
  if (questionType === "MC") {
    currentAnswer = getSelectedAnswer(currentQuestion);
  } else if (questionType === "OE") {
    const input = document.getElementById("OpenInput");
    currentAnswer = input ? input.value.toLowerCase() : "";
  }

  const correctAnswer = currentSubject[currentQuestion];
  const isCorrect =
    currentAnswer.toLowerCase() === correctAnswer.toLowerCase() ||
    (questionType === "OE" && currentAnswer.includes(correctAnswer.toLowerCase()));

  if (!stats[currentSubjectName]) stats[currentSubjectName] = { correct: 0, total: 0 };
  stats[currentSubjectName].total++;
  if (isCorrect) stats[currentSubjectName].correct++;

  answeredQuestions.push({
    question: currentQuestion,
    subjectName: currentSubjectName,
    correctAnswer,
    userAnswer: currentAnswer,
    wasCorrect: isCorrect,
  });

  const answerEl = document.getElementById("answer");
  answerEl.className = isCorrect ? "correct" : "incorrect";
  answerEl.innerHTML = isCorrect
    ? "Correct!"
    : `Incorrect. The correct answer was: ${correctAnswer}`;
}

function UpdateQuestions() {
  const slider = document.getElementById("QuestionSlider");
  document.getElementById("AmountQuestions").innerHTML = slider.value + " Questions";
  maxQuestions = Number(slider.value);
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
    if (checkbox.checked) {
      selectedSubjectNames.add(subjectName);
    } else {
      selectedSubjectNames.delete(subjectName);
    }
  }

  if (level !== "") rebuildSelectedSubjects();
}

function showResults() {
  const container = document.getElementById("QuestionContainer");
  document.getElementById("answer").innerHTML = "";
  submitBtn.style.display = "none";

  const totalAnswered = answeredQuestions.length;
  const totalCorrect = Object.values(stats).reduce((s, v) => s + v.correct, 0);
  const overallPct = totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const scoreColor = overallPct >= 70 ? "#4caf50" : overallPct >= 40 ? "#ff9800" : "#f44336";

  const subjectBarsHTML = Object.entries(stats).map(([name, data]) => {
    const pct = data.total ? Math.round((data.correct / data.total) * 100) : 0;
    const color = pct >= 70 ? "#4caf50" : pct >= 40 ? "#ff9800" : "#f44336";
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
        <span class="subject-score">${data.correct}/${data.total} (${pct}%)</span>
        <span class="subject-feedback">${feedback}</span>
      </div>`;
  }).join("");

  const missed = answeredQuestions.filter(q => !q.wasCorrect);
  const missedHTML = missed.length === 0
    ? `<p class="no-misses">Perfect score — no incorrect answers!</p>`
    : missed.map(q => `
      <div class="missed-card">
        <p class="missed-q">${q.question}</p>
        <p class="missed-yours">Your answer: <span>${q.userAnswer || "(no answer)"}</span></p>
        <p class="missed-correct">Correct answer: <span>${q.correctAnswer}</span></p>
        <p class="missed-subject">Subject: ${q.subjectName}</p>
      </div>`).join("");

  container.innerHTML = `
    <div class="results-screen">
      <h2>Session Complete</h2>

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
        </div>
      </div>

      <h3>Subject Breakdown</h3>
      <div class="subject-breakdown">${subjectBarsHTML}</div>

      <h3>Missed Questions (${missed.length})</h3>
      <div class="missed-list">${missedHTML}</div>
    </div>`;
}
