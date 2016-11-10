const Tenant = require('../models/tenants');
const User = require('../models/users');
const logger = require('../logger');
const { tenant: { adminId, investorId }} = require('../models/constants');

const handleDuplicatedError = (err) => {
  if (err.status === 409) {
    return;
  } else {
    throw err;
  }
};

const systemAdminTenant = {
  name: adminId,
  type: 'admin',
  description: 'The system admin tenant. This is predefined by reits auth server.'
};

const investorTenant = {
  name: investorId,
  type: 'investor',
  description: 'The investors tenant. All users belong to this tenant are investors (portal user).'
};

const createTenants = () => {

  const createIfNotExist = (tenant) => {
    return Tenant.create(tenant)
      .then((tenant) => {
        logger.info(`[${tenant.name}] tenant created.`);
      })
      .catch(handleDuplicatedError);
  };

  return [systemAdminTenant, investorTenant].map(createIfNotExist);

};

const adminUser = {
  username: "admin",
  password: "helloworld",
  tenantId: adminId,
  roles: ['admin'],
};

const createUser = () => {
  return User.create(adminUser)
    .then((user) => {
      logger.info('System admin user created.');
    })
    .catch(handleDuplicatedError);
};

module.exports = (cb) => {

  const values = [ createTenants, createUser ].map((action) => action());

  Promise
    .all(values)
    .then(() => {
      logger.info('Data init finished.');
      cb(null);
    })
    .catch(cb);
};
