const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const quizContainer = document.getElementById('quiz');
const startScreen = document.getElementById('start-screen');
const resultScreen = document.getElementById('result');
const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const timerEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const leaderboardEl = document.getElementById('leaderboard');
const usernameInput = document.getElementById('username');
const categorySelect = document.getElementById('category');
const playerNameDisplay = document.getElementById('player-name');
const questionNumberEl = document.getElementById('question-number');

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;
let currentUser = "";

const allQuestions = {
  general: [
    { q: "Capital of India?", a: "New Delhi", choices: ["Mumbai", "Chennai", "New Delhi", "Kolkata"] },
    { q: "Largest ocean?", a: "Pacific", choices: ["Atlantic", "Indian", "Arctic", "Pacific"] },
    { q: "Fastest land animal?", a: "Cheetah", choices: ["Lion", "Cheetah", "Tiger", "Leopard"] },
    { q: "Currency of Japan?", a: "Yen", choices: ["Dollar", "Won", "Yen", "Ruble"] },
    { q: "Color of an emerald?", a: "Green", choices: ["Green", "Red", "Blue", "Yellow"] },
    { q: "Where is the Eiffel Tower?", a: "France", choices: ["Germany", "Italy", "UK", "France"] },
    { q: "Largest desert?", a: "Sahara", choices: ["Thar", "Gobi", "Kalahari", "Sahara"] },
    { q: "Which is a continent?", a: "Africa", choices: ["Asia", "Africa", "India", "Russia"] },
    { q: "Which is not a primary color?", a: "Green", choices: ["Red", "Blue", "Yellow", "Green"] },
    { q: "How many days in a leap year?", a: "366", choices: ["365", "366", "364", "360"] }
  ],
  science: [
    { q: "H2O is?", a: "Water", choices: ["Hydrogen", "Water", "Oxygen", "Salt"] },
    { q: "Planet closest to Sun?", a: "Mercury", choices: ["Venus", "Earth", "Mercury", "Jupiter"] },
    { q: "Color of blood?", a: "Red", choices: ["Red", "Blue", "Green", "Yellow"] },
    { q: "Photosynthesis happens in?", a: "Leaves", choices: ["Roots", "Leaves", "Stems", "Fruits"] },
    { q: "Sun is a?", a: "Star", choices: ["Planet", "Star", "Asteroid", "Comet"] },
    { q: "Boiling point of water?", a: "100°C", choices: ["90°C", "80°C", "100°C", "70°C"] },
    { q: "Unit of force?", a: "Newton", choices: ["Watt", "Pascal", "Joule", "Newton"] },
    { q: "Energy from sun is?", a: "Solar", choices: ["Solar", "Wind", "Thermal", "Hydro"] },
    { q: "Which organ pumps blood?", a: "Heart", choices: ["Brain", "Heart", "Lungs", "Kidney"] },
    { q: "What gas do plants absorb?", a: "Carbon Dioxide", choices: ["Oxygen", "Nitrogen", "Hydrogen", "Carbon Dioxide"] }
  ],
  coding: [
    { q: "HTML stands for?", a: "HyperText Markup Language", choices: ["HyperText", "Markup", "Machine Language", "HyperText Markup Language"] },
    { q: "CSS used for?", a: "Styling", choices: ["Database", "Logic", "Styling", "Markup"] },
    { q: "JavaScript runs on?", a: "Browser", choices: ["Server", "IDE", "Compiler", "Browser"] },
    { q: "Which is not a programming language?", a: "HTML", choices: ["Python", "Java", "C++", "HTML"] },
    { q: "To declare variable in JS?", a: "let", choices: ["dim", "let", "varr", "int"] },
    { q: "Function keyword in JS?", a: "function", choices: ["func", "define", "function", "def"] },
    { q: "To print in console?", a: "console.log", choices: ["print", "console.write", "console.log", "log.console"] },
    { q: "Which is a loop?", a: "for", choices: ["loop", "doAll", "for", "if"] },
    { q: "To check equality in JS?", a: "===", choices: ["==", "===", "=", "!="] },
    { q: "To comment in JS?", a: "//", choices: ["--", "//", "#", "/* */"] }
  ]
};

startBtn.addEventListener('click', () => {
  const name = usernameInput.value.trim();
  const category = categorySelect.value;
  if (!name) return alert("Please enter your name!");
  currentUser = name;
  playerNameDisplay.textContent = name;
  questions = shuffle([...allQuestions[category]]).slice(0, 10);
  currentQuestionIndex = 0;
  score = 0;
  startScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  quizContainer.classList.remove('hidden');
  showQuestion();
});

function showQuestion() {
  resetState();
  const current = questions[currentQuestionIndex];
  questionNumberEl.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  questionEl.textContent = current.q;
  current.choices.forEach(choice => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = choice;
    btn.className = 'choice-btn';
    btn.onclick = () => selectAnswer(btn, current.a);
    li.appendChild(btn);
    choicesEl.appendChild(li);
  });
  startTimer();
}

function resetState() {
  clearInterval(timer);
  timeLeft = 30;
  timerEl.textContent = timeLeft;
  choicesEl.innerHTML = '';
  nextBtn.classList.add('hidden');
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      autoSelect();
    }
  }, 1000);
}

function autoSelect() {
  const current = questions[currentQuestionIndex];
  const buttons = choicesEl.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === current.a) btn.classList.add('correct');
  });
  nextBtn.classList.remove('hidden');
}

function selectAnswer(button, correctAnswer) {
  clearInterval(timer);
  const buttons = choicesEl.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correctAnswer) btn.classList.add('correct');
    else if (btn === button) btn.classList.add('incorrect');
  });
  if (button.textContent === correctAnswer) score++;
  nextBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  quizContainer.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  scoreEl.textContent = `${score} / ${questions.length}`;
  saveToLeaderboard(currentUser, score);
}

function saveToLeaderboard(name, score) {
  let leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  leaderboard.push({ name, score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5);
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  renderLeaderboard(leaderboard);
}

function renderLeaderboard(data) {
  leaderboardEl.innerHTML = '';
  data.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.name}: ${entry.score}`;
    leaderboardEl.appendChild(li);
  });
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Dark mode toggle
const darkToggle = document.getElementById('darkModeToggle');
darkToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});
window.addEventListener('DOMContentLoaded', () => {
  const dark = localStorage.getItem('darkMode') === 'true';
  if (dark) {
    document.body.classList.add('dark-mode');
    darkToggle.checked = true;
  }
});
