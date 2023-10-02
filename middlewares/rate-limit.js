const rateLimit = require('express-rate-limit');

module.exports.rateLimiter = (req, res, next) => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });
};
