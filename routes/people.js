var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');
var WriteModel = require('../models/write');
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/:userId', checkLogin, function(req, res, next) {
    var userId = req.params.userId;

    // console.log(writeId);
    WriteModel.getArticles(userId)
        .then(function(articles) {
             
            articles.forEach(function(item){
                delete item.author.password;
            })
            
            // console.log(articles);
            res.render('people', {
                articles: articles
            });
        })
        .catch(next);
});

router.post('/:userId', checkLogin, function(req, res, next) {
    var userId = req.params.userId;
    var avatar = req.files.avatar.path.split(path.sep).pop();
    UserModel.updateAvatar(userId, avatar)
        .then(function(result) {
            req.session.user.avatar = avatar;
            res.redirect('/people/' + userId)

        })
        .catch(function(e) {
            // 上传失败，异步删除上传的头像
            fs.unlink(req.files.avatar.path);
            // 用户名被占用则跳回注册页，而不是错误页
            res.redirect('/people/' + userId);
            next(e);
        });
});
router.post('/user_bg/:userId', checkLogin, function(req, res, next) {
    var userId = req.params.userId;
    var user_bg = req.files.user_bg.path.split(path.sep).pop();
    UserModel.updateUser_bg(userId, user_bg)
        .then(function(result) {
            req.session.user.user_bg = user_bg;
            res.redirect('/people/' + userId)

        })
        .catch(function(e) {
            // 上传失败，异步删除上传的头像
            fs.unlink(req.files.user_bg.path);
            // 用户名被占用则跳回注册页，而不是错误页
            res.redirect('/people/' + userId);
            next(e);
        });
});

module.exports = router;