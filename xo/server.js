const http = require('http');
const board = Array(9).fill(null);

function checkWinner() {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let line of lines) {
        if (board[line[0]] && board[line[0]] === board[line[1]] && board[line[0]] === board[line[2]]) {
            return board[line[0]];
        }
    }
    return null;
}

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/move') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const move = JSON.parse(body);
            board[move.index] = move.symbol;
            const winner = checkWinner();
            res.end(winner ? winner : "None");
        });
    }
});

server.listen(3000);
