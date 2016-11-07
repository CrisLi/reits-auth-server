const { mapValues } = require('lodash');
const logger = require('../logger');
const { message } = require('./constants');

module.exports = (schema, action = 'checkBody') => {
  return (req, res, next) => {
    if (typeof req[action] === 'function') {
      req[action](schema);
      const errors = req.validationErrors(true);
      if (errors) {
        logger.error(message, errors);
        return res.status(400).json({
          status: 400,
          message,
          errors: mapValues(errors, 'msg')
        });
      }
    }
    next();
  };
};