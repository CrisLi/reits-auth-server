const logger = require('./logger');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan'); 
const routes = require('./routes');
const PORT = process.env['PORT'] || 3000;

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'This is the reits auth server'});
});

Object.keys(routes).forEach((key) => {
  app.use(key, routes[key]);
});

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Not found' }
  );
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    status,
    message: err.message 
  });
});

module.exports = {
  start() {
    app.listen(PORT, () => {
      logger.info(`Server start up at port ${PORT}`);
    });
  }
};