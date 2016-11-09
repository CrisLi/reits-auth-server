const Investor = require('../models/investors');

const findAll = (req, res) => {
  Investor.find().then((data) => {
    res.json(data);
  });
};

const create = (req, res, next) => {
  Investor.create(req.body)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch(next);
};

module.exports = {
  findAll,
  create
};