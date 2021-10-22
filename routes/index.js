var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/1k', function (req, res, next) {
    res.render('index.html');
});
router.get('/4k', function (req, res, next) {
    res.render('index.html');
});

module.exports = router;