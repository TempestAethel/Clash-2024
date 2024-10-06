// Global variables
let score = 0;
let timer = 600;
let play = false;
let bronzeClicks = 0;
let silverClicks = 0;
let goldClicks = 0;
let platinumClicks = 0;
let titaniumClicks = 0;
let diamondClicks = 0;
let coins = {};
let autoClickers = [];
const coinTypes = {
    "B": { value: 1, clicks: 1000, next: "S", color: "brown" },
    "S": { value: 5, clicks: 1000, next: "G", color: "silver" },
    "G": { value: 10, clicks: 1000, next: "PL", color: "gold" },
    "PL": { value: 50, clicks: 1000, next: "TI", color: "platinum" },
    "TI": { value: 500, clicks: 1000, next: "D", color: "gray" },
    "D": { value: 1000, clicks: 1000, next: null, color: "blue" }
};

document.getElementById('play-pause-btn').addEventListener('click', toggleGame);
document.getElementById('plead-btn').addEventListener('click', generateCoin);
document.getElementById('reset-btn').addEventListener('click', resetGame);
document.getElementById('score-multiplier-btn').addEventListener('click', doubleScoreMultiplier);
document.getElementById('extra-time-btn').addEventListener('click', addExtraTime);

function toggleGame() {
    play = !play;
    this.innerText = play ? 'Pause' : 'Play';
    document.getElementById('plead-btn').style.display = play ? 'inline' : 'none';
    
    if (play) {
        startTimer();
    } else {
        clearInterval(autoClickers);
    }
}

function startTimer() {
    const timerInterval = setInterval(() => {
        if (timer <= 0) {
            clearInterval(timerInterval);
            endGame();
        } else {
            timer--;
            document.getElementById('timer-display').innerText = `Time Left: ${timer}`;
        }
    }, 1000);
}

function generateCoin() {
    const coinType = "B";
    const coin = document.createElement('div');
    coin.className = 'coin';
    coin.style.backgroundColor = coinTypes[coinType].color;
    coin.innerText = coinType;
    coin.style.position = 'absolute';
    coin.style.top = `${Math.random() * (window.innerHeight - 50)}px`;
    coin.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
    coin.addEventListener('click', () => clickCoin(coinType, coin));
    document.getElementById('coins-container').appendChild(coin);
    coins[coinType] = (coins[coinType] || 0) + 1;
    manageCoins();
}

function clickCoin(type, coinElement) {
    score += coinTypes[type].value;
    document.getElementById('score-display').innerText = `Score: ${score}`;
    coins[type]++;
    if (coins[type] >= coinTypes[type].clicks) {
        upgradeCoin(type, coinElement);
    }
}

function upgradeCoin(type, coinElement) {
    const nextType = coinTypes[type].next;
    if (nextType) {
        coins[type] = 0; // Reset click count for current type
        coinElement.innerText = nextType;
        coinElement.style.backgroundColor = coinTypes[nextType].color;
        coinElement.onclick = () => clickCoin(nextType, coinElement);
    }
}

function manageCoins() {
    const coinDivs = document.getElementById('coins-container').children;
    const coinCounts = {};
    
    for (let coin of coinDivs) {
        const type = coin.innerText;
        coinCounts[type] = (coinCounts[type] || 0) + 1;
        if (coinCounts[type] > 5) {
            coin.remove(); // Remove excess coins
        }
    }
}

function endGame() {
    play = false;
    document.getElementById('play-pause-btn').innerText = 'Play';
    document.getElementById('plead-btn').style.display = 'none';
    document.getElementById('prestige-options').style.display = 'block';
}

function resetGame() {
    score = 0;
    timer = 600;
    bronzeClicks = 0;
    silverClicks = 0;
    goldClicks = 0;
    platinumClicks = 0;
    titaniumClicks = 0;
    diamondClicks = 0;
    coins = {};
    document.getElementById('score-display').innerText = `Score: ${score}`;
    document.getElementById('timer-display').innerText = `Time Left: ${timer}`;
    document.getElementById('prestige-options').style.display = 'none';
    document.getElementById('coins-container').innerHTML = '';
    localStorage.clear();
}

function doubleScoreMultiplier() {
    // Logic for double score multiplier
    score *= 2;
    document.getElementById('score-display').innerText = `Score: ${score}`;
    resetGame(); // Reset after selecting prestige option
}

function addExtraTime() {
    timer += 120; // Add 2 minutes
    resetGame(); // Reset after selecting prestige option
}

// Load from local storage if available
function loadGameState() {
    const savedScore = localStorage.getItem('score');
    const savedCoins = JSON.parse(localStorage.getItem('coins'));
    if (savedScore) score = parseInt(savedScore);
    if (savedCoins) coins = savedCoins;

    document.getElementById('score-display').innerText = `Score: ${score}`;
}

// Save the game state
function saveGameState() {
    localStorage.setItem('score', score);
    localStorage.setItem('coins', JSON.stringify(coins));
}

window.addEventListener('beforeunload', saveGameState);
window.addEventListener('load', loadGameState);
