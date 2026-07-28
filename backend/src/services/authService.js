import bcrypt from 'bcrypt';
import { getDatabase } from '../database/connection.js';

export const BCRYPT_COST_FACTOR = 12;

// Email is normalised the same way everywhere it is handled so that
// capitalisation or surrounding spaces never affect matching.
export function normaliseEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

export function getAdminByEmail(email) {
  const database = getDatabase();

  return database
    .prepare('SELECT id, email, password_hash FROM admins WHERE email = ?;')
    .get(email);
}

// Verifies a submitted email and password against the stored admin record.
// Returns the admin (without the hash) on success, or null on any failure.
export async function verifyCredentials(rawEmail, password) {
  const email = normaliseEmail(rawEmail);

  if (
    email.length === 0 ||
    typeof password !== 'string' ||
    password.length === 0
  ) {
    return null;
  }

  const admin = getAdminByEmail(email);

  if (!admin) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(password, admin.password_hash);

  if (!passwordMatches) {
    return null;
  }

  return { id: admin.id, email: admin.email };
}
