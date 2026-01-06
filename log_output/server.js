import dotenv from 'dotenv';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { mkdir, readFile } from 'node:fs/promises';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pingpongSvc = process.env.PINGPONG_SVC;

const server = createServer(async (req, res) => {
  const content = await getContentFromFile();
  const pongs = await getPongsViaNetwork();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(content + `Ping / Pong: ${pongs}`);
});

server.listen(3001, () => {
  console.log('Server running on port 3001');
});

async function getContentFromFile() {
  const logsDir = path.join(__dirname, 'logs');
  const filePath = path.join(logsDir, 'log.txt');
  await mkdir(logsDir, { recursive: true });

  if (!existsSync(filePath)) {
    return '';
  }

  const content = await readFile(filePath, {
    encoding: 'utf8',
  });

  return content;
}

// Halt volume-based usage
async function getPongsFromFile() {
  const logsDir = path.join(__dirname, 'logs');
  const filePath = path.join(logsDir, 'pongs.txt');

  if (!existsSync(filePath)) {
    return 0;
  }

  const pongs = await readFile(filePath, { encoding: 'utf8' });
  return pongs;
}

async function getPongsViaNetwork() {
  console.log({ pingpongSvc });
  try {
    const res = await fetch(`${pingpongSvc}/get-pingpong`);
    const pongs = await res.text();
    return pongs;
  } catch (error) {
    console.error(
      'an error occured fetching pongs via the network',
      error.stack
    );
    return 0;
  }
}
