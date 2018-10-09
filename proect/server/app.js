var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods')//引入商品路由

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));   //设置视图，视图指向view
app.engine('.html',ejs.__express);  //设置引擎后缀 .html
app.set('view engine', 'html');     //设置视图引擎为html

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
 
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  return next();
});

//拦截登录  app.use()使用插件，注入中间键，加入function优先进去
app.use(function(req,res,next){
  //拦截登录 在cookie 取值 [req.cookies.userId]
  if(req.cookies.userId){ //判断用户名有无登录
      next()
  }else{
    //没有登录，加入购物车拦截  originalUrl原始的url,当前接口地址是一个全级，（/goods是一个子级,goods后面有参数）
    //1.req.originalUrl.indexOf('/goods/list') > -1  2.req.path == '/goods/list'  不用考虑参数
    if(req.originalUrl == '/users/login' || req.originalUrl == '/users/logout' || req.originalUrl.indexOf('/goods/list') > -1){
      next()
    }else{
      //不让走
      res.json({
        status:'1001',
        msg:'当前未登录',
        result:''
      })
    }
  } 
})

app.use('/', indexRouter);   //一级路由
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);//二级路由

// catch 404 and forward to error handler
// 对404的拦截
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
