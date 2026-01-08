import pg from 'pg';
import dotenv from 'dotenv';
import { config } from './config.js';

dotenv.config();
const { Pool } = pg;
const { db } = config;

class DatabaseClient {
  #pool;
  constructor() {
    this.#pool = new Pool({
      host: db.host,
      port: db.port,
      database: db.name,
      user: db.user,
      password: db.password,
    });
  }

  async query(query, params) {
    const client = await this.#pool.connect();
    try {
      const result = await client.query(query, params);
      return result;
    } finally {
      client.release();
    }
  }
}

export class PingPong {
  #client;

  constructor() {
    this.#client = new DatabaseClient();
  }

  /**
   * @returns {Promise<{id: number, pongs: number}|null>}
   */
  async get() {
    console.log('getting pongs...');
    const { rows } = await this.#client.query('SELECT * FROM pongs');
    /** @type {{id: number, pongs: number, created_at: string, updated_at:string}} */
    const result = rows[0];
    return result;
  }

  async set(pong) {
    console.log('setting pongs...');
    const { rows } = await this.#client.query(
      `
      INSERT INTO pongs (id, pongs)
      VALUES (1, $1)
      ON conflict (id)
      DO Update SET 
        pongs = EXCLUDED.pongs
      RETURNING *
      `,
      [pong]
    );
    return rows[0];
  }
}
