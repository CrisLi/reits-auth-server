const Tenant = require('../models/tenants');
const { pick } = require('lodash');

const findAll = (req, res) => {
  Tenant.find().then((data) => {
    res.json(data);
  });
};

const create = (req, res, next) => {
  const tenant = pick(req.body, ['name', 'description', 'profile']);
  Tenant.create(tenant)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch(next);
};

module.exports = {
  findAll,
  create
};