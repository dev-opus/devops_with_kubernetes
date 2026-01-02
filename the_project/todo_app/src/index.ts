import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT ?? 3000;

const app = new Hono();

app.get('/', (c) => {
  return c.text(`Server started in port ${port}`);
});

serve(
  {
    fetch: app.fetch,
    port: port as number,
  },
  (info) => {
    console.log(`Server started in port ${port}`);
  }
);
