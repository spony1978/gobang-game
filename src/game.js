const BOARD_SIZE = 15;
const WIN_COUNT = 5;

let board = [];
let currentPlayer = 'black';
let gameOver = false;
let history = [];

function initBoard() {
    board = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        board[i] = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = null;
        }
    }
}

function createBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    
    for (let i = 0; i < BOARD_SIZE; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.onclick = () => placeStone(i, j);
            row.appendChild(cell);
        }
        
        boardElement.appendChild(row);
    }
}

function placeStone(row, col) {
    if (gameOver || board[row][col] !== null) return;

    board[row][col] = currentPlayer;
    history.push({ row, col, player: currentPlayer });

    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    const stone = document.createElement('div');
    stone.className = `stone ${currentPlayer}`;
    cell.appendChild(stone);

    if (checkWin(row, col)) {
        gameOver = true;
        const winner = currentPlayer === 'black' ? '黑棋' : '白棋';
        showMessage(`${winner}获胜！`, true);
        return;
    }

    if (checkDraw()) {
        gameOver = true;
        showMessage('平局！', false);
        return;
    }

    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    updatePlayerInfo();
}

function checkWin(row, col) {
    const directions = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1]
    ];

    for (const [dx, dy] of directions) {
        let count = 1;

        for (let i = 1; i < WIN_COUNT; i++) {
            const newRow = row + dx * i;
            const newCol = col + dy * i;
            if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) break;
            if (board[newRow][newCol] !== currentPlayer) break;
            count++;
        }

        for (let i = 1; i < WIN_COUNT; i++) {
            const newRow = row - dx * i;
            const newCol = col - dy * i;
            if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) break;
            if (board[newRow][newCol] !== currentPlayer) break;
            count++;
        }

        if (count >= WIN_COUNT) return true;
    }

    return false;
}

function checkDraw() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === null) return false;
        }
    }
    return true;
}

function updatePlayerInfo() {
    const blackInfo = document.getElementById('black-info');
    const whiteInfo = document.getElementById('white-info');
    
    if (currentPlayer === 'black') {
        blackInfo.classList.add('active');
        whiteInfo.classList.remove('active');
    } else {
        blackInfo.classList.remove('active');
        whiteInfo.classList.add('active');
    }
}

function showMessage(text, isWin) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = isWin ? 'message win' : 'message';
}

function restartGame() {
    initBoard();
    createBoard();
    currentPlayer = 'black';
    gameOver = false;
    history = [];
    updatePlayerInfo();
    showMessage('', false);
}

function undoMove() {
    if (history.length === 0 || gameOver) return;

    const lastMove = history.pop();
    board[lastMove.row][lastMove.col] = null;

    const cell = document.querySelector(`.cell[data-row="${lastMove.row}"][data-col="${lastMove.col}"]`);
    const stone = cell.querySelector('.stone');
    if (stone) stone.remove();

    currentPlayer = lastMove.player;
    updatePlayerInfo();
}

restartGame();
