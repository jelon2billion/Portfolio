// ================= WORD BANK =================
const wordBank = {
    easy: [
        "code","loop","array","logic","html","css",
        "api","bit","byte","node","input","output",
        "string","integer","float","boolean","class",
        "object","method","syntax"
    ], // 20 words = 100 pts
    medium: [
        "compiler","database","algorithm","function",
        "frontend","backend","javascript","python",
        "protocol","framework"
    ],
    hard: [
        "encapsulation","polymorphism","cybersecurity",
        "cryptography","multithreading","asynchronous",
        "inheritance","optimization"
    ]
};

// ================= POINT SETTINGS =================
const pointsPerDifficulty = {
    easy: 5,
    medium: 10,
    hard: 20
};
const MAX_SCORE = 100;

// ================= GAME VARIABLES =================
let selectedWords = [];
let usedWords = [];
let currentWord = "";
let score = 0;
let timeLeft = 20;
let timer;
let lives = 3;
let player = "";
let difficulty = "";

// ================= FLOATING LETTER BACKGROUND =================
function generateLetters(count = 120) {
    const container = document.getElementById("letter-bg");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    container.innerHTML = "";

    for (let i = 0; i < count; i++) {
        const span = document.createElement("span");
        span.className = "letter";
        span.textContent = chars[Math.floor(Math.random() * chars.length)];
        span.style.left = Math.random() * 100 + "vw";
        span.style.fontSize = (28 + Math.random() * 40) + "px";
        span.style.animationDuration = (10 + Math.random() * 12) + "s";
        span.style.animationDelay = Math.random() * 5 + "s";
        container.appendChild(span);
    }
}

// ================= SCREEN CONTROL =================
function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function goToName() {
    showScreen("nameScreen");
}

function goToDifficulty() {
    player = document.getElementById("playerName").value.trim();
    if (!player) return alert("Please enter your name");
    showScreen("difficultyScreen");
}

// ================= START GAME =================
function startGame() {
    difficulty = document.getElementById("difficultySelect").value;
    if (!difficulty) return alert("Select a difficulty");

    selectedWords = [...wordBank[difficulty]];
    usedWords = [];
    score = 0;
    lives = 3;

    document.getElementById("score").textContent = score;
    renderLives();
    showScreen("gameScreen");
    nextWord();
}

// ================= GAME LOGIC =================
function renderLives() {
    document.getElementById("livesContainer").innerHTML =
        "❤️".repeat(lives) + "🖤".repeat(3 - lives);
}

function scrambleWord(word) {
    let arr = word.split("");
    do {
        arr.sort(() => Math.random() - 0.5);
    } while (arr.join("") === word);
    return arr.join("");
}

function pickWord() {
    const available = selectedWords.filter(w => !usedWords.includes(w));
    if (available.length === 0) {
        endGame(true);
        return;
    }
    currentWord = available[Math.floor(Math.random() * available.length)];
    usedWords.push(currentWord);
    document.getElementById("scrambledWord").textContent =
        scrambleWord(currentWord);
}

function nextWord() {
    clearInterval(timer);
    timeLeft = 20;
    document.getElementById("time").textContent = timeLeft;
    document.getElementById("userInput").value = "";
    pickWord();
    startTimer();
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("time").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            lives--;
            renderLives();
            lives <= 0 ? endGame(false) : nextWord();
        }
    }, 1000);
}

function checkAnswer() {
    const answer = document.getElementById("userInput").value.toLowerCase();
    if (answer === currentWord) {
        score += pointsPerDifficulty[difficulty];
        if (score > MAX_SCORE) score = MAX_SCORE;
        document.getElementById("score").textContent = score;
        score >= MAX_SCORE ? endGame(true) : nextWord();
    } else {
        lives--;
        renderLives();
        lives <= 0 ? endGame(false) : alert("❌ Wrong answer!");
    }
}

function showHint() {
    alert("Starts with: " + currentWord[0].toUpperCase());
}

// ================= GAME END =================
function endGame(completed) {
    clearInterval(timer);
    alert(
        completed
            ? `🎉 Game Completed!\nFinal Score: ${score}/100`
            : `💀 Game Over\nFinal Score: ${score}/100`
    );
    saveToLeaderboard(player, score, difficulty);
    updateLeaderboard(document.getElementById("leaderboardDifficulty").value);
    location.reload();
}

// ================= LEADERBOARD (PER DIFFICULTY) =================
function saveToLeaderboard(name, score, diff) {
    const key = `leaderboard_${diff}`;
    let board = JSON.parse(localStorage.getItem(key)) || [];
    board.push({ name, score });
    board.sort((a, b) => b.score - a.score);
    localStorage.setItem(key, JSON.stringify(board));
}

function updateLeaderboard(diff) {
    const key = `leaderboard_${diff}`;
    const board = JSON.parse(localStorage.getItem(key)) || [];
    const display = document.getElementById("leaderboardDisplay");
    if (!display) return;

    if (board.length === 0) {
        display.innerHTML = "<p>No records yet</p>";
        return;
    }

    display.innerHTML = board.slice(0, 5).map((e, i) =>
        `<p class="rank-${i + 1}">${i + 1}. ${e.name} — ${e.score} pts</p>`
    ).join("");
}

function changeLeaderboard() {
    const diff = document.getElementById("leaderboardDifficulty").value;
    updateLeaderboard(diff);
}

function resetLeaderboard() {
    const diff = document.getElementById("leaderboardDifficulty").value;
    if (!diff) return alert("Select a difficulty first");

    if (confirm(`Reset ${diff.toUpperCase()} leaderboard?`)) {
        localStorage.removeItem(`leaderboard_${diff}`);
        updateLeaderboard(diff);
        alert("Leaderboard reset successfully!");
    }
}

// ================= INIT =================
window.onload = () => {
    generateLetters();
    updateLeaderboard(document.getElementById("leaderboardDifficulty").value);
};
