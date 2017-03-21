var express = require('express');
var router = express.Router();
//权限控制
var auth = require('../middleware/auth');
//var router = express.Router();
/* GET users listing. */
//文章相关的集合
var articleModel = require('../mongodb/db').articleModel;
//引入multer模块实现图片的上传
var multer = require('multer');
var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'../public/uploads');//上传图片后保存的路径地址
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);//上传图片后图片的名字等于原来图片的名字
    }
});
var upload = multer({storage:storage});//配置(upload是一个中间件处理函数)
router.get('/add',auth.checkLogin, function(req, res) {
    res.render('article/add',{title:'发表文章',content:'添加文章内容'});
});

//详情
router.get('/detail',auth.checkLogin, function(req, res) {
    var id = req.query.id;
    articleModel.findById(id).populate('user').exec(function(err,article){
        res.render('article/detail',{title:'详情页',article:article});
    })
});

//更新
router.get('/edit',auth.checkLogin, function(req, res) {
    var id = req.query.id;
    articleModel.findById(id).populate('user').exec(function(err,article){
        res.render('article/edit',{title:'编辑页',article:article});
    })
});

//删除
router.get('/delete',function(req,res){
    var id = req.query.id;
    articleModel.remove({_id: id},function(err,article) {
        if (!err) {
            req.flash('success', '删除成功')
            res.redirect('/');
        } else {
            req.flash('success', '删除失败')
            res.redirect('back');
        }
    })
});
router.post('/add',auth.checkLogin,upload.single('poster'),function(req,res,next){
    //1.获取表单提交的文章信息
    var articleInfo = req.body;

    if(req.file){//如果有图片上传
        articleInfo.poster = '/uploads/'+req.file.filename;
    }
    //设置文章发表时间
    articleInfo.createAt = Date.now();
    //文章的作者
    articleInfo.user = req.session.user._id;
    //2.将文章信息保存到数据库
    if(articleInfo.id){
        articleModel.findById(articleInfo.id,function(err,doc){
            if(!err){
                //console.log(doc)
                articleInfo.poster || (articleInfo.poster = doc.poster);
                articleModel.update({_id:articleInfo.id},{title:articleInfo.title,poster:articleInfo.poster,content:articleInfo.content},
                    function(err,doc){
                        if(!err) {
                           // console.log('-----------')
                            //console.log(doc);
                            req.flash('success','修改成功');
                            res.redirect('/');
                        }else{
                            req.flash('error','修改失败');
                            res.redirect('back');
                        }
                    });
            }
        });
    }else{
        articleModel.create(articleInfo,function(err,doc){
            if(!err){
                req.flash('success','用户发表文章成功');
                res.redirect('/');
            }else{
                req.flash('error','用户发表文章失败');
                res.redirect('back');
            }
        });
    }

});
module.exports = router;
