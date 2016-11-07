const SysUser = require('../models/sys-users');
const passwordEncoder = require('../security/password-encoder');
const jwt = require('../security/jwt');
const validation = require('../validations/validation-middlweare');
const unauthorized = new Error("Invalid username or password!");

unauthorized.status = 401;

const login = {
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
  },
  'type': {
    notEmpty: {
      errorMessage: 'User type is required!'
    },
    isIn: {
      options: ['console', 'portal'],
      errorMessage: 'User type is invalid!'
    }
  }
};

const auth = (req, res, next) => {

  const { username, tenantId, password, type } = req.body;

  let result;

  if (type === 'console') {
    result = SysUser.findOne({ username, tenantId });
  } else {
    result = SysUser.findOne({ username, tenantId });
  }

  result
    .then((data) => {
      if (!data || !passwordEncoder.matches(password, data.password)) {
        return next(unauthorized);
      }
      data['type'] = type;
      const token = jwt.sign(data);
      res.status(200).json({ token });
    })
    .catch((err) => {
      next(unauthorized);
    });

};

module.exports = {
  auth: [validation(login), auth]
};