const router = require('express').Router();
const { findAll, create } = require('../controllers/user-controller');

router.get('/', findAll);
router.post('/', create);

module.exports = router;