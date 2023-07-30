const http = require('http');
const url = require('url');

const port = 3000;

let towers;
let movesRequired;
let numberOfDisks;

const getRandomInt = (
  minimum = 0,
  maximum = Number.MAX_SAFE_INTEGER,
) => {
  const [min, max] =
    minimum <= maximum ? [minimum, maximum] : [maximum, minimum];
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  const { pathname, query } = reqUrl;


  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  try {
    switch (pathname) {
      case '/start':
        numberOfDisks = parseInt(query.disks);
        if (isNaN(numberOfDisks) || numberOfDisks < 3 || numberOfDisks > 10) {
          throw new Error("Invalid 'disks' value. It should be a number greater than or equal to 3 and less or equal to 10.");
        }

        movesRequired = Math.pow(2, numberOfDisks) - 1;
        towers = getDefaultState();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ towers, movesRequired }));
        break;

      case '/move':
        const from = parseInt(query.from);
        const to = parseInt(query.to);
        if (isNaN(from) || isNaN(to) || from < 0 || from > 2 || to < 0 || to > 2) {
          throw new Error("Invalid 'from' or 'to' value. They should be numbers in the range 0-2.");
        }

        if (isValidMove(from, to)) {
          towers[to].unshift(towers[from].shift());
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, towers, win: checkWin() }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false }));
        }
        break;

      case '/solution':
        const userSteps = JSON.parse(query.steps);
        const solution = searchSolution(userSteps);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ solution }));
        break;

      default:
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end("404 Not Found\n");
        break;
    }
  } catch (error) {
    console.error(error);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: `Invalid request: ${error.message}` }));
  }
});

function checkWin(state = towers) {
  return state[1].length === numberOfDisks || state[2].length === numberOfDisks;
}

function isValidMove(from, to, state = towers) {
  if (state[from].length === 0) return false;
  if (state[to].length === 0) return true;
  return state[from][0] < state[to][0];
}

function searchSolution(userSteps) {
  let steps = [];

  let minDiskTower = towers.findIndex(tower => tower.length && tower[0] === 1);
  const maxDiskTower = towers.findIndex(tower => tower.length && tower[tower.length - 1] === numberOfDisks);
  const targetTower = (minDiskTower === 0 ? maxDiskTower : minDiskTower) || getRandomInt(1, 2);

  steps = searchPathStepByStep(targetTower, userSteps);
  if (!steps) {
    steps = searchPathStepByStep(targetTower === 2 ? 1 : 2, userSteps);
  }
  if (!steps) {
    throw new Error('решение не найдено');
  }

  return steps;
}

function getDefaultState() {
  let disks = [];
  for (let i = 1; i <= numberOfDisks; i++) {
    disks.push(i);
  }
  return [disks, [], []];
}

function searchPathStepByStep(targetTower, userSteps) {
  const steps = hanoi(numberOfDisks, 0, targetTower, targetTower === 1 ? 2 : 1);
  const path = [];
  let i = 0;
  let hasError = false;
  if (userSteps.length) {
    for (i = 0; i < steps.length; i++) {
      if (!userSteps[i]) {
        break;
      } else if (!(steps[i].from === userSteps[i].from && steps[i].to === userSteps[i].to)) {
        hasError = true;
        break;
      }
    }

    if (hasError) {
      if(i === 0) {
        // Ошибочно определен targetTower
        console.log('Ошибочно определен targetTower');
        return;
      }
      path.push({ from: userSteps[userSteps.length - 1].to, to: userSteps[userSteps.length - 1].from });
    }
  }
  path.push(...steps.slice(i));
  return path;
}

function hanoi(n, from, to, aux, steps = []) {
  if (n > 0) {
    hanoi(n - 1, from, aux, to, steps);
    steps.push({ from, to });
    hanoi(n - 1, aux, to, from, steps);
  }
  return steps;
}

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

