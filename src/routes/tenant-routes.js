const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({ message: 'this is tenants api'});
});

module.exports = router;