const timeDisplay = document.getElementById("timeDisplay");
const phaseLabel = document.getElementById("phaseLabel");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const exerciseInput = document.getElementById("exerciseInput");
const pauseInput = document.getElementById("pauseInput");
const repsInput = document.getElementById("repsInput");
const repCountEl = document.getElementById("repCount");
const repTotalEl = document.getElementById("repTotal");

const TICK_COUNTDOWN_SECONDS = 10;

let phase = "exercise"; // "exercise" | "pause"
let secondsLeft = Number(exerciseInput.value);
let tickHandle = null;
let repsDone = 0;
let finished = false;
let hasPlayedStartGong = false;

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playGong(volume, duration) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(volume, now);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  masterGain.connect(ctx.destination);

  [1, 2.4, 4.1].forEach((overtoneMultiplier, index) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(196 * overtoneMultiplier, now);
    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(1 / (index + 1), now);
    osc.connect(overtoneGain);
    overtoneGain.connect(masterGain);
    osc.start(now);
    osc.stop(now + duration);
  });
}

function playLoudGong() {
  playGong(0.5, 1.4);
}

function playQuietTick() {
  playGong(0.15, 0.35);
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function updateDisplay() {
  timeDisplay.textContent = formatTime(secondsLeft);
  phaseLabel.textContent = phase === "exercise" ? "Übung" : "Pause";
  document.body.classList.toggle("exercise-phase", phase === "exercise");
  document.body.classList.toggle("pause-phase", phase === "pause");
  repCountEl.textContent = repsDone;
  repTotalEl.textContent = repsInput.value;
}

function stopTimer() {
  clearInterval(tickHandle);
  tickHandle = null;
}

function finish() {
  stopTimer();
  finished = true;
  document.body.classList.remove("running");
  phaseLabel.textContent = "Fertig";
  timeDisplay.textContent = "00:00";
  startBtn.disabled = true;
  pauseBtn.disabled = true;
}

function switchPhase() {
  if (phase === "exercise") {
    playLoudGong();
    repsDone += 1;
    if (repsDone >= Number(repsInput.value)) {
      updateDisplay();
      finish();
      return;
    }
    phase = "pause";
    secondsLeft = Number(pauseInput.value);
  } else {
    phase = "exercise";
    secondsLeft = Number(exerciseInput.value);
    playLoudGong();
  }
  updateDisplay();
}

function tick() {
  secondsLeft -= 1;
  if (secondsLeft <= 0) {
    switchPhase();
    return;
  }
  if (secondsLeft <= TICK_COUNTDOWN_SECONDS) {
    playQuietTick();
  }
  updateDisplay();
}

function start() {
  if (tickHandle || finished) return;
  if (!hasPlayedStartGong) {
    playLoudGong();
    hasPlayedStartGong = true;
  }
  document.body.classList.add("running");
  tickHandle = setInterval(tick, 1000);
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  exerciseInput.disabled = true;
  pauseInput.disabled = true;
  repsInput.disabled = true;
}

function pause() {
  stopTimer();
  document.body.classList.remove("running");
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function reset() {
  stopTimer();
  finished = false;
  hasPlayedStartGong = false;
  phase = "exercise";
  repsDone = 0;
  secondsLeft = Number(exerciseInput.value);
  exerciseInput.disabled = false;
  pauseInput.disabled = false;
  repsInput.disabled = false;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  updateDisplay();
}

startBtn.addEventListener("click", start);
pauseBtn.addEventListener("click", pause);
resetBtn.addEventListener("click", reset);
exerciseInput.addEventListener("change", () => {
  if (phase === "exercise" && !tickHandle && repsDone === 0) {
    secondsLeft = Number(exerciseInput.value);
    updateDisplay();
  }
});
pauseInput.addEventListener("change", () => {
  if (phase === "pause" && !tickHandle) {
    secondsLeft = Number(pauseInput.value);
    updateDisplay();
  }
});
repsInput.addEventListener("change", updateDisplay);

updateDisplay();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js");
  });
}
