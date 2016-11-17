const logger = require('../logger');

module.exports = (err, req, res, next) => {
  const { name, status, message } = err;
  if (name === 'UnauthorizedError') {
    logger.error(err.message, err);
    return res.status(status).json({
      status,
      message
    });
  }
  return next(err);
};