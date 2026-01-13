import dotenv from 'dotenv';
import app from './index.js';
import { serve } from '@hono/node-server';
import {
  type Todo,
  config,
  ensureConfigDefined,
  TodoClient,
} from './utils/index.js';

dotenv.config();
ensureConfigDefined(config);

const todoClient = new TodoClient();

app.post('/todos', async (c) => {
  console.log('Received request to create a new todo');
  const formData = await c.req.formData();
  const title = formData.get('todo');

  if (!title) {
    return c.redirect('/title-error', 301);
  }

  await todoClient.createTodo(title as string);
  return c.redirect('/', 301);
});

app.get('/todos', async (c) => {
  console.log('Received request to fetch todos');
  const todos = await todoClient.getTodos();
  return c.json(todos);
});

serve(
  {
    fetch: app.fetch,
    port: +config.port!,
  },
  (info) => {
    console.log(`Server running at http://${info.address}:${info.port}`);
  }
);
