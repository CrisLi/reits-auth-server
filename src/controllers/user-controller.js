const User = require('../models/users');
const Tenant = require('../models/tenants');
const userService = require('../services/user-service');

const findAll = (req, res, next) => {
  User.find()
    // .populate('tenantId')
    .exec()
    .then((data) => {
      res.json(data);
    })
    .catch(next);
};

module.exports = {
  findAll,
  create: userService.create
};