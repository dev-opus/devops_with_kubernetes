import pg from 'pg';
import dotenv from 'dotenv';
import { config } from './config.js';

dotenv.config();
const { db } = config;
const { Client } = pg;

async function setup() {
  const client = new Client({
    host: db.host,
    port: db.port,
    database: 'postgres',
    user: db.superUser,
    password: db.superPassword,
  });

  try {
    await client.connect();

    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_user WHERE usename = '${db.user}') THEN
          CREATE USER ${db.user} WITH PASSWORD '${db.password}';
        END IF;
      END
      $$;
    `);

    const dbCheck = await client.query(`
      SELECT 1 FROM pg_database WHERE datname = '${db.name}'
    `);

    if (dbCheck.rowCount === 0) {
      await client.query(`CREATE DATABASE ${db.name} OWNER ${db.user}`);
    }

    console.log('Database setup completed successfully.');
  } catch (error) {
    console.error(
      'An error occurred while setting up the database:',
      error.stack
    );
  } finally {
    await client.end();
  }
}

async function grantPermissions() {
  const client = new Client({
    host: db.host,
    port: db.port,
    database: db.name,
    user: db.superUser,
    password: db.superPassword,
  });

  try {
    await client.connect();

    // Grant schema permissions (needed for PostgreSQL 15+)
    await client.query(`
      GRANT ALL ON SCHEMA public TO ${db.user};
    `);

    await client.query(`
      GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${db.user};
    `);

    await client.query(`
      GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${db.user};
    `);
    console.log('Permissions granted successfully.');
  } catch (error) {
    console.error('An error occurred while granting permissions:', error.stack);
  } finally {
    await client.end();
  }
}

async function createTable() {
  const client = new Client({
    host: db.host,
    port: db.port,
    database: db.name,
    user: db.user,
    password: db.password,
  });

  try {
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS pongs (
        id SERIAL PRIMARY KEY,
        pongs INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // await client.query(`
    //   ALTER TABLE pongs ADD CONSTRAINT pongs_single_row CHECK (id = 1);
    // `);

    console.log('Tables created successfully.');
  } catch (error) {
    console.error('An error occurred while creating tables:', error.stack);
  } finally {
    await client.end();
  }
}

await setup();
await grantPermissions();
await createTable();
