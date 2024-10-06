const boardSizeSelect = document.getElementById('board-size');
const playButton = document.getElementById('play-button');
const gameBoard = document.getElementById('game-board');
const scoreValue = document.getElementById('score-value');

let board, score;

playButton.addEventListener('click', () => {
    const size = parseInt(boardSizeSelect.value);
    setupBoard(size);
    startGame(size);
});

function setupBoard(size) {
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${size}, 100px)`;
    gameBoard.style.gridTemplateRows = `repeat(${size}, 100px)`;
    gameBoard.classList.remove('hidden');
    
    board = Array.from({ length: size }, () => Array(size).fill(0));
    score = 0;
    updateScore();
    
    addRandomTile();
    addRandomTile();
    drawBoard();
}

function addRandomTile() {
    let emptyTiles = [];
    board.forEach((row, r) => row.forEach((tile, c) => {
        if (tile === 0) emptyTiles.push({ r, c });
    }));
    
    const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function drawBoard() {
    board.forEach(row => {
        row.forEach(tile => {
            const tileDiv = document.createElement('div');
            tileDiv.classList.add('tile', `tile-${tile}`);
            tileDiv.innerText = tile ? tile : '';
            gameBoard.appendChild(tileDiv);
        });
    });
}

function updateScore() {
    scoreValue.innerText = score;
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'w') {
        moveUp();
    } else if (event.key === 'ArrowDown' || event.key === 's') {
        moveDown();
    } else if (event.key === 'ArrowLeft' || event.key === 'a') {
        moveLeft();
    } else if (event.key === 'ArrowRight' || event.key === 'd') {
        moveRight();
    }
});

function moveUp() {
    // Logic for moving tiles up
    let moved = false;
    for (let c = 0; c < board.length; c++) {
        let stack = [];
        for (let r = 0; r < board.length; r++) {
            if (board[r][c] !== 0) {
                if (stack.length && stack[stack.length - 1] === board[r][c]) {
                    stack[stack.length - 1] *= 2;
                    score += stack[stack.length - 1];
                    moved = true;
                } else {
                    stack.push(board[r][c]);
                }
            }
        }
        for (let r = 0; r < board.length; r++) {
            board[r][c] = stack[r] || 0;
        }
    }
    if (moved) {
        addRandomTile();
        drawBoard();
        updateScore();
    }
}

// Implement moveDown, moveLeft, moveRight with similar logic

function moveDown() {
    // Logic for moving tiles down (similar to moveUp)
}

function moveLeft() {
    // Logic for moving tiles left
}

function moveRight() {
    // Logic for moving tiles right
}

// Swipe controls for mobile
let touchstartX = 0;
let touchstartY = 0;

gameBoard.addEventListener('touchstart', (event) => {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
});

gameBoard.addEventListener('touchend', (event) => {
    const touchendX = event.changedTouches[0].screenX;
    const touchendY = event.changedTouches[0].screenY;

    const diffX = touchendX - touchstartX;
    const diffY = touchendY - touchstartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
            moveRight();
        } else {
            moveLeft();
        }
    } else {
        if (diffY > 0) {
            moveDown();
        } else {
            moveUp();
        }
    }
});
