/*
* 1.不同的输入一定会产生不同的输出
* 2.相同的输入一定产生相同的输出
* 3.从输出的摘要不能推算出原始的输入
* */
var crypto = require('crypto');
//获取crypto中提供的所有的has算法
console.log(crypto.getHashes());

//创建一个md5加密
var md5 = crypto.createHash('md5');
//向md5加密输入数据（可以多次调用）
md5.update('123456');
//md5.update('1');
//md5.update('2');
//进行加密
var result = md5.digest('hex');
//输出加密后的数据
console.log(result);