const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const timerDisplay = document.getElementById("timer-display");
const modeLabel = document.getElementById("mode-label");
const quoteBox = document.getElementById("quote");
const soundSelect = document.getElementById("sound-select");
const alarm = document.getElementById("alarmSound");
const canvas = document.getElementById("analog");
const ctx = canvas.getContext("2d");

let time = 25 * 60;
let timer;
let isRunning = false;
let sessionType = "Pomodoro";
let pomodoros = 0, shorts = 0, longs = 0;

const stats = {
  Pomodoro: () => pomodoros++,
  "Short Break": () => shorts++,
  "Long Break": () => longs++
};

function updateDisplay() {
  const min = String(Math.floor(time / 60)).padStart(2, '0');
  const sec = String(time % 60).padStart(2, '0');
  timerDisplay.textContent = `${min}:${sec}`;
  drawAnalog(time);
}

function drawAnalog(timeLeft) {
  // Adjust total time according to session type
  let totalSeconds;
  if (sessionType === "Pomodoro") totalSeconds = 25 * 60;
  else if (sessionType === "Short Break") totalSeconds = 5 * 60;
  else totalSeconds = 10 * 60;

  const percent = (totalSeconds - timeLeft) / totalSeconds;
  const angle = percent * 2 * Math.PI - Math.PI / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(100, 100, 90, 0, 2 * Math.PI);
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 8;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(100, 100);
  ctx.lineTo(100 + 70 * Math.cos(angle), 100 + 70 * Math.sin(angle));
  ctx.strokeStyle = "#f04c75";
  ctx.lineWidth = 6;
  ctx.stroke();
}

function startTimer() {
  if (!isRunning) {
    timer = setInterval(() => {
      time--;
      updateDisplay();
      if (time <= 0) {
        clearInterval(timer);
        isRunning = false;
        alarm.src = soundSelect.value;
        alarm.play();
        showMotivation();
        stats[sessionType]();
        updateStats();
      }
    }, 1000);
    isRunning = true;
  }
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  time = sessionType === "Pomodoro" ? 25 * 60 :
         sessionType === "Short Break" ? 5 * 60 : 10 * 60;
  alarm.pause();
  alarm.currentTime = 0;
  updateDisplay();
  quoteBox.classList.add("hidden");
}

function showMotivation() {
  const builtIn = [
    "You did it! Your brain is now legally a weapon.",
    "25 minutes? You just dominated time itself.",
    "Bro, NASA called — they want to study your focus.",
    "Time bowed down. You stood tall. Respect."
  ];
  const custom = document.getElementById("customQuotes").value
    .split("\n")
    .filter(q => q.trim() !== "");
  const allQuotes = [...builtIn, ...custom];
  if (allQuotes.length === 0) return;

  const random = allQuotes[Math.floor(Math.random() * allQuotes.length)];
  quoteBox.textContent = random;
  quoteBox.classList.remove("hidden");
}

function updateStats() {
  document.getElementById("pomodoros").textContent = `Pomodoros Completed: ${pomodoros}`;
  document.getElementById("shorts").textContent = `Short Breaks Taken: ${shorts}`;
  document.getElementById("longs").textContent = `Long Breaks Taken: ${longs}`;
}

document.getElementById("pomodoro").onclick = () => {
  sessionType = "Pomodoro";
  time = 25 * 60;
  modeLabel.textContent = "Pomodoro — 25 min";
  resetTimer();
};

document.getElementById("shortBreak").onclick = () => {
  sessionType = "Short Break";
  time = 5 * 60;
  modeLabel.textContent = "Short Break — 5 min";
  resetTimer();
};

document.getElementById("longBreak").onclick = () => {
  sessionType = "Long Break";
  time = 10 * 60;
  modeLabel.textContent = "Long Break — 10 min";
  resetTimer();
};

startBtn.onclick = startTimer;
pauseBtn.onclick = pauseTimer;
resetBtn.onclick = resetTimer;

document.getElementById("saveQuotes").onclick = () => alert("Quotes saved (session only).");

updateDisplay();
