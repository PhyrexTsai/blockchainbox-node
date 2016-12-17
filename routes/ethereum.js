var express = require('express');
var Web3 = require('web3');
var web3 = new Web3();
var router = express.Router();

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
var coinbase = web3.eth.coinbase;

/**
 * GET ethereum coinbase
 */
router.get('/coinbase', function(req, res, next) {
  res.json({'data' :{'coinbase': coinbase}});
});

/**
 * GET ethereum account balance
 */
router.get('/balance', function(req, res, next) {
  var balance = web3.fromWei(web3.eth.getBalance(coinbase), "ether").toString(10) + ' ether';
  res.json({'coinbase': coinbase, 'balance': balance});
});

// send transaction
router.post('/transaction', function(req, res, next) {

  res.json({'txHash': txHash});
});

// query contract
router.get('/transaction', function(req, res, next) {
  var txHash = req.query.txHash;
  if (txHash == null || txHash == '' || txHash == undefined) {
    res.json({'error': {'code': 100, 'message': 'txHash is null'}});
  }
  res.json({"txHash": txHash});
});

module.exports = router;
