import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { env } from '../config/env.js';

let database = null;

export function getDatabase() {
  if (database) {
    return database;
  }

  // The database directory is created if it does not exist so the
  // application can start without manual configuration.
  fs.mkdirSync(path.dirname(env.databasePath), { recursive: true });

  database = new Database(env.databasePath);
  database.pragma('foreign_keys = ON');

  return database;
}

export function closeDatabase() {
  if (database) {
    database.close();
    database = null;
  }
}
