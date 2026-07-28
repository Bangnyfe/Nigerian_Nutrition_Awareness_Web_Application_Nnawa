// Command-line setup script: create the single administrator, or rotate the
// existing administrator's password. Run with `npm run create-admin`.

// The administrator is never created through the web interface, and only one
// administrator is ever permitted. The password and its hash are never
// printed.

import fs from 'node:fs';
import bcrypt from 'bcrypt';
import Database from 'better-sqlite3';
import { env, validateEnv } from '../config/env.js';
import { getDatabase } from './connection.js';
import { initDatabase } from './initDatabase.js';
import { normaliseEmail, BCRYPT_COST_FACTOR } from '../services/authService.js';
import { SESSION_TABLE_NAME } from '../config/session.js';

// Removes every stored session so that rotating the password logs the
// administrator out everywhere. Reads the same session database path the
// server uses, so both always point at the same file.
function clearAllSessions() {
  if (!fs.existsSync(env.sessionDbPath)) {
    return;
  }

  const sessionDb = new Database(env.sessionDbPath);
  try {
    // If the session table does not exist yet there is nothing to clear.
    const tableExists = sessionDb
      .prepare(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?;"
      )
      .get(SESSION_TABLE_NAME);

    if (tableExists) {
      sessionDb.prepare(`DELETE FROM ${SESSION_TABLE_NAME};`).run();
    }
  } finally {
    sessionDb.close();
  }
}

function run() {
  validateEnv();

  const email = normaliseEmail(env.adminEmail);
  const password = env.adminPassword;

  if (email.length === 0) {
    console.error('ADMIN_EMAIL must be set before creating an administrator.');
    process.exit(1);
  }

  if (typeof password !== 'string' || password.length < 8) {
    console.error('ADMIN_PASSWORD must be set and at least 8 characters long.');
    process.exit(1);
  }

  // Ensures the schema (including the admins table) exists before writing.
  initDatabase();

  const database = getDatabase();
  const passwordHash = bcrypt.hashSync(password, BCRYPT_COST_FACTOR);

  const existing = database
    .prepare('SELECT id FROM admins WHERE email = ?;')
    .get(email);

  // The single-admin rule: if any administrator already exists, only the
  // matching email may be updated; a different email is rejected.
  const anyAdmin = database
    .prepare('SELECT id, email FROM admins LIMIT 1;')
    .get();

  if (anyAdmin && !existing) {
    console.error(
      'An administrator already exists. Only one administrator is permitted. ' +
        'To rotate the password, run this script with the existing ' +
        'administrator email.'
    );
    process.exit(1);
  }

  if (existing) {
    database
      .prepare('UPDATE admins SET password_hash = ? WHERE id = ?;')
      .run(passwordHash, existing.id);

    clearAllSessions();
    console.log(
      'Administrator password updated. All active sessions have been ' +
        'invalidated; please log in again with the new password.'
    );
  } else {
    database
      .prepare('INSERT INTO admins (email, password_hash) VALUES (?, ?);')
      .run(email, passwordHash);

    console.log('Administrator created successfully.');
  }

  process.exit(0);
}

run();
