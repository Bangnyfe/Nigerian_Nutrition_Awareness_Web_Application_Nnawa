const MAX_SEARCH_KEYWORD_LENGTH = 100;

const PROCESSING_LEVELS = ['NOVA_1', 'NOVA_2', 'NOVA_3', 'NOVA_4'];
const HEALTH_INDICATORS = [
  'HEALTHIER_CHOICE',
  'CONSUME_IN_MODERATION',
  'HIGH_NUTRITIONAL_CONCERN'
];
const NUTRITION_BASES = ['PER_100G', 'PER_100ML', 'PER_SERVING'];
const SEVERITIES = ['LOW', 'MODERATE', 'HIGH'];
const NUTRITION_FIELDS = [
  'energy_kcal',
  'total_fat_g',
  'saturated_fat_g',
  'trans_fat_g',
  'carbohydrates_g',
  'total_sugars_g',
  'fibre_g',
  'protein_g',
  'sodium_mg',
  'salt_g'
];

export function validateSearchKeyword(keyword) {
  const errors = [];

  // Express returns an array when a query parameter is supplied more than
  // once, so the type is checked before the value is trimmed.
  if (typeof keyword !== 'string') {
    return {
      isValid: false,
      errors: ['The search keyword must be provided as text.'],
      value: ''
    };
  }

  const value = keyword.trim();

  if (value.length === 0) {
    errors.push('The search keyword cannot be empty.');
  }

  if (value.length > MAX_SEARCH_KEYWORD_LENGTH) {
    errors.push(
      `The search keyword cannot exceed ${MAX_SEARCH_KEYWORD_LENGTH} characters.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    value
  };
}

export function validateProductId(id) {
  // Route parameters always arrive as text, so the value is checked against
  // a whole-number pattern before being converted.
  const isWholeNumber = typeof id === 'string' && /^\d+$/.test(id);
  const value = isWholeNumber ? Number(id) : null;

  if (!isWholeNumber || value < 1) {
    return {
      isValid: false,
      errors: ['The product identifier must be a positive whole number.'],
      value: null
    };
  }

  return {
    isValid: true,
    errors: [],
    value
  };
}

// --- Product payload validation -----------------------------------------

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Returns a trimmed string, or null when the value is absent or blank.
function optionalString(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

// Accepts numbers, numeric strings, blank values (treated as absent) and
// reports anything else as invalid.
function optionalNumber(value) {
  if (value === undefined || value === null || value === '') {
    return { ok: true, value: null };
  }

  const number = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(number)) {
    return { ok: false, value: null };
  }

  return { ok: true, value: number };
}

function validateNutritionFacts(raw, errors) {
  if (raw === undefined || raw === null) {
    return null;
  }

  if (!isPlainObject(raw)) {
    errors.push('Nutrition facts must be provided as an object.');
    return null;
  }

  const basis = optionalString(raw.basis);
  const values = {};
  let hasAnyValue = false;

  for (const field of NUTRITION_FIELDS) {
    const result = optionalNumber(raw[field]);

    if (!result.ok) {
      errors.push(`The nutrition value "${field}" must be a number.`);
      values[field] = null;
      continue;
    }

    if (result.value !== null && result.value < 0) {
      errors.push(`The nutrition value "${field}" cannot be negative.`);
    }

    values[field] = result.value;

    if (result.value !== null) {
      hasAnyValue = true;
    }
  }

  // A basis is what the numbers are measured against, so values without one
  // cannot be stored. No basis and no values simply means "no nutrition
  // facts recorded".
  if (!basis) {
    if (hasAnyValue) {
      errors.push(
        'A nutrition basis is required when nutrition values are provided.'
      );
    }
    return null;
  }

  if (!NUTRITION_BASES.includes(basis)) {
    errors.push('The nutrition basis is invalid.');
    return null;
  }

  return { basis, ...values };
}

function validateListItems(raw, label, buildItem, errors) {
  if (raw === undefined || raw === null) {
    return [];
  }

  if (!Array.isArray(raw)) {
    errors.push(`${label} must be provided as a list.`);
    return [];
  }

  const items = [];

  raw.forEach((entry, index) => {
    if (!isPlainObject(entry)) {
      errors.push(`${label} item ${index + 1} is invalid.`);
      return;
    }

    const item = buildItem(entry, index, errors);

    if (item) {
      items.push(item);
    }
  });

  return items;
}

export function validateProductPayload(payload) {
  const errors = [];

  if (!isPlainObject(payload)) {
    return {
      isValid: false,
      errors: ['The product data must be provided as an object.'],
      value: null
    };
  }

  const productName =
    typeof payload.product_name === 'string' ? payload.product_name.trim() : '';
  if (productName.length === 0) {
    errors.push('Product name is required.');
  } else if (productName.length > 200) {
    errors.push('Product name cannot exceed 200 characters.');
  }

  const categoryName =
    typeof payload.category_name === 'string'
      ? payload.category_name.trim()
      : '';
  if (categoryName.length === 0) {
    errors.push('Category is required.');
  } else if (categoryName.length > 100) {
    errors.push('Category cannot exceed 100 characters.');
  }

  const brand = optionalString(payload.brand);
  if (brand && brand.length > 200) {
    errors.push('Brand cannot exceed 200 characters.');
  }

  const description = optionalString(payload.description);
  if (description && description.length > 2000) {
    errors.push('Description cannot exceed 2000 characters.');
  }

  let processingLevel = optionalString(payload.processing_level);
  if (processingLevel && !PROCESSING_LEVELS.includes(processingLevel)) {
    errors.push('Processing level is invalid.');
    processingLevel = null;
  }

  let healthIndicator = optionalString(payload.health_indicator);
  if (healthIndicator && !HEALTH_INDICATORS.includes(healthIndicator)) {
    errors.push('Health indicator is invalid.');
    healthIndicator = null;
  }

  const servingResult = optionalNumber(payload.serving_size_value);
  let servingSizeValue = null;
  const servingSizeUnit = optionalString(payload.serving_size_unit);

  if (!servingResult.ok) {
    errors.push('Serving size value must be a number.');
  } else {
    servingSizeValue = servingResult.value;

    if (servingSizeValue !== null && servingSizeValue <= 0) {
      errors.push('Serving size value must be greater than zero.');
    }

    // Serving size is stored as a value/unit pair so a number is never shown
    // without its unit. Either both are provided or neither is.
    if (servingSizeValue !== null && servingSizeUnit === null) {
      errors.push('A serving size unit is required when a value is provided.');
    }

    if (servingSizeUnit !== null && servingSizeValue === null) {
      errors.push('A serving size value is required when a unit is provided.');
    }
  }

  const nutritionFacts = validateNutritionFacts(payload.nutrition_facts, errors);

  const nutritionalConcerns = validateListItems(
    payload.nutritional_concerns,
    'Nutritional concerns',
    (entry, index, itemErrors) => {
      const title = typeof entry.title === 'string' ? entry.title.trim() : '';
      if (title.length === 0) {
        itemErrors.push(`Concern ${index + 1} requires a title.`);
        return null;
      }
      if (title.length > 200) {
        itemErrors.push(`Concern ${index + 1} title cannot exceed 200 characters.`);
      }

      let severity = optionalString(entry.severity);
      if (severity && !SEVERITIES.includes(severity)) {
        itemErrors.push(`Concern ${index + 1} severity is invalid.`);
        severity = null;
      }

      return {
        title,
        description: optionalString(entry.description),
        severity
      };
    },
    errors
  );

  const productAlternatives = validateListItems(
    payload.product_alternatives,
    'Healthier processed alternatives',
    (entry, index, itemErrors) => {
      const name =
        typeof entry.alternative_name === 'string'
          ? entry.alternative_name.trim()
          : '';
      if (name.length === 0) {
        itemErrors.push(`Processed alternative ${index + 1} requires a name.`);
        return null;
      }
      if (name.length > 200) {
        itemErrors.push(
          `Processed alternative ${index + 1} name cannot exceed 200 characters.`
        );
      }

      return {
        alternative_name: name,
        reason: optionalString(entry.reason)
      };
    },
    errors
  );

  const wholeFoodAlternatives = validateListItems(
    payload.whole_food_alternatives,
    'Whole food alternatives',
    (entry, index, itemErrors) => {
      const name =
        typeof entry.food_name === 'string' ? entry.food_name.trim() : '';
      if (name.length === 0) {
        itemErrors.push(`Whole food alternative ${index + 1} requires a name.`);
        return null;
      }
      if (name.length > 200) {
        itemErrors.push(
          `Whole food alternative ${index + 1} name cannot exceed 200 characters.`
        );
      }

      return {
        food_name: name,
        description: optionalString(entry.description),
        benefit: optionalString(entry.benefit)
      };
    },
    errors
  );

  if (errors.length > 0) {
    return { isValid: false, errors, value: null };
  }

  return {
    isValid: true,
    errors: [],
    value: {
      product_name: productName,
      brand,
      category_name: categoryName,
      description,
      processing_level: processingLevel,
      health_indicator: healthIndicator,
      serving_size_value: servingSizeValue,
      serving_size_unit: servingSizeUnit,
      nutrition_facts: nutritionFacts,
      nutritional_concerns: nutritionalConcerns,
      product_alternatives: productAlternatives,
      whole_food_alternatives: wholeFoodAlternatives
    }
  };
}
