// 导入数据库操作模块
const { error } = require('@hapi/joi/lib/base');
const db = require('../db/index');
// 获取文章分类列表数据的处理函数
exports.getArtCtes = (req, res) => {
    // res.send('okk');
    // 定义sql语句
    const sql = 'select * from ev_article_cate where is_delete=0 order by id asc';
    // 调用db.query
    db.query(sql, (error, results) => {
        if(error) return res.cc(err);
        res.send({
            status: 0,
            msg: '获取文章分类数据成功',
            data: results,
        })
    })
}
// 新增文章分类
exports.addArticleCates = (req, res) => {
    // res.send('ok');
    // 定义查重sql语句
    const sql = 'select * from ev_article_cate where name = ? or alias = ?'
    // 执行sql语句
    db.query(sql, [req.body.name, req.body.alias], (error, results) => {
        // 是否执行sql语句失败
        if (error) return res.cc(error);
        // 判断数据的length 
        // 长度 = 2 ==》表示分别占用了两头数据，一条占用name，一条占用alias
        if (results.length === 2) {
            return res.cc('分类名称和分类别名被占用，请更换重试!')
        }
        // 长度 === 1
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) {
            return res.cc('分类名称和分类别名被占用，请更换重试!')
        }
        if (results.length === 1 && results[0].name === req.body.name) {
            return res.cc('分类名称被占用，请更换重试！')
        }
        if (results.length === 1 && results[0].alias === req.body.alias) {
            return res.cc('分类别名被占用，请更换重试！')
        }
        // 成功, 执行添加操作
        // 定义插入文章分类sql语句
        const sql = 'insert into ev_article_cate set ?';
        db.query(sql, req.body, (error, results) => {
            if (error) return res.cc(error);
            if(results.affectedRows !== 1) {
                return res.cc('新增文章分类失败');
            }
            res.cc('新增文章分类成功', 0);
        });
    });
}

// 删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
    // res.send('OK');
    // 定义标记删除的sql语句
    const sql = 'update ev_article_cate set is_delete=1 where id = ?';
    db.query(sql, req.params.id,(err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败!');
        res.cc('删除文章分类成功', 0)
    })
}

// 根据id获取文章分类
exports.getArtCateById = (req, res) => {
    // res.send('ok')
    // 定义根据id获取文章分类数据的语句
    const sql = 'select * from ev_article_cate where id = ?';
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 1) {
            return res.cc('获取文章分类数据失败!');
        }
        res.send({
            status: 0,
            msg: '获取文章分类数据成功',
            data: results[0],
        })
    })
}

// 根据id更新文章分类的处理函数
exports.updateCateById = (req, res) => {
    // res.send('ok');
    // 定义查重的sql语句
    const sql = 'select * from ev_article_cate where Id <> ? and (name= ? or alias = ?)';
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        // 是否执行sql语句失败
        if (err) return res.cc(err);
        // 判断数据的length 
        // 长度 = 2 ==》表示分别占用了两头数据，一条占用name，一条占用alias
        if (results.length === 2) {
            return res.cc('分类名称和分类别名被占用，请更换重试!')
        }
        // 长度 === 1
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) {
            return res.cc('分类名称和分类别名被占用，请更换重试!')
        }
        if (results.length === 1 && results[0].name === req.body.name) {
            return res.cc('分类名称被占用，请更换重试！')
        }
        if (results.length === 1 && results[0].alias === req.body.alias) {
            return res.cc('分类别名被占用，请更换重试！')
        }
        // res.send('Ok')
        // 更新文章分类语句
        const sql = 'update ev_article_cate set ? where Id = ?';
        db.query(sql, [req.body, req.body.Id], (err, results) => {
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc('更新文章分类失败');
            res.cc('更新文章分类成功', 0)
        })
    });
}

