const http = require('http');
const randomNum = Math.floor(Math.random() * 100) + 1;

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/guess') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const guess = JSON.parse(body).guess;
            if (guess < randomNum) {
                res.end("Больше");
            } else if (guess > randomNum) {
                res.end("Меньше");
            } else {
                res.end("Угадал");
            }
        });
    }
});

server.listen(3000);
