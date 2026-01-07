import dotenv from 'dotenv';
import { Hono } from 'hono';
import path from 'node:path';
import { todos } from './server.js';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { ErrorPage, ErrorPageTitleRequired, Main } from './components/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetDir = path.join(__dirname, 'assets');
await mkdir(assetDir, { recursive: true });
const imagePath = path.join(assetDir, 'random-image.jpg');

const IMAGE_THRESHHOLD_IN_MS = process.env.IMAGE_THRESHHOLD_IN_MS; // 10 minutes
if (!IMAGE_THRESHHOLD_IN_MS) {
  throw new Error('IMAGE_THRESHHOLD_IN_MS is not set');
}

setInterval(async () => {
  await refreshImage(imagePath).catch((error) => {
    console.error('an error occured in reloading image', error.stack);
  });
}, +IMAGE_THRESHHOLD_IN_MS);

const app = new Hono();

app.get('/', async (c) => {
  try {
    if (!existsSync(imagePath)) {
      await saveImageToDisk(imagePath);
    }
    const image = await getImageFromDisk(imagePath);
    return c.html(<Main image={image} todos={todos} />);
  } catch (error: any) {
    const errMsg = error.stack ?? error.message;
    return c.html(<ErrorPage errMsg={errMsg}></ErrorPage>);
  }
});

app.get('title-error', (c) => {
  return c.html(<ErrorPageTitleRequired></ErrorPageTitleRequired>);
});

export default app;

// Helpers

async function saveImageToDisk(filePath: string) {
  const IMAGE_DOWNLOAD_URL = process.env.IMAGE_DOWNLOAD_URL;
  if (!IMAGE_DOWNLOAD_URL) {
    throw new Error('IMAGE_DOWNLOAD_URL is not set');
  }
  const res = await fetch(IMAGE_DOWNLOAD_URL);
  const arrayBuffer = await res.arrayBuffer();
  const imageBuffer = Buffer.from(arrayBuffer);
  await writeFile(filePath, imageBuffer);
}

async function getImageFromDisk(filePath: string) {
  const imageBuffer = await readFile(filePath);
  const base64Image = imageBuffer.toString('base64');
  const imageString = `data:image/jpg;base64,${base64Image}`;
  return imageString;
}

async function refreshImage(filePath: string) {
  console.log('Threshold met, saving new image...');
  await saveImageToDisk(filePath);
}
