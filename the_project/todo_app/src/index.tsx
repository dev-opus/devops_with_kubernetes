import { Hono } from 'hono';
import path from 'node:path';
import type { FC } from 'hono/jsx';
import { fileURLToPath } from 'node:url';
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetDir = path.join(__dirname, 'assets');
await mkdir(assetDir, { recursive: true });
const imagePath = path.join(assetDir, 'random-image.jpg');

const IMAGE_THRESHHOLD_IN_MS = 10 * 60 * 1000; // 10 minutes
setInterval(async () => {
  await refreshImage(imagePath).catch((error) => {
    console.error('an error occured in reloading image', error.stack);
  });
}, IMAGE_THRESHHOLD_IN_MS);

const app = new Hono();

const Layout: FC = (props) => {
  return (
    <html>
      <body>{props.children}</body>
    </html>
  );
};

const TodoSection: FC<{ todos: string[] }> = (props: { todos: string[] }) => {
  return (
    <>
      <div style={{ marginTop: '10px' }}>
        <input
          type="text"
          name="todo"
          id="todo"
          minlength={2}
          maxlength={140}
          style={{
            display: 'inline-block',
            padding: '2px',
            lineHeight: '1.2rem',
          }}
        />
        <button
          type="submit"
          style={{
            display: 'inline-block',
            padding: '4px',
            marginLeft: '10px',
            cursor: 'pointer',
          }}
        >
          Create todo
        </button>
      </div>

      <div>
        <ul>
          {props.todos.map((todo, index) => {
            return (
              <b>
                <li key={index}>{todo}</li>
              </b>
            );
          })}
        </ul>
      </div>
    </>
  );
};

const Top: FC<{ image: string; todos: string[] }> = (props: {
  image: string;
  todos: string[];
}) => {
  return (
    <Layout>
      <h1>The Project App</h1>
      <img
        src={props.image}
        alt="Dynamic content"
        style={{ maxWidth: '20%' }}
      />
      <TodoSection todos={props.todos} />
      <h2>DevOps with Kubernetes 2026</h2>
    </Layout>
  );
};

const ErrorPage: FC<{ errMsg: string }> = (props: { errMsg: string }) => {
  const { errMsg } = props;
  return (
    <Layout>
      <h1>An error has occurred</h1>
      <code
        style={{
          display: 'block',
          width: '50%',
          wordBreak: 'break-all',
          whiteSpace: 'pre-wrap',
        }}
      >
        {errMsg}
      </code>
    </Layout>
  );
};

app.get('/', async (c) => {
  try {
    if (!existsSync(imagePath)) {
      await saveImageToDisk(imagePath);
    }

    const image = await getImageFromDisk(imagePath);
    return c.html(
      <Top
        image={image}
        todos={[
          'Learn Golang',
          'Master production grade k8s',
          'Build projects',
        ]}
      />
    );
  } catch (error: any) {
    const errMsg = error.stack ?? error.message;
    return c.html(<ErrorPage errMsg={errMsg}></ErrorPage>);
  }
});

export default app;

// Helpers

async function saveImageToDisk(filePath: string) {
  const res = await fetch('https://picsum.photos/1200');
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
