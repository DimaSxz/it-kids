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
}

module.exports = { applyMove };
