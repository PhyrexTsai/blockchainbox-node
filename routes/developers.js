// TODO 建置 web page for API document
var express = require('express');
var router = express.Router();

/* GET API page. */
router.get('/', function(req, res, next) {
    res.render('developers', { title: 'API' });
});

module.exports = router;
