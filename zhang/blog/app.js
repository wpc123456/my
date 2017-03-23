var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require('express-session');
var MongoStore =require('connect-mongo')(session);
var flash =require('connect-flash');

var index = require('./routes/index');
var user = require('./routes/user');
var article = require('./routes/article');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'come',
  resave:true,
  saveUninitialized:true,
  store:new MongoStore({
    url:require('./dbUrl').dbUrl
  })
}))

app.use(flash());

app.use(function(req,res,next){
  //向所有模版文件都增加user属性
  res.locals.user=req.session.user;//获取session中用户登录的信息
  //成功的提示信息
  res.locals.success=req.flash('success');
  //失败的提示信息
  res.locals.error=req.flash('error');
  //取出session中保存的搜索关键字
  res.locals.keyword=req.session.keyword;
  next();
})

app.use('/', index);
app.use('/user', user);
app.use('/article', article);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
