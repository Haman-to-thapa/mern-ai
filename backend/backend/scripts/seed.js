import { query as dbQuery } from '../src/db/db.js';

const BATCH_SIZE = 1000;
const TOTAL = 200000;

const ADJECTIVES = [
  'Amazing', 'Beautiful', 'Classic', 'Deluxe', 'Elegant', 'Fancy',
  'Gorgeous', 'Premium', 'Modern', 'Natural', 'Organic', 'Sleek',
  'Compact', 'Durable', 'Essential', 'Portable', 'Smart', 'Eco',
  'Ultra', 'Pro', 'Mini', 'Max', 'Neo', 'Retro',
];
const NOUNS = [
  'Widget', 'Gadget', 'Device', 'Appliance', 'Tool', 'Instrument',
  'Component', 'Accessory', 'Machine', 'System',
];
const CATEGORIES = [
  'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books',
  'Toys & Games', 'Food & Beverage', 'Beauty', 'Automotive', 'Health',
  'Music', 'Office', 'Pet Supplies', 'Baby', 'Tools', 'Outdoors',
  'Jewelry', 'Art', 'Stationery', 'Furniture',
];

const TOTAL_ADJ = ADJECTIVES.length;
const TOTAL_NOUNS = NOUNS.length;

const BASE_DATE = Date.now() - 365 * 24 * 60 * 60 * 1000;
const TIME_RANGE = 365 * 24 * 60 * 60 * 1000;

function generateProduct(index) {
  const adj = ADJECTIVES[index % TOTAL_ADJ];
  const noun = NOUNS[Math.floor(index / TOTAL_ADJ) % TOTAL_NOUNS];
  const category = CATEGORIES[index % CATEGORIES.length];
  const price = parseFloat((Math.random() * 1000 + 0.01).toFixed(2));
  const created_at = new Date(BASE_DATE + (index / TOTAL) * TIME_RANGE).toISOString();
  const name = `${adj} ${noun} #${index}`;
  return { name, category, price, created_at };
}

function batchInsert(rows) {
  const placeholders = [];
  const values = [];
  let idx = 1;
  for (const row of rows) {
    placeholders.push(`($${idx}, $${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4})`);
    values.push(row.name, row.category, row.price, row.created_at, row.created_at);
    idx += 5;
  }
  const sql = `INSERT INTO products (name, category, price, created_at, updated_at) VALUES ${placeholders.join(', ')}`;
  return dbQuery(sql, values);
}

async function seed() {
  const start = Date.now();
  console.log(`Seeding ${TOTAL.toLocaleString()} products...`);

  await dbQuery('TRUNCATE TABLE products RESTART IDENTITY CASCADE');

  for (let i = 0; i < TOTAL; i += BATCH_SIZE) {
    const batch = [];
    const end = Math.min(i + BATCH_SIZE, TOTAL);
    for (let j = i; j < end; j++) {
      batch.push(generateProduct(j));
    }
    await batchInsert(batch);
    if ((i / BATCH_SIZE) % 10 === 0) {
      console.log(`  ${Math.min(end, TOTAL).toLocaleString()} / ${TOTAL.toLocaleString()}`);
    }
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`Seeded ${TOTAL.toLocaleString()} products in ${elapsed}s`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});
