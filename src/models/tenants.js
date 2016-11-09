const mongoose = require('mongoose');
const getSlug = require('speakingurl');
const { status } = require('./constants');
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
        return /^[0-9a-zA-Z_\-\.() ]+$/.test(v);
      },
      message: 'Tenant name is invalid!'
    }
  },
  status: {
    type: Number,
    default: status.Active
  },
  profile: {
    email: String,
    phoneNumber: {
      type: String,
      required: true,
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

schema.post('save', (error, doc, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    next({
      status: 409,
      message: 'Tenant name duplicated.'
    });
  } else {
    next(error);
  }
});

module.exports = mongoose.model('Tenant', schema);