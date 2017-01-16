var express = require('express');
var Web3 = require('web3');
var solc = require('solc');
var util = require('util');
var contract = require('../db/models/contract.js');
var web3 = new Web3();
var router = express.Router();

web3.setProvider(new web3.providers.HttpProvider(process.env.ENODE_BASE || 'http://localhost:8545'));

/**
 * GET web3 compilers
 */
router.get('/v1/compilers', function (req, res, next) {
    var compiler = web3.eth.getCompilers();
    res.json({'compiler': compiler});
});

/**
 * PUT deploy solidity contract
 */
router.put('/v1/contract', function (req, res, next) {
    if (req.body.sourceCode != null && req.body.sourceCode != '') {
        // var result = web3.eth.compile.solidity(req.body.sourceCode);
        var result = solc.compile(req.body.sourceCode, 1);
        console.log(result);
        var id = [];
        for (var contractName in result.contracts) {
            var entity = {
                name: contractName, 
                sourceCode: req.body.sourceCode,
                byteCode: result.contracts[contractName].bytecode,
                language: result.contracts[contractName].metadata.language,
                compilerVersion: result.contracts[contractName].metadata.compiler,
                abi: util.inspect(result.contracts[contractName].interface, false, null),
                // have to check [solc]
                gasEstimates: web3.eth.estimateGas({data: result.contracts[contractName].bytecode});
            };

            contract.create(entity).then(function (contractId) {
                id.push(contractId);

                // deploy contract
                var newContract = web3.eth.contract(JSON.parse(result.contracts[contractName].interface));
                var contractResult = newContract.new({
                    from: web3.eth.coinbase, 
                    data: result.contracts[contractName].bytecode,
                    gas: 4700000
                }, function(err, deployedContract){
                    console.log(err, deployedContract);
                    if (!err) {
                        if (!deployedContract.address) {
                            // update transactionHash
                            console.log(deployedContract.transactionHash);
                            var entity = {
                                transactionHash: deployedContract.transactionHash,
                                id: contractId
                            };
                            contract.updateTransactionHash(entity).then(function(result){
                            }).catch(function (err) {
                                console.log(err.message, err.stack);
                                res.json({'error': {'message': err.message}});
                            });
                        } else {
                            // update address
                            console.log(deployedContract.address);
                            var entity = {
                                address: deployedContract.address,
                                id: contractId
                            };
                            contract.updateAddress(entity).then(function(result){
                            }).catch(function (err) {
                                console.log(err.message, err.stack);
                                res.json({'error': {'message': err.message}});
                            });
                        }
                    }
                });

            }).catch(function (err) {
                // error handle
                console.log(err.message, err.stack);
                res.json({'error': {'message': err.message}});
            });
        }
        res.json({'data': id});
    } else {
        console.log('error invalid source code!');
        res.json({'error': {'message': 'invalid source code'}});
    }
});

/**
 * GET ethereum coinbase
 */
router.get('/v1/coinbase', function (req, res, next) {
    res.json({'data': {'coinbase': web3.eth.coinbase}});
});

/**
 * GET ethereum account balance
 */
router.get('/v1/balance', function (req, res, next) {
    var coinbase = web3.eth.coinbase;
    if (req.query.address != null && req.query.address != '' && req.query.address != undefined) {
        coinbase = req.query.address;
    }
    var balance = web3.fromWei(web3.eth.getBalance(coinbase), "ether").toString(10) + ' ether';
    res.json({'data': {'coinbase': coinbase, 'balance': balance}});
});

/**
 * 這邊是在針對兩兩之間送錢的做的 transaction，如果是針對合約送錢需要使用 data 寫入合約的 byteCode
 * PUT send transaction
 * https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethsendtransaction
 */
router.put('/v1/transaction', function (req, res, next) {
    // TODO: init gas maximum
    web3.eth.sendTransaction(
        {
            from: req.body.from,
            //data: contract,
            gas: 4700000,
            to: req.body.to,
            value: req.body.value
        },
        function (err, txHash) {
            if (!err) {
                res.json({'data': {'txHash': txHash}});
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
router.get('/v1/transaction', function (req, res, next) {
    var txHash = req.query.txHash;
    if (txHash == null || txHash == '' || txHash == undefined) {
        res.json({'error': {'code': 100, 'message': 'txHash is null'}});
    }
    res.json({'data': {"txHash": txHash}});
});

/**
 * GET transactionReceipt
 * https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgettransactionreceipt
 */
router.get('/v1/transactionReceipt', function (req, res, next) {
    var transactionHash = req.query.transactionHash;
    if (transactionHash == null || transactionHash == '' || transactionHash == undefined) {
        res.json({'error': {'code': 102, 'message': 'transactionHash is null'}});
    }
    res.json({'data': web3.eth.getTransactionReceipt(transactionHash)});
});

/**
 * GET estimate gas
 * https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethestimategas
 */
router.get('/v1/estimateGas', function (req, res, next) {
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
