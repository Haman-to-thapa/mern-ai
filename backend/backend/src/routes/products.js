import { Router } from 'express';
import { query as dbQuery } from '../db/db.js';

const router = Router();

function decodeCursor(cursor) {
  try {
    const str = Buffer.from(cursor, 'base64url').toString('utf8');
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function encodeCursor(created_at, id) {
  return Buffer.from(JSON.stringify([created_at, id])).toString('base64url');
}

router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const category = req.query.category || null;
    const cursor = req.query.cursor || null;

    const cursorParts = cursor ? decodeCursor(cursor) : null;
    const hasCursor = cursorParts && cursorParts.length === 2;

    let query;
    let params;

    if (category) {
      if (hasCursor) {
        query = `
          SELECT * FROM products
          WHERE category = $1
            AND (created_at, id) < ($2::timestamptz, $3)
          ORDER BY created_at DESC, id DESC
          LIMIT $4
        `;
        params = [category, cursorParts[0], cursorParts[1], limit + 1];
      } else {
        query = `
          SELECT * FROM products
          WHERE category = $1
          ORDER BY created_at DESC, id DESC
          LIMIT $2
        `;
        params = [category, limit + 1];
      }
    } else {
      if (hasCursor) {
        query = `
          SELECT * FROM products
          WHERE (created_at, id) < ($1::timestamptz, $2)
          ORDER BY created_at DESC, id DESC
          LIMIT $3
        `;
        params = [cursorParts[0], cursorParts[1], limit + 1];
      } else {
        query = `
          SELECT * FROM products
          ORDER BY created_at DESC, id DESC
          LIMIT $1
        `;
        params = [limit + 1];
      }
    }

    const result = await dbQuery(query, params);
    const rows = result.rows;
    const hasMore = rows.length > limit;

    if (hasMore) {
      rows.pop();
    }

    const data = rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      price: parseFloat(r.price),
      description: r.description,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));

    res.json({
      data,
      nextCursor: hasMore ? encodeCursor(rows[rows.length - 1].created_at, rows[rows.length - 1].id) : null,
      hasMore,
    });
  } catch (err) {
    console.error('Error fetching products', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const result = await dbQuery('SELECT DISTINCT category FROM products ORDER BY category');
    res.json(result.rows.map((r) => r.category));
  } catch (err) {
    console.error('Error fetching categories', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dbQuery('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const r = result.rows[0];
    res.json({
      id: r.id,
      name: r.name,
      category: r.category,
      price: parseFloat(r.price),
      description: r.description,
      created_at: r.created_at,
      updated_at: r.updated_at,
    });
  } catch (err) {
    console.error('Error fetching product', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
