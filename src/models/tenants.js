const mongoose = require('mongoose');
const getSlug = require('speakingurl');
const { tenant: { status, types } } = require('./constants');
const createSchema = require('./createSchema');

const schema = createSchema({
  _id: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^[0-9a-z][0-9a-z\-]+[0-9a-z]$/.test(v);
      },
      message: `Tenant name can only contain alphanumeric characters, lowercase letters and "-". But it can't start nor end with "-".`
    }
  },
  type: {
    type: String,
    enum: Object.keys(types),
    default: 'operator'
  },
  status: {
    type: String,
    default: status.active
  },
  profile: {
    email: String,
    phoneNumber: {
      type: String,
      validate: {
        validator(v) {
          return /\d{3}-\d{3}-\d{4}/.test(v);
        },
        message: '{VALUE} is not a valid phone number!'
      }
    }
  },
  description: String
});

schema.pre('validate', function (next) {
  this._id = getSlug(this.name);
  next();
});

schema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next({
      status: 409,
      message: `This name (${doc.name}) is taken.`
    });
  } else {
    next(error);
  }
});

module.exports = mongoose.model('Tenant', schema);