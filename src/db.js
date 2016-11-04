const mongoose = require('mongoose');
const HOST = process.env['MONGODB_HOST'] || 'localhost';
const PORT = process.env['MONGODB_PORT'] || 27017;
const DB = process.env['MONGODB_DATABASE'] || 'reits_auth_server';
const logger = require('./logger');

mongoose.Promise = global.Promise;

module.exports = (cb) => {
  mongoose.connect(`mongodb://${HOST}:${PORT}/${DB}`, (err) => {
    if (err) {
      return cb(err);
    };
    logger.info('Connected to mongodb.');
    cb(null);
  });
};