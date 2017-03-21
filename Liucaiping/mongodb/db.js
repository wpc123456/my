var mongoose = require('mongoose');//引入数据库
//连接数据库
mongoose.connect(require('../dbUrl').dbUrl);//将容易发生改变的数据单独用一个文件存放起来
//创建模型骨架
var userSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    //用户头像地地址
    avatar:String
});
//创建model
var userModel = mongoose.model('user',userSchema);
//创建文章相关的模型
var articleSchema = new mongoose.Schema({
    title:String,
    content:String,
    poster:String,
    createAt:{
        type:Date,
        default:Date.now()
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
});
//创建文章集合
var articleModel = mongoose.model('article',articleSchema);
//用户相关的集合导出
module.exports.userModel = userModel;
//文章相关的集合导出
module.exports.articleModel = articleModel;