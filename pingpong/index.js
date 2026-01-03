import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { mkdir, writeFile } from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let counter = 0;

const server = createServer(async (req, res) => {
  if (req.url === '/pingpong') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`pong ${counter}`);
    counter += 1;
    await writePongsToFile(counter);
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Page not found');
  }
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});

async function writePongsToFile(counter) {
  const logsDir = path.join(__dirname, 'logs');
  const filePath = path.join(logsDir, 'pongs.txt');

  await mkdir(logsDir, { recursive: true });
  await writeFile(filePath, counter.toString(), { flag: 'w' });
}
