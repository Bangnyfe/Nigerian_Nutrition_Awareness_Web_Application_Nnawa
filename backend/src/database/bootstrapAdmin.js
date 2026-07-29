import { env } from '../config/env.js';
import {
  getAnyAdmin,
  getAdminByEmail,
  createAdmin,
  normaliseEmail
} from '../services/authService.js';

// First-run administrator bootstrap.
//
// On startup, if no administrator exists, create one from ADMIN_EMAIL and
// ADMIN_PASSWORD. If an administrator already exists, do nothing — the
// account is never overwritten and the password is never rotated here.
// Password rotation remains the responsibility of the create-admin script.
export function bootstrapAdmin() {
  const existing = getAnyAdmin();

  if (existing) {
    // An administrator already exists; first-run bootstrap does nothing.
    return;
  }

  const email = normaliseEmail(env.adminEmail);
  const password = env.adminPassword;

  // Missing or invalid credentials are reported without stopping the server,
  // so the public site still runs. The admin can be created by setting the
  // variables and restarting, or by running the create-admin script.
  if (email.length === 0) {
    console.warn(
      'Admin bootstrap skipped: ADMIN_EMAIL is not set. No administrator ' +
        'account was created.'
    );
    return;
  }

  if (typeof password !== 'string' || password.length < 8) {
    console.warn(
      'Admin bootstrap skipped: ADMIN_PASSWORD is not set or is shorter ' +
        'than 8 characters. No administrator account was created.'
    );
    return;
  }

  // Guard against a race between the existence check and the insert (for
  // example, two instances starting at once): the email is unique, so a
  // duplicate insert would throw. Re-check by email and swallow only that case.
  if (getAdminByEmail(email)) {
    return;
  }

  try {
    createAdmin(email, password);
    console.log('Administrator account created on first startup.');
  } catch (error) {
    // A UNIQUE constraint failure means another instance created it first,
    // which is fine. Anything else is re-thrown.
    if (String(error.message).includes('UNIQUE')) {
      return;
    }
    throw error;
  }
}
