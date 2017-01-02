// TODO 建置 web page
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Blockchainbox' });
});
// $(function(){				
// 	$('#send').click(function(e){
// 	    e.preventDefault();
// 	    alert('123');
	    
		
// 	});				
// });



module.exports = router;



