const logger = require('./logger');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes');
const db = require('./db');
const { mapValues } = require('lodash');
const PORT = process.env['PORT'] || 3000;

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({
    message: 'This is the reits auth server'
  });
});

Object.keys(routes).forEach((key) => {
  app.use(key, routes[key]);
});

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Not found'
  });
});

const validationErrorHanlder = (err, req, res, next) => {
  const status = err.status || 400;
  return res.status(status).json({
    status,
    message: err.message,
    errors: mapValues(err.errors, (field) => field.message)
  });
};

app.use((err, req, res, next) => {

  logger.error(err.message, err);

  if (err.name === 'ValidationError' && err.errors) {
    return next(err);
  }

  const status = err.status || 500;
  res.status(status).json({
    status,
    message: err.message
  });
});

app.use(validationErrorHanlder);

module.exports = {
  start() {
    db((err) => {
      if (err) {
        logger.error(err.message, err);
        return;
      };
      app.listen(PORT, (err) => {
        if (err) {
          logger.error(err.message, err);
        } else {
          logger.info(`Server start up at port ${PORT}`);
        }
      });
    });
  }
};