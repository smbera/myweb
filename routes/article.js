var express = require('express');
var router = express.Router();

var WriteModel = require('../models/write');
var CommentModel  = require('../models/comments');
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/:articleId', checkLogin, function(req, res, next) {

    var articleId = req.params.articleId;
    // console.log(writeId);
    
    Promise.all([
        WriteModel.getArticleById(articleId),
        CommentModel.getComments(articleId),// 获取该文章所有留言
        WriteModel.incPv(articleId)
    ])
    
        .then(function(result) {
            // console.log(result);
            var article=result[0];
            var article=article[0];
            var comments = result[1];
            res.render('article_detail', {
                article: article,
                comments: comments
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

router.post('/:articleId/comment', checkLogin, function(req, res, next) {
  var author = req.session.user._id;
  var articleId = req.params.articleId;
  var content = req.fields.content;
  var comment = {
    author: author,
    articleId: articleId,
    content: content
  };

  CommentModel.create(comment)
    .then(function () {
      res.redirect('back');
    })
    .catch(next);
});

router.get('/:articleId/comment/:commentId/remove', checkLogin, function(req, res, next) {
  var commentId = req.params.commentId;
  var author = req.session.user._id;

  CommentModel.delCommentById(commentId, author)
    .then(function () {
      res.redirect('back');
    })
    .catch(next);
});


module.exports = router;