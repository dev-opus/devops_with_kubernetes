import { TodoClient, config } from './utils/index.js';
import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');

async function generateHourlyTodo() {
  const todoClient = new TodoClient();
  const res = await fetch(config.wikipediaUrl, {
    redirect: 'manual',
  });

  const wikipediaUrl = res.headers.get('location')!;
  console.log(`Fetched random Wikipedia article: ${wikipediaUrl}`);

  await todoClient.createTodo(`Read ${new URL(wikipediaUrl).toString()}`);
  console.log('Created todo for reading the article');
}

await generateHourlyTodo().catch((err) => {
  console.error('Error generating hourly todo:', err.stack);
});
