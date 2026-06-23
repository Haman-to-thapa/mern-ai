import pkg from 'pg';
import 'dotenv/config';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      description TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_products_created_at_id
    ON products (created_at DESC, id DESC);
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_products_category_created_at_id
    ON products (category, created_at DESC, id DESC);
  `);
  console.log('Schema initialized');
}

function query(text, params) {
  return pool.query(text, params);
}

export { query, pool, initSchema };
