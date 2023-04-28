// 文章的路由模块
const express = require('express');
const router = express.Router();
// 导入multer 和 path
const multer = require('multer');
const path = require('path');

// 创建multer的实例 dest：将文件存储在服务器的哪个目录里面
const uploads = multer({dest: path.join(__dirname, '../uploads')});

// uploads.single()是一个局部生效的中间件，用来解析FormData格式的表单数据
// 将文件类型的数据，解析挂载到req.file属性中
// 将文本类型的数据，解析挂载到req.body属性中

// 导入需要的处理函数
const article_handler = require('../router_handler/article');

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi');
// 导入需要的验证规则对象
const { add_article_schema } = require('../schema/article');

// 发布文章的路由
router.post('/add', uploads.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle)

module.exports = router;