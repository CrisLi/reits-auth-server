const logger = require('../logger');

module.exports = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    logger.error(err.message, err);
    const { status, message } = err;
    return res.status(status).json({
      status,
      message
    });
  }
  return next(err);
};