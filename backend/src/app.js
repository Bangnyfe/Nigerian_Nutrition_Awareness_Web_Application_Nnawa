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

app.use(cors());
app.use(express.json());

app.use(createSessionMiddleware());

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
