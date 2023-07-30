/**
 * Стартовое состояние башен для 3х дисков: [[1, 2, 3], [], []]
 * @param {number} numberOfDisks количество дисков
 * @returns {[number[], number[], number[]]} стартовое состояние по-умолчанию для заданного количества дисков
 */
function getDefaultState(numberOfDisks) {

}

/**
 * Формула расчета минимального количества шагов для решения задачи: 2^n - 1
 * Для возведения в степень в JavaScript можно воспользоваться оператором x ** y, или функцией Math.pow(x,y)
 * @param {number} numberOfDisks количество дисков
 * @returns {number} минимальное количество шагов для решения задачи с заданным количеством дисков
 */
function getRequiredMoves(numberOfDisks) {
  
}

/**
 * Для приведения строки к целому числу можно воспользоваться встроенной функцией `parseInt`
 * @param {{disks?: string}} query параметры, которые получены в запросе фронтенда
 * @returns {{towers: [number[], number[], number[]]; movesRequired: number; numberOfDisks: number; }} состояние новой сессии игры
 */
function startGame(query) {

}

module.exports = { startGame };
