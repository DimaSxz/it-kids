/**
 * Стартовое состояние стержней для 3х дисков: [[1, 2, 3], [], []]
 * @param {number} numberOfDisks количество дисков
 * @returns {[number[], number[], number[]]} стартовое состояние по-умолчанию для заданного количества дисков
 */
function getDefaultState(numberOfDisks) {
  const disks = [];
  for (let i = 1; i <= numberOfDisks; i++) {
    disks.push(i);
  }
  return [disks, [], []];
}

/**
 * Формула расчета минимального количества шагов для решения задачи: 2^n - 1
 * Для возведения в степень в JavaScript можно воспользоваться оператором x ** y, или функцией Math.pow(x,y)
 * @param {number} numberOfDisks количество дисков
 * @returns {number} минимальное количество шагов для решения задачи с заданным количеством дисков
 */
function getRequiredMoves(numberOfDisks) {
  return 2 ** numberOfDisks - 1;
}

/**
 * Для приведения строки к целому числу можно воспользоваться встроенной функцией `parseInt`
 * @param {{disks?: string}} query параметры, которые получены в запросе фронтенда
 * @returns {{towers: [number[], number[], number[]]; movesRequired: number; numberOfDisks: number; }} состояние новой сессии игры
 */
function startGame(query) {
  const numberOfDisks = parseInt(query.disks);
  if (!Number.isInteger(numberOfDisks) || numberOfDisks < 3 || numberOfDisks > 10) {
    throw new Error("Неверное значение 'disks'. Оно должно быть целым числом от 3 до 10 включительно");
  }

  return {
    towers: getDefaultState(numberOfDisks),
    movesRequired: getRequiredMoves(numberOfDisks),
    numberOfDisks,
  };
}

module.exports = { startGame };
