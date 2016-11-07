const mongoose = require('mongoose');
const { omit } = require('lodash');
const passwordEncoder = require('../security/password-encoder');
const { status } = require('./constants');
const Schema = mongoose.Schema;

const schema = new Schema({
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
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
  status: {
    type: Number,
    default: status.Active
  },
  description: String
}, {
  timestamps: true,
  collection: 'sys_users'
});

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

module.exports = mongoose.model('SysUser', schema);