/*
* debug根据程序的运行情况可以选择性的输出
* require('debug'):引入debug模块
* ('blog:success')：给debug起一个名字
* */
/*
* console和debug的区别
* console：在任何环境下都会进行输出
* debug：可以选择性的进行打印
* */
var successDebug = require('debug')('blog:success');
var failDebug = require('debug')('blog:fail');
var warningDebug = require('debug')('blog:warn');
successDebug('success');
failDebug('fail');
warningDebug('warn');
