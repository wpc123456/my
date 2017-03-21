/**
 * Created by sony on 2017/3/15.
 */

 var express = require('express');
//引入multer模块实现图片上传
var multer = require("multer");


var markdown = require('markdown').markdown;

var storage = multer.diskStorage({
    destination:function(req,file,cb) {
        cb(null,'../public/uploads');//上传图片后保存的地址
    },
    filename:function(req,file,cb) {
        //上传图片后图片的名字等于原来图片的名字
        cb(null,file.originalname);
    }
});

var upload= multer({storage:storage});//配置（upload是一个中间件处理函数）

var router = express.Router();
//权限控制
var auth = require('../middleware/auth');

var articleModel = require('../mongodb/db').articleModel;
var publishModel = require('../mongodb/db').publishModel;

router.get('/add', auth.checkLogin,function(req,res) {
    res.render('article/add',{title:"文章",content:"文章内容"});
})

//主页
router.get('/home',function(req,res,next) {
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
                        res.render('article/home', { title: 'Express' ,
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
})

function getDouble(x) {
    return x >= 10 ? x : "0" + x;
}

function getDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return year + "/" + getDouble(month) + "/" + getDouble(day) + "  " + getDouble(hour) + ":" + getDouble(minute) + ":" + getDouble(second);
}


router.post('/add',auth.checkLogin,upload.single('poster'),function(req,res) {
    //获取表单提交信息
    var articleInfo = req.body;

    if(req.file) {

        articleInfo.poster = "/uploads/" + req.file.filename;
    }
    req.session.commentCount = 0;
    req.session.assistCount = 0;
    req.session.count = 0;
    articleInfo.showCount = 0;
    articleInfo.createAt = getDate();
    articleInfo.users = req.session.users._id;
    //保存到数据库
    articleModel.create(articleInfo,function(err,doc) {
        if(!err) {
            req.flash('success','成功');
            res.redirect('/article/home');
        }else{
            console.log(err);
            req.flash('error','失败');
            res.redirect('back');
        }
    })
    /*
    var info = req.body;
    info.count = 0;
    //获取文章的id
    info.publish = req.session.article._id;
    //获取评论用户名
    info.name = req.session.users.username;

    publishModel.create(info,function(err,doc) {
        if(!err) {
            req.flash('success','成功');
            res.redirect('article/detail');
        }else{
            req.flash('error','失败');
            res.redirect('back');
        }
    })
    */
})

//详情
router.get('/detail/:_id',function(req,res) {
    var id = req.params._id;

    articleModel.findById({_id:id}).populate('users').exec(function(err,doc) {
        if (!err) {
            //if (auth.checkNotLogin) {
            //    res.render('article/detail', {title: "文章", article: doc});
            //}
            //else if (auth.checkLogin) {
                if (doc) {
                    var count = doc.showCount;
                    count++;
                    doc.showCount = count;
                    articleModel.update({_id: id}, {$set: {showCount: count}}, function (err, info) {
                        if (!err) {
                            console.log("chenggong");
                        } else {
                            console.log(err);
                        }
                    });
                    res.render('article/detail', {title: "文章", article: doc});
                } else {
                    req.flash('error', '失败');
                    res.redirect('back');
                }
            //}
        }else{
            req.flash('error', '失败');
            res.redirect('back');
        }
    })
})
//删除
router.get('/remove/:_id',function(req,res) {

    var id = req.params._id;

    articleModel.findOneAndRemove({_id:id},function(err,doc) {
        if(!err) {
            req.flash('error','删除成功');
            res.redirect('/article/home');
        }else {
            req.flash('error','删除失败');
            res.redirect('back');
        }
    })
})

//更新
router.get('/update/:_id',function(req,res) {
    var id = req.params._id;

    articleModel.findById({_id:id},function(err,doc) {
        if(!err) {
            req.flash('error','成功');
            res.render('article/update',{title:"文章",article:doc});
        }else{
            req.flash('error','失败');
            res.redirect('back');
        }
    })

})
router.get('/renewal/:_id',function(req,res) {
    var arr = req.path.split('/');
    console.log(arr)
    var id = arr[arr.length-1];
    console.log(id)
    console.log(req.query);

    //更新到数据库
    articleModel.update({_id:id},{$set:{title:req.query.title,content:req.query.content,add:req.query.add,users:req.session.users._id,createAt:getDate()}},function(err,doc) {
        if(!err) {
            req.flash('success','成功');
            res.redirect('/article/home');
        }else{
            console.log(err);
            req.flash('error','失败');
            res.redirect('back');
        }
    })

})




/*
router.post('/detail',function(req,res) {
    var info = req.body;
    req.session.commentCount += 1;
    //获取文章的id
    info.publish = req.session.article._id;
    //获取评论用户名
    info.name = req.session.users.username;
    //保存到数据库
    publishModel.create(info,function(err,doc) {
        if(!err) {
            req.flash('success','成功');
            res.redirect('article/detail');
        }else{
            req.flash('error','失败');
            res.redirect('back');
        }
    })


})*/




module.exports = router;