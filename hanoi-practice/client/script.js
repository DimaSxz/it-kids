const host = 'http://localhost:3000';

let towers;
let selectedTower;
let moves;
let movesRequired;
let numberOfDisks;
let timer
let steps = [];

let sessionId;

function updateMoves() {
  const movesElement = document.getElementById('moves');
  movesElement.innerText = `Ходов: ${moves}, минимально необходимо: ${movesRequired}`;
}

async function startGame() {
  numberOfDisks = document.getElementById("disks").value;
  try {
    const response = await fetch(`${host}/start?disks=${numberOfDisks}`);
    const data = await response.json();
    if (!response.ok) {
      throw data.message;
    }
    sessionId = data.sessionId;
    steps = [];
    towers = data.towers;
    movesRequired = data.movesRequired;
    moves = 0;
    selectedTower = null;
    updateMoves();
    updateTowers(towers);
    document.getElementById("autoButton").style.display = "block";
    startTimer();
  } catch (error) {
    console.error('Ошибка:', error);
    alert(error);
  }
}

async function selectTower(indexTower) {
  if (selectedTower === null) {
    selectedTower = indexTower;
    const tower = document.getElementById(`tower${selectedTower + 1}`)
    tower.lastChild?.classList.add('selected');
  } else {
    document.querySelector('.disk.selected')?.classList.remove('selected');
    try {
      const response = await fetch(`${host}/move?from=${selectedTower}&to=${indexTower}&sessionId=${sessionId}`);
      const data = await response.json();
      if (!response.ok) {
        throw data.message;
      }

      if (data.success) {
        steps.push({from: selectedTower, to: indexTower});
        towers = data.towers;
        document.getElementById("message").innerText = '';
        moves++;
        updateMoves();
        updateTowers(towers);
        selectedTower = null;
        if (data.win) {
          stopTimer();
          await new Promise(resolve => setTimeout(resolve, 50));
          const playAgain = confirm("Поздравляем, вы выиграли! Хотите начать новую игру?");
          if (playAgain) {
            startGame(); // Restart the game
          }
        }
      } else {
        document.getElementById("message").innerText = "Недопустимый ход. Попробуйте еще раз.";
        selectedTower = null;
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert(error);
    }
  }
}

function updateTowers(towers) {
  const colors = ["blue", "green", "red", "purple", "orange", "yellow", "pink", "cyan", "lime", "magenta"];
  for (let i = 0; i < 3; i++) {
    const towerElement = document.getElementById("tower" + (i + 1));
    while (towerElement.firstChild) {
      towerElement.removeChild(towerElement.firstChild);
    }
    for (let j = towers[i].length - 1; j >= 0; j--) {
      const diskElement = document.createElement("div");
      diskElement.className = "disk";
      diskElement.style.background = colors[towers[i][j] - 1];
      diskElement.style.width = (100 - (numberOfDisks - towers[i][j]) * 10) + "%";
      towerElement.appendChild(diskElement);
    }
  }
}

function startTimer() {
  const timerElement = document.getElementById('timer');
  timer = 0;
  timerInterval = setInterval(() => {
    timer++;
    const hours = Math.floor(timer / 3600);
    const minutes = Math.floor((timer % 3600) / 60);
    const seconds = timer % 60;

    timerElement.innerText = `Времени потрачено: ${hours ? `${hours} час(ов) ` : ''}${minutes ? `${minutes} минут(а) ` : ''}${seconds} секунд(а)`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

async function autoSolve() {
  try {
    const response = await fetch(`${host}/solution?steps=${JSON.stringify(steps)}&sessionId=${sessionId}`);
    const data = await response.json();
    if (!response.ok) {
      throw data.message;
    }

    await autoPlay(data.solution);
  } catch (error) {
    console.error('Ошибка:', error);
    alert(error);
  }
}

async function autoPlay(steps) {
    selectedTower = null;
    for(const step of steps) {
      await selectTower(step.from);
      await selectTower(step.to);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
}
