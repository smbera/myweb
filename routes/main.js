var express = require('express');
var router = express.Router();

var WriteModel = require('../models/write');
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', checkLogin, function(req, res, next) {
    WriteModel.getArticles()
        .then(function(articles) {

            res.render('main', {
                articles: articles
            });
        })
        .catch(next);
});



module.exports = router;