//用户登陆后才能执行的操作
module.exports.checkLogin = function (req, res, next) {
    if (req.session.user){ //用户已经登陆
        next();
    } else { //用户未登陆
        req.flash('error', '当前用户未登录，不能执行此操作，请先登陆');
        res.redirect('/user/login');
    }
};

module.exports.checkNotLogin = function (req, res, next) {
    if (req.session.user){ //用户已经登陆
        req.flash('error', '当前用户以登录，不能执行此操作，请先退出');
        res.redirect('/');
    } else { //用户未登陆
        next();
    }
};

