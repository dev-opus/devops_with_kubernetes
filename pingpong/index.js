import { createServer } from 'node:http';

let counter = 0;

const server = createServer((req, res) => {
  if (req.url === '/pingpong') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`pong ${counter}`);
    counter++;
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Page not found');
  }
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
