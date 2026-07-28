import fs from 'node:fs';
import path from 'node:path';
import session from 'express-session';
import Database from 'better-sqlite3';
import betterSqlite3SessionStore from 'better-sqlite3-session-store';
import { env } from './env.js';

const SqliteStore = betterSqlite3SessionStore(session);

const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;

// The session store's table name. Referenced here and by the create-admin
// script when it clears sessions on password rotation, so both stay in sync.
export const SESSION_TABLE_NAME = 'sessions';

export const SESSION_COOKIE_NAME = 'nnawa.sid';

// The session store lives in its own database file so session churn never
// touches the product database. It is built on better-sqlite3, the same
// database library used elsewhere in the application.
export function createSessionMiddleware() {
  const sessionDir = path.dirname(env.sessionDbPath);
  fs.mkdirSync(sessionDir, { recursive: true });

  const sessionDatabase = new Database(env.sessionDbPath);

  const store = new SqliteStore({
    client: sessionDatabase,
    expired: {
      clear: true,
      // Expired rows are purged periodically; the interval is in milliseconds.
      intervalMs: 15 * 60 * 1000
    }
  });

  return session({
    name: SESSION_COOKIE_NAME,
    store,
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    // The 8-hour lifetime is absolute; activity does not extend it.
    rolling: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.isProduction,
      maxAge: EIGHT_HOURS_MS
    }
  });
}
