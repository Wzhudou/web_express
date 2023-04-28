// 导入数据库
const db = require('../db/index');
// 导入处理密码的模块
const bcrypt = require('bcryptjs');
// 获取用户基本信息的函数
exports.getUserInfo = (req, res) => {
    // 定义查询用户信息的sql语句
    const sql = 'select id, username, nickname, email, user_pic from ev_users where id=?';
    // 调用db.query执行sql语句
    db.query(sql, req.user.id, (err, results) => {
        // 执行sql语句失败
        if (err) {
            return res.cc(err);
        }
        // 执行sql语句成功
        //（1）查询结果为空
        if (!results.length) {
            return res.cc('获取用户信息失败')
        }
        // (2) 用户信息获取成功
        res.send({
            status: 0,
            msg: '获取用户信息成功',
            data: results[0],
        })
    });
    // res.send('OK');
}

// 更新用户信息的函数
exports.updateUserInfo = (req, res) => {
    // 定义待执行的sql语句
    const sql = 'update ev_users set ? where id = ?';
    // 调用db.query执行sql语句
    db.query(sql, [req.body, req.body.id], (err, results) => {
        if (err) return res.cc(err);
        // 执行sql语句成功
        //(1) 影响行数不等于1，表示失败
        if (results.affectedRows !== 1) {
            return res.cc('更新用户基本信息失败');
        }
        res.cc('更新用户信息成功', 0);
    });
    // res.send('OK');
}
// 更新密码的处理函数
exports.updatePassword = (req, res) => {
    // res.send('OK');
    // 查询语句
    const sql = 'select * from ev_users where id = ?';
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err);
        // 判断结构是否存在
        if (!results.length) return res.cc('用户不存在');
        // 判断密码是否正确
        const compareResults = bcrypt.compareSync(req.body.oldPwd, results[0].password);
        if (!compareResults) return res.cc('旧密码错误');
        // 定义更新密码的sql语句
        const updateSql = 'update ev_users set password=? where id=?';
        // 新密码加密
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
        db.query(updateSql, [newPwd, req.user.id], (err, results) => {
            if (err) return res.cc(err);
            // 判断影响行数
            if(results.affectedRows !== 1) return res.cc('更新密码失败');
            res.cc('更新密码成功', 0);
        })
        // res.cc('OK', 0)
    })
}

// 更新用户头像
exports.updateAvatar = (req, res) => {
    // sql查询语句
    const sql = 'update ev_users set user_pic=? where id=?';
    // 调用db.query
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        if(err) return res.cc('执行sql语句失败');
        // 判断影响行数
        if(results.affectedRows !== 1) return res.cc('更换头像失败');
        // 成功
        res.cc('更换头像成功', 0);
    })
    // res.send('ok');
}