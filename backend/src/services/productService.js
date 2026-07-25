import { getDatabase } from '../database/connection.js';

// All SQL for product data is executed here. No other layer of the application communicates with SQLite.

const PRODUCT_SELECT = `
  SELECT
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
`;

export function getAllProducts() {
  const database = getDatabase();

  return database
    .prepare(`${PRODUCT_SELECT} ORDER BY products.product_name ASC;`)
    .all();
}

export function searchProductsByName(keyword) {
  const database = getDatabase();

  // The wildcard characters used by LIKE are escaped so that a keyword containing % or _ is matched as ordinary text rather than as a pattern.
  const escapedKeyword = keyword.replace(/[\\%_]/g, '\\$&');
  const pattern = `%${escapedKeyword}%`;

  return database
    .prepare(
      `${PRODUCT_SELECT}
       WHERE products.product_name LIKE ? ESCAPE '\\'
       ORDER BY products.product_name ASC;`
    )
    .all(pattern);
}

export function getProductById(productId) {
  const database = getDatabase();

  const product = database
    .prepare(
      `SELECT
         products.id,
         products.product_name,
         products.brand,
         products.description,
         products.processing_level,
         products.health_indicator,
         products.health_summary,
         products.serving_size_value,
         products.serving_size_unit,
         categories.name AS category_name
       FROM products
       INNER JOIN categories ON categories.id = products.category_id
       WHERE products.id = ?;`
    )
    .get(productId);

  if (!product) {
    return null;
  }

  // Nutrition facts are optional. A product without an approved set of
  // values returns null rather than an object of empty fields.
  const nutritionFacts = database
    .prepare(
      `SELECT
         basis,
         energy_kcal,
         total_fat_g,
         saturated_fat_g,
         trans_fat_g,
         carbohydrates_g,
         total_sugars_g,
         fibre_g,
         protein_g,
         sodium_mg,
         salt_g
       FROM nutrition_facts
       WHERE product_id = ?;`
    )
    .get(productId);

  return {
    ...product,
    nutrition_facts: nutritionFacts || null
  };
}

export function getProductCount() {
  const database = getDatabase();

  const { count } = database
    .prepare('SELECT COUNT(*) AS count FROM products;')
    .get();

  return count;
}
