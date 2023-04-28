// 导入数据库操作模块
const db = require('../db/index');
// 导入加密包bcryptjs包
const bcrypt = require('bcryptjs');
// 导入生成token的包
const jwt = require('jsonwebtoken');
// 导入全局的配置文件
const config = require('../config');
// 注册新用户的处理函数
exports.reguser = (req, res) => {
    // 客户提交的用户信息
    const userInfo = req.body;
    // 1、对表单数据进行合法校验
    // if (!userInfo.username || !userInfo.password) {
    //     return res.cc('用户名或密码不合法!');
    // }
    // 2、检测用户名是否被占用
    // 定义sql语句
    const sqlStr = `select * from ev_users where username=?`;
    db.query(sqlStr, userInfo.username, (err, results) => {
        // 执行sql语句失败
        if (err) {
            return res.cc(err);
        }
        // 判断用户名是否被占用
        if(results.length) {
            return res.cc('用户名被占用，请更换其他用户名')
        }
        // TODO: 用户名可以使用
        // 调用bcrypt.hashSync(加密密码， 长度)对密码进行加密
        userInfo.password = bcrypt.hashSync(userInfo.password, 10);
        // 定义插入新用户sql语句
        const sql = 'insert into ev_users set ?';
        db.query(sql, {username: userInfo.username, password: userInfo.password}, (err, results) => {
            // 判断ql语句是否成功
            if (err) {
                return res.cc(err);
            }
            // 判断影响行数是否为1
            if (results.affectedRows !== 1) {
                return res.cc('注册用户失败，请稍后再试!');
            }
            // 注册用户成功
            res.cc('注册成功', 0);
        })
    })
    // 
}
//登录的处理函数
exports.login = (req, res) => {
    // 接收表单的数据
    const userinfo = req.body
    // 定义sql语句
    const sql = 'select * from ev_users where username=?';
    // 根据用户名查询语句
    db.query(sql, userinfo.username, (err, results) => {
        // 执行sql语句失败
        if (err) {
            res.cc(err);
        }
        // 成功
        // 但是获取到的数据条数不等于1
        if (!results.length) return res.cc('用户名不存在，请重新输入或注册');
        // TODO: 判断密码是否正确 (用户提交的密码, 数据库中的密码)
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);
        if (!compareResult) {
            return res.cc('密码输入错误');
        }
        // TODO: 在服务器端生成token字符串
        const user = {...results[0], password: '', user_pic: ''};
        // 对用户的信息进行加密，生成token字符串
        const token = jwt.sign(user, config.jwtSecret, {expiresIn: config.expireIn});
        // console.log(token);
        // 响应给客户端
        res.send({
            status: 0,
            token: 'Bearer ' + token,
            msg: '登录成功',
        })

        // res.send('OK');
    })
    // 
}