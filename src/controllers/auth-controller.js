const { pick }= require('lodash');
const logger = require('../logger');
const User = require('../models/users');
const passwordEncoder = require('../security/password-encoder');
const jwt = require('../security/jwt');
const validation = require('../validations/validation-middlweare');
const unauthorized = new Error("Invalid username or password!");

unauthorized.status = 401;

const credential = {
 'username': {
    notEmpty: true,
    errorMessage: 'Username is required!'
  },
  'password': {
    notEmpty: true,
    errorMessage: 'Password is required!'
  },
  'tenantId': {
    notEmpty: true,
    errorMessage: 'Tenant id is required!'
  }
};

const auth = (req, res, next) => {

  const { username, tenantId, password } = req.body;

  User.findOne({ username, tenantId })
    .then((user) => {
      if (!user) {
        throw new Error(`User [${username}@${tenantId}] not found.`);
      }
      if (!passwordEncoder.matches(password, user.password)) {
        throw new Error(`User [${username}] password is wrong.`);
      }
      user.lastLoginAt = Date.now();
      return user.save();
    })
    .then((user) => {
      const data = pick(user, ['_id', 'username', 'tenantId', 'roles']);
      const token = jwt.sign(data);
      res.status(200).json({ token });
    })
    .catch((err) => {
      logger.error(err);
      next(unauthorized);
    });

};

module.exports = {
  auth: [validation(credential), auth]
};