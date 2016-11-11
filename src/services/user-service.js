const { difference, pick } = require('lodash');
const User = require('../models/users');
const Tenant = require('../models/tenants');
const { tenant: { types } } = require('../models/constants');

const findTenant = (tenantId) => {
  return Tenant.findById(tenantId)
    .then((tenant) => {
      if (!tenant) {
        const err = new Error(`Tenant (${tenantId}) not found!`);
        err.status = 400;
        throw err;
      }
      return tenant;
    });
};

const create = (req, res, next) => {

  const { tenantId, roles } = req.body;

  findTenant(tenantId)
    .then((tenant) => {
      const validRoles = types[tenant.type].roles;
      if (difference(roles, validRoles).length !== 0) {
        const err = new Error(`Roles are invalid for the tenant (${tenant.name})!`);
        err.status = 400;
        throw err; 
      }
      return tenant;
    })
    .then((tenant) => {
      const user = pick(req.body, ['username', 'password', 'roles', 'tenantId']);
      return User.create(user);
    })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch(next);

};

module.exports = {
  create
};