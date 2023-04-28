// 导入express
const express = require('express');
// 配置跨域
const cors = require('cors');
const app = express();
// 导入验证规则
const joi = require('joi');

// 注册跨域中间件
app.use(cors());
// 配置解析表单数据的中间件 ，注意这个中间件只能解析application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}));

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'));

// 一定要在路由之前封装res.cc函数, status默认值为1，表示失败的情况
// err的值可能是错误对象，也可能是错误的表述对象
app.use((req, res, next) =>{
    res.cc = function (err, status = 1) {
        res.send({
            status,
            msg: err instanceof Error ? err.message : err,
        })
    }
    next();
})

// 配置解析token的中间件
const expressJWT = require('express-jwt');
const config = require('./config');
app.use(expressJWT({secret: config.jwtSecret}).unless({path: [/^\/api/]}));

// 导入并使用用户路由模块
const userRouter = require('./router/user');
app.use('/api', userRouter);
// 导入并使用用户信息的模块
const userinfoRouter = require('./router/userinfo');
app.use('/my', userinfoRouter);

// 导入并使用文章分类的模块
const artcateRouter = require('./router/artcate');
app.use('/my/article', artcateRouter);

// 导入并使用文章的路由模块
const articleRouter = require('./router/article');
app.use('/my/article', articleRouter);



// 4.4、定义错误级别的中间件
app.use((err, req, res, next) => {
    // console.log(err);
    // 验证失败导致的错误
    if (err instanceof joi.ValidationError) return res.cc(err);
    // token认证失败相关
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败!')
    // 未知错误
    res.cc(err);
})

// 启动服务器
app.listen(3009, () => {
    console.log('api server running at http://127.0.0.1:3009');
});