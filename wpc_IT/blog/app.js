//引入express模块
var express = require('express');

var session = require('express-session');

var MongoStore = require('connect-mongo')(session);
//path模块 join __dirname resolve
var path = require('path');
//
var favicon = require('serve-favicon');
//打印日志的模块
var logger = require('morgan');
//cookie req.cookies res.cookie
var cookieParser = require('cookie-parser');

//flash依赖session
var flash = require('connect-flash');

//post请求 req.body
var bodyParser = require('body-parser');
//引入路由容器
var index = require('./routes/index');
var users = require('./routes/users');
var article = require("./routes/article");
 //创建app，其实一个函数，http.createServer
var app = express();

// view engine setup
//设置模版引擎文件根路径
app.set('views', path.join(__dirname, 'views'));
//设置模版引擎文件类型
app.set('view engine', 'html');
//
app.engine('html',require('ejs').__express);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//用来请求请求体是json对象
app.use(bodyParser.json());
//用来处理post表单提交
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//静态资源文件根路径
app.use(express.static(path.join(__dirname, 'public')));
//session的设置
app.use(session({
  secret:'come',
  resave:true,
  saveUninitialized:true,
  store:new MongoStore({
    //数据库的连接地址
    url:require('./dburl').dburl
  })
}));

app.use(flash());

//中间件
//公共中间件
app.use(function(req,res,next) {
  //向所有的模板引擎文件都增加user属性
  res.locals.users = req.session.users;//获取session中用户登陆的信息
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.keyword = req.flash('keyword');
  res.locals.commentCount = req.flash('commentCount');//评论次数
  res.locals.assistCount = req.flash('assistCount');//赞 次数
  res.locals.article = req.session.article;
  res.locals.count = req.session.count;//浏览次数
  next();
})

//所有/开头的路由都交给index路由容器处理
app.use('/', index);
//所有/users开头的路由都交给index路由容器处理
app.use('/users', users);

app.use('/article',article);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {//错误处理中间件
  // set locals, only providing error in development
  //给模版引擎文件传递数据的第二种方式，这种方式可以传递给所有的引擎文件
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
