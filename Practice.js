var MS = document.getElementById("Cadet");
var HS = document.getElementById("Lieutenant");
var Subjects = [];
var submit = document.getElementById("Submit");
var questions = "";
var questionType = "";
var MaxQuestion = 30;
function MSSelect() {
  questions = "MS";
}
function HSSelect() {
  questions = "HS";
}

function AddMCQuestion() {
  //Question limiter
  if (MaxQuestion <= 0) {
    return;
  } else {
    MaxQuestion -= 1;
  }
  //Adding the Questions
  submit.innerHTML = "Next Phase";
  var randomSubjects = Subjects[Math.floor(Math.random() * Subjects.length)];
  var randomQuestion =
    Object.keys(randomSubjects)[
      Math.floor(Math.random() * Object.keys(randomSubjects).length)
    ];
  var ranks = document.getElementById("ranks");
  var subjects = document.getElementById("SubjectContainer");
  var title = document.getElementById("Title");

  CheckQuestion(randomQuestion, randomSubjects);
  var container = document.getElementById("QuestionContainer");
  container.innerHTML = "";

  if (randomQuestion.indexOf("W)") >= 0) {
    container.insertAdjacentHTML(
      "beforeend",
      `
  <h2>${randomQuestion}</h2>
  <h2>Answers</h2>
  <input id=c1 type= "checkbox" onclick="check()">W</input>
  <input id=c2 type="checkbox" onclick="check()">X</input>
  <input id=c3 type="checkbox" onclick="check()">Y</input>
  <input id=c4 type="checkbox" onclick="check()">Z</input>
  `,
    );
    questionType = "MC";
  } else {
    container.insertAdjacentHTML(
      "beforeend",
      `
  <h2>${randomQuestion}</h2>
  <input id=OpenInput>
  `,
    );
    questionType = "OE";
  }

  ranks.remove();
  subjects.remove();
  title.innerHTML = "Neural Trials Online";
}
function CheckQuestion(question, subject) {
  if (questionType == "MC") {
  }
  if (questionType == "OE") {
    var input = document.getElementById("OpenInput");
    if (input.value.includes(subject[question])) {
      alert("Correct");
    }
  }
}
function UpdateQuestions() {
  var h3 = document.getElementById("AmountQuestions");
  var slider = document.getElementById("QuestionSlider");
  h3.innerHTML = slider.value + " questions";
  MaxQuestions = slider.value;
}
function addSubject(subject) {
  if (questions == "MS") {
    if (subject == "Math") {
      Subjects.push(MSMath);
    }
    if (subject == "Physics") {
      Subjects.push(MSPhysics);
    }
    if (subject == "Chemistry") {
      Subjects.push(MSChemistry);
    }
    if (subject == "Biology") {
      Subjects.push(MSBiology);
    }
    if (subject == "EarthSpace") {
      Subjects.push(MSEarthSpace);
    }
    if (subject == "Energy") {
      Subjects.push(MSEnergy);
    }
    if (subject == "Everything") {
      Subjects.push(MSMath);
      Subjects.push(MSPhysics);
      Subjects.push(MSChemistry);
      Subjects.push(MSBiology);
      Subjects.push(MSEarthSpace);
      Subjects.push(MSEnergy);
    }
  }
  if (questions == "HS") {
    if (subject == "Math") {
      Subjects.push(HSMath);
    }
    if (subject == "Physics") {
      Subjects.push(HSPhysics);
    }
    if (subject == "Chemistry") {
      Subjects.push(HSChemistry);
    }
    if (subject == "Biology") {
      Subjects.push(HSBiology);
    }
    if (subject == "EarthSpace") {
      Subjects.push(HSEarthSpace);
    }
    if (subject == "Energy") {
      Subjects.push(HSEnergy);
    }
    if (subject == "Everything") {
      Subjects.push(HSMath);
      Subjects.push(HSPhysics);
      Subjects.push(HSChemistry);
      Subjects.push(HSBiology);
      Subjects.push(HSEarthSpace);
      Subjects.push(HSEnergy);
    }
  }
}
