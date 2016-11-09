const User = require('../models/users');

const findAll = (req, res) => {
  User.find().then((data) => {
    res.json(data);
  });
};

const create = (req, res, next) => {
  User.create(req.body)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch(next);
};

module.exports = {
  findAll,
  create
};