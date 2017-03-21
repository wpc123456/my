/**
 * Created by sony on 2017/3/15.
 */

var mongoose = require('mongoose');

mongoose.connect(require('../dburl').dburl);
//创建集合的字段
var userSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    //用户注册的头像地址
    avatar:String
});
//创建集合
var userModel = mongoose.model('users',userSchema);


var articleSchema = new mongoose.Schema({
    title:String,//标题
    content:String,//内容
    createAt:{//时间
        type:Date,
        default:Date.now()
    },
    users:{//外键ID
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    add:String,//图片地址
    poster:String,//上传图片
    showCount:Number//浏览次数

});

var articleModel = mongoose.model('article',articleSchema);

//评论数据库
var publishSchema = mongoose.Schema({
    name:String,
    content:String,
    count:Number,
    publish:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'article'
    }

})

var publishModel = mongoose.model('publish',publishSchema);

//用户相关的集合导出
module.exports.userModel = userModel;

module.exports.articleModel = articleModel;

module.exports.publishModel = publishModel;
