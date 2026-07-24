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

  if (value.length > MAX_SEARCH_KEYWORD_LENGTH) {
    errors.push(
      `The product name cannot exceed ${MAX_SEARCH_KEYWORD_LENGTH} characters.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    value
  };
}
