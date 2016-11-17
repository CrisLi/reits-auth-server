const router = require('express').Router();
const { findAll, create } = require('../controllers/tenant-controller');
const { tenant: { admin } } = require('../models/constants');
const authorization = require('../security/authorization');

// router.use('/', authorization((user) => (user.tenantId === admin.name)));
router.get('/', findAll);
router.post('/', authorization((user) => (user.tenantId === admin.name)), create);

module.exports = router;