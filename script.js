let boardSize = 4; // Default board size
let board = [];
let score = 0;
let highScore = 0;

const menu = document.getElementById('menu');
const game = document.getElementById('game');
const boardElement = document.getElementById('board');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const playButton = document.getElementById('play-button');
const resetButton = document.getElementById('reset-button');
const sizeSelect = document.getElementById('size-select');

function initGame() {
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    score = 0;
    scoreElement.textContent = score;
    render();
    addRandomTile();
    addRandomTile();
}

function addRandomTile() {
    const emptyTiles = [];
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (board[r][c] === 0) {
                emptyTiles.push({ r, c });
            }
        }
    }

    if (emptyTiles.length === 0) return; // No empty tiles available

    const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4; // 90% chance of 2, 10% chance of 4
}

function render() {
    boardElement.innerHTML = '';
    board.forEach(row => {
        row.forEach(value => {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.textContent = value !== 0 ? value : '';
            tile.style.backgroundColor = getTileColor(value);
            boardElement.appendChild(tile);
        });
    });
}

function getTileColor(value) {
    const colors = {
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f67c5f',
        128: '#f9f86d',
        256: '#f9f86d',
        512: '#e6df73',
        1024: '#e6df73',
        2048: '#edc22e',
        default: '#3c3a32'
    };
    return colors[value] || colors.default;
}

function move(direction) {
    let moved = false;
    switch (direction) {
        case 'left':
            for (let r = 0; r < boardSize; r++) {
                const newRow = board[r].filter(num => num !== 0);
                const mergedRow = [];
                for (let c = 0; c < newRow.length; c++) {
                    if (newRow[c] === newRow[c + 1]) {
                        mergedRow.push(newRow[c] * 2);
                        score += newRow[c] * 2;
                        c++;
                    } else {
                        mergedRow.push(newRow[c]);
                    }
                }
                while (mergedRow.length < boardSize) mergedRow.push(0);
                for (let c = 0; c < boardSize; c++) {
                    if (board[r][c] !== mergedRow[c]) {
                        moved = true;
                    }
                    board[r][c] = mergedRow[c];
                }
            }
            break;
        case 'right':
            for (let r = 0; r < boardSize; r++) {
                const newRow = board[r].filter(num => num !== 0).reverse();
                const mergedRow = [];
                for (let c = 0; c < newRow.length; c++) {
                    if (newRow[c] === newRow[c + 1]) {
                        mergedRow.push(newRow[c] * 2);
                        score += newRow[c] * 2;
                        c++;
                    } else {
                        mergedRow.push(newRow[c]);
                    }
                }
                while (mergedRow.length < boardSize) mergedRow.push(0);
                mergedRow.reverse();
                for (let c = 0; c < boardSize; c++) {
                    if (board[r][c] !== mergedRow[c]) {
                        moved = true;
                    }
                    board[r][c] = mergedRow[c];
                }
            }
            break;
        case 'up':
            for (let c = 0; c < boardSize; c++) {
                const newColumn = [];
                for (let r = 0; r < boardSize; r++) {
                    if (board[r][c] !== 0) newColumn.push(board[r][c]);
                }
                const mergedColumn = [];
                for (let i = 0; i < newColumn.length; i++) {
                    if (newColumn[i] === newColumn[i + 1]) {
                        mergedColumn.push(newColumn[i] * 2);
                        score += newColumn[i] * 2;
                        i++;
                    } else {
                        mergedColumn.push(newColumn[i]);
                    }
                }
                while (mergedColumn.length < boardSize) mergedColumn.push(0);
                for (let r = 0; r < boardSize; r++) {
                    if (board[r][c] !== mergedColumn[r]) {
                        moved = true;
                    }
                    board[r][c] = mergedColumn[r];
                }
            }
            break;
        case 'down':
            for (let c = 0; c < boardSize; c++) {
                const newColumn = [];
                for (let r = 0; r < boardSize; r++) {
                    if (board[r][c] !== 0) newColumn.push(board[r][c]);
                }
                const mergedColumn = [];
                for (let i = 0; i < newColumn.length; i++) {
                    if (newColumn[i] === newColumn[i + 1]) {
                        mergedColumn.push(newColumn[i] * 2);
                        score += newColumn[i] * 2;
                        i++;
                    } else {
                        mergedColumn.push(newColumn[i]);
                    }
                }
                while (mergedColumn.length < boardSize) mergedColumn.push(0);
                mergedColumn.reverse();
                for (let r = 0; r < boardSize; r++) {
                    if (board[r][c] !== mergedColumn[r]) {
                        moved = true;
                    }
                    board[r][c] = mergedColumn[r];
                }
            }
            break;
    }
    if (moved) {
        addRandomTile();
        render();
        scoreElement.textContent = score;
        checkGameOver();
    }
}

function checkGameOver() {
    const hasEmptyTile = board.some(row => row.includes(0));
    const hasMergeableTile = board.some((row, r) => row.some((num, c) => {
        return (num === row[c + 1]) || (r < boardSize - 1 && num === board[r + 1][c]);
    }));
    if (!hasEmptyTile && !hasMergeableTile) {
        alert('Game Over!');
        updateHighScore();
    }
}

function updateHighScore() {
    const currentHighScore = localStorage.getItem(`highScore_${boardSize}`) || 0;
    if (score > currentHighScore) {
        localStorage.setItem(`highScore_${boardSize}`, score);
        highScoreElement.textContent = score;
    }
}

function startGame() {
    boardSize = parseInt(sizeSelect.value);
    highScore = localStorage.getItem(`highScore_${boardSize}`) || 0;
    highScoreElement.textContent = highScore;
    menu.classList.remove('active');
    game.classList.add('active');
    initGame();
}

function resetGame() {
    menu.classList.add('active');
    game.classList.remove('active');
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
        case 'a':
            move('left');
            break;
        case 'ArrowRight':
        case 'd':
            move('right');
            break;
        case 'ArrowUp':
        case 'w':
            move('up');
            break;
        case 'ArrowDown':
        case 's':
            move('down');
            break;
    }
});

playButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);

// Falling numbers effect
function createFallingNumber() {
    const numberElement = document.createElement('div');
    numberElement.className = 'number';
    numberElement.textContent = Math.floor(Math.random() * 10); // Random digit from 0 to 9

    const xPosition = Math.random() * (window.innerWidth - 50); // Random x position
    numberElement.style.left = `${xPosition}px`;
    document.getElementById('falling-numbers').appendChild(numberElement);

    const duration = Math.random() * 3 + 2; // Random duration between 2s and 5s
    numberElement.style.animationDuration = `${duration}s`; // Set the animation duration

    // Remove number after animation ends
    numberElement.addEventListener('animationend', () => {
        numberElement.remove();
    });
}

// Start generating falling numbers
setInterval(createFallingNumber, 300); // Create a new falling number every 300ms
