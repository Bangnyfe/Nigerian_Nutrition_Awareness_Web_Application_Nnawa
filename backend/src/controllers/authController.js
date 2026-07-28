import * as authService from '../services/authService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { SESSION_COOKIE_NAME } from '../config/session.js';
import { env } from '../config/env.js';

export async function login(request, response, next) {
  try {
    const { email, password } = request.body || {};

    const admin = await authService.verifyCredentials(email, password);

    // A single generic message avoids revealing whether the email exists.
    if (!admin) {
      return response
        .status(401)
        .json(errorResponse('Invalid email or password.'));
    }

    // The session ID is regenerated before the admin details are stored so a
    // pre-authentication session cannot be reused after login.
    request.session.regenerate((regenerateError) => {
      if (regenerateError) {
        return next(regenerateError);
      }

      request.session.admin = { id: admin.id, email: admin.email };

      request.session.save((saveError) => {
        if (saveError) {
          return next(saveError);
        }

        response.status(200).json(
          successResponse('Logged in successfully.', {
            isAuthenticated: true,
            email: admin.email
          })
        );
      });
    });
  } catch (error) {
    next(error);
  }
}

export function logout(request, response, next) {
  request.session.destroy((destroyError) => {
    if (destroyError) {
      return next(destroyError);
    }

    // Clearing the cookie must use the same options the cookie was set with.
    response.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.isProduction
    });

    response
      .status(200)
      .json(successResponse('Logged out successfully.', null));
  });
}

// Always returns 200; the body reports whether a session is active.
export function me(request, response) {
  if (request.session && request.session.admin) {
    return response.status(200).json(
      successResponse('Authenticated.', {
        isAuthenticated: true,
        email: request.session.admin.email
      })
    );
  }

  response
    .status(200)
    .json(successResponse('Not authenticated.', { isAuthenticated: false }));
}
