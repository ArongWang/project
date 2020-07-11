var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter = require('./routes/article');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//sessi的配置
app.use(session({
        secret: 'wz project',
        resava: false,
        saveUninitialized: true,
        cookie: { macAge: 1000 * 60 * 20 } //指定cookie登录有效时长
    }))
    //登录拦截
app.get('*', (req, res, next) => {
    var username = req.session.username
    var path = req.path
    console.log('session', username)
    if (path != '/login' && path != '/regist' && path != '/one' && path != '/detail') { //对登录页和注册页取消拦截
        if (!username) { //没有登录状态，跳转到登录页
            res.redirect('/login')
        }

    }
    next()
})
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/article', articleRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
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