const { pick }= require('lodash');
const logger = require('../logger');
const User = require('../models/users');
const Investor = require('../models/investors');
const passwordEncoder = require('../security/password-encoder');
const jwt = require('../security/jwt');
const validation = require('../validations/validation-middlweare');
const unauthorized = new Error("Invalid username or password!");

unauthorized.status = 401;

const user = {
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

const authUser = (req, res, next) => {

  const { username, tenantId, password } = req.body;

  User.findOne({ username, tenantId })
    .then((user) => {
      if (!user) {
        logger.error(`User ${username} not found.`);
        return next(unauthorized);
      }
      if (!passwordEncoder.matches(password, user.password)) {
        logger.error(`User ${username} password is wrong.`);
        return next(unauthorized);
      }
      const data = pick(user, ['_id', 'username', 'tenantId', 'roles']);
      data['type'] = 'console';
      const token = jwt.sign(data);
      res.status(200).json({ token });
    })
    .catch((err) => (next(unauthorized)));

};

const investor = {
 'username': {
    notEmpty: true,
    errorMessage: 'Username is required!'
  },
  'password': {
    notEmpty: true,
    errorMessage: 'Password is required!'
  }
};

const authInvestor = (req, res, next) => {

  const { username, password } = req.body;
  
  Investor.findOne({ username })
    .then((investor) => {
      if (!investor) {
        return next(unauthorized);
      }
      if (!passwordEncoder.matches(password, investor.password)) {
        return next(unauthorized);
      }
      const data = pick(investor, ['_id', 'username']);
      data['type'] = 'investor';
      const token = jwt.sign(data);
      res.status(200).json({ token });
    })
    .catch((err) => (next(unauthorized)));

};

module.exports = {
  authUser: [validation(user), authUser],
  authInvestor: [validation(investor), authInvestor]
};