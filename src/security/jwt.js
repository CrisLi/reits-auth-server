// https://github.com/auth0/node-jsonwebtoken
const jwt = require('jsonwebtoken');
// https://github.com/auth0/express-jwt
const expressJwt = require('express-jwt');
const key = 'hellokitty!!!!!!!@@@@@whoiam';
const algorithm = 'HS512';
const expiresIn = '24h';

module.exports = {
  sign(data) {
    return jwt.sign(data, key, { expiresIn, algorithm });
  },
  auth() {
    return expressJwt({ secret: key });
  }
};