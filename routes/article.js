var express = require('express');
var router = express.Router();
var model = require('../model');
/* GET users listing. */

router.post('/add', (req, res) => {
    var data = {
        title: req.body.title,
        content: req.body.content,
        id: Date.now(),
        ulsername: req.session.ulsername
    }
    model.connect(function(db) {
        db.collection('articles').insertOne(data, (err, ret) => {
            if (err) {
                console.log("文章发布出错")
                res.redirect('/write')
            } else {
                res.redirect('/')
            }
        })
    })
})


//删除接口
router.get('/delete', (req, res) => {
    var id = parseInt(req.query.id)
    var page = req.query.page
    model.connect(function(db) {
        db.collection('articles').deleteOne({ id: id }, (err, ret) => {
            if (err) {
                console.log("删除失败")
                res.redirect('/?page=' + page)
            } else {
                res.redirect('/?page=' + page)
            }
        })
    })
})



module.exports = router;