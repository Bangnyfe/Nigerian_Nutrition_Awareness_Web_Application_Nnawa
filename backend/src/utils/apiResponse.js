export function successResponse(message, data = null) {
  return {
    success: true,
    message,
    data
  };
}

export function errorResponse(message, errors = []) {
  return {
    success: false,
    message,
    errors
  };
}
