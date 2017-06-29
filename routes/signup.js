var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup 注册页
router.get('/', checkNotLogin, function(req, res, next) {
  res.render('signup');
});

// POST /signup 用户注册
router.post('/', checkNotLogin, function(req, res, next) {
  var name = req.fields.name;
  var password = req.fields.password;
  var repassword = req.fields.repassword;

  // 校验参数
  try {
    // if (!(name.length >= 1 && name.length <= 10)) {
    //   throw new Error('名字请限制在 1-10 个字符');
    // }
    
    // if (password.length < 6) {
    //   throw new Error('密码至少 6 个字符');
    // }
    if (password !== repassword) {
      throw new Error('两次输入密码不一致');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('/signup');
  }

  // 明文密码加密
  // password = sha1(password);

  // 待写入数据库的用户信息
  var user = {
    name: name,
    password: password,
    avatar: "default.jpg",
    user_bg: "user_bg.jpg"
  };
  // 用户信息写入数据库
  UserModel.create(user)
    .then(function (result) {
  //   	console.log(result);
  //   	{ result: { ok: 1, n: 1 },
	  // ops: [ { name: '3', password: '3', _id: 595090dd3ff7fd4a143dba95 } ],
	  // insertedCount: 1,
	  // insertedIds: [ 595090dd3ff7fd4a143dba95 ] }
    // 
      // 此 user 是插入 mongodb 后的值，包含 _id
      user = result.ops[0];
      // 将用户信息存入 session
      delete user.password;
      req.session.user = user;
      // 跳转到首页
      res.redirect('/main');
    })
    .catch(function (e) {
      
      // 用户名被占用则跳回注册页，而不是错误页
      if (e.message.match('E11000 duplicate key')) {
        return res.redirect('/signup');
      }
      next(e);
    });
});

module.exports = router;
