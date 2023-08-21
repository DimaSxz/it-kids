const boardDiv = document.getElementById('board');
const settingsForm = document.getElementById('settings-form');
const startButton = settingsForm['start-button'];
const statusDiv = document.getElementById('status');
const cellIdxAttr = 'x-index';
const cellPlayerAttr = 'x-player';


let gridSize = 3;
let currentPlayer = 'x';

startButton.addEventListener('click', () => {
  const settings = Object.fromEntries(new FormData(settingsForm).entries());
  startGame(settings);
})

function startGame(settings) {
  const { size } = settings;

  if(size && size !== gridSize) {
    gridSize = Number(size);
  }

  drawGameBoard();
}

function drawGameBoard() {
  boardDiv.innerHTML = '';
  boardDiv.style.display = 'grid';
  boardDiv.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
  boardDiv.style.gridTemplateRows = `repeat(${gridSize}, 100px)`;

  setCurrentPlayer('x');

  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell', 'unchecked');
    cell.setAttribute(cellIdxAttr, i);
    cell.addEventListener('click', doMove);
    boardDiv.appendChild(cell);
  }
}

function doMove() {
  this.removeEventListener('click', doMove);
  this.classList.remove('unchecked');
  this.textContent = currentPlayer;
  this.setAttribute(cellPlayerAttr, currentPlayer);
  const isWin = checkWin();

  if(isWin) {
    if(confirm(`Победил ${currentPlayer}!\n\nХотите начать новую игру с теми же настройками?`)) {
      drawGameBoard();
    } else {
      statusDiv.textContent = '';
      boardDiv.style.display = 'none';
    }
  } else if (isDraw()) {
    if(confirm('Ничья! Хотите начать новую игру с теми же настройками?')) {
      drawGameBoard();
    } else {
      statusDiv.textContent = '';
      boardDiv.style.display = 'none';
    }
  } else {
    setCurrentPlayer();
  }
}

function setCurrentPlayer(player) {
  if(player) {
    currentPlayer = player;
  } else {
    currentPlayer = currentPlayer == 'x' ? 'o' : 'x';
  }
  statusDiv.textContent = `Сейчас ходит: ${currentPlayer.toUpperCase()}`;
}

function checkWin() {
  const cells = document.querySelectorAll(`.cell[${cellPlayerAttr}=${currentPlayer}]`);
  if(cells.length < gridSize) {
    return false;
  }

  const playerCells = Array.from(cells)
  .map(cell => Number(cell.getAttribute(cellIdxAttr)));

  return checkPattern(playerCells, gridSize);
}

function checkPattern(indices, N) {
  if (indices.length < N) {
    return false;
  }

  // Создаем массивы для строк, столбцов и диагоналей.
  const rows = Array.from({ length: N }, () => 0);
  const columns = Array.from({ length: N }, () => 0);
  let mainDiagonal = 0;
  let secondaryDiagonal = 0;

  // Определяем константу trigger для отслеживания нужного количества индексов.
  const trigger = N - 1;

  // Заполняем массивы значениями, соответствующими индексам.
  for (let i = 0; i < indices.length; i++) {
    const row = Math.floor(indices[i] / N);
    const col = indices[i] % N;

    // Проверяем, достигнуто ли нужное количество индексов для строки.
    if (rows[row] === trigger) {
      return true;
    }
    rows[row]++;

    // Проверяем, достигнуто ли нужное количество индексов для столбца.
    if (columns[col] === trigger) {
      return true;
    }
    columns[col]++;

    // Проверяем, достигнуто ли нужное количество индексов для главной диагонали.
    if (row === col) {
      if (mainDiagonal === trigger) {
        return true;
      }
      mainDiagonal++;
    }

    // Проверяем, достигнуто ли нужное количество индексов для побочной диагонали.
    if (row + col === trigger) {
      if (secondaryDiagonal === trigger) {
        return true;
      }
      secondaryDiagonal++;
    }
  }

  // Если не было достигнуто нужное количество индексов, возвращаем false.
  return false;
}

// Функция для проверки ничьи.
function isDraw() {
  const uncheckedCells = document.querySelectorAll('.cell.unchecked');
  return !uncheckedCells.length;
}
