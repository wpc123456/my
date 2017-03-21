//引入express模块，用来创建app
var express = require('express');
//引入path模块 resolve  join  __dirname
var path = require('path');
//用来处理ico图标的模块
var favicon = require('serve-favicon');
//输出日志
var logger = require('morgan');
//处理cookie的，当使用cookie-parser模块后，req.cookies  res.cookie
var cookieParser = require('cookie-parser');
//获取post请求体内容 req.body
var bodyParser = require('body-parser');
//引入session模块，为了保存登录信息
var session = require('express-session');
//将session信息保存到数据库中
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
//路由容器
var index = require('./routes/index');//首页
var user = require('./routes/user');//用户
var article = require('./routes/article');//文章



//创建app，一个函数
var app = express();

// view engine setup
//设置模板引擎文件根路径
app.set('views', path.join(__dirname, 'views'));
//设置模板引擎文件类型
//app.set('view engine', 'ejs');
app.set('view engine','html');
//使用ejs语法解析html文件
app.engine('html',require('ejs').__express);
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//用来请求请求体是json对象（请求体的对象不同，解析的方法也不同）
app.use(bodyParser.json());
//处理表单请求  post请求
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//设置静态资源文件根路径
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'come',
  resave:true,
  saveUninitialized:true,
  store:new MongoStore({
    url:require('./dbUrl').dbUrl//引入自定义模块
  })
}));
//使用flash模块
app.use(flash());
//公共中间件，用来操作所有路由的公共操作
app.use(function(req,res,next){
  //向所有的模板引擎文件传递数据第二种方式
  res.locals.user = req.session.user;//获取session中用户登录信息
  //成功的提示信息
  res.locals.success = req.flash('success');
  //失败的提示信息
  res.locals.error = req.flash('error');
  //取出session中保存的搜岁关键字
  res.locals.keyword =req.session.keyword;
  next();
});


//中间件
//当请求的路径是“/”开头交给index路由容器处理，
app.use('/', index);
//当请求的路径是/user开头，交给user路由容器
app.use('/user', user);
//上面所有的路由都不匹配的时候执行下面的中间件
//所有与article相关的路由交给article处理
app.use('/article',article);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
//错误处理中间间
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  //给模板引擎文件传递数据的第二种方式
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  //可以给模板引擎文件传递数据
  res.status(err.status || 500);
  res.render('error');//模板引擎文件的渲染
});

module.exports = app;
