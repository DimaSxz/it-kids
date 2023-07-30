function getDefaultState(numberOfDisks) {
  let disks = [];
  for (let i = 1; i <= numberOfDisks; i++) {
    disks.push(i);
  }
  return [disks, [], []];
}

function startGame(query) {
  const numberOfDisks = parseInt(query.disks);
  if (!Number.isInteger(numberOfDisks) || numberOfDisks < 3 || numberOfDisks > 10) {
    throw new Error("Неверное значение 'disks'. Оно должно быть целым числом от 3 до 10 включительно");
  }

  const movesRequired = Math.pow(2, numberOfDisks) - 1;
  const towers = getDefaultState(numberOfDisks);

  return {
    towers,
    movesRequired,
    numberOfDisks,
  };
}

module.exports = { startGame };
