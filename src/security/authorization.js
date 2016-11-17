const logger = require('../logger');

module.exports = (isPermitted) => {
  return (req, res, next) => {
    if (isPermitted(req.user, req)) {
      return next();
    }
    logger.error(`Insufficient privilege. [${req.user || ''} ${req.method} ${req.baseUrl}]`);
    return res.status(403).json({
      status: 403,
      message: `Insufficient privilege.`
    });
  };
};