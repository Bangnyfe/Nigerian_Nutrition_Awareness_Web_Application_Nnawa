CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_name TEXT NOT NULL,
  brand TEXT,
  category_id INTEGER NOT NULL,
  description TEXT,
  processing_level TEXT
    CHECK (processing_level IN ('NOVA_1', 'NOVA_2', 'NOVA_3', 'NOVA_4')),
  health_indicator TEXT
    CHECK (health_indicator IN (
      'HEALTHIER_CHOICE',
      'CONSUME_IN_MODERATION',
      'HIGH_NUTRITIONAL_CONCERN'
    )),
  serving_size_value REAL CHECK (serving_size_value > 0),
  serving_size_unit TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories (id)
);

CREATE TABLE IF NOT EXISTS nutrition_facts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL UNIQUE,
  basis TEXT NOT NULL
    CHECK (basis IN ('PER_100G', 'PER_100ML', 'PER_SERVING')),
  energy_kcal REAL CHECK (energy_kcal >= 0),
  total_fat_g REAL CHECK (total_fat_g >= 0),
  saturated_fat_g REAL CHECK (saturated_fat_g >= 0),
  trans_fat_g REAL CHECK (trans_fat_g >= 0),
  carbohydrates_g REAL CHECK (carbohydrates_g >= 0),
  total_sugars_g REAL CHECK (total_sugars_g >= 0),
  fibre_g REAL CHECK (fibre_g >= 0),
  protein_g REAL CHECK (protein_g >= 0),
  sodium_mg REAL CHECK (sodium_mg >= 0),
  salt_g REAL CHECK (salt_g >= 0),
  FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS nutritional_concerns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT CHECK (severity IN ('LOW', 'MODERATE', 'HIGH')),
  FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_alternatives (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  alternative_name TEXT NOT NULL,
  reason TEXT,
  FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS whole_food_alternatives (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  food_name TEXT NOT NULL,
  description TEXT,
  benefit TEXT,
  FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_products_product_name
  ON products (product_name);
CREATE INDEX IF NOT EXISTS idx_products_category_id
  ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_nutritional_concerns_product_id
  ON nutritional_concerns (product_id);
CREATE INDEX IF NOT EXISTS idx_product_alternatives_product_id
  ON product_alternatives (product_id);
CREATE INDEX IF NOT EXISTS idx_whole_food_alternatives_product_id
  ON whole_food_alternatives (product_id);
