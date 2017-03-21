var express = require('express');
var router = express.Router();

var markdown = require('markdown').markdown;

//权限控制
var auth = require('../middleware/auth');

var articleModel = require('../mongodb/db').articleModel;

/* GET home page. */
router.get('/',function(req, res, next) {

  var query = {};//到数据库中查找文章的条件
  var keyword = req.query.keyword;//搜索提交的关键字
  if(keyword) {//提交搜索的表单
    //文章   标题或者内容包含keyword关键字即可
    req.session.keyword = keyword;//将搜索关键字保存到sesssion中
    var reg = new RegExp(keyword,'i');//创建正则
    query = {$or:[{title:reg},{content:reg}]};
  }
  var pageNum = parseInt(req.query.pageNum) || 1;
  var pageSize = parseInt(req.query.pageSize) || 10;

  articleModel.find(query)
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .populate('users').exec(function(err,doc) {
    if(!err) {
      req.flash('success','获取文章信息成功');
      doc.forEach(function(article,index) {
        article.content = markdown.toHTML(article.content);
      });

      articleModel.count(query,function(err,count) {
        if(!err) {
          res.render('index', { title: 'Express' ,
            article:doc,
            keyword:keyword,
            pageNum:pageNum,
            pageSize:pageSize,
            totalPage:Math.ceil(parseInt(count)/pageSize)
          });
        }else {
          req.flash('error','获取总条数失败');
          res.rediect('back');
        }
      })


    }else{
      req.flash('error','获取文章信息失败');
      res.rediect('back');
    }
  })

});

module.exports = router;
