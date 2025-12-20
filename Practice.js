var MS = document.getElementById("MS");
var HS = document.getElementById("HS");
var questions = "";
function MSSelect() {
  question = "MS";
}
function HSSelect() {
  question = "HS";
}

MS.onclick = "MSSelect";
HS.onclick = "HSSelect";
function AddOEQuestion() {
  var container = document.getElementById("QuestionContainer");
  container.insertAdjacentHTML(
    "beforeend",
    `
  <h2>Questions</h2>
  <h2>Answers</h2>
  <input>
    `
  );
}

function AddMCQuestion() {
  var ranks = document.getElementById("ranks");
  var subjects = document.getElementById("SubjectContainer");
  var title = document.getElementById("Title");
  ranks.remove();
  subjects.remove();
  title.innerHTML = "Neural Trials Online";
  var container = document.getElementById("QuestionContainer");
  container.insertAdjacentHTML(
    "beforeend",
    `
  <h2>Questions</h2>
  <h2>Answers</h2>
  <input id=c1 type="checkbox" onclick="check()">W</input>
  <input id=c2 type="checkbox" onclick="check()">X</input>
  <input id=c3 type="checkbox" onclick="check()">Y</input>
  <input id=c4 type="checkbox" onclick="check()">Z</input>
  
    `
  );
}
