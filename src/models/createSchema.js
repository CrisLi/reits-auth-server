const mongoose = require('mongoose');
const { extend } = require('lodash');
const Schema = mongoose.Schema;

module.exports = (schema, options) => {
  return new Schema(schema, extend({ timestamps: true }, options));
};
