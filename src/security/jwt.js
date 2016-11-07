const jwt = require('jsonwebtoken');
const { pick } = require('lodash');
const key = 'hellokitty!!!!!!!@@@@@whoiam';
const algorithm = 'HS512';
const expiresIn = '24h';

module.exports = {
  sign(user) {
    const data = pick(user, ['username', 'tenantId', 'type', 'roles']);
    return jwt.sign(data, key, { expiresIn, algorithm });
  }
};