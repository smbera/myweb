var marked = require('marked');
var Write = require('../lib/mongo').Write;

// 将 article 的 content 从 markdown 转换成 html
Write.plugin('contentToHtml', {
    afterFind: function(articles) {
        return articles.map(function(article) {
            article.content = marked(article.content);
            return article;
        });
    },
    afterFindOne: function(article) {
        if (article) {
            article.content = marked(article.content);
        }
        return article;
    }
});


module.exports = {

    // 创建一篇文章
    create: function create(write) {
        return Write.create(write).exec();
    },

    // 通过文章 id 获取一篇文章
    getArticleById: function getArticleById(writeId) {
        return Write
            .find({
                _id: writeId
            })
            .populate({
                path: 'author',
                model: 'User'
            }) //设置这个后才能在main页取到不同用户的头像等信息
            .addCreatedAt()
            .contentToHtml()
            .exec();
    },
    // 通过用户 id 获取文章或传入空值获取所有用户的文章
    getArticles: function getArticles(userId) {
        var query = {};
        if (userId) {
            query.author = userId;
        }
        return Write
            .find(query)
            .populate({
                path: 'author',
                model: 'User'
            }) //设置这个后才能在main页取到不同用户的头像等信息
            .sort({
                _id: -1
            })
            .addCreatedAt()
            .contentToHtml()
            .exec();
    },
    // 通过文章 id 获取一篇原生文章（编辑文章）
    getRawArticleById: function getRawArticleById(articleId) {
        return Write
            .findOne({
                _id: articleId
            })
            .populate({
                path: 'author',
                model: 'User'
            })
            .exec();
    },

    // 通过用户 id 和文章 id 更新一篇文章
    updateArticleById: function updateArticleById(articleId, author, data) {
        return Write.update({
            author: author,
            _id: articleId
        }, {
            $set: data
        }).exec();
    },

    // 通过用户 id 和文章 id 删除一篇文章
    delArticleById: function delArticleById(articleId, author) {
        return Write.remove({
                author: author,
                _id: articleId
            })
            .exec();
    },

    // 通过文章 id 给 pv 加 1
    incPv: function incPv(articleId) {
        return Write
        .update({ _id: articleId }, { $inc: { pv: 1 } })
        .exec();
    }
};