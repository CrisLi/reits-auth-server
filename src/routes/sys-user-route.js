const router = require('express').Router();
const { findAll, create } = require('../controllers/sys-user-controller');

router.get('/', findAll);
router.post('/', create);

module.exports = router;