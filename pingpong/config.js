import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    superUser: process.env.DB_SUPER_USER,
    superPassword: process.env.DB_SUPER_PASSWORD,
  },
};
