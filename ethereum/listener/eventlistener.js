var Web3 = require('web3');
var web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

function EventListener() {
}

EventListener.prototype.filterWatch = function(transactionHash, callback) {
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

exports = module.exports = new EventListener();