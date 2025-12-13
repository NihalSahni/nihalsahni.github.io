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
const newparagraph = document.createElement("p");
const open = document.getElementById("OpenEndedContainer");
open.appendElement(newparagraph);
