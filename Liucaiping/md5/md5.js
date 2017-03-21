module.exports = function(input){
    var crypto = require('crypto');//引入模块
    var md5 = crypto.createHash('md5');//创建md5加密
    md5.update(input);//向算法中输入数据
    var result = md5.digest('hex');
    return result;
};
