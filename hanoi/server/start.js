function getDefaultState(numberOfDisks) {
  let disks = [];
  for (let i = 1; i <= numberOfDisks; i++) {
    disks.push(i);
  }
  return [disks, [], []];
}

function startGame(query) {
  const numberOfDisks = parseInt(query.disks);
  if (isNaN(numberOfDisks) || numberOfDisks < 3 || numberOfDisks > 10) {
    throw new Error("Invalid 'disks' value. It should be a number greater than or equal to 3 and less or equal to 10.");
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
