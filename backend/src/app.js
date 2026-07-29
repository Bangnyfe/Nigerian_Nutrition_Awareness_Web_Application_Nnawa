import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { createSessionMiddleware } from './config/session.js';
import { env } from './config/env.js';

const app = express();

// Behind a deployment proxy the app must trust the proxy so that secure
// cookies and the rate limiter see the real client protocol and IP. This is
// only enabled in production, where such a proxy is expected.
if (env.isProduction) {
  app.set('trust proxy', 1);
}

// In development the frontend runs on its own Vite server and reaches the API
// through a proxy, so cross-origin handling is only needed there. In the
// single-service production deploy the frontend is served by this app, so no
// CORS is required.
if (!env.isProduction) {
  app.use(cors());
}

app.use(express.json());

app.use(createSessionMiddleware());

app.use('/api/v1', routes);

// In production this app also serves the built React application. The static
// middleware handles real files (JS, CSS, assets); the SPA fallback returns
// index.html for any other non-API GET so client-side routes such as /about
// or /admin/login work on a full page refresh.
if (env.isProduction) {
  app.use(express.static(env.clientDistPath));

  app.get(/^\/(?!api\/).*/, (request, response, next) => {
    // Only GET requests receive the SPA shell; other methods fall through.
    if (request.method !== 'GET') {
      return next();
    }
    response.sendFile('index.html', { root: env.clientDistPath });
  });
}

// API 404 for unmatched routes (in production, non-API paths have already been
// handled by the SPA fallback above, so this returns JSON for /api/* misses).
app.use(notFound);
app.use(errorHandler);

export default app;
