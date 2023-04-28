const express = require('express');
const router = express.Router();
// 导入验证规则相关
const expressjoi = require('@escook/express-joi');
const {update_userinfo_schema, update_password_schema, update_avatar_schema} = require('../schema/user');


// 导入路由处理函数模块
const userinfo_handler = require('../router_handler/userinfo');

// 挂载路由
// 获取用户基本信息
router.get('/userinfo', userinfo_handler.getUserInfo);
// 更新用户基本信息
router.post('/userinfo', expressjoi(update_userinfo_schema), userinfo_handler.updateUserInfo);
// 更新密码的路由
router.post('/updatepwd', expressjoi(update_password_schema), userinfo_handler.updatePassword);
// 更新用户头像
router.post('/update/avatar', expressjoi(update_avatar_schema), userinfo_handler.updateAvatar)


module.exports = router;