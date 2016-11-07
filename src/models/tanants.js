const mongoose = require('mongoose');
const getSlug = require('speakingurl');
const { status } = require('./constants');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true
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
}, {
  timestamps: true
});

schema.pre('validate', function (next) {
  this.slug = getSlug(this.name);
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