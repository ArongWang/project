var express = require('express');
var router = express.Router();
var model = require('../model');
var moment = require('moment');

/* GET home page. */
//渲染主页面
router.get('/one', (req, res) => {
    model.connect(function(db) {
        db.collection('articles').find().toArray(function(err, docs) {
            console.log('文章列表', err)
            var liste = docs
            liste.map(function(ele, index) {
                ele['time'] = moment(ele.id).format('YYYY-MM-DD HH:mm:ss')
            })
            res.render('one', { liste: liste })
        })
    })
});

router.get('/', function(req, res, next) {
    var username = req.session.username
    var page = req.query.page || 1
    var data = {
        total: 0, //总共多少页
        curPage: page,
        list: [] //当前页面的文章列表
    }
    var pageSize = 4
    model.connect(function(db) {
        //查询所有文章
        db.collection('articles').find().toArray(function(err, docs) {
            console.log("文章列表", err)
            data.total = Math.ceil(docs.length / pageSize)
                //查询当前文章列表
            model.connect(function(db) {
                db.collection('articles').find().sort({ id: -1 }).limit(pageSize).skip((page - 1) * pageSize).toArray(function(err, docs2) {
                    docs2.map(function(ele, indes) {
                        ele['time'] = moment(ele.id).format('YYYY-MM-DD HH:mm:ss')
                    })
                    data.list = docs2
                    res.render("index", { username: username, data: data });
                })
            })
        })

    })
});
//渲染注册页面
router.get('/regist', (req, res) => {
        res.render('regist', {})
    })
    //渲染登录页面
router.get('/login', (req, res) => {
        res.render('login', {})
    })
    //渲染写文章界面
router.get('/write', (req, res) => {
        var username = req.session.username || ''
        var id = parseInt(req.query.id)
        var page = req.query.page
        var item = {
            title: '',
            content: ''
        }
        if (id) { //编辑页面
            model.connect(function(db) {
                db.collection('articles').findOne({ id: id }, (err, docs) => {
                    if (err) {
                        console.log("编辑失败")
                    } else {
                        item = docs
                        item['page'] = page
                        res.render('write', { username: username, item: item })

                    }
                })
            })

        } else { //新增加
            res.render('write', { username: username, item: item })
        }
    })
    //加载详情页
router.get('/detail', (req, res) => {
    var id = parseInt(req.query.id)
    var username = req.session.username
    model.connect(function(db) {
        db.collection('articles').findOne({ id: id }, (err, docs) => {
            if (err) {
                console.log("失败", err)
            } else {
                var item = docs
                item['time'] = moment(item.id).format('YYYY-MM-DD HH:mm:ss')
                res.render('detail', { item: item, username: username })
            }
        })
    })
})
module.exports = router;