var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: '前端工程师自荐｜首页'
    });
});
router.get('/about', function(req, res, next) {
    res.render('about', {
        title: '前端工程师自荐｜关于本站'
    });
});
router.get('/contact', function(req, res, next) {
    res.render('contact', {
        title: '前端工程师自荐｜联系方式'
    });
});

module.exports = router;
