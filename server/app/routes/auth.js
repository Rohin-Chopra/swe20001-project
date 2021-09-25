const express = require('express');

const auth = require('../auth');
const { login, verify } = require('../controllers/auth');

const router = express.Router()

router.route('/login')
  .post(auth.authenticate(), login);

router.route('/verify')
  .get(verify)

module.exports = router
