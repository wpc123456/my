/**
 * Created by sony on 2017/3/15.
 */
/*
* console和debug的区别
* console：在任何环境下都会进行输出
* debug:可以选择性打印
* */

var successDebug = require('debug')('blog:success');
var failDebug = require('debug')('blog:fail');
var warnDebug = require('debug')('blog:warn');
successDebug('success');
failDebug('fail');
warnDebug('warn');

