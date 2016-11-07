const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
  encode(password) {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  },
  matches(rawPassword, encodedPassword) {
    return bcrypt.compareSync(rawPassword, encodedPassword);
  }
};