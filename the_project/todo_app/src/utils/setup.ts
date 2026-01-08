import PG from 'pg';
import { config, ensureConfigDefined } from './config.js';

ensureConfigDefined(config.db);
const { db } = config;

async function setup() {
  const client = new PG.Client({
    host: db.host!,
    port: +db.port!,
    user: db.superUser,
    password: db.superPassword!,
    database: 'postgres',
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
  } catch (e: any) {
    console.error('Database setup error', e.stack);
  } finally {
    await client.end();
  }
}

async function grantPermissions() {
  const client = new PG.Client({
    host: db.host!,
    port: +db.port!,
    database: db.name!,
    user: db.superUser!,
    password: db.superPassword!,
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
  } catch (e: any) {
    console.error('An error occurred while granting permissions:', e.stack);
  } finally {
    await client.end();
  }
}

async function createTables() {
  const client = new PG.Client({
    host: db.host!,
    port: +db.port!,
    database: db.name!,
    user: db.user!,
    password: db.password!,
  });

  try {
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL
      );
    `);

    console.log('Tables created successfully.');
  } catch (e: any) {
    console.error('Error creating tables:', e.stack);
  } finally {
    await client.end();
  }
}

await setup();
await grantPermissions();
await createTables();
