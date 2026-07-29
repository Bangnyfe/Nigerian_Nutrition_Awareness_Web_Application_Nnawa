import app from './app.js';
import { env, validateEnv } from './config/env.js';
import { initDatabase } from './database/initDatabase.js';
import { bootstrapAdmin } from './database/bootstrapAdmin.js';

function startServer() {
  try {
    validateEnv();
    initDatabase();

    // First-run only: creates the administrator if none exists yet.
    bootstrapAdmin();

    app.listen(env.port, () => {
      console.log(
        `Nnawa backend running on port ${env.port} (${env.nodeEnv}).`
      );
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}
startServer();
