import { PingPong } from './db.js';
import { config } from './config.js';
import { createServer } from 'node:http';

const pingpong = new PingPong();
await pingpong.set(0);

let pongsRow = await pingpong.get();
let counter = pongsRow.pongs;

const server = createServer(async (req, res) => {
  switch (req.url) {
    case '/pingpong':
      await pingpong.set(counter);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`pong ${counter}`);
      counter += 1;
      break;
    case '/get-pingpong':
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');

      const row = await pingpong.get();
      const pongs = row.pongs;

      res.end(`${pongs}`);
      break;
    default:
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Page not found');
  }
});

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
