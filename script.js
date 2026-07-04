const timeDisplay = document.getElementById("timeDisplay");
const phaseLabel = document.getElementById("phaseLabel");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const workInput = document.getElementById("workInput");
const breakInput = document.getElementById("breakInput");
const sessionCount = document.getElementById("sessionCount");
const dingSound = document.getElementById("dingSound");

const STORAGE_KEY = "fokus-timer-sessions";

let phase = "focus"; // "focus" | "break"
let secondsLeft = Number(workInput.value) * 60;
let tickHandle = null;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadSessionCount() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  return data[todayKey()] || 0;
}

function saveSessionCount(count) {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  data[todayKey()] = count;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function renderSessionCount() {
  sessionCount.textContent = loadSessionCount();
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function updateDisplay() {
  timeDisplay.textContent = formatTime(secondsLeft);
  phaseLabel.textContent = phase === "focus" ? "Fokus" : "Pause";
  document.body.classList.toggle("focus-phase", phase === "focus");
  document.body.classList.toggle("break-phase", phase === "break");
}

function switchPhase() {
  dingSound.play().catch(() => {});
  if (phase === "focus") {
    saveSessionCount(loadSessionCount() + 1);
    renderSessionCount();
    phase = "break";
    secondsLeft = Number(breakInput.value) * 60;
  } else {
    phase = "focus";
    secondsLeft = Number(workInput.value) * 60;
  }
  updateDisplay();
}

function tick() {
  secondsLeft -= 1;
  if (secondsLeft <= 0) {
    switchPhase();
    return;
  }
  updateDisplay();
}

function start() {
  if (tickHandle) return;
  document.body.classList.add("running");
  tickHandle = setInterval(tick, 1000);
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  workInput.disabled = true;
  breakInput.disabled = true;
}

function pause() {
  clearInterval(tickHandle);
  tickHandle = null;
  document.body.classList.remove("running");
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function reset() {
  pause();
  phase = "focus";
  secondsLeft = Number(workInput.value) * 60;
  workInput.disabled = false;
  breakInput.disabled = false;
  updateDisplay();
}

startBtn.addEventListener("click", start);
pauseBtn.addEventListener("click", pause);
resetBtn.addEventListener("click", reset);
workInput.addEventListener("change", () => {
  if (phase === "focus" && !tickHandle) {
    secondsLeft = Number(workInput.value) * 60;
    updateDisplay();
  }
});
breakInput.addEventListener("change", () => {
  if (phase === "break" && !tickHandle) {
    secondsLeft = Number(breakInput.value) * 60;
    updateDisplay();
  }
});

renderSessionCount();
updateDisplay();
