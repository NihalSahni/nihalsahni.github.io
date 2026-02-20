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
      var i = 0;
      while (i < Subjects.length) {
        if (Subjects[i] == MSMath) {
          Subjects.splice(i, 1);
        }
        i++;
      }
    }
    if (subject == "Physics" && checkbox.checked == true) {
      Subjects.push(MSPhysics);
    } else if (subject == "Physics" && checkbox.checked == false) {
      var i = 0;
      while (i < Subjects.length) {
        if (Subjects[i] == MSPhysics) {
          Subjects.splice(i, 1);
        }
        i++;
      }
    }
    if (subject == "Chemistry" && checkbox.checked == true) {
      Subjects.push(MSChemistry);
    } else if (subject == "Chemistry" && checkbox.checked == false) {
      var i = 0;
      while (i < Subjects.length) {
        if (Subjects[i] == MSChemistry) {
          Subjects.splice(i, 1);
        }
        i++;
      }
    }
    if (subject == "Biology" && checkbox.checked == true) {
      Subjects.push(MSBiology);
    } else if (subject == "Biology" && checkbox.checked == false) {
      var i = 0;
      while (i < Subjects.length) {
        if (Subjects[i] == MSBiology) {
          Subjects.splice(i, 1);
        }
        i++;
      }
    }
    if (subject == "EarthSpace" && checkbox.checked == true) {
      Subjects.push(MSEarthSpace);
    } else if (subject == "EarthSpace" && checkbox.checked == false) {
      var i = 0;
      while (i < Subjects.length) {
        if (Subjects[i] == MSEarthSpace) {
          Subjects.splice(i, 1);
        }
        i++;
      }
    }
    if (subject == "Energy" && checkbox.checked == true) {
      Subjects.push(MSEnergy);
    } else if (subject == "Energy" && checkbox.checked == false) {
      var i = 0;
      while (i < Subjects.length) {
        if (Subjects[i] == MSEnergy) {
          Subjects.splice(i, 1);
        }
        i++;
      }
    }
    if (subject == "Everything" && checkbox.checked == true) {
      Subjects.push(MSMath);
      Subjects.push(MSPhysics);
      Subjects.push(MSChemistry);
      Subjects.push(MSBiology);
      Subjects.push(MSEarthSpace);
      Subjects.push(MSEnergy);
      getElementById("Math").checked = true;
      getElementById("Physics").checked = true;
      getElementById("Chemistry").checked = true;
      getElementById("Biology").checked = true;
      getElementById("EarthSpace").checked = true;
      getElementById("Energy").checked = true;
    } else if (subject == "Everything" && checkbox.checked == false) {
      subject = [];
      getElementById("Math").checked = false;
      getElementById("Physics").checked = false;
      getElementById("Chemistry").checked = false;
      getElementById("Biology").checked = false;
      getElementById("EarthSpace").checked = false;
      getElementById("Energy").checked = false;
    }
  }
  if (Questions == "HS") {
    if (subject == "Math" && checkbox.checked == true) {
      Subjects.push(HSMath);
    } else if (subject == "Math" && checkbox.checked == false) {
      var i = 0;
      while (i < Subjects.length) {
        if (Subjects[i] == HSMath) {
          Subjects.splice(i, 1);
        }
        i++;
      }
    }
    if (subject == "Physics" && checkbox.checked == true) {
      Subjects.push(HSPhysics);
    } else if (subject == "Physics" && checkbox.checked == false) {
      var i = 0;
      while (i < Subjects.length) {
        if (Subjects[i] == HSPhysics) {
          Subjects.splice(i, 1);
        }
        i++;
      }
    }
    if (subject == "Chemistry" && checkbox.checked == true) {
      Subjects.push(HSChemistry);
    } else if (subject == "Chemistry" && checkbox.checked == false) {
      var i = 0;
      while (i < Subjects.length) {
        if (Subjects[i] == HSChemistry) {
          Subjects.splice(i, 1);
        }
        i++;
      }
    }
    if (subject == "Biology" && checkbox.checked == true) {
      Subjects.push(HSBiology);
    } else if (subject == "Biology" && checkbox.checked == false) {
      var i = 0;
      while (i < Subjects.length) {
        if (Subjects[i] == HSBiology) {
          Subjects.splice(i, 1);
        }
        i++;
      }
    }
    if (subject == "EarthSpace" && checkbox.checked == true) {
      Subjects.push(HSEarthSpace);
    } else if (subject == "EarthSpace" && checkbox.checked == false) {
      var i = 0;
      while (i < Subjects.length) {
        if (Subjects[i] == HSEarthSpace) {
          Subjects.splice(i, 1);
        }
        i++;
      }
    }
    if (subject == "Energy" && checkbox.checked == true) {
      Subjects.push(HSEnergy);
    } else if (subject == "Energy" && checkbox.checked == false) {
      var i = 0;
      while (i < Subjects.length) {
        if (Subjects[i] == HSEnergy) {
          Subjects.splice(i, 1);
        }
        i++;
      }
    }
    if (subject == "Everything" && checkbox.checked == true) {
      Subjects.push(HSMath);
      Subjects.push(HSPhysics);
      Subjects.push(HSChemistry);
      Subjects.push(HSBiology);
      Subjects.push(HSEarthSpace);
      Subjects.push(HSEnergy);
      getElementById("Math").checked = true;
      getElementById("Physics").checked = true;
      getElementById("Chemistry").checked = true;
      getElementById("Biology").checked = true;
      getElementById("EarthSpace").checked = true;
      getElementById("Energy").checked = true;
    } else if (subject == "Everything" && checkbox.checked == false) {
      subject = [];
      getElementById("Math").checked = false;
      getElementById("Physics").checked = false;
      getElementById("Chemistry").checked = false;
      getElementById("Biology").checked = false;
      getElementById("EarthSpace").checked = false;
      getElementById("Energy").checked = false;
    }
  }
}
