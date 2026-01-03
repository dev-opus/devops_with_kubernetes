import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { writeFile, mkdir } from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

start();

function start() {
  const datePrefixedString = prefixWithDate(generateString());
  setInterval(async () => {
    await writeStringToFile(datePrefixedString);
  }, 5000);
}

function generateString() {
  return randomUUID();
}

function prefixWithDate(string) {
  const isoDateString = new Date().toISOString();
  return `${isoDateString}: ${string}`;
}

async function writeStringToFile(string) {
  const logsDir = path.join(__dirname, 'logs');
  await mkdir(logsDir, { recursive: true });
  const filePath = path.join(logsDir, 'log.txt');

  await writeFile(path.join(filePath), string + '\n', {
    flag: 'a',
  });
}
