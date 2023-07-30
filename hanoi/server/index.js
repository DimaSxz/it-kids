const http = require('http');
const url = require('url');
const { startGame } = require('./start');
const { applyMove } = require('./move');
const { solution } = require('./solution');

const port = 3000;

const sessions = new Map();

function okAnswer(response, answer) {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(answer));
}

function badRequestAnswer(response, message) {
  response.writeHead(400, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ message: `Неверный запрос: ${message}` }));
}

function notFoundAnswer(response) {
  response.writeHead(404, { 'Content-Type': 'text/plain' });
  response.end("404 Not Found\n");
}

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  const { pathname, query } = reqUrl;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  let sessionId = parseInt(query.sessionId) || (sessions.size + 1);
  let session = sessions.get(sessionId);

  let response;
  try {
    switch (pathname) { 
      case '/start':
        response = startGame(query);
        sessions.set(sessionId, response);
        okAnswer(res, { ...response, sessionId });
        break;

      case '/move':
        response = applyMove(query, session);

        if(response) {
          sessions.set(sessionId, { ...session, towers: response.towers });
          okAnswer(res, {success: true, ...response });
        } else {
          okAnswer(res, { success: false });
        }
        break;

      case '/solution':
        okAnswer(res, { solution: solution(query, session) });
        break;

      default:
        notFoundAnswer(res);
        break;
    }
  } catch (error) {
    console.error(error);
    badRequestAnswer(res, error.message);
  }
});

server.listen(port, () => {
  console.log(`Сервер слушает порт: ${port}`);
});

