const boardSizeSelect = document.getElementById('board-size');
const playButton = document.getElementById('play-button');
const gameBoard = document.getElementById('game-board');
const scoreValue = document.getElementById('score-value');

let board, score;

playButton.addEventListener('click', () => {
    const size = parseInt(boardSizeSelect.value);
    setupBoard(size);
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
    
    if (emptyTiles.length === 0) return; // No empty tiles left
    
    const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function drawBoard() {
    gameBoard.innerHTML = ''; // Clear the board before drawing
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
        if (moveUp()) {
            addRandomTile();
            drawBoard();
            updateScore();
        }
    } else if (event.key === 'ArrowDown' || event.key === 's') {
        if (moveDown()) {
            addRandomTile();
            drawBoard();
            updateScore();
        }
    } else if (event.key === 'ArrowLeft' || event.key === 'a') {
        if (moveLeft()) {
            addRandomTile();
            drawBoard();
            updateScore();
        }
    } else if (event.key === 'ArrowRight' || event.key === 'd') {
        if (moveRight()) {
            addRandomTile();
            drawBoard();
            updateScore();
        }
    }
});

function moveUp() {
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
    return moved;
}

function moveDown() {
    let moved = false;
    for (let c = 0; c < board.length; c++) {
        let stack = [];
        for (let r = board.length - 1; r >= 0; r--) {
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
        for (let r = board.length - 1; r >= 0; r--) {
            board[r][c] = stack.pop() || 0;
        }
    }
    return moved;
}

function moveLeft() {
    let moved = false;
    for (let r = 0; r < board.length; r++) {
        let stack = [];
        for (let c = 0; c < board.length; c++) {
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
        for (let c = 0; c < board.length; c++) {
            board[r][c] = stack[c] || 0;
        }
    }
    return moved;
}

function moveRight() {
    let moved = false;
    for (let r = 0; r < board.length; r++) {
        let stack = [];
        for (let c = board.length - 1; c >= 0; c--) {
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
        for (let c = board.length - 1; c >= 0; c--) {
            board[r][c] = stack.pop() || 0;
        }
    }
    return moved;
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
            if (moveRight()) {
                addRandomTile();
                drawBoard();
                updateScore();
            }
        } else {
            if (moveLeft()) {
                addRandomTile();
                drawBoard();
                updateScore();
            }
        }
    } else {
        if (diffY > 0) {
            if (moveDown()) {
                addRandomTile();
                drawBoard();
                updateScore();
            }
        } else {
            if (moveUp()) {
                addRandomTile();
                drawBoard();
                updateScore();
            }
        }
    }
});
