import { createClient } from '@libsql/client';
import SEED from './seed.js';

const PRICES = [
  17500, 19500, 9800, 5200, 2100, 4200, 3300, 29500, 3400, 1900, 3100, 3800, 3500, 1900, 1200, 450,
  250, 450, 25, 20, 350, 35, 5, 85, 3, 90, 350, 45, 120, 60, 25, 30, 1500, 2200, 1300, 9500, 1800, 280, 90, 85, 15, 10
];

function getClient() {
  const url = process.env.TURSO_DATABASE_URL || 'file:data.db';
  const authToken = process.env.TURSO_AUTH_TOKEN;
  return createClient({ url, authToken });
}

const client = globalThis._libsqlClient || (globalThis._libsqlClient = getClient());

let initPromise = null;
export async function ensureDb() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    await client.execute(`CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY,
      name TEXT,
      icon TEXT,
      blurb TEXT
    )`);
    await client.execute(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT,
      brand TEXT,
      part_no TEXT,
      category_id INTEGER,
      price INTEGER DEFAULT 0,
      availability TEXT DEFAULT 'In Stock',
      specs TEXT DEFAULT '{}'
    )`);
    await client.execute(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY,
      user_id TEXT,
      email TEXT,
      items TEXT,
      amount INTEGER,
      status TEXT DEFAULT 'Pending',
      rp_order TEXT,
      rp_payment TEXT,
      created TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
    await client.execute(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY,
      name TEXT,
      email TEXT,
      phone TEXT,
      message TEXT,
      created TEXT DEFAULT CURRENT_TIMESTAMP
    )`);

    const check = await client.execute('SELECT 1 FROM categories LIMIT 1');
    if (!check.rows || check.rows.length === 0) {
      let n = 0;
      for (const [c, i, b, items] of SEED) {
        const catRes = await client.execute({
          sql: 'INSERT INTO categories (name, icon, blurb) VALUES (?, ?, ?)',
          args: [c, i, b]
        });
        const catId = Number(catRes.lastInsertRowid);
        for (let k = 0; k < items.length; k++) {
          const s = items[k];
          const [a, br, pn, sp] = s.split('|');
          const specsObj = Object.fromEntries(sp.split(';').map(x => x.split(':')));
          await client.execute({
            sql: 'INSERT INTO products (name, brand, part_no, category_id, price, availability, specs) VALUES (?, ?, ?, ?, ?, ?, ?)',
            args: [
              a,
              br,
              pn,
              catId,
              PRICES[n++] || 100,
              k % 6 === 5 ? 'Limited' : 'In Stock',
              JSON.stringify(specsObj)
            ]
          });
        }
      }
    }
  })();
  return initPromise;
}

const db = {
  client,
  async all(sql, args = []) {
    await ensureDb();
    const res = await client.execute({ sql, args });
    return res.rows;
  },
  async get(sql, args = []) {
    await ensureDb();
    const res = await client.execute({ sql, args });
    return res.rows[0] || null;
  },
  async run(sql, args = []) {
    await ensureDb();
    const res = await client.execute({ sql, args });
    return {
      lastInsertRowid: res.lastInsertRowid != null ? Number(res.lastInsertRowid) : undefined,
      rowsAffected: res.rowsAffected
    };
  },
  async execute(sql, args = []) {
    await ensureDb();
    return client.execute({ sql, args });
  }
};

export default db;
