import { errorResponse } from '../utils/apiResponse.js';

// eslint-disable-next-line no-unused-vars
export function errorHandler(error, request, response, next) {
  console.error('Unexpected error:', error.message);

  // Internal details such as stack traces and SQL statements are never
  // returned to the client.
  response
    .status(500)
    .json(errorResponse('An unexpected error occurred. Error 500'));
}
