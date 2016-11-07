const SysUser = require('../models/sys-users');

const findAll = (req, res) => {
  SysUser.find().then((data) => {
    res.json(data);
  });
};

const create = (req, res, next) => {
  SysUser.create(req.body)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch(next);
};

module.exports = {
  findAll,
  create
};