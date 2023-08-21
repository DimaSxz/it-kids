// Получаем ссылки на HTML-элементы, которые будем использовать в игре.
const boardDiv = document.getElementById('board'); // Доска для игры.
const settingsForm = document.getElementById('settings-form'); // Форма настроек.
const startButton = settingsForm['start-button']; // Кнопка "Начать игру".
const statusDiv = document.getElementById('status'); // Статус игры (чей ход).
const cellIdxAttr = 'x-index'; // Атрибут для хранения индекса ячейки.
const cellPlayerAttr = 'x-player'; // Атрибут для хранения игрока в ячейке.
const playWithComputerCheckbox = document.getElementById('play-with-computer');
const sideChoiceDiv = document.getElementById('side-choice');
const playerSideSelect = document.getElementById('player-side');
const boardCover = document.getElementById('board-cover');

// Начальные значения переменных.
let gridSize = 3; // Размер игрового поля (по умолчанию 3x3).
let currentPlayer = 'x'; // Текущий игрок ('x' или 'o').
let pvpMode = true; // Режим игры: true - игрок против игрока, false - игрок против компьютера.
let humanSide = 'x'; // Сторона, которую выбрал игрок в режиме игры с компьютером.

// Добавляем обработчик события изменения состояния чекбокса "Играть с компьютером".
playWithComputerCheckbox.addEventListener('change', toggleSideChoice);

// Функция для переключения отображения выбора стороны при игре с компьютером.
function toggleSideChoice() {
  sideChoiceDiv.style.display = playWithComputerCheckbox.checked ? 'block' : 'none';
}

// Обработчик клика по кнопке "Начать игру".
startButton.addEventListener('click', () => {
  // Получаем настройки игры из формы.
  const settings = Object.fromEntries(new FormData(settingsForm).entries());
  // Начинаем новую игру с указанными настройками.
  startGame(settings);
})

// Функция для начала новой игры.
function startGame(settings) {
  const { size } = settings;


  // Если выбран новый размер поля, обновляем gridSize.
  if (size) {
    gridSize = Number(size);
  }

  // Отрисовываем игровое поле.
  drawGameBoard();
}

// Функция для отрисовки игрового поля.
function drawGameBoard() {
  // Очищаем содержимое доски.
  boardDiv.innerHTML = '';
  // Отрисовываем игровое поле в соответствии с настройками
  boardDiv.style.display = 'grid';
  boardDiv.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
  boardDiv.style.gridTemplateRows = `repeat(${gridSize}, 100px)`;

  // Устанавливаем текущего игрока в 'x'.
  setCurrentPlayer('x');

  // Создаем и добавляем ячейки на доску.
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell', 'unchecked');
    cell.setAttribute(cellIdxAttr, i);
    cell.addEventListener('click', doMove); // Добавляем обработчик клика для хода.
    boardDiv.appendChild(cell);
  }

  // Если режим игры с компьютером и текущий игрок не человек, компьютер делает первый ход.
  if(!pvpMode && currentPlayer !== humanSide) {
    // Если компьютер, то ходим с задержкой, чтобы было видно, что ходит компьютер.
    boardCover.style.display = 'block';  // Показываем "покрывало" для эффекта ожидания.
    // setTimeout(doComputerMove, 500); // Запускаем ход компьютера с небольшой задержкой.
  }
}

