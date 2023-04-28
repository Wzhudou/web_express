const express = require('express');
const router = express.Router();
// 导入用户路由处理函数对应的模块
const user_handler = require('../router_handler/user');

// 四：验证规则相关
// 4.1、导入验证数据的中间件
const expressjoi = require('@escook/express-joi');
// 4.2、导入需要的验证对象
const {reg_login_schema} = require('../schema/user')

// 注册新用户

// 4.3 注册添加验证规则
router.post('/reguser', expressjoi(reg_login_schema), user_handler.reguser);

// 登录
router.post('/login', expressjoi(reg_login_schema), user_handler.login);

module.exports = router;