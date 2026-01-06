import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsDir = path.join(__dirname, 'logs');
const filePath = path.join(logsDir, 'pongs.txt');

let counter = 0;

const server = createServer(async (req, res) => {
  switch (req.url) {
    case '/pingpong':
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`pong ${counter}`);
      await writePongsToFile(counter);
      counter += 1;
      break;
    case '/get-pingpong':
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      const pongs = await readPongsFromFile(filePath);
      res.end(`${pongs}`);
      break;
    default:
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Page not found');
  }
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});

async function writePongsToFile(counter) {
  await mkdir(logsDir, { recursive: true });
  await writeFile(filePath, counter.toString(), { flag: 'w' });
}

async function readPongsFromFile(filePath) {
  const pongs = await readFile(filePath, 'utf8');
  return pongs;
}