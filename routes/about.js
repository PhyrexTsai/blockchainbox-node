// TODO 建置 web page for Proof of transaction document
var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/', function(req, res, next) {
    res.render('about', { title: 'Introduce' });
});

module.exports = router;
