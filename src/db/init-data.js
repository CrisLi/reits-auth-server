const Tenant = require('../models/tenants');
const User = require('../models/users');
const logger = require('../logger');
const data = require('./data.json');
const { tenant: { admin, investor }} = require('../models/constants');

const handleDuplicatedError = (err) => {
  if (err.status === 409) {
    return;
  } else {
    throw err;
  }
};

const createTenants = () => {

  const systemAdminTenant = {
    name: admin.name,
    type: 'admin',
    description: 'The system admin tenant. This is predefined by reits auth server.'
  };

  const investorTenant = {
    name: investor.name,
    type: 'investor',
    description: 'The investors tenant. All users belong to this tenant are investors (portal user).'
  };

  const createIfNotExist = (tenant) => {
    return Tenant.create(tenant)
      .then((tenant) => {
        logger.info(`[${tenant.name}] tenant created.`);
      })
      .catch(handleDuplicatedError);
  };

  return [systemAdminTenant, investorTenant].map(createIfNotExist);

};

const createUsers = () => {

  const { username, password } = data.user.admin;
  const adminUser = {
    username,
    password,
    tenantId: admin.name,
    roles: ['admin'],
  };

  return User.create(adminUser)
    .then((user) => {
      logger.info(`[${adminUser.name}] user created.`);
    })
    .catch(handleDuplicatedError);
};

module.exports = (cb) => {

  const values = [
    createTenants,
    createUsers
  ].map((action) => action());

  Promise
    .all(values)
    .then(() => {
      logger.info('Data init finished.');
      cb(null);
    })
    .catch(cb);
};
