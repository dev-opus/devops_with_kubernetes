FROM node:lts-alpine3.23 AS logger
WORKDIR /app
COPY . .
CMD [ "npm", "start" ]

FROM node:lts-alpine3.23 AS server
WORKDIR /app
COPY . .
RUN npm install --omit=dev
CMD [ "npm", "run", "start:server" ]