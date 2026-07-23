import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const backendRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..'
);

// Relative database paths are resolved against the backend root so the
// application behaves the same regardless of the working directory.
const configuredDatabasePath =
  process.env.DATABASE_PATH || './data/nnawa.sqlite';

export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databasePath: path.isAbsolute(configuredDatabasePath)
    ? configuredDatabasePath
    : path.join(backendRoot, configuredDatabasePath)
};

export function validateEnv() {
  if (Number.isNaN(env.port) || env.port <= 0) {
    throw new Error('PORT must be a positive number.');
  }

  if (!env.databasePath) {
    throw new Error('DATABASE_PATH must be defined.');
  }
}
