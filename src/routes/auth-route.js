const router = require('express').Router();
const { authUser, authInvestor } = require('../controllers/auth-controller');

router.post('/console', authUser);
router.post('/investor', authInvestor);

module.exports = router;