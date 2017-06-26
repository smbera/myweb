var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

router.get('/:userId', checkLogin, function(req, res, next) {
  res.render('people');
});

module.exports = router;