function isValidMove(from, to, state) {
  if (state[from].length === 0) return false;
  if (state[to].length === 0) return true;
  return state[from][0] < state[to][0];
}

function checkWin(state, numberOfDisks) {
  return state[1].length === numberOfDisks || state[2].length === numberOfDisks;
}

function applyMove(query, session) {
  if (!session) {
    throw new Error('Сессия не найдена, начните новую игру');
  }

  const from = parseInt(query.from);
  const to = parseInt(query.to);
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || from > 2 || to < 0 || to > 2) {
    throw new Error("Значения 'from' и 'to' должны быть целыми числами от 0 до 2");
  }

  const towers = session.towers;
  if (isValidMove(from, to, towers)) {
    towers[to].unshift(towers[from].shift());
    return { towers, win: checkWin(towers, session.numberOfDisks) };
  }

  return false;
}

module.exports = { applyMove };
