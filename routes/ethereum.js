var express = require('express');
var Web3 = require('web3');
var web3 = new Web3();
var router = express.Router();

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
var coinbase = web3.eth.coinbase;

/* GET ethereum coinbase */
router.get('/coinbase', function(req, res, next) {
  res.send('coinbase: ' + coinbase);
});

router.get('/balance', function(req, res, next) {
  var balance = web3.fromWei(web3.eth.getBalance(coinbase), "ether").toString(10);
  res.send('balance: ' + balance + ' ether');
});

module.exports = router;
