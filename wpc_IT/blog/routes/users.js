var express = require('express');
var router = express.Router();


var userModel = require('../mongodb/db').userModel;

//引入md5模块
var md5 = require('../md5/md5');

//权限控制
var auth = require('../middleware/auth');

/* GET users listing. */
router.get('/', auth.checkNotLogin,function(req, res, next) {
  res.send('respond with a resource');
});

//注册
router.get('/reg', auth.checkNotLogin,function(req,res) {
  res.render('users/reg',{title:"用户注册",content:"注册页内容"});
});

router.post('/reg', auth.checkNotLogin,function(req,res) {
  //获取表单内容
  var userInfo = req.body;
  userInfo.password = md5(userInfo.password);
    userInfo.avatar  = "https://secure.gravatar.com/avatary/" + userInfo.email + "?s=48";
  //保存到数据库中
  userModel.findOne({name:userInfo.name,password:userInfo.password},function(err,doc) {
    if(!err) {
      if(doc){
        req.flash('error','当前用户已注册，请更换用户名和密码');;
        res.redirect('back');
      }else{
        userModel.create(userInfo,function(err,doc) {
          if(!err) {
            //console.log('用户注册成功')
            req.flash('success','用户注册成功');
            res.redirect('/users/login');
          }else {
            //console.log('用户注册失败')
            req.flash('error','用户注册失败');
            res.redirect('back');
          }
        })
      }
    }else {
        req.flash('error','查询失败');
      //console.log('查询失败')
      res.redirect('back');
    }
  })

})

//登陆
router.get('/login', auth.checkNotLogin,function(req,res) {
  res.render('users/login',{title:"用户登陆",content:"登陆页内容"});
});

router.post('/login', auth.checkNotLogin,function(req,res) {
  //获取表单内容：
  var userinfo = req.body;
  userinfo.password = md5(userinfo.password);
  //和数据库中的数据进行比较
  userModel.findOne(userinfo,function(err,doc) {
    if(!err) {
      if(doc) {
          req.flash('success','用户登陆成功');
        req.session.users = doc;
        res.redirect('/article/home');
      }else {
        //console.log("未注册，请先注册");
          req.flash('error','未注册，请先注册');
        res.redirect('/users/reg');
      }
    }else {
      //console.log('数据库查找失败');
        req.flash('error','数据库查找失败');
      res.redirect('back');
    }
  });
});

//退出
router.get('/logout', auth.checkLogin,function(req,res) {
  req.session.users = null;//清空session的登陆信息
  res.redirect('/');
});


module.exports = router;
