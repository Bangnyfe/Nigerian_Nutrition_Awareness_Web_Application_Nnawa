import { getDatabase } from '../database/connection.js';

// All SQL for product data is executed here. No other layer of the
// application communicates with SQLite.

export function getAllProducts() {
  const database = getDatabase();

  return database
    .prepare(
      `SELECT
         products.id,
         products.product_name,
         products.brand,
         products.description,
         products.processing_level,
         products.health_indicator,
         products.health_summary,
         categories.name AS category_name
       FROM products
       INNER JOIN categories ON categories.id = products.category_id
       ORDER BY products.product_name ASC;`
    )
    .all();
}

export function getProductCount() {
  const database = getDatabase();

  const { count } = database
    .prepare('SELECT COUNT(*) AS count FROM products;')
    .get();

  return count;
}
