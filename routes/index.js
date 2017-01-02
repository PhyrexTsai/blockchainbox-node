// TODO 建置 web page
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Proof Of Transaction' });
});

module.exports = router;



