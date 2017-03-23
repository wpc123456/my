/**
 * console和debug区别
 * console: 在任何环境下都会进行输出
 * debug: 可以选择性的打印
 * */
/**
 * debug可以选择性输出
 *require('debug')引入debug模块
 * ('blog:success')给debug模块起名
 * **/
console.log(111111111);

var successDebug = require('debug')('blog:success');

var failDebug = require('debug')('blog:fail');

var warnDebug = require('debug')('blog:warn');

successDebug('success');

failDebug('fail');

warnDebug('warn');