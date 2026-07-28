import fs from 'node:fs';
import path from 'node:path';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { env } from './env.js';

const SqliteStore = connectSqlite3(session);

const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;

export const SESSION_COOKIE_NAME = 'nnawa.sid';

// The session store lives in its own database file so session churn never
// touches the product database.
export function createSessionMiddleware() {
  const sessionDir = path.dirname(env.sessionDbPath);
  fs.mkdirSync(sessionDir, { recursive: true });

  const store = new SqliteStore({
    dir: sessionDir,
    db: path.basename(env.sessionDbPath)
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
