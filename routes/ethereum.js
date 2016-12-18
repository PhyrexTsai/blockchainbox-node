var express = require('express');
var Web3 = require('web3');
var web3 = new Web3();
var router = express.Router();

web3.setProvider(new web3.providers.HttpProvider('http://localhost:' + (process.env.ENODE_PORT || '8545')));
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
  res.json({'data' :{'coinbase': coinbase, 'balance': balance}});
});

/**
 * PUT send transaction
 * https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethsendtransaction
 */
router.put('/transaction', function(req, res, next) {
  // TODO: init gas maximum
  web3.eth.sendTransaction({data: contract/*, gas: */}, function(err, txHash) {
    if (!err) {
      res.json({'data' :{'txHash': txHash}});
      //console.log(address); // "0x7f9fade1c0d57a7af66ab4ead7c2eb7b11a91385"
    } else {
      res.json({'error': {'code': 101, 'message': err}});
    }
  });
});

/**
 * GET query txHash from contract
 * https://github.com/ethereum/wiki/wiki/JavaScript-API#contract-methods
 */
router.get('/transaction', function(req, res, next) {
  var txHash = req.query.txHash;
  if (txHash == null || txHash == '' || txHash == undefined) {
    res.json({'error': {'code': 100, 'message': 'txHash is null'}});
  }
  res.json({'data' :{"txHash": txHash}});
});

/**
 * GET estimate gas
 * https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethestimategas
 */
router.get('/estimateGas', function(req, res, next) {
  var result = web3.eth.estimateGas({
    to: "0xc4abd0339eb8d57087278718986382264244252f",
    data: "0xc6888fa10000000000000000000000000000000000000000000000000000000000000003"
  });
  res.json({'date': {'gas': result}});
});

// worker: load Event
// https://github.com/ethereum/wiki/wiki/JavaScript-API#contract-events
// https://github.com/ethereum/wiki/wiki/JavaScript-API#contract-allevents

// worker: web3.eth.filter, filter pending
// https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter

// deploy contract via: web3.eth.contract
// https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethcontract

module.exports = router;
