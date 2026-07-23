import { errorResponse } from '../utils/apiResponse.js';

export function notFound(request, response) {
  response
    .status(404)
    .json(errorResponse('The requested endpoint was not found.'));
}
