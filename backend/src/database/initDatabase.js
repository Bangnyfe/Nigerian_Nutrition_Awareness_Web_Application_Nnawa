import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDatabase } from './connection.js';
import { categories, products } from './seed/seedData.js';

const schemaPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'schema.sql'
);

function createTables(database) {
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  database.exec(schema);
}

function isDatabaseEmpty(database) {
  const { count } = database
    .prepare('SELECT COUNT(*) AS count FROM products;')
    .get();

  return count === 0;
}

function insertSeedData(database) {
  const insertCategory = database.prepare(
    'INSERT INTO categories (name) VALUES (?);'
  );
  const selectCategory = database.prepare(
    'SELECT id FROM categories WHERE name = ?;'
  );
  const insertProduct = database.prepare(
    `INSERT INTO products (product_name, brand, category_id)
     VALUES (?, ?, ?);`
  );

  // Seeding runs as a single transaction so the database is never left
  // partially populated if an insert fails.
  const seed = database.transaction(() => {
    for (const name of categories) {
      insertCategory.run(name);
    }

    for (const product of products) {
      const category = selectCategory.get(product.categoryName);
      insertProduct.run(product.productName, product.brand, category.id);
    }
  });

  seed();
}

export function initDatabase() {
  const database = getDatabase();

  createTables(database);

  if (isDatabaseEmpty(database)) {
    insertSeedData(database);
    console.log('Database seeded with initial product records.');
  }

  console.log('Database connection established.');

  return database;
}
