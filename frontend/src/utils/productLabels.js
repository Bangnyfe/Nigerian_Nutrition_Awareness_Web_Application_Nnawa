// Display labels for values stored in the database. These translate stored
// codes into readable text and do not alter or interpret the stored data.

const PROCESSING_LEVEL_LABELS = {
  NOVA_1: 'Group 1 — Unprocessed or minimally processed',
  NOVA_2: 'Group 2 — Processed culinary ingredient',
  NOVA_3: 'Group 3 — Processed food',
  NOVA_4: 'Group 4 — Ultra-processed food'
};

const NUTRITION_BASIS_LABELS = {
  PER_100G: 'Per 100 g',
  PER_100ML: 'Per 100 ml',
  PER_SERVING: 'Per serving'
};


export const NUTRIENT_FIELDS = [
  { key: 'energy_kcal', label: 'Energy', unit: 'kcal' },
  { key: 'total_fat_g', label: 'Total fat', unit: 'g' },
  { key: 'saturated_fat_g', label: 'Saturated fat', unit: 'g' },
  { key: 'trans_fat_g', label: 'Trans fat', unit: 'g' },
  { key: 'carbohydrates_g', label: 'Carbohydrates', unit: 'g' },
  { key: 'total_sugars_g', label: 'Total sugars', unit: 'g' },
  { key: 'fibre_g', label: 'Fibre', unit: 'g' },
  { key: 'protein_g', label: 'Protein', unit: 'g' },
  { key: 'sodium_mg', label: 'Sodium', unit: 'mg' },
  { key: 'salt_g', label: 'Salt', unit: 'g' }
];

export function getProcessingLevelLabel(processingLevel) {
  return PROCESSING_LEVEL_LABELS[processingLevel] || null;
}

export function getNutritionBasisLabel(basis) {
  return NUTRITION_BASIS_LABELS[basis] || null;
}

export function formatServingSize(value, unit) {
  if (value === null || value === undefined || !unit) {
    return null;
  }

  return `${value} ${unit}`;
}
