// TODO 這邊要加上 deploy contract, compile contract 等 API
var express = require('express');
var Web3 = require('web3');
var web3 = new Web3();
var router = express.Router();

web3.setProvider(new web3.providers.HttpProvider(process.env.ENODE_BASE || 'http://localhost:8545'));
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
 * 這邊是在針對兩兩之間送錢的做的 transaction，如果是針對合約送錢需要使用 data 寫入合約的 byteCode
 * PUT send transaction
 * https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethsendtransaction
 */
router.put('/transaction', function(req, res, next) {
  // TODO: init gas maximum
  web3.eth.sendTransaction(
    {
      from: req.body.from,
      //data: contract,
      gas: 4700000,
      to: req.body.to,
      value: req.body.value
    },
    function(err, txHash) {
      if (!err) {
        res.json({'data' :{'txHash': txHash}});
        //console.log(txHash); // "0x7f9fade1c0d57a7af66ab4ead7c2eb7b11a91385"
      } else {
        res.json({'error': {'code': 101, 'message': err}});
      }
    }
  );
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
    to: req.query.to,
    data: req.query.data
  });
  res.json({'date': {'gas': result}});
});

// deploy contract via: web3.eth.contract
// https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethcontract

// worker: load Event
// https://github.com/ethereum/wiki/wiki/JavaScript-API#contract-events
// https://github.com/ethereum/wiki/wiki/JavaScript-API#contract-allevents

// worker: web3.eth.filter, filter pending
// https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter

module.exports = router;
