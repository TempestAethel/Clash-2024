// Game Variables
let score = 0;
let bronzeClicks = 0;
let isGamePaused = false;
let timerInterval;
let timeLeft = 600; // 10 minutes (600 seconds)
let multiplier = 1;
let prestigeLevel = 1;
let coins = { bronze: 0, silver: 0, gold: 0, platinum: 0, titanium: 0, diamond: 0, crystal: 0, ruby: 0, emerald: 0, obsidian: 0 };

// HTML Elements
const playButton = document.getElementById('play-button');
const pleadButton = document.getElementById('plead-button');
const resetButton = document.getElementById('reset-button');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const pleadSection = document.getElementById('plead-section');
const prestigeSection = document.getElementById('prestige-section');
const multiplierOption = document.getElementById('multiplier-option');
const timeOption = document.getElementById('time-option');

// Load Game State from Local Storage
function loadGame() {
    score = parseInt(localStorage.getItem('score')) || 0;
    bronzeClicks = parseInt(localStorage.getItem('bronzeClicks')) || 0;
    coins = JSON.parse(localStorage.getItem('coins')) || coins;
    multiplier = parseInt(localStorage.getItem('multiplier')) || 1;
    prestigeLevel = parseInt(localStorage.getItem('prestigeLevel')) || 1;
    timeLeft = parseInt(localStorage.getItem('timeLeft')) || 600;
    updateScore();
    renderCoins();
}

// Save Game State to Local Storage
function saveGame() {
    localStorage.setItem('score', score);
    localStorage.setItem('bronzeClicks', bronzeClicks);
    localStorage.setItem('coins', JSON.stringify(coins));
    localStorage.setItem('multiplier', multiplier);
    localStorage.setItem('prestigeLevel', prestigeLevel);
    localStorage.setItem('timeLeft', timeLeft);
}

// Function to update the score
function updateScore() {
    scoreElement.textContent = score;
}

// Function to start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        if (!isGamePaused) {
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            timeLeft--;
            
            if (timeLeft < 0) {
                clearInterval(timerInterval);
                endGame();
            }
        }
    }, 1000);
}

// Function to handle the end of the game (timer runs out)
function endGame() {
    pleadSection.style.display = 'none';
    prestigeSection.style.display = 'block'; // Show prestige options
}

// Prestige options
multiplierOption.addEventListener('click', () => {
    multiplier += prestigeLevel;
    prestigeLevel++;
    resetGame();
});

timeOption.addEventListener('click', () => {
    timeLeft += 300; // Add 5 more minutes
    prestigeLevel++;
    resetGame();
});

// Handle the Play/Pause button toggle
playButton.addEventListener('click', () => {
    if (playButton.textContent === 'Play') {
        // Start game, show plead button, change Play to Pause
        isGamePaused = false;
        pleadSection.style.display = 'block';
        playButton.textContent = 'Pause';
        
        if (!timerInterval) {
            startTimer();  // Start the timer if not already running
        }
    } else {
        // Pause the game
        isGamePaused = true;
        pleadSection.style.display = 'none'; // Hide Plead button
        playButton.textContent = 'Play'; // Change Pause to Play
    }
});

// Handle plead button click (spawn bronze coin and update score)
pleadButton.addEventListener('click', () => {
    if (!isGamePaused) {
        let bronzeCoin = document.createElement('img');
        bronzeCoin.src = 'coins/bronze.png';
        bronzeCoin.className = 'coin bronze';
        bronzeCoin.style.top = `${Math.random() * 500}px`;
        bronzeCoin.style.left = `${Math.random() * 500}px`;
        
        bronzeCoin.addEventListener('click', () => {
            if (!isGamePaused) {
                score += 1 * multiplier;
                bronzeClicks++;
                coins.bronze++;
                if (bronzeClicks >= 1000) {
                    upgradeCoin(bronzeCoin, 'silver', 5);
                    bronzeClicks = 0;
                }
                updateScore();
                saveGame();
            }
        });

        document.getElementById('coins').appendChild(bronzeCoin);
    }
});

// Function to upgrade a coin
function upgradeCoin(coinElement, newTier, scoreValue) {
    coinElement.src = `coins/${newTier}.png`;
    coinElement.classList.remove('bronze');
    coinElement.classList.add(newTier);
    coinElement.addEventListener('click', () => {
        if (!isGamePaused) {
            score += scoreValue * multiplier;
            updateScore();
            saveGame();
        }
    });
}

// Function to autoclick the previous tier every second
function autoclickCoin(coinTier, previousTier, interval) {
    setInterval(() => {
        if (!isGamePaused && coins[previousTier] > 0) {
            score += coins[coinTier] * multiplier;
            updateScore();
            saveGame();
        }
    }, interval);
}

// Function to render coins from local storage
function renderCoins() {
    for (let coinType in coins) {
        for (let i = 0; i < coins[coinType]; i++) {
            let coinImg = document.createElement('img');
            coinImg.src = `coins/${coinType}.png`;
            coinImg.className = `coin ${coinType}`;
            coinImg.style.top = `${Math.random() * 500}px`;
            coinImg.style.left = `${Math.random() * 500}px`;
            document.getElementById('coins').appendChild(coinImg);
        }
    }
}

// Reset button to restart the game
resetButton.addEventListener('click', () => {
    resetGame(true);
});

// Function to reset the game
function resetGame(clearStorage = false) {
    score = 0;
    bronzeClicks = 0;
    coins = { bronze: 0, silver: 0, gold: 0, platinum: 0, titanium: 0, diamond: 0, crystal: 0, ruby: 0, emerald: 0, obsidian: 0 };
    isGamePaused = true;
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 600; // Reset timer to 10 minutes
    updateScore();
    playButton.textContent = 'Play';
    pleadSection.style.display = 'none';
    prestigeSection.style.display = 'none';
    document.getElementById('coins').innerHTML = '';
    
    if (clearStorage) {
        localStorage.clear(); // Clear local storage
    }
}

// Function to check and remove coins if more than 5 of the same type
function checkCoinLimit() {
    for (let coinType in coins) {
        if (coins[coinType] > 5) {
            removeCoins(coinType);
        }
    }
}

// Function to remove all coins of a specific type
function removeCoins(coinType) {
    let coinElements = document.querySelectorAll(`.coin.${coinType}`);
    coinElements.forEach(coin => {
        coin.remove();
    });
    coins[coinType] = 0;
    saveGame();
}

// Initialize game on load
updateScore();
loadGame();

// Autoclickers for each coin tier
autoclickCoin('silver', 'bronze', 1000);
autoclickCoin('gold', 'silver', 1000);
autoclickCoin('platinum', 'gold', 1000);
autoclickCoin('titanium', 'platinum', 1000);
autoclickCoin('diamond', 'titanium', 1000);
autoclickCoin('crystal', 'diamond', 1000);
autoclickCoin('ruby', 'crystal', 1000);
autoclickCoin('emerald', 'ruby', 1000);
autoclickCoin('obsidian', 'emerald', 1000);
