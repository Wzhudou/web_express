const express = require('express');
const router = express.Router();

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi');
// 导入需要的验证对象
const { add_cate_schema, delete_cate_schema, get_cate_schema, update_cate_schema } = require('../schema/artcate')

const artCate_handler = require('../router_handler/artcate')

// 获取文章分类列表数据
router.get('/cates', artCate_handler.getArtCtes)
// 新增文章分类的路由
router.post('/addcates', expressJoi(add_cate_schema), artCate_handler.addArticleCates);
// 删除文章分类
router.get('/deletecate/:id',expressJoi(delete_cate_schema), artCate_handler.deleteCateById);
// 根据id获取文章分类的路由
router.get('/cates/:id', expressJoi(get_cate_schema), artCate_handler.getArtCateById);
// 根据id更新文章分类的路由
router.post('/updatecate', expressJoi(update_cate_schema), artCate_handler.updateCateById);
module.exports = router;