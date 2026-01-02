import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  const string = generateString();
  res.end(prefixWithDate(generateString()) + '\n');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});

// start();

// function start() {
//   setInterval(() => {
//     printWithDate(generateString());
//   }, 5000);
// }

function generateString() {
  return randomUUID();
}

// function printWithDate(string) {
//   const isoDateString = new Date().toISOString();
//   console.log(`${isoDateString}: ${string}`);
// }

function prefixWithDate(string) {
  const isoDateString = new Date().toISOString();
  return `${isoDateString}: ${string}`;
}
