// 文章的处理函数模块
const { log } = require('console');
const path = require('path');

const db = require('../db/index');

// 发布文章的处理函数
exports.addArticle = (req, res) => {
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数!');

    // TODO: 数据合法，可以进行后续业务逻辑的处理
    // 1、处理文章的信息对象
    const articleInfo = {
        // 文章的标题， 内容，文章的发布状态，所属数据的分类Id
        ...req.body,
        // 文章封面的存放路径
        cover_img: path.join('/uploads', req.file.filename),
        // 文章的发布事件
        pub_date: new Date(),
        // 文章作者id
        author_id: req.user.id,
    }

    // 定义发布文章的发布语句
    const sql = 'insert into ev_articles set ?';
    db.query(sql, articleInfo, (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('发布新文章失败');
        res.cc('发布文章成功', 0);
    })
}