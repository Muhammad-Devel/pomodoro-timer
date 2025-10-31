const timeEl = document.getElementById("time");
const timesList = document.getElementById("time-list");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const pauseBtn = document.getElementById("pause");
const workBtn = document.getElementById("work");
const shortBtn = document.getElementById("short");
const longBtn = document.getElementById("long");
const line = document.getElementById("up-line");
const canvas = document.querySelector("canvas");

let timeWork = 25 * 60;
let timeShort = 5 * 60;
let timeLong = 15 * 60;
let time = timeWork;
let totalTime = timeWork;
let timer;
let running = false;

let currentPomodoro = "work";
let completedPomodoros = 0;
const history = [];

let progress = 0;
let lastProgress = 0;

function updateDisplay() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timeEl.textContent = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

function startTimer() {
  console.log("start timer");
  if (running) return;
  running = true;
  timer = setInterval(() => {
    if (time > 0) {
      time--;
      updateDisplay();
      progress = 1 - time / totalTime;
      drawProgressLine(progress);
    } else {
      clearInterval(timer);
      running = false;

      if (currentPomodoro === "work") {
        completedPomodoros++;
        if (completedPomodoros % 4 === 0) {
          currentPomodoro = "long";
          time = timeLong;
        } else {
          currentPomodoro = "short";
          time = timeShort;
        }
      } else {
        currentPomodoro = "work";
        time = timeWork;
      }

      alert(`Time's up! Next: ${currentPomodoro}`);
      updateDisplay();
      drawProgressLine(0);
      startTimer();
    }
  }, 1000);
}

function pauseTimer() {
  console.log("Pause timer");
  clearInterval(timer);
  running = false;
}
function resetTimer() {
  console.log("Reset timer");
  clearInterval(timer);
  running = false;
  currentPomodoro = "work";
  completedPomodoros = 0;
  progress = 0;
  history.length = 0;
  time = timeWork;
  updateDisplay();
}

function setMode(mode) {
  clearInterval(timer);
  running = false;

  currentPomodoro = mode;
  if (mode === "work") {
    time = timeWork;
    totalTime = timeWork;
  }
  if (mode === "short") {
    time = timeShort;
    totalTime = timeShort;
  }
  if (mode === "long") {
    time = timeLong;
    totalTime = timeLong;
  }

  updateDisplay();
  drawProgressLine(0);
}

const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

function drawProgressLine(progress) {
  ctx.clearRect(0, 0, width, height);

  // Orqa fon chizig'i (bo‘sh progress)
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = height;
  ctx.lineCap = "round";
  ctx.stroke();

  // To‘lgan qismi (progress)
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(progress * width, height / 2);
  ctx.strokeStyle = "#21c400ff";
  ctx.lineWidth = height;
  ctx.lineCap = "round";
  ctx.stroke();

  // Harakatlanuvchi dumaloq indikator
  const circleX = progress * width; // progressga qarab o‘rni
  const circleY = height / 2;
  const radius = 8;

  ctx.beginPath();
  ctx.arc(circleX, circleY, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "#21c400ff";
  ctx.fill();
}



startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
workBtn.addEventListener("click", () => setMode("work"));
shortBtn.addEventListener("click", () => setMode("short"));
longBtn.addEventListener("click", () => setMode("long"));

updateDisplay();
drawProgressLine(0);
