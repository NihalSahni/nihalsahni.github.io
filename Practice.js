var MS = document.getElementById("Cadet");
var HS = document.getElementById("Lieutenant");
var Subjects = [];
var Submit = document.getElementById("Submit");
var Questions = "";
var QuestionType = "";
var MaxQuestion = 30;
function MSSelect() {
  Questions = "MS";
}
function HSSelect() {
  Questions = "HS";
}

function AddMCQuestion() {
  if (Questions == "" || Subjects.length == 0) {
    return;
  }

  //Question limiter
  if (MaxQuestion <= 0) {
    return;
  } else {
    MaxQuestion -= 1;
  }
  //Adding the Questions
  Submit.innerHTML = "Next Phase";
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
    QuestionType = "MC";
  } else {
    container.insertAdjacentHTML(
      "beforeend",
      `
  <h2>${randomQuestion}</h2>
  <input id=OpenInput>
  `,
    );
    QuestionType = "OE";
  }

  ranks.remove();
  subjects.remove();
  title.innerHTML = "Neural Trials Online";
}
function CheckQuestion(question, subject) {
  if (QuestionType == "MC") {
  }
  if (QuestionType == "OE") {
    var input = document.getElementById("OpenInput");
    if (input.value.includes(subject[question])) {
      alert("Correct");
    }
  }
}
function UpdateQuestions() {
  var h3 = document.getElementById("AmountQuestions");
  var slider = document.getElementById("Questionslider");
  h3.innerHTML = slider.value + " Questions";
  MaxQuestions = slider.value;
}
function addSubject(subject, checkbox) {
  if (Questions == "MS") {
    if (subject == "Math" && checkbox.checked == true) {
      Subjects.push(MSMath);
    } else if (subject == "Math" && checkbox.checked == false) {
    }
    if (subject == "Physics" && checkbox.checked == true) {
      Subjects.push(MSPhysics);
    } else if (subject == "Physics" && checkbox.checked == false) {
    }
    if (subject == "Chemistry" && checkbox.checked == true) {
      Subjects.push(MSChemistry);
    } else if (subject == "Chemistry" && checkbox.checked == false) {
    }
    if (subject == "Biology" && checkbox.checked == true) {
      Subjects.push(MSBiology);
    } else if (subject == "Biology" && checkbox.checked == false) {
    }
    if (subject == "EarthSpace" && checkbox.checked == true) {
      Subjects.push(MSEarthSpace);
    } else if (subject == "EarthSpace" && checkbox.checked == false) {
    }
    if (subject == "Energy" && checkbox.checked == true) {
      Subjects.push(MSEnergy);
    } else if (subject == "Energy" && checkbox.checked == false) {
    }
    if (subject == "Everything" && checkbox.checked == true) {
      Subjects.push(MSMath);
      Subjects.push(MSPhysics);
      Subjects.push(MSChemistry);
      Subjects.push(MSBiology);
      Subjects.push(MSEarthSpace);
      Subjects.push(MSEnergy);
    } else if (subject == "Everything" && checkbox.checked == false) {
    }
  }
  if (Questions == "HS") {
    if (subject == "Math" && checkbox.checked == true) {
      Subjects.push(HSMath);
    } else if (subject == "Math" && checkbox.checked == false) {
    }
    if (subject == "Physics" && checkbox.checked == true) {
      Subjects.push(HSPhysics);
    } else if (subject == "Physics" && checkbox.checked == false) {
    }
    if (subject == "Chemistry" && checkbox.checked == true) {
      Subjects.push(HSChemistry);
    } else if (subject == "Chemistry" && checkbox.checked == false) {
    }
    if (subject == "Biology" && checkbox.checked == true) {
      Subjects.push(HSBiology);
    } else if (subject == "Biology" && checkbox.checked == false) {
    }
    if (subject == "EarthSpace" && checkbox.checked == true) {
      Subjects.push(HSEarthSpace);
    } else if (subject == "EarthSpace" && checkbox.checked == false) {
    }
    if (subject == "Energy" && checkbox.checked == true) {
      Subjects.push(HSEnergy);
    } else if (subject == "Energy" && checkbox.checked == false) {
    }
    if (subject == "Everything" && checkbox.checked == true) {
      Subjects.push(HSMath);
      Subjects.push(HSPhysics);
      Subjects.push(HSChemistry);
      Subjects.push(HSBiology);
      Subjects.push(HSEarthSpace);
      Subjects.push(HSEnergy);
    } else if (subject == "Everything" && checkbox.checked == false) {
    }
  }
}
