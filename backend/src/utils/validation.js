const MAX_SEARCH_KEYWORD_LENGTH = 100;

export function validateSearchKeyword(keyword) {
  const errors = [];

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


  return {
    isValid: errors.length === 0,
    errors,
    value
  };
}

export function validateProductId(id) {
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
