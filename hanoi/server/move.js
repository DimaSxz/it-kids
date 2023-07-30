/**
 * Функция проверяет допустимость хода
 * @param {number} from номер башни (от 0 до 2), с которой перемещается верхний диск
 * @param {number} to номер башни (от 0 до 2), на который перемещается диск
 * @param {[number[], number[], number[]]} state текущее состояние башен
 * @returns {boolean} признак допустим ли ход по правилам игры
 */
function isValidMove(from, to, state) {
  if (state[from].length === 0) return false;
  if (state[to].length === 0) return true;
  return state[from][0] < state[to][0];
}

/**
 * Функция проверяет текущее состояние игры на победу
 * @param {[number[], number[], number[]]} state текущее состояние башен
 * @param {number} numberOfDisks количество дисков
 * @returns {boolean} признак победы
 */
function checkWin(state, numberOfDisks) {
  return state[1].length === numberOfDisks || state[2].length === numberOfDisks;
}

/**
 * Функция применяет ход, полученный с фронтенда. Если ход недопустим по правилам игры, возвращает `false`.
 * @param {{ from?: string; to?: string; sessionId?: string}} query параметры, которые получены в запросе фронтенда
 * @param {({ towers: [number[], number[], number[]]; movesRequired: number; numberOfDisks: number; } | undefined)} session текущая игровая сессия
 * @returns {( false | { towers: [number[], number[], number[]]; win: boolean; } )} новое состояние башен и флаг признака победы, или `false`
 */
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
