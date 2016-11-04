const Tenant = require('../models/tanants');

const findAll = (req, res) => {
  Tenant.find().then((data) => {
    res.json(data);
  });
};

const create = (req, res, next) => {
  Tenant.create(req.body)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch(next);
};

module.exports = {
  findAll,
  create
};