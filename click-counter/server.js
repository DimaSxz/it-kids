const http = require('http');
let count = 0;

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/click') {
        count++;
        res.end(count.toString());
    }
});

server.listen(3000);
