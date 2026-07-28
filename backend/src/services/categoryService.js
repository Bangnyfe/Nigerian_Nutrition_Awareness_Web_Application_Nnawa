import { getDatabase } from '../database/connection.js';

// Category data access. Categories are created on demand when a product is
// saved with a category name that does not yet exist.
export function getAllCategories() {
  const database = getDatabase();

  return database
    .prepare('SELECT id, name FROM categories ORDER BY name ASC;')
    .all();
}

export function getOrCreateCategoryId(name) {
  const database = getDatabase();

  const existing = database
    .prepare('SELECT id FROM categories WHERE name = ?;')
    .get(name);

  if (existing) {
    return existing.id;
  }

  const result = database
    .prepare('INSERT INTO categories (name) VALUES (?);')
    .run(name);

  return result.lastInsertRowid;
}
