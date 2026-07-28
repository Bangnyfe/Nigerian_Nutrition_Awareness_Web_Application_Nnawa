import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const backendRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..'
);

function resolvePath(configuredPath, fallback) {
  const value = configuredPath || fallback;
  return path.isAbsolute(value) ? value : path.join(backendRoot, value);
}

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

// A fixed development fallback keeps first-run setup simple. In production a
// real secret is mandatory and its absence stops the application.
const DEV_SESSION_SECRET = 'nnawa-development-session-secret';
let sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  if (isProduction) {
    // Left null so validateEnv can fail with a clear message.
    sessionSecret = null;
  } else {
    sessionSecret = DEV_SESSION_SECRET;
    console.warn(
      'WARNING: SESSION_SECRET is not set. Using an insecure development ' +
        'fallback. Set SESSION_SECRET before deploying to production.'
    );
  }
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv,
  isProduction,
  databasePath: resolvePath(process.env.DATABASE_PATH, './data/nnawa.sqlite'),
  sessionDbPath: resolvePath(
    process.env.SESSION_DB_PATH,
    './data/sessions.sqlite'
  ),
  sessionSecret,
  // Read only by the create-admin script.
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPassword: process.env.ADMIN_PASSWORD || ''
};

export function validateEnv() {
  if (Number.isNaN(env.port) || env.port <= 0) {
    throw new Error('PORT must be a positive number.');
  }

  if (!env.databasePath) {
    throw new Error('DATABASE_PATH must be defined.');
  }

  if (env.isProduction && !env.sessionSecret) {
    throw new Error('SESSION_SECRET must be set in production.');
  }
}
