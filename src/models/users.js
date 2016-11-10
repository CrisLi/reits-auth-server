const mongoose = require('mongoose');
const { difference } = require('lodash');
const passwordEncoder = require('../security/password-encoder');
const { user: { status }, roles, tenant } = require('./constants');
const createSchema = require('./createSchema');

const schema = createSchema({
  tenantId: {
    type: String,
    ref: 'Tenant',
    required: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^[0-9a-zA-Z_\-\.]+$/.test(v);
      },
      message: 'Username name is invalid!'
    }
  },
  password: {
    type: String,
    required: true
  },
  identifier: {
    type: String,
    required: true,
    unique: true
  },
  roles: {
    type: [String],
    validate: {
      validator(values) {
        return difference(values, roles).length === 0;
      },
      message: `Role must be one of ${roles.join(', ')}.`
    },
    required: true,
  },
  status: {
    type: String,
    default: status.enabled
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  }
});

schema.pre('validate', function(next) {
  this.identifier = `${this.username}@${this.tenantId}`;
  if (this.tenantId === tenant.investorId) {
    this.roles = ['investor'];
  }
  next();
});

schema.pre('save', function(next) {
  if (this.isNew) {
    this.password = passwordEncoder.encode(this.password);
  }
  next();
});

schema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next({
      status: 409,
      message: `This username (${doc.username}) is taken.`
    });
  } else {
    next(error);
  }
});

schema.set('toJSON', {
  transform(doc, ret, options) {
    delete ret.password;
    delete ret.identifier;
    return ret;
  }
});

module.exports = mongoose.model('User', schema);