module.exports = {
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
  }
};