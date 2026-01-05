import app from './index.js';
import dotenv from 'dotenv';
import { serve } from '@hono/node-server';

dotenv.config();

const port = process.env.PORT ?? 3000;

serve(
  {
    fetch: app.fetch,
    port: port as number,
  },
  (info) => {
    console.log(`Server running at http://${info.address}:${info.port}`);
  }
);
