var express = require('express');
var router = express.Router();

var WriteModel = require('../models/write');
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', checkLogin, function(req, res, next) {
    res.render('write');
});

router.post('/', checkLogin, function(req, res, next) {
    var author = req.session.user._id;
    var title = req.fields.title;
    var content = req.fields.content;

    // 校验参数
    try {
        if (!title.length) {
            throw new Error('请填写标题');
        }
        if (!content.length) {
            throw new Error('请填写内容');
        }
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var write = {
        author: author,
        title: title,
        content: content,
        pv: 0
    };

    WriteModel.create(write)
        .then(function(result) {
            // 此 write 是插入 mongodb 后的值，包含 _id
            write = result.ops[0];
            // 发表成功后跳转到该文章页
            res.redirect(`/write/${write._id}`);
        })
        .catch(next);

});
router.get('/:writeId', checkLogin, function(req, res, next) {
    var writeId = req.params.writeId;
    WriteModel.getArticleById(writeId)
        .then(function(result) {
            // console.log(result);
            var article = result[0];
            if (!article) {
                throw new Error('该文章不存在');
            }

            res.render('article_detail', {
                article: article
            });
        })
        .catch(next);
    
});

module.exports = router;