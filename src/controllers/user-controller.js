const User = require('../models/users');
const Tenant = require('../models/tenants');

const findAll = (req, res, next) => {
  User.find()
    // .populate('tenantId')
    .exec()
    .then((data) => {
      res.json(data);
    })
    .catch(next);
};

const create = (req, res, next) => {

  const { tenantId } = req.body;

  Tenant.findById(tenantId)
    .then((tenant) => {
      if (tenant) {
        return User.create(req.body);
      } else {
        const err = new Error(`Tenant (${tenantId}) not found!`);
        err.status = 400;
        throw err;
      }
    })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch(next);

};

module.exports = {
  findAll,
  create
};