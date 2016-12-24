var pool = require('../dbConnectionPool.js');

function SearchTransaction() {}

SearchTransaction.prototype.readAll = function() {
    return pool.query('SELECT * FROM searchtransaction');
}

SearchTransaction.prototype.read = function(txHash) {
    return pool.query('SELECT * FROM searchtransaction WHERE txHash = $1', [txHash]);
}

SearchTransaction.prototype.create = function(txHash) {
    return pool.query('SELECT * FROM searchtransaction WHERE txHash = $1', [txHash]);
}

SearchTransaction.prototype.update = function() {

}

SearchTransaction.prototype.delete = function() {

}

exports = module.exports = new SearchTransaction();