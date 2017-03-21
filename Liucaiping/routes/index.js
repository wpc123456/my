var express = require('express');
var router = express.Router();
var articleModel = require('../mongodb/db').articleModel;

//引入markdown模块
var markdown = require('markdown').markdown;
/* GET home page. */
router.get('/', function(req, res, next) {
    var query = {};//到数据库中查找文章的条件
    var keyword = req.query.keyword;//搜索提交的关键字
    if(keyword){//提交搜索的表单
        req.session.keyword = keyword;//将搜索关键字保存到session中
        //文章 标题或者内容包含keyword关键字即可
        var reg = new RegExp(keyword,'i');//创建正则
        query = {$or:[{title:reg},{content:reg}]}
    }
    //获取pageNum和pageSize的值
    var pageNum = parseInt(req.query.pageNum) || 1;
    var pageSize = parseInt(req.query.pageSize) || 6;
 //读取数据库中所有文章列表的信息
  articleModel.find(query)
      .skip((pageNum-1)*pageSize)//跳过前面的pageNum-1页的数据
      .limit(pageSize) //默认一个显示pageSize条信息
      .populate('user')//将外键的—id读取成对应的对象值
      .exec(function(err,articles){
          if(!err){
            req.flash('success','获取文章列表信息成功');
              articles.forEach(function(article,index){
                  article.content = markdown.toHTML(article.content);//让所有文章的内容支持markdown
              });
              //在数据库中查找集合中一共有多少条文档，数据库中的count方法
              articleModel.count(query,function(err,count){
                  if(!err){
                      res.render('index',{
                          title:'首页标题',
                          articles:articles,
                          keyword:keyword,//渲染模板引擎文件
                          pageNum:pageNum,//页数
                          pageSize:pageSize,//一页显示多少条
                          totalPage:Math.ceil(parseInt(count)/pageSize)//总页数
                      });
                  }else{
                      req.flash('error','获取总条数失败');
                      req.redirect('back');
                  }
              });

          }else{
            req.flash('error','获取文章列表信息失败');
            res.redirect('back');
          }
      });
});

module.exports = router;
