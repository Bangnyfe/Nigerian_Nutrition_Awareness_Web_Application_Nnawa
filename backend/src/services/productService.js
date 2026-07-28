import { getDatabase } from '../database/connection.js';
import { getOrCreateCategoryId } from './categoryService.js';

// All SQL for product data is executed here. No other layer of the application communicates with SQLite.
const PRODUCT_SELECT = `
  SELECT
    products.id,
    products.product_name,
    products.brand,
    products.description,
    products.processing_level,
    products.health_indicator,
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

  // The wildcard characters used by LIKE are escaped so that a keyword
  // containing % or _ is matched as ordinary text rather than as a pattern.
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

  const nutritionFacts = database
    .prepare(
      `SELECT
         basis, energy_kcal, total_fat_g, saturated_fat_g, trans_fat_g,
         carbohydrates_g, total_sugars_g, fibre_g, protein_g, sodium_mg, salt_g
       FROM nutrition_facts
       WHERE product_id = ?;`
    )
    .get(productId);

  const nutritionalConcerns = database
    .prepare(
      `SELECT id, title, description, severity
       FROM nutritional_concerns
       WHERE product_id = ?
       ORDER BY id ASC;`
    )
    .all(productId);

  const productAlternatives = database
    .prepare(
      `SELECT id, alternative_name, reason
       FROM product_alternatives
       WHERE product_id = ?
       ORDER BY id ASC;`
    )
    .all(productId);

  const wholeFoodAlternatives = database
    .prepare(
      `SELECT id, food_name, description, benefit
       FROM whole_food_alternatives
       WHERE product_id = ?
       ORDER BY id ASC;`
    )
    .all(productId);

  return {
    ...product,
    nutrition_facts: nutritionFacts || null,
    nutritional_concerns: nutritionalConcerns,
    product_alternatives: productAlternatives,
    whole_food_alternatives: wholeFoodAlternatives
  };
}

export function getProductCount() {
  const database = getDatabase();

  const { count } = database
    .prepare('SELECT COUNT(*) AS count FROM products;')
    .get();

  return count;
}

// --- Write operations ---------------------------------------------------
// The related records (nutrition facts, concerns and alternatives) are
// written together with the product inside a single transaction so the
// database is never left in a partially updated state.

function insertRelatedRecords(database, productId, product) {
  if (product.nutrition_facts) {
    const facts = product.nutrition_facts;
    database
      .prepare(
        `INSERT INTO nutrition_facts (
           product_id, basis, energy_kcal, total_fat_g, saturated_fat_g,
           trans_fat_g, carbohydrates_g, total_sugars_g, fibre_g, protein_g,
           sodium_mg, salt_g
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
      )
      .run(
        productId,
        facts.basis,
        facts.energy_kcal ?? null,
        facts.total_fat_g ?? null,
        facts.saturated_fat_g ?? null,
        facts.trans_fat_g ?? null,
        facts.carbohydrates_g ?? null,
        facts.total_sugars_g ?? null,
        facts.fibre_g ?? null,
        facts.protein_g ?? null,
        facts.sodium_mg ?? null,
        facts.salt_g ?? null
      );
  }

  const insertConcern = database.prepare(
    `INSERT INTO nutritional_concerns (product_id, title, description, severity)
     VALUES (?, ?, ?, ?);`
  );
  for (const concern of product.nutritional_concerns) {
    insertConcern.run(
      productId,
      concern.title,
      concern.description ?? null,
      concern.severity ?? null
    );
  }

  const insertProductAlternative = database.prepare(
    `INSERT INTO product_alternatives (product_id, alternative_name, reason)
     VALUES (?, ?, ?);`
  );
  for (const alternative of product.product_alternatives) {
    insertProductAlternative.run(
      productId,
      alternative.alternative_name,
      alternative.reason ?? null
    );
  }

  const insertWholeFood = database.prepare(
    `INSERT INTO whole_food_alternatives (product_id, food_name, description, benefit)
     VALUES (?, ?, ?, ?);`
  );
  for (const alternative of product.whole_food_alternatives) {
    insertWholeFood.run(
      productId,
      alternative.food_name,
      alternative.description ?? null,
      alternative.benefit ?? null
    );
  }
}

function deleteRelatedRecords(database, productId) {
  database
    .prepare('DELETE FROM nutrition_facts WHERE product_id = ?;')
    .run(productId);
  database
    .prepare('DELETE FROM nutritional_concerns WHERE product_id = ?;')
    .run(productId);
  database
    .prepare('DELETE FROM product_alternatives WHERE product_id = ?;')
    .run(productId);
  database
    .prepare('DELETE FROM whole_food_alternatives WHERE product_id = ?;')
    .run(productId);
}

export function createProduct(product) {
  const database = getDatabase();

  const create = database.transaction(() => {
    const categoryId = getOrCreateCategoryId(product.category_name);

    const result = database
      .prepare(
        `INSERT INTO products (
           product_name, brand, category_id, description, processing_level,
           health_indicator, serving_size_value, serving_size_unit
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
      )
      .run(
        product.product_name,
        product.brand ?? null,
        categoryId,
        product.description ?? null,
        product.processing_level ?? null,
        product.health_indicator ?? null,
        product.serving_size_value ?? null,
        product.serving_size_unit ?? null
      );

    const productId = result.lastInsertRowid;
    insertRelatedRecords(database, productId, product);
    return productId;
  });

  const newProductId = create();
  return getProductById(newProductId);
}

export function updateProduct(productId, product) {
  const database = getDatabase();

  const existing = database
    .prepare('SELECT id FROM products WHERE id = ?;')
    .get(productId);

  if (!existing) {
    return null;
  }

  const update = database.transaction(() => {
    const categoryId = getOrCreateCategoryId(product.category_name);

    database
      .prepare(
        `UPDATE products SET
           product_name = ?, brand = ?, category_id = ?, description = ?,
           processing_level = ?, health_indicator = ?, serving_size_value = ?,
           serving_size_unit = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?;`
      )
      .run(
        product.product_name,
        product.brand ?? null,
        categoryId,
        product.description ?? null,
        product.processing_level ?? null,
        product.health_indicator ?? null,
        product.serving_size_value ?? null,
        product.serving_size_unit ?? null,
        productId
      );

    // The related records are replaced rather than individually reconciled.
    deleteRelatedRecords(database, productId);
    insertRelatedRecords(database, productId, product);
  });

  update();
  return getProductById(productId);
}

export function deleteProduct(productId) {
  const database = getDatabase();

  // Related records are removed automatically by the ON DELETE CASCADE
  // constraints defined in the schema.
  const result = database
    .prepare('DELETE FROM products WHERE id = ?;')
    .run(productId);

  return result.changes > 0;
}