// Функция для выполнения хода игрока.
async function doMove() {
  // Убираем обработчик клика, чтобы нельзя было кликнуть еще раз в эту ячейку.
  this.removeEventListener('click', doMove);
  this.classList.remove('unchecked'); // Убираем класс "unchecked".
  this.textContent = currentPlayer; // Устанавливаем 'x' или 'o' в ячейку.
  this.setAttribute(cellPlayerAttr, currentPlayer); // Записываем текущего игрока в атрибут ячейки.
  const isWin = checkWin(); // Проверяем, есть ли победитель.

  if (isWin) {
    // Если есть победитель, выводим сообщение и предлагаем начать новую игру.
    if (await showResultMessage(`Победил ${currentPlayer}!\n\nХотите начать новую игру с теми же настройками?`)) {
      drawGameBoard(); // Начинаем новую игру.
    } else {
      statusDiv.textContent = ''; // Очищаем статус.
      boardDiv.style.display = 'none'; // Скрываем доску.
    }
  } else if(isDraw()) {
    // Если ничья, показываем сообщение и предлагаем начать новую игру.
    if (await showResultMessage('Ничья! Хотите начать новую игру с теми же настройками?')) {
      drawGameBoard();
    } else {
      statusDiv.textContent = '';
      boardDiv.style.display = 'none';
    }
  } else {
     // Если игра продолжается, меняем текущего игрока.
    setCurrentPlayer(); // Меняем текущего игрока.
    if(!pvpMode && currentPlayer !== humanSide) {
      boardCover.style.display = 'block'; // Показываем "покрывало".
      // Если компьютер, то ходим с задержкой, чтобы было видно, что ходит компьютер.
      // setTimeout(doComputerMove, 500); // Запускаем ход компьютера с небольшой задержкой.
    }
  }
}

// Функция для установки текущего игрока.
function setCurrentPlayer(player) {
  if (player) {
    currentPlayer = player; // Если передан игрок, устанавливаем его.
  } else {
    currentPlayer = currentPlayer == 'x' ? 'o' : 'x'; // Иначе меняем текущего игрока.
  }
  statusDiv.textContent = `Сейчас ходит: ${currentPlayer.toUpperCase()}`; // Обновляем статус.
}

// Функция для проверки наличия победы.
function checkWin() {
  // Получаем все ячейки, которые принадлежат текущему игроку.
  const cells = document.querySelectorAll(`.cell[${cellPlayerAttr}=${currentPlayer}]`);
  if (cells.length < gridSize) {
    return false; // Если ячеек меньше, чем нужно для победы, возвращаем false.
  }

  // Преобразуем ячейки в массив индексов.
  const playerCells = Array.from(cells)
    .map(cell => Number(cell.getAttribute(cellIdxAttr)));

  // Проверяем, собран ли паттерн индексов для победы.
  return checkPattern(playerCells, gridSize);
}

// Функция для проверки ничьи.
function isDraw() {
  const uncheckedCells = document.querySelectorAll('.cell.unchecked');
  return !uncheckedCells.length;
}

// Функция для проверки паттерна индексов.
function checkPattern(indices, N) {
  if (indices.length < N) {
    return false; // Если количество индексов недостаточно, возвращаем false.
  }

  // Создаем массивы для отслеживания индексов в строках, столбцах и диагоналях.
  const rows = Array.from({ length: N }, () => 0);
  const columns = Array.from({ length: N }, () => 0);
  let mainDiagonal = 0;
  let secondaryDiagonal = 0;

  // Константа trigger для отслеживания нужного количества индексов.
  const trigger = N - 1;

  // Проверяем индексы и считаем соответствующие строки, столбцы и диагонали.
  for (let i = 0; i < indices.length; i++) {
    const row = Math.floor(indices[i] / N);
    const col = indices[i] % N;

    // Проверяем строки и столбцы.
    if (rows[row] === trigger || columns[col] === trigger) {
      return true; // Если достигнуто нужное количество индексов, возвращаем true.
    }
    rows[row]++;
    columns[col]++;

    // Проверяем главную диагональ.
    if (row === col) {
      if(mainDiagonal === trigger) {
        return true;
      }
      mainDiagonal++;
    }

    // Проверяем побочную диагональ.
    if (row + col === trigger) {
      if(secondaryDiagonal === trigger) {
        return true; 
      }
      secondaryDiagonal++;
    }
  }

  // Если не было достигнуто нужное количество индексов, возвращаем false.
  return false;
}

// // Функция для хода компьютера.
// function doComputerMove() {

// }
