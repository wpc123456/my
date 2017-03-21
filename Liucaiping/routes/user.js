var express = require('express');
var router = express.Router();
//引入数据库的用户集合
var userModel = require('../mongodb/db').userModel;
//引入md5加密模块
var md5 = require('../md5/md5');
//权限控制
var auth = require('../middleware/auth');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//注册
router.get('/reg',auth.checkNotLogin, function(req, res) {
  res.render('user/reg',{title:'用户注册页面标题',content:'用户注册页面内容'});
});
//用户注册表单提交
router.post('/reg',auth.checkNotLogin,function(req,res){
  //1.获取表单提交的内容
  var userInfo = req.body;
  //2.保存到数据库中
  //需求：用户名和密码不能和数据库中的数据完全相同
  //对用户的密码进行加密
  userInfo.password = md5(userInfo.password);
  //用户的头像
  userInfo.avatar = 'http://secure.gravatar.com/avatar/'+userInfo.email+'?s=48';
  var query = {username:userInfo.username,password:userInfo.password};
  userModel.findOne(query,function(err,doc){
    if(!err){
      if(doc){//数据库中已经有该用户
        //console.log('当前用户已注册，请更换用户名和密码');
        req.flash('error','当前用户已注册，请更换用户名和密码');
        res.redirect('back');
      }else{//没有该用户
        userModel.create(userInfo,function(err,doc){
          if(!err){
            req.flash('success','用户注册成功');
            //console.log('用户登录成功');
            res.redirect('/user/login');
          }else{
            //console.log('用户登录失败');
            req.flash('error','用户注册失败');
            res.redirect('back');
          }
        });
      }
    }else{
      req.flash('error','查询数据库失败');
      //console.log('查询数据库失败');
      res.redirect('back');
    }
  });
});
//登录
router.get('/login',auth.checkNotLogin, function(req, res) {
  res.render('user/login',{title:'用户登录页面标题',content:'用户登录页面内容'});
});
//登录表单提交处理
router.post('/login',auth.checkNotLogin,function(req,res){
  //1.获取登录信息
  var userInfo = req.body;
  userInfo.password = md5(userInfo.password);//加密密码
  //2.数据库中查找该用户的注册信息
  userModel.findOne(userInfo,function(err,doc){
    if(!err){//成功
        if(doc){//用户已经注册过，doc不为空
          //用户已经登录了，但是我们需要用户登录的信息保存起来
          //console.log('当前用户登录成功');
          req.flash('success','当前用户登录成功');
         // req.session.user = userInfo;
          req.session.user = doc;//将登录信息保存到session中
          res.redirect('/');
        }else{//doc为空
          req.flash('error','当前用户信息不存在，请先注册');
          //console.log('当前用户信息不存在，请先注册');
          res.redirect('/user/reg');
        }
    }else{//失败
     //console.log('数据库中查找用户信息失败：'+err);
      req.flash('error','数据库中查找用户信息失败');
      res.redirect('back');//跳转到注册页面
    }
  });
});
//退出
router.get('/logout',auth.checkLogin, function(req, res) {
  req.flash('success','退出成功');//flash设置
  req.session.user = null//清空session中的登录信息
  res.redirect('/');
});
module.exports = router;
