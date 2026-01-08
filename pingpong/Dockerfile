FROM node:lts-alpine3.23
WORKDIR /app
COPY . .
RUN npm ci --omit=dev
CMD [ "sh", "-c", "npm run db:setup && npm start" ]