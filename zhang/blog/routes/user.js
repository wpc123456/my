var express = require('express');
var router = express.Router();


var userModel = require('../mongodb/db').userModel;

var md5 = require('../md5/md5');

//权限控制
var auth = require('../middleware/auth');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//注册
router.get('/reg', auth.checkNotLogin, function (req, res) {
  res.render('user/reg', {title: "用户注册", content: '注册页内容'});
});


router.post('/reg', auth.checkNotLogin, function (req, res) {
  //1: 获取表单提交的内容
  var userInfo = req.body;
  //2: 保存到数据库中
  userInfo.password = md5(userInfo.password);

  //用户的头像
  userInfo.avatar = "https://secure.gravatar.com/avatar/"+userInfo.email+'?s=48';

  var query = {username: userInfo.username, password: userInfo.password};
  userModel.findOne(query, function (err, doc) {
    if (!err){
      if (doc){
        req.flash('error', '当前用户已注册，请更换用户名和密码');//flash设置
        res.redirect('back');
      } else {
        userModel.create(userInfo, function (err, doc) {
          if (!err) {
            req.flash('success', '用户注册成功');
            res.redirect('/user/login');
          } else {
            req.flash('error', '用户注册失败');
            res.redirect('back');
          }
        });
      }
    } else {
      req.flash('error', '查询数据库失败');
      res.redirect('back');
    }
  });
});

//登陆
router.get('/login', auth.checkNotLogin, function (req, res) {
  res.render('user/login', {title: "用户登陆", content: '登陆页内容'})
});

//登陆表单提交请求处理
router.post('/login', auth.checkNotLogin, function (req, res) {
  //1: 获取登陆信息
  var userInfo = req.body;

  userInfo.password = md5(userInfo.password);

  userModel.findOne(userInfo, function (err, doc) {
    if (!err){
      if (doc){
        req.flash('success', '当前用户登陆成功');
        //_id: 主键(外健 populate) email

        //req.session.user = userInfo;
        req.session.user = doc;

        res.redirect('/');
      } else {
        req.flash('error', '当前用户没有注册，请先注册');
        res.redirect('/user/reg');
      }
    } else {
      req.flash('error', '数据库中查找用户信息失败');
      res.redirect('back');
    }
  });
});

//退出
router.get('/logout', auth.checkLogin, function (req, res) {
  req.flash('success', '退出成功');
  req.session.user = null;//清空session中的登陆信息
  res.redirect('/');
});


module.exports = router;
