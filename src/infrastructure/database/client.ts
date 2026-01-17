import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let connectionString = process.env.DATABASE_URL;

if (process.env.NODE_ENV === 'test') {
  if (process.env.DATABASE_URL_TEST) {
    connectionString = process.env.DATABASE_URL_TEST;
  } else if (process.env.ENABLE_POSTGRES_TESTS === 'true') {
    throw new Error('DATABASE_URL_TEST is required when ENABLE_POSTGRES_TESTS is true');
  }
}

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export default pool;
