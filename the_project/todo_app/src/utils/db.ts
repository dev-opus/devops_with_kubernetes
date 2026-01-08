import PG from 'pg';
import { config } from './config.js';
import type { Todo } from './types.js';

const { db } = config;

class DatabaseClient {
  private pool: PG.Pool;

  constructor() {
    this.pool = new PG.Pool({
      host: db.host!,
      port: +db.port!,
      user: db.user!,
      password: db.password!,
      database: db.name!,
    });
  }

  protected async query<T>(query: string, params?: any[]): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }
}

export class TodoClient extends DatabaseClient {
  async createTodo(title: string): Promise<Todo> {
    console.log('creating todo...');
    const query = 'INSERT INTO todos (title) VALUES ($1) RETURNING *';
    const params = [title];
    const rows = await this.query<Todo>(query, params);
    return rows[0];
  }

  async getTodos(): Promise<Todo[]> {
    console.log('getting todos...');
    const query = 'SELECT * FROM todos';
    return this.query<Todo>(query);
  }

  async updateTodo(id: number, title: string): Promise<Todo[]> {
    console.log('updating todo...');
    const query = 'UPDATE todos SET title = $1 WHERE id = $2 RETURNING *';
    const params = [title, id];
    return this.query<Todo>(query, params);
  }

  async deleteTodo(id: number): Promise<void> {
    console.log('deleting todo...');
    const query = 'DELETE FROM todos WHERE id = $1';
    const params = [id];
    await this.query<void>(query, params);
  }
}
