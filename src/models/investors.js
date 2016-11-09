const mongoose = require('mongoose');
const { omit, extend } = require('lodash');
const passwordEncoder = require('../security/password-encoder');
const { status } = require('./constants');
const createSchema = require('./createSchema');
const credential = require('./credential');

const schema = createSchema(extend({
  status: {
    type: Number,
    default: status.ENABLED
  },
  description: String
}, credential));

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
    return ret;
  }
});

module.exports = mongoose.model('Investor', schema);