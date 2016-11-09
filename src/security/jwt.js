const jwt = require('jsonwebtoken');
const key = 'hellokitty!!!!!!!@@@@@whoiam';
const algorithm = 'HS512';
const expiresIn = '24h';

module.exports = {
  sign(data) {
    return jwt.sign(data, key, { expiresIn, algorithm });
  }
};