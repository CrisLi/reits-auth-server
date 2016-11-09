const mongoose = require('mongoose');
const { omit, extend } = require('lodash');
const passwordEncoder = require('../security/password-encoder');
const { status } = require('./constants');
const createSchema = require('./createSchema');
const credential = require('./credential');

const schema = createSchema(extend({
  tenantId: {
    type: String,
    ref: 'Tenant',
    required: true,
    index: true
  },
  identifier: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: Number,
    default: status.ENABLED
  },
  description: String
}, credential));

schema.pre('validate', function(next) {
  this.identifier = `${this.username}@${this.tenantId}`;
  next();
});

schema.pre('save', function(next) {
  this.password = passwordEncoder.encode(this.password);
  this._id = `${this.name}@${this.tenantId}`;
  next();
});

schema.post('save', (error, doc, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    next({
      status: 409,
      message: 'Username name duplicated.'
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