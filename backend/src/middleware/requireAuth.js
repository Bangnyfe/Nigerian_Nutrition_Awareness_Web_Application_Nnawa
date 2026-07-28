import { errorResponse } from '../utils/apiResponse.js';

// Guards the product write endpoints. Enforcement is server-side: the
// frontend route guard is a convenience only.
export function requireAuth(request, response, next) {
  if (request.session && request.session.admin) {
    return next();
  }

  response
    .status(401)
    .json(errorResponse('Authentication is required for this action.'));
}
