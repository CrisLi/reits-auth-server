const { mapValues } = require('lodash');
const logger = require('../logger');
const { message } = require('../validations/constants');

module.exports = (err, req, res, next) => {
  if (err.name === 'ValidationError' && err.errors) {
    // handle mongoose validation error
    logger.error(err.message, err);
    const status = err.status || 400;
    return res.status(status).json({
      status,
      message,
      errors: mapValues(err.errors, 'message')
    });
  }
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    logger.error(err.message, err);
    const status = err.status || 400;
    return res.status(status).json({
      status,
      message,
      errors: {
        [err.path]: `${err.path} is invalid!`
      }
    });
  }
  next(err);
};