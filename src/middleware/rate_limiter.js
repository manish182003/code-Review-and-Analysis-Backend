const rateLimit = require("express-rate-limit");

const createRateLimiter = (WindowMs, max, message) => {
  return rateLimit({
    WindowMs,
    max,
    message: { success: false, error: message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
      res.status(options.statusCode).send(options.message);
    },
  });
};

const loginLimiter = createRateLimiter(
  15 * 60 * 1000,
  5,
  "Too many login attempts from this IP, please try again after 15 minutes"
);

const registerLimiter = createRateLimiter(
  60 * 60 * 1000,
  10,
  "Too many registration attempts from this IP, please try again after 1 hour"
);

module.exports = { registerLimiter, loginLimiter };
