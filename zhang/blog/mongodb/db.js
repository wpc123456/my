var mongoose = require('mongoose');

//连接数据库
mongoose.connect(require('../dbUrl').dbUrl);

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    //用户的头像地址
    avatar: String
});

var userModel = mongoose.model('user', userSchema);

//创建文章相关的模型
var articleSchema = new mongoose.Schema({
    title: String,
    content: String,
    poster: String, //上传的图片
    createAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
});

//创建文章集合
var articleModel = mongoose.model('article', articleSchema);

//用户相关的集合导出
module.exports.userModel = userModel;
//文章相关的集合导出
module.exports.articleModel = articleModel;



