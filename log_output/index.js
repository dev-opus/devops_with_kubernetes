import { randomUUID } from 'node:crypto';

start();

function start() {
  setInterval(() => {
    printWithDate(generateString());
  }, 5000);
}

function generateString() {
  return randomUUID();
}

function printWithDate(string) {
  const isoDateString = new Date().toISOString();
  console.log(`${isoDateString}: ${string}`);
}
