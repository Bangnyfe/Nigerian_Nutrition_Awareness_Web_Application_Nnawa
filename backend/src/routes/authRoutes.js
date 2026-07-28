import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, logout, me } from '../controllers/authController.js';
import { errorResponse } from '../utils/apiResponse.js';

const router = Router();

// Only failed logins count toward the limit, so a legitimate admin logging in
// cleanly is never rate limited. The counter is in-memory and resets on
// restart, which is acceptable for a single-instance deployment.
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (request, response) => {
    response
      .status(429)
      .json(
        errorResponse(
          'Too many login attempts. Please try again in a few minutes.'
        )
      );
  }
});

router.post('/login', loginRateLimiter, login);
router.post('/logout', logout);
router.get('/me', me);

export default router;
