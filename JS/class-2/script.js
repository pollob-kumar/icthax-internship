// Element gulo dhoro
const input = document.getElementById("mark");
const btn = document.getElementById("btn");
const out = document.getElementById("out");

// Grade ber korar function
function getGrade(m) {
  if (m >= 80) return { g: "A+", pass: true, msg: "Chomotkar!" };
  if (m >= 70) return { g: "A", pass: true, msg: "Khub valo!" };
  if (m >= 60) return { g: "B", pass: true, msg: "Valo!" };
  if (m >= 50) return { g: "C", pass: true, msg: "Aro effort lagbe!" };
  if (m >= 33) return { g: "D", pass: true, msg: "Kono rokom pass!" };
  return { g: "F", pass: false, msg: "Fail - Abar chesta koro!" };
}

// button click er kaj
btn.addEventListener("click", () => {
  const m = Number(input.value);
  if (Number.isNaN(m) || m < 0 || m > 100) {
    out.className = "result fail";
    out.textContent = "0-100 er moddhe dao";
    return;
  }
  const r = getGrade(m);
  out.className = "result " + (r.pass ? "pass" : "fail");
  out.textContent = "Grade: " + r.g + " - " + r.msg;
});

// Enter key dileo kaj korbe
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") btn.click();
});
