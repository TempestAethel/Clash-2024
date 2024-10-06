// Game Variables
let score = 0;
let bronzeClicks = 0;
let silverClicks = 0;
let goldClicks = 0;
let timerInterval;
let gameDuration = 600; // 10 minutes (600 seconds)
let multiplier = 1;
let extraTime = 0;
let coins = { bronze: 0, silver: 0, gold: 0, platinum: 0, titanium: 0, diamond: 0, crystal: 0, ruby: 0, emerald: 0, obsidian: 0 };

// HTML Elements
const playButton = document.getElementById('play-button');
const pleadButton = document.getElementById('plead-button');
const resetButton = document.getElementById('reset-button');
const prestigeSection = document.getElementById('prestige-section');
const multiplierOption = document.getElementById('multiplier-option');
const timeOption = document.getElementById('time-option');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const pleadSection = document.getElementById('plead-section');
const coinsDiv = document.getElementById('coins');

// Load game state from localStorage
function loadGameState() {
    if (localStorage.getItem('score')) {
        score = parseInt(localStorage.getItem('score'));
        multiplier = parseInt(localStorage.getItem('multiplier')) || 1;
        extraTime = parseInt(localStorage.getItem('extraTime')) || 0;
        coins = JSON.parse(localStorage.getItem('coins')) || coins;
    }
    updateScore();
}

// Save game state to localStorage
function saveGameState() {
    localStorage.setItem('score', score);
    localStorage.setItem('multiplier', multiplier);
    localStorage.setItem('extraTime', extraTime);
    localStorage.setItem('coins', JSON.stringify(coins));
}

// Reset game
function resetGame() {
    score = 0;
    bronzeClicks = 0;
    silverClicks = 0;
    goldClicks = 0;
    multiplier = 1;
    extraTime = 0;
    coins = { bronze: 0, silver: 0, gold: 0, platinum: 0, titanium: 0, diamond: 0, crystal: 0, ruby: 0, emerald: 0, obsidian: 0 };
    localStorage.clear();
    updateScore();
    pleadSection.style.display = 'none';
    playButton.style.display = 'block';
    resetButton.style.display = 'none';
}

// Update the score display
function updateScore() {
    scoreElement.textContent = score;
}

// Start game timer
function startTimer() {
    let timeLeft = gameDuration + (extraTime * 5 * 60); // Add extra time based on prestige
    timerInterval = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

// End game and show prestige options
function endGame() {
    pleadSection.style.display = 'none';
    prestigeSection.style.display = 'block';
}

// Handle play button click
playButton.addEventListener('click', () => {
    playButton.style.display = 'none';
    pleadSection.style.display = 'block';
    resetButton.style.display = 'block';
    startTimer();
});

// Handle plead button click (spawn bronze coin)
pleadButton.addEventListener('click', () => {
    let bronzeCoin = document.createElement('img');
    bronzeCoin.src = 'coins/bronze.png';
    bronzeCoin.className = 'coin bronze';
    bronzeCoin.addEventListener('click', () => {
        score += 1 * multiplier;
        bronzeClicks++;
        if (bronzeClicks >= 1000) {
            bronzeCoin.src = 'coins/silver.png';
            score += 5;
            bronzeClicks = 0;
        }
        updateScore();
        saveGameState();
    });
    coinsDiv.appendChild(bronzeCoin);
});

// Prestige Options
multiplierOption.addEventListener('click', () => {
    multiplier++;
    resetGame();
});

timeOption.addEventListener('click', () => {
    extraTime++;
    resetGame();
});

// Handle reset button click
resetButton.addEventListener('click', resetGame);

// Load the game state when the page loads
window.onload = loadGameState;
