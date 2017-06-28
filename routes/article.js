var express = require('express');
var router = express.Router();

var WriteModel = require('../models/write');
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/:articleId', checkLogin, function(req, res, next) {

    var articleId = req.params.articleId;
    // console.log(writeId);
    Promise.all([
        WriteModel.getArticleById(articleId),
        WriteModel.incPv(articleId)
    ])
    
        .then(function(article) {
            var article=article[0];
            res.render('article_detail', {
                article: article[0]
            });
        })
        .catch(next);

});

router.get('/:articleId/edit', checkLogin, function(req, res, next) {

    var articleId = req.params.articleId;
    var author = req.session.user._id;

    WriteModel.getRawArticleById(articleId)
        .then(function(article) {
            if (!article) {
                throw new Error('该文章不存在');
            }
            res.render('edit', {
                article: article
            });
        })
        .catch(next);
});

router.post('/:articleId', checkLogin, function(req, res, next) {

    var articleId = req.params.articleId;
    var author = req.session.user._id;
    var title = req.fields.title;
    var content = req.fields.content;

    WriteModel.updateArticleById(articleId, author, {
            title: title,
            content: content
        })
        .then(function() {
            res.redirect(`/article/${articleId}`);
        })
        .catch(next);
});

router.get('/:articleId/remove', checkLogin, function(req, res, next) {

    var articleId = req.params.articleId;
    var author = req.session.user._id;

    WriteModel.delArticleById(articleId,author)
        .then(function() {
            res.redirect(`/people/${author}`);
        })
        .catch(next);
});

module.exports = router;