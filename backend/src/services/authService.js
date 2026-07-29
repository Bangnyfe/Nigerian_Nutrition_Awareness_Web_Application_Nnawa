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

// Returns the first administrator, or undefined when none exists. Used to
// enforce the single-admin rule and to decide whether bootstrapping is needed.
export function getAnyAdmin() {
  const database = getDatabase();

  return database.prepare('SELECT id, email FROM admins LIMIT 1;').get();
}

// Creates an administrator row from an already-normalised email and a
// plaintext password. Callers are responsible for validation and for enforcing the single-admin
// rule before calling this.
export function createAdmin(email, password) {
  const database = getDatabase();
  const passwordHash = bcrypt.hashSync(password, BCRYPT_COST_FACTOR);

  database
    .prepare('INSERT INTO admins (email, password_hash) VALUES (?, ?);')
    .run(email, passwordHash);
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
