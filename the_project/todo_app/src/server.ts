import dotenv from 'dotenv';
import app from './index.js';
import { serve } from '@hono/node-server';
import type { Todo } from './utils/types.js';

dotenv.config();

const port = process.env.PORT ?? 3000;
export const todos: Todo[] = [
  {
    id: 1,
    title: 'Learn Golang',
  },
  {
    id: 2,
    title: 'Master production grade k8s',
  },
  {
    id: 3,
    title: 'Build projects',
  },
  {
    id: 4,
    title: 'Get a job!!',
  },
];

app.post('/todos', async (c) => {
  const formData = await c.req.formData();
  const title = formData.get('todo');

  if (!title) {
    return c.redirect('/title-error', 301);
  }

  const todo: Todo = {
    id: todos.length + 1,
    title: title as string,
  };

  todos.push(todo);
  return c.redirect('/', 301);
});

serve(
  {
    fetch: app.fetch,
    port: port as number,
  },
  (info) => {
    console.log(`Server running at http://${info.address}:${info.port}`);
  }
);
