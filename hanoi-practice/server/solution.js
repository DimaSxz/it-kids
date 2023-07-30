const getRandomInt = (
  minimum = 0,
  maximum = Number.MAX_SAFE_INTEGER,
) => {
  const [min, max] =
    minimum <= maximum ? [minimum, maximum] : [maximum, minimum];
  return Math.floor(Math.random() * (max - min + 1) + min);
};


function hanoi(n, from, to, aux, steps = []) {
  if (n > 0) {
    hanoi(n - 1, from, aux, to, steps);
    steps.push({ from, to });
    hanoi(n - 1, aux, to, from, steps);
  }
  return steps;
}

function searchPathStepByStep(targetTower, userSteps, numberOfDisks) {
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

function searchSolution(userSteps, session) {
  const { towers, numberOfDisks } = session;
  let steps = [];
  let minDiskTower = towers.findIndex(tower => tower.length && tower[0] === 1);
  const maxDiskTower = towers.findIndex(tower => tower.length && tower[tower.length - 1] === numberOfDisks);
  const targetTower = (minDiskTower === 0 ? maxDiskTower : minDiskTower) || getRandomInt(1, 2);

  steps = searchPathStepByStep(targetTower, userSteps, numberOfDisks);
  if (!steps) {
    steps = searchPathStepByStep(targetTower === 2 ? 1 : 2, userSteps, numberOfDisks);
  }
  if (!steps) {
    throw new Error('Решение не найдено');
  }

  return steps;
}

function solution(query, session) {
  const userSteps = JSON.parse(query.steps);
  return searchSolution(userSteps, session);
}

module.exports = { solution };
