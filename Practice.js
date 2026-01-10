var MS = document.getElementById("MS");
var HS = document.getElementById("HS");
var submit = document.getElementById("Submit");
var questions = "";
function MSSelect() {
  question = "MS";
}
function HSSelect() {
  question = "HS";
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
  if (randomQuestion.indexOf("W)") >= 0) {
    var container = document.getElementById("QuestionContainer");
    container.insertAdjacentHTML(
      "beforeend",
      `
  <h2>${randomQuestion}</h2>
  <h2>Answers</h2>
  <input id=c1 type= "checkbox" onclick="check()">W</input>
  <input id=c2 type="checkbox" onclick="check()">X</input>
  <input id=c3 type="checkbox" onclick="check()">Y</input>
  <input id=c4 type="checkbox" onclick="check()">Z</input>
  `
    );
  } else {
    var container = document.getElementById("QuestionContainer");
    container.insertAdjacentHTML(
      "beforeend",
      `
  <h2>${randomQuestion}</h2>
  <input>
  `
    );
  }

  ranks.remove();
  subjects.remove();
  title.innerHTML = "Neural Trials Online";
}
