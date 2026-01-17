var MS = document.getElementById("Cadet");
var HS = document.getElementById("Lieutenant");
var submit = document.getElementById("Submit");
var questions = "";
var questions = "";
var questionType = "";
function MSSelect() {
  questions = "MS";
}
function HSSelect() {
  questions = "HS";
}

MS.onclick = "MSSelect";
HS.onclick = "HSSelect";

function AddMCQuestion() {
  submit.innerHTML = "Next Phase";
  var randomQuestion =
    Object.keys(MSQuestions)[
      Math.floor(Math.random() * Object.keys(MSQuestions).length)
    ];
  var ranks = document.getElementById("ranks");
  var subjects = document.getElementById("SubjectContainer");
  var title = document.getElementById("Title");

  CheckQuestion(randomQuestion);
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
function CheckQuestion(question) {
  if (questionType == "MC") {
  }
  if (questionType == "OE") {
    var input = document.getElementById("OpenInput");
    if (input.value.includes(MSQuestions[question])) {
      alert("Correct");
    }
  }
}
