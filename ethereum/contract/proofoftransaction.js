/**
 * Need to unlock account first
 *
 * Run command below:
 * geth attach
 * personal.unlockAccount('0x2707318718f1c69ff55f5192cec64e117fdbbfde','password',600000);
 */
var Web3 = require('web3');
var web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

function ProofOfTransaction() {
}

var proofOfTransactionABI = [{
    "constant": false,
    "inputs": [{"name": "txHash", "type": "string"}],
    "name": "getDataHash",
    "outputs": [{"name": "", "type": "bytes32"}],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "dataHash",
    "outputs": [{"name": "", "type": "bytes32"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "txHash", "type": "string"}, {"name": "data", "type": "string"}],
    "name": "setData",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "from", "type": "address"}, {
        "indexed": false,
        "name": "txHash",
        "type": "string"
    }, {"indexed": false, "name": "dataHash", "type": "bytes32"}, {
        "indexed": false,
        "name": "time",
        "type": "uint256"
    }],
    "name": "setDataHashEvent",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "from", "type": "address"}, {
        "indexed": false,
        "name": "txHash",
        "type": "string"
    }, {"indexed": false, "name": "dataHash", "type": "bytes32"}, {
        "indexed": false,
        "name": "time",
        "type": "uint256"
    }],
    "name": "getDataHashEvent",
    "type": "event"
}];

var proofOfTransactionContractAddress = '0xD0F96Ba2FEDB74b92343De6ba3f1b3D55076B2B2';

// Reference: https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethcontract
var proofOfTransaction = web3.eth.contract(proofOfTransactionABI).at(proofOfTransactionContractAddress);

// Reference: https://github.com/ethereum/wiki/wiki/JavaScript-API#contract-methods
ProofOfTransaction.prototype.setData = function(txHash, data) {
    console.log('ProofOfTransaction.prototype.setData: txHash = ' + txHash + ', data = ' + data);
    var transactionHash = proofOfTransaction.setData(txHash, data, {from: web3.eth.coinbase, gas: 4700000});
    return transactionHash;
};

ProofOfTransaction.prototype.getDataHash = function(txHash, data) {
    console.log('ProofOfTransaction.prototype.getDataHash: txHash = ' + txHash);
    var transactionHash = proofOfTransaction.getDataHash(txHash, {from: web3.eth.coinbase, gas: 4700000});
    // 這邊單純回應 transactionHash 所以需要用 transactionHash 去 filter 那邊聽是否 mine 到了
    return transactionHash;
};

// Reference: https://github.com/ethereum/wiki/wiki/JavaScript-API#contract-events
ProofOfTransaction.prototype.getDataHashEvent = function() {
    console.log('ProofOfTransaction.prototype.getDataHashEvent');
    return proofOfTransaction.getDataHashEvent({});
};

ProofOfTransaction.prototype.setDataHashEvent = function() {
    console.log('ProofOfTransaction.prototype.setDataHashEvent')
    return proofOfTransaction.setDataHashEvent({});
};

ProofOfTransaction.prototype.filterWatch = function(transactionHash, callback) {
    var filter = web3.eth.filter('latest');
    filter.watch(function(err, result) {
        //console.log("latest: ", result);
        var blockInfo = web3.eth.getBlock(result);
        //console.log("block: ", info);
        if (blockInfo.transactions > 0) {
            blockInfo.transactions.forEach(function(tx) {
                if (tx == transactionHash) {
                    var transactionInfo = web3.eth.getTransaction(tx);
                    // save to database
                    callback(transactionInfo, blockInfo);
                    filter.stopWatching();
                }
            });
        }
    });
};

exports = module.exports = new ProofOfTransaction();