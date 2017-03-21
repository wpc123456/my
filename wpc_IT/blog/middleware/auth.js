/**
 * Created by sony on 2017/3/16.
 */

module.exports.checkLogin = function(req,res,next){
    if(req.session.users) {//用户已登陆
        next();
    }else{//用户未登录
        req.flash('error','当前用户未登录，不能执行操作');
        res.redirect('/users/login');
    }
}

module.exports.checkNotLogin = function(req,res,next){
    if(req.session.users) {//用户已登陆
        req.flash('error','当前用户已登录，不能执行操作');
        res.redirect('/');
    }else{//用户未登录
        next();
    }
}